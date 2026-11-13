import { AttachedDocument, AttachedFolderFile } from "../types";
import {
  containsBinaryBytes,
  formatBytes,
  generateAttachmentId,
  getFileExtension,
  isKnownBinaryFile,
  isPdfFile,
  processTextFile,
} from "./fileAttachment";
import { extractTextFromPdf } from "./pdfParser";

export const MAX_FOLDER_FILES = 120;
export const MAX_SINGLE_FILE_BYTES = 512 * 1024; // 512 KB per code/text file
export const MAX_PDF_FILE_BYTES = 8 * 1024 * 1024; // 8 MB per PDF inside a folder
export const MAX_FOLDER_PDFS = 3;
export const MAX_SINGLE_FILE_CHARS = 25_000;
export const MAX_FOLDER_TOTAL_CHARS = 180_000;

// Heavy dependency, VCS, cache, and build output subdirectories skipped automatically
const IGNORED_DIR_NAMES = new Set([
  ".git",
  ".hg",
  ".svn",
  ".bzr",
  "node_modules",
  ".pnpm-store",
  "bower_components",
  "jspm_packages",
  "__pycache__",
  ".pytest_cache",
  ".mypy_cache",
  ".ruff_cache",
  ".tox",
  ".nox",
  ".venv",
  "venv",
  ".next",
  ".nuxt",
  ".output",
  ".svelte-kit",
  ".astro",
  "dist",
  "build",
  "out",
  ".turbo",
  ".parcel-cache",
  ".cache",
  "coverage",
  ".nyc_output",
  "target",
  ".gradle",
  ".dart_tool",
  ".pub-cache",
  "pods",
  "deriveddata",
  ".idea",
  ".vs",
]);

const IGNORED_OS_OR_LOCK_FILES = new Set([
  ".ds_store",
  "thumbs.db",
  "desktop.ini",
  ".spotlight-v100",
  ".trashes",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lock",
  "bun.lockb",
  "cargo.lock",
  "poetry.lock",
  "pipfile.lock",
  "composer.lock",
  "gemfile.lock",
  "podfile.lock",
  "pubspec.lock",
  "flake.lock",
]);

const SAFE_ENV_FILENAMES = new Set([
  ".env.example",
  ".env.sample",
  ".env.template",
  ".env.defaults",
]);

const PRIORITY_MANIFEST_NAMES = new Set([
  "readme.md",
  "readme",
  "package.json",
  "tsconfig.json",
  "pyproject.toml",
  "requirements.txt",
  "cargo.toml",
  "go.mod",
  "pom.xml",
  "build.gradle",
  "makefile",
  "dockerfile",
  "docker-compose.yml",
  "docker-compose.yaml",
]);

export interface FolderEntryDraft {
  path: string;
  size: number;
  lineCount?: number;
  pageCount?: number;
  content: string;
  truncated: boolean;
  included: boolean;
  budgetOmitted?: boolean;
}

export interface FolderSkippedCounts {
  ignoredDirs: number;
  secrets: number;
  lockOrMinified: number;
  binary: number;
  tooLarge: number;
  budgetOmitted: number;
}

export interface FolderAttachmentDraft {
  id: string;
  folderName: string;
  entries: FolderEntryDraft[];
  skippedCounts: FolderSkippedCounts;
  document: AttachedDocument;
}

export interface FolderImportResult {
  draft: FolderAttachmentDraft | null;
  error?: string;
}

interface CandidateFile {
  relativePath: string;
  getFile: () => Promise<File>;
}

function emptySkippedCounts(): FolderSkippedCounts {
  return {
    ignoredDirs: 0,
    secrets: 0,
    lockOrMinified: 0,
    binary: 0,
    tooLarge: 0,
    budgetOmitted: 0,
  };
}

function isSecretOrKeyFile(baseNameLower: string): boolean {
  if (SAFE_ENV_FILENAMES.has(baseNameLower)) return false;
  if (baseNameLower === ".env" || baseNameLower.startsWith(".env.")) return true;
  return (
    baseNameLower.endsWith(".pem") ||
    baseNameLower.endsWith(".key") ||
    baseNameLower.endsWith(".p12") ||
    baseNameLower.endsWith(".pfx") ||
    baseNameLower === "id_rsa" ||
    baseNameLower === "id_ed25519"
  );
}

function isMinifiedOrMapFile(baseNameLower: string): boolean {
  return (
    baseNameLower.endsWith(".min.js") ||
    baseNameLower.endsWith(".min.css") ||
    baseNameLower.endsWith(".js.map") ||
    baseNameLower.endsWith(".css.map")
  );
}

function isIgnoredSubdirectory(dirName: string): boolean {
  return IGNORED_DIR_NAMES.has(dirName.toLowerCase());
}

function getFileSortScore(relativePath: string): [number, number, string] {
  const lower = relativePath.toLowerCase();
  const segments = lower.split("/");
  const depth = segments.length - 1;
  const baseName = segments[segments.length - 1];

  if (depth === 0 && PRIORITY_MANIFEST_NAMES.has(baseName)) {
    return [0, 0, lower];
  }
  const isSecondary =
    segments.some((s) =>
      s === "test" || s === "tests" || s === "__tests__" || s === "spec" || s === "fixtures" || s === "mocks"
    ) ||
    lower.endsWith(".test.ts") ||
    lower.endsWith(".test.tsx") ||
    lower.endsWith(".spec.ts") ||
    lower.endsWith(".spec.tsx");

  return [isSecondary ? 2 : 1, depth, lower];
}

function compareCandidatePaths(aPath: string, bPath: string): number {
  const [groupA, depthA, nameA] = getFileSortScore(aPath);
  const [groupB, depthB, nameB] = getFileSortScore(bPath);
  if (groupA !== groupB) return groupA - groupB;
  if (depthA !== depthB) return depthA - depthB;
  return nameA.localeCompare(nameB);
}

export function formatSkippedSummary(counts: FolderSkippedCounts): string[] {
  const parts: string[] = [];
  if (counts.ignoredDirs > 0) parts.push(`${counts.ignoredDirs} build/dependency dir${counts.ignoredDirs === 1 ? "" : "s"}`);
  if (counts.binary > 0) parts.push(`${counts.binary} binary/media file${counts.binary === 1 ? "" : "s"}`);
  if (counts.lockOrMinified > 0) parts.push(`${counts.lockOrMinified} lock/minified file${counts.lockOrMinified === 1 ? "" : "s"}`);
  if (counts.secrets > 0) parts.push(`${counts.secrets} .env/key file${counts.secrets === 1 ? "" : "s"}`);
  if (counts.tooLarge > 0) parts.push(`${counts.tooLarge} oversized file${counts.tooLarge === 1 ? "" : "s"}`);
  if (counts.budgetOmitted > 0) parts.push(`${counts.budgetOmitted} omitted (context limit)`);
  return parts;
}

interface TreeNode {
  children: Map<string, TreeNode>;
  metaLabel?: string;
}

function buildDirectoryTree(folderName: string, entries: FolderEntryDraft[]): string {
  const root: TreeNode = { children: new Map() };

  for (const entry of entries) {
    if (!entry.included && !entry.budgetOmitted) continue;
    const segments = entry.path.split("/").filter(Boolean);
    let cursor = root;
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (!cursor.children.has(seg)) {
        cursor.children.set(seg, { children: new Map() });
      }
      cursor = cursor.children.get(seg)!;
      if (i === segments.length - 1) {
        if (entry.budgetOmitted) {
          cursor.metaLabel = "[omitted - context limit]";
        } else if (entry.pageCount) {
          cursor.metaLabel = `${entry.pageCount} ${entry.pageCount === 1 ? "page" : "pages"}`;
        } else if (entry.lineCount !== undefined) {
          cursor.metaLabel = `${entry.lineCount} ${entry.lineCount === 1 ? "line" : "lines"}${entry.truncated ? ", truncated" : ""}`;
        }
      }
    }
  }

  const lines: string[] = [`${folderName}/`];

  const renderNode = (node: TreeNode, prefix: string) => {
    const sortedKeys = Array.from(node.children.entries()).sort(([nameA, nodeA], [nameB, nodeB]) => {
      const isDirA = nodeA.children.size > 0;
      const isDirB = nodeB.children.size > 0;
      if (isDirA !== isDirB) return isDirA ? -1 : 1;
      return nameA.localeCompare(nameB);
    });

    sortedKeys.forEach(([name, child], idx) => {
      const isLast = idx === sortedKeys.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const isDir = child.children.size > 0;
      const suffix = isDir ? "/" : child.metaLabel ? ` (${child.metaLabel})` : "";
      lines.push(`${prefix}${connector}${name}${suffix}`);
      if (isDir) {
        renderNode(child, `${prefix}${isLast ? "    " : "│   "}`);
      }
    });
  };

  renderNode(root, "");
  return lines.join("\n");
}

function getFenceForContent(content: string): string {
  const matches = content.match(/`{3,}/g);
  if (!matches) return "```";
  const maxLen = Math.max(...matches.map((m) => m.length));
  return "`".repeat(Math.min(Math.max(3, maxLen + 1), 8));
}

function formatEntryBlock(entry: FolderEntryDraft): string {
  const ext = getFileExtension(entry.path);
  const metaParts: string[] = [];
  if (entry.pageCount) metaParts.push(`${entry.pageCount} ${entry.pageCount === 1 ? "page" : "pages"}`);
  if (entry.lineCount !== undefined) metaParts.push(`${entry.lineCount} lines`);
  metaParts.push(formatBytes(entry.size));
  if (entry.truncated) metaParts.push("truncated");

  const header = `--- FILE: ${entry.path} (${metaParts.join(", ")}) ---`;
  const fence = getFenceForContent(entry.content);
  const lang = ext || "";
  return `${header}\n${fence}${lang}\n${entry.content}\n${fence}`;
}

/**
 * Rebuilds a folder draft's serialized prompt payload, file tree, and metadata totals
 * whenever files are toggled inside the Folder Inspector Modal.
 */
export function rebuildFolderDraft(
  draft: FolderAttachmentDraft,
  updatedEntries?: FolderEntryDraft[]
): FolderAttachmentDraft {
  const entries = updatedEntries || draft.entries;
  const activeEntries = entries.filter((e) => e.included);

  let totalSize = 0;
  let totalLines = 0;
  const folderFiles: AttachedFolderFile[] = [];

  for (const entry of activeEntries) {
    totalSize += entry.size;
    totalLines += entry.lineCount || 0;
    folderFiles.push({
      path: entry.path,
      size: entry.size,
      lineCount: entry.lineCount,
      pageCount: entry.pageCount,
      truncated: entry.truncated,
    });
  }

  const treeText = buildDirectoryTree(draft.folderName, entries);
  const bodyBlocks = activeEntries.map(formatEntryBlock).join("\n\n");
  const skippedSummary = formatSkippedSummary(draft.skippedCounts);

  const summaryLine = `Included: ${activeEntries.length} ${activeEntries.length === 1 ? "file" : "files"}, ${totalLines.toLocaleString()} lines (${formatBytes(totalSize)})${
    skippedSummary.length > 0 ? ` | Skipped: ${skippedSummary.join(", ")}` : ""
  }`;

  const extractedText = activeEntries.length > 0
    ? `${summaryLine}\n\nFolder Structure:\n${treeText}\n\n${bodyBlocks}`
    : `${summaryLine}\n\nFolder Structure:\n${treeText}\n\n[No files selected from this folder]`;

  const document: AttachedDocument = {
    id: draft.id,
    name: draft.folderName,
    type: "folder",
    size: totalSize,
    lineCount: totalLines,
    fileCount: activeEntries.length,
    skippedCount: skippedSummary.length > 0
      ? draft.skippedCounts.ignoredDirs +
        draft.skippedCounts.secrets +
        draft.skippedCounts.lockOrMinified +
        draft.skippedCounts.binary +
        draft.skippedCounts.tooLarge +
        draft.skippedCounts.budgetOmitted
      : 0,
    skippedSummary,
    folderFiles,
    extractedText,
  };

  return {
    ...draft,
    entries,
    document,
  };
}

async function finalizeFolderCandidates(
  folderName: string,
  candidates: CandidateFile[],
  skippedCounts: FolderSkippedCounts
): Promise<FolderImportResult> {
  const sorted = [...candidates].sort((a, b) =>
    compareCandidatePaths(a.relativePath, b.relativePath)
  );

  const entries: FolderEntryDraft[] = [];
  let totalChars = 0;
  let pdfCount = 0;

  for (const item of sorted) {
    const baseNameLower = item.relativePath.split("/").pop()?.toLowerCase() || "";

    if (IGNORED_OS_OR_LOCK_FILES.has(baseNameLower) || isMinifiedOrMapFile(baseNameLower)) {
      if (baseNameLower !== ".ds_store" && baseNameLower !== "thumbs.db" && baseNameLower !== "desktop.ini") {
        skippedCounts.lockOrMinified++;
      }
      continue;
    }

    if (isSecretOrKeyFile(baseNameLower)) {
      skippedCounts.secrets++;
      continue;
    }

    const isPdf = baseNameLower.endsWith(".pdf");
    if (!isPdf && isKnownBinaryFile(baseNameLower)) {
      skippedCounts.binary++;
      continue;
    }

    let file: File;
    try {
      file = await item.getFile();
    } catch {
      continue;
    }

    if (isPdf || isPdfFile(file)) {
      if (file.size > MAX_PDF_FILE_BYTES || pdfCount >= MAX_FOLDER_PDFS) {
        skippedCounts.tooLarge++;
        continue;
      }
      pdfCount++;
    } else if (file.size > MAX_SINGLE_FILE_BYTES) {
      skippedCounts.tooLarge++;
      continue;
    }

    const includedCount = entries.filter((e) => e.included).length;
    if (includedCount >= MAX_FOLDER_FILES || totalChars >= MAX_FOLDER_TOTAL_CHARS) {
      skippedCounts.budgetOmitted++;
      entries.push({
        path: item.relativePath,
        size: file.size,
        content: "",
        truncated: false,
        included: false,
        budgetOmitted: true,
      });
      continue;
    }

    try {
      if (isPdf || isPdfFile(file)) {
        const pdfData = await extractTextFromPdf(file);
        let text = pdfData.text.trim();
        if (!text) {
          skippedCounts.binary++;
          continue;
        }
        let truncated = false;
        const remainingBudget = Math.max(2000, MAX_FOLDER_TOTAL_CHARS - totalChars);
        const charCap = Math.min(MAX_SINGLE_FILE_CHARS, remainingBudget);
        if (text.length > charCap) {
          text = text.slice(0, charCap) + `\n[... truncated at ${charCap.toLocaleString()} chars ...]`;
          truncated = true;
        }
        totalChars += text.length;
        entries.push({
          path: item.relativePath,
          size: file.size,
          pageCount: pdfData.pageCount,
          lineCount: text.split("\n").length,
          content: text,
          truncated,
          included: true,
        });
        continue;
      }

      const rawText = await processTextFile(file);
      if (containsBinaryBytes(rawText)) {
        skippedCounts.binary++;
        continue;
      }

      let content = rawText;
      let truncated = false;
      const remainingBudget = Math.max(2000, MAX_FOLDER_TOTAL_CHARS - totalChars);
      const charCap = Math.min(MAX_SINGLE_FILE_CHARS, remainingBudget);
      if (content.length > charCap) {
        content = content.slice(0, charCap) + `\n[... truncated from ${rawText.length.toLocaleString()} chars to ${charCap.toLocaleString()} chars ...]`;
        truncated = true;
      }

      totalChars += content.length;
      const lineCount = content === "" ? 0 : content.split("\n").length;

      entries.push({
        path: item.relativePath,
        size: file.size,
        lineCount,
        content,
        truncated,
        included: true,
      });
    } catch {
      skippedCounts.binary++;
    }
  }

  const includedEntries = entries.filter((e) => e.included);
  if (includedEntries.length === 0) {
    const skipped = formatSkippedSummary(skippedCounts);
    return {
      draft: null,
      error: skipped.length > 0
        ? `No readable code or text files found in "${folderName}/" (skipped ${skipped.join(", ")}).`
        : `Folder "${folderName}/" is empty or contains no readable files.`,
    };
  }

  const initialDraft: FolderAttachmentDraft = {
    id: generateAttachmentId(),
    folderName,
    entries,
    skippedCounts,
    document: {
      id: "",
      name: folderName,
      type: "folder",
      size: 0,
    },
  };

  return {
    draft: rebuildFolderDraft(initialDraft, entries),
  };
}

/**
 * Processes files returned by `<input type="file" webkitdirectory />`.
 */
export async function processFolderFileList(files: File[] | FileList): Promise<FolderImportResult> {
  const fileArray = Array.from(files);
  if (fileArray.length === 0) {
    return { draft: null, error: "Selected folder is empty." };
  }

  const firstRel = (fileArray[0].webkitRelativePath || fileArray[0].name).replace(/\\/g, "/");
  const folderName = firstRel.includes("/") ? firstRel.split("/")[0] : "project-folder";
  const skippedCounts = emptySkippedCounts();
  const seenIgnoredDirs = new Set<string>();
  const candidates: CandidateFile[] = [];

  for (const file of fileArray) {
    const rawRel = (file.webkitRelativePath || file.name).replace(/\\/g, "/");
    const segments = rawRel.split("/").filter(Boolean);
    const innerSegments = segments.length > 1 && segments[0] === folderName ? segments.slice(1) : segments;
    if (innerSegments.length === 0) continue;

    // Check parent directories inside the folder for ignored names
    const parentDirs = innerSegments.slice(0, -1);
    const ignoredIdx = parentDirs.findIndex((seg) => isIgnoredSubdirectory(seg));
    if (ignoredIdx !== -1) {
      const ignoredKey = parentDirs.slice(0, ignoredIdx + 1).join("/");
      if (!seenIgnoredDirs.has(ignoredKey)) {
        seenIgnoredDirs.add(ignoredKey);
        skippedCounts.ignoredDirs++;
      }
      continue;
    }

    candidates.push({
      relativePath: innerSegments.join("/"),
      getFile: async () => file,
    });
  }

  return finalizeFolderCandidates(folderName, candidates, skippedCounts);
}

/**
 * Processes a directory chosen via the File System Access API (`window.showDirectoryPicker`).
 * Skips ignored subdirectories before enumerating or reading their children.
 */
export async function processDirectoryHandle(
  dirHandle: FileSystemDirectoryHandle
): Promise<FolderImportResult> {
  const skippedCounts = emptySkippedCounts();
  const candidates: CandidateFile[] = [];

  const walkDirectory = async (
    handle: FileSystemDirectoryHandle,
    prefix: string
  ): Promise<void> => {
    const iterableHandle = handle as FileSystemDirectoryHandle & {
      values: () => AsyncIterable<FileSystemHandle>;
    };

    for await (const child of iterableHandle.values()) {
      const relPath = prefix ? `${prefix}/${child.name}` : child.name;
      if (child.kind === "directory") {
        if (isIgnoredSubdirectory(child.name)) {
          skippedCounts.ignoredDirs++;
          continue;
        }
        await walkDirectory(child as FileSystemDirectoryHandle, relPath);
      } else if (child.kind === "file") {
        const fileHandle = child as FileSystemFileHandle;
        candidates.push({
          relativePath: relPath,
          getFile: () => fileHandle.getFile(),
        });
      }
    }
  };

  await walkDirectory(dirHandle, "");
  return finalizeFolderCandidates(dirHandle.name || "project-folder", candidates, skippedCounts);
}

function readAllDirectoryEntries(dirEntry: any): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = dirEntry.createReader();
    const collected: any[] = [];

    const readNextBatch = () => {
      reader.readEntries(
        (batch: any[]) => {
          if (!batch || batch.length === 0) {
            resolve(collected);
          } else {
            collected.push(...batch);
            readNextBatch();
          }
        },
        (err: any) => reject(err)
      );
    };

    readNextBatch();
  });
}

function getFileFromEntry(fileEntry: any): Promise<File> {
  return new Promise((resolve, reject) => {
    fileEntry.file(resolve, reject);
  });
}

async function processDroppedDirectoryEntry(dirEntry: any): Promise<FolderImportResult> {
  const skippedCounts = emptySkippedCounts();
  const candidates: CandidateFile[] = [];

  const walkEntry = async (entry: any, prefix: string): Promise<void> => {
    const children = await readAllDirectoryEntries(entry);
    for (const child of children) {
      const relPath = prefix ? `${prefix}/${child.name}` : child.name;
      if (child.isDirectory) {
        if (isIgnoredSubdirectory(child.name)) {
          skippedCounts.ignoredDirs++;
          continue;
        }
        await walkEntry(child, relPath);
      } else if (child.isFile) {
        candidates.push({
          relativePath: relPath,
          getFile: () => getFileFromEntry(child),
        });
      }
    }
  };

  await walkEntry(dirEntry, "");
  return finalizeFolderCandidates(dirEntry.name || "project-folder", candidates, skippedCounts);
}

export interface CapturedDropPayload {
  directoryEntries: any[];
  looseFiles: File[];
}

/**
 * Synchronously snapshots `DataTransferItemList` before the browser clears it across awaits.
 */
export function captureDropPayload(dataTransfer: DataTransfer): CapturedDropPayload {
  const directoryEntries: any[] = [];
  const looseFiles: File[] = [];

  if (dataTransfer.items && dataTransfer.items.length > 0) {
    for (let i = 0; i < dataTransfer.items.length; i++) {
      const item = dataTransfer.items[i];
      if (item.kind !== "file") continue;

      const entry = typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null;
      if (entry) {
        if (entry.isDirectory) {
          directoryEntries.push(entry);
        } else if (entry.isFile) {
          const f = item.getAsFile();
          if (f) looseFiles.push(f);
        }
      } else {
        const f = item.getAsFile();
        if (f) looseFiles.push(f);
      }
    }
  } else if (dataTransfer.files && dataTransfer.files.length > 0) {
    looseFiles.push(...Array.from(dataTransfer.files));
  }

  return { directoryEntries, looseFiles };
}

export async function processCapturedDropDirectories(
  directoryEntries: any[]
): Promise<FolderImportResult[]> {
  return Promise.all(directoryEntries.map((entry) => processDroppedDirectoryEntry(entry)));
}
