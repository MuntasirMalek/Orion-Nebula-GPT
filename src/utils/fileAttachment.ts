import { extractTextFromPdf } from "./pdfParser";

export interface ProcessedAttachment {
  id: string;
  name: string;
  type: "image" | "pdf" | "text" | "code";
  size: number;
  dataUrl?: string; // For images
  extractedText?: string; // For PDF or text documents
  pageCount?: number; // For PDF
  lineCount?: number; // For text and code files
  fallbackImages?: string[]; // Scanned PDF fallback images for vision
  isLoading?: boolean;
  error?: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function generateAttachmentId(): string {
  return "att_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
}

// Common text-based and coding file extensions
const TEXT_EXTENSIONS = new Set([
  "txt", "text", "md", "mdx", "markdown", "rst", "adoc", "json", "jsonc", "json5",
  "csv", "tsv", "xml", "yaml", "yml", "html", "htm", "css", "scss", "sass", "less",
  "js", "jsx", "mjs", "cjs", "ts", "tsx", "mts", "cts", "vue", "svelte", "astro",
  "py", "pyw", "pyi", "ipynb", "c", "cpp", "cc", "cxx", "h", "hpp", "hh", "java",
  "go", "mod", "sum", "rs", "sql", "sh", "bash", "zsh", "fish", "ps1", "bat", "cmd",
  "env", "example", "sample", "template", "log", "ini", "toml", "cfg", "conf", "config",
  "tex", "bib", "diff", "patch", "svg", "graphql", "gql", "prisma", "proto",
  "dockerfile", "makefile", "cmake", "gradle", "properties", "r", "rmd", "jl",
  "swift", "kt", "kts", "rb", "erb", "php", "cs", "fs", "vb", "lua", "dart",
  "ex", "exs", "erl", "hrl", "hs", "lhs", "scala", "clj", "cljs", "edn", "elm",
  "pl", "pm", "zig", "nim", "v", "sol", "tf", "tfvars", "hcl", "nix", "lock"
]);

// Known text/coding filenames without a standard extension
const TEXT_FILENAMES = new Set([
  "dockerfile", "makefile", "gnumakefile", "procfile", "justfile", "jenkinsfile",
  "vagrantfile", "gemfile", "rakefile", "podfile", "fastfile", "brewfile",
  "cmakelists.txt", "license", "licence", "readme", "changelog", "authors",
  "notice", "contributing", "codeowners", ".gitignore", ".gitattributes",
  ".gitmodules", ".dockerignore", ".editorconfig", ".nvmrc", ".npmrc", ".yarnrc",
  ".prettierrc", ".eslintrc", ".babelrc", ".browserslistrc", ".env.example",
  ".env.sample", ".env.template"
]);

// Known binary/media/compiled extensions (never attempt UTF-8 text decode)
const BINARY_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "gif", "webp", "bmp", "ico", "icns", "tiff", "tif", "avif", "heic", "heif",
  "mp3", "mp4", "wav", "ogg", "flac", "m4a", "aac", "wma", "mov", "avi", "mkv", "webm", "m4v", "flv",
  "woff", "woff2", "ttf", "otf", "eot",
  "zip", "tar", "gz", "tgz", "bz2", "xz", "7z", "rar", "dmg", "iso", "img",
  "exe", "dll", "so", "dylib", "bin", "o", "a", "lib", "obj", "class", "jar", "war", "ear",
  "pyc", "pyo", "pyd", "wasm", "sqlite", "sqlite3", "db", "mdb", "pdb", "ilk", "suo",
  "nupkg", "whl", "egg", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "odt", "ods", "psd", "ai", "sketch", "fig"
]);

export function getFileExtension(filename: string): string {
  const baseName = filename.split("/").pop()?.toLowerCase() || "";
  if (!baseName.includes(".")) return "";
  return baseName.split(".").pop() || "";
}

export function isKnownBinaryFile(filename: string): boolean {
  const ext = getFileExtension(filename);
  return ext ? BINARY_EXTENSIONS.has(ext) : false;
}

export function containsBinaryBytes(text: string): boolean {
  const sample = text.slice(0, 4096);
  if (!sample) return false;
  let replacementOrControl = 0;
  for (let i = 0; i < sample.length; i++) {
    const code = sample.charCodeAt(i);
    if (code === 0) return true; // NUL byte is definitive binary indicator
    if ((code < 9 || (code > 13 && code < 32)) && code !== 27) {
      replacementOrControl++;
    }
  }
  return replacementOrControl / sample.length > 0.08;
}

export function isTextFile(file: File): boolean {
  if (file.type && (
    file.type === "text/plain" ||
    file.type.startsWith("text/") ||
    file.type.includes("json") ||
    file.type.includes("javascript") ||
    file.type.includes("typescript") ||
    file.type.includes("xml") ||
    file.type.includes("yaml") ||
    file.type.includes("csv")
  )) {
    return true;
  }
  const baseName = file.name.toLowerCase();
  if (TEXT_FILENAMES.has(baseName)) return true;
  if (baseName.endsWith(".txt") || baseName.endsWith(".text")) return true;
  const ext = getFileExtension(baseName);
  return ext ? TEXT_EXTENSIONS.has(ext) : false;
}

export function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * Downscales and converts an image file to a base64 JPEG data URL.
 */
export async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return reject(new Error("Failed to read image file"));

      // If file is > 1MB, downscale using canvas to conserve bandwidth and model token quota
      if (file.size > 1024 * 1024) {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1600;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = () => resolve(result);
        img.src = result;
      } else {
        resolve(result);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Reads plain text or code file contents.
 */
export async function processTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      resolve(result || "");
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

const MAX_DOCUMENT_CHARS = 60000;

/**
 * Master parser for attached files (Images, PDFs, Text/Code files).
 */
export async function processFile(file: File): Promise<ProcessedAttachment> {
  const id = generateAttachmentId();

  if (isImageFile(file)) {
    const dataUrl = await processImageFile(file);
    return {
      id,
      name: file.name,
      type: "image",
      size: file.size,
      dataUrl,
    };
  }

  if (isPdfFile(file)) {
    try {
      const pdfData = await extractTextFromPdf(file);
      let text = pdfData.text;
      if (text.length > MAX_DOCUMENT_CHARS) {
        text = text.slice(0, MAX_DOCUMENT_CHARS) + `\n\n[Note: Document truncated to first ${MAX_DOCUMENT_CHARS} characters to fit context window]`;
      }

      return {
        id,
        name: file.name,
        type: "pdf",
        size: file.size,
        pageCount: pdfData.pageCount,
        extractedText: text,
        fallbackImages: pdfData.images,
      };
    } catch (err: any) {
      console.error("PDF extraction error:", err);
      return {
        id,
        name: file.name,
        type: "pdf",
        size: file.size,
        error: err?.message || "Failed to parse PDF document.",
      };
    }
  }

  if (isTextFile(file) || (!isKnownBinaryFile(file.name) && file.size < 5 * 1024 * 1024)) {
    // Treat as text or code document
    try {
      let text = await processTextFile(file);
      if (containsBinaryBytes(text)) {
        throw new Error(`Unsupported binary file: ${file.name}`);
      }
      if (text.length > MAX_DOCUMENT_CHARS) {
        text = text.slice(0, MAX_DOCUMENT_CHARS) + `\n\n[Note: File truncated to first ${MAX_DOCUMENT_CHARS} characters]`;
      }
      const lineCount = text.split("\n").length;
      const ext = getFileExtension(file.name);
      const isCode = [
        "js", "jsx", "mjs", "cjs", "ts", "tsx", "mts", "cts", "vue", "svelte", "astro",
        "py", "pyw", "pyi", "html", "htm", "css", "scss", "sass", "less", "json", "jsonc",
        "sql", "sh", "bash", "zsh", "ps1", "rs", "go", "c", "cpp", "cc", "h", "hpp",
        "java", "php", "rb", "swift", "kt", "kts", "cs", "fs", "lua", "dart", "ex", "exs",
        "scala", "clj", "zig", "nim", "sol", "tf", "hcl", "proto", "prisma", "graphql",
        "gql", "diff", "patch", "xml", "yaml", "yml", "toml", "ini"
      ].includes(ext);

      return {
        id,
        name: file.name,
        type: isCode ? "code" : "text",
        size: file.size,
        lineCount,
        extractedText: text,
      };
    } catch (err: any) {
      return {
        id,
        name: file.name,
        type: "text",
        size: file.size,
        error: err?.message || "Failed to read file text.",
      };
    }
  }

  throw new Error(`Unsupported file type: ${file.name}`);
}
