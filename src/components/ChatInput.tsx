import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, ChevronUp, Check, Paperclip, FolderPlus, FolderCode, X, FileText, FileCode, Loader2, Code2 } from "lucide-react";
import { LockIcon } from "./LockIcon";
import { AVAILABLE_MODELS, DEFAULT_MODEL_ID, ModelOption, isModelUnlocked, getModelProviderUiStyle, getModelById } from "../config";
import { ThemeConfig } from "../themes";
import { AttachedDocument } from "../types";
import { processFile, isImageFile, isPdfFile, isTextFile, formatBytes } from "../utils/fileAttachment";
import {
  FolderAttachmentDraft,
  FolderImportResult,
  captureDropPayload,
  processCapturedDropDirectories,
  processDirectoryHandle,
  processFolderFileList,
  rebuildFolderDraft,
} from "../utils/folderAttachment";
import { PasscodeModal } from "./PasscodeModal";
import { FolderInspectorModal } from "./FolderInspectorModal";
import { ModelNameLabel } from "./ModelNameLabel";
import { ModelLogo } from "./ModelLogo";

interface ChatInputProps {
  onSendMessage: (content: string, images?: string[], documents?: AttachedDocument[]) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  currentModelId?: string;
  onSelectModel?: (modelId: string) => void;
  reasoningEffort?: "low" | "medium" | "high";
  onSelectReasoningEffort?: (effort: "low" | "medium" | "high") => void;
  sendKeyMode?: "enter" | "cmd_enter";
  theme?: ThemeConfig;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled = false,
  currentModelId = DEFAULT_MODEL_ID,
  onSelectModel,
  reasoningEffort = "medium",
  onSelectReasoningEffort,
  sendKeyMode = "enter",
  theme,
}) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<AttachedDocument[]>([]);
  const [folderDrafts, setFolderDrafts] = useState<Record<string, FolderAttachmentDraft>>({});
  const [inspectingFolderId, setInspectingFolderId] = useState<string | null>(null);
  const [attachmentNotice, setAttachmentNotice] = useState<{ message: string; tone: "info" | "warn" } | null>(null);
  const [isParsingFiles, setIsParsingFiles] = useState(false);
  const [showVibePrompts, setShowVibePrompts] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [, setUnlockTick] = useState(0);
  const [passcodeTarget, setPasscodeTarget] = useState<ModelOption | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const selectedModel = getModelById(currentModelId);
  const isSelectedModelLocked = Boolean(
    selectedModel.requiresPasscode &&
      !isModelUnlocked(selectedModel.id, selectedModel.defaultEffort || reasoningEffort)
  );
  const isDark = false;

  useEffect(() => {
    const handleUnlockChange = () => setUnlockTick((t) => t + 1);
    window.addEventListener("orion-unlock-changed", handleUnlockChange);
    window.addEventListener("storage", handleUnlockChange);
    return () => {
      window.removeEventListener("orion-unlock-changed", handleUnlockChange);
      window.removeEventListener("storage", handleUnlockChange);
    };
  }, []);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Synchronous zero-overhead auto-resize without React layout thrashing
  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustHeight(e.target);
  };

  // Close model menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target as Node)) {
        setIsModelMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (folderInputRef.current) {
      folderInputRef.current.setAttribute("webkitdirectory", "");
      folderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  useEffect(() => {
    if (!attachmentNotice) return;
    const timer = setTimeout(() => setAttachmentNotice(null), 6500);
    return () => clearTimeout(timer);
  }, [attachmentNotice]);

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeDocument = (indexToRemove: number) => {
    const targetDoc = documents[indexToRemove];
    setDocuments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    if (targetDoc?.type === "folder") {
      setFolderDrafts((prev) => {
        const next = { ...prev };
        delete next[targetDoc.id];
        return next;
      });
      if (inspectingFolderId === targetDoc.id) {
        setInspectingFolderId(null);
      }
    }
  };

  const clearAllAttachments = () => {
    setImages([]);
    setDocuments([]);
    setFolderDrafts({});
    setInspectingFolderId(null);
  };

  const applyFolderResults = (results: FolderImportResult[]) => {
    const newDocs: AttachedDocument[] = [];
    const newDrafts: Record<string, FolderAttachmentDraft> = {};
    const errors: string[] = [];

    for (const res of results) {
      if (res.draft) {
        newDocs.push(res.draft.document);
        newDrafts[res.draft.id] = res.draft;
      } else if (res.error) {
        errors.push(res.error);
      }
    }

    if (newDocs.length > 0) {
      setFolderDrafts((prev) => ({ ...prev, ...newDrafts }));
      setDocuments((prev) => {
        const existingKeys = new Set(
          prev.map((d) => `${d.type}:${d.name}:${d.size}:${d.fileCount || 0}`)
        );
        const uniqueNew = newDocs.filter(
          (d) => !existingKeys.has(`${d.type}:${d.name}:${d.size}:${d.fileCount || 0}`)
        );
        return [...prev, ...uniqueNew];
      });

      const primary = newDocs[0];
      const skippedText =
        primary.skippedSummary && primary.skippedSummary.length > 0
          ? ` (excluded ${primary.skippedSummary.join(", ")})`
          : "";
      setAttachmentNotice({
        message:
          newDocs.length === 1
            ? `Attached ${primary.name}/ — ${primary.fileCount} files${skippedText}`
            : `Attached ${newDocs.length} folders`,
        tone: primary.skippedSummary?.some((s) => s.includes("context limit")) ? "warn" : "info",
      });
    } else if (errors.length > 0) {
      setAttachmentNotice({
        message: errors[0],
        tone: "warn",
      });
    }
  };

  const updateFolderDraft = (folderId: string, updater: (draft: FolderAttachmentDraft) => FolderAttachmentDraft) => {
    const current = folderDrafts[folderId];
    if (!current) return;
    const updated = updater(current);
    setFolderDrafts((prev) => ({ ...prev, [folderId]: updated }));
    setDocuments((prev) =>
      prev.map((doc) => (doc.id === folderId ? updated.document : doc))
    );
  };

  const handleToggleFolderFile = (folderId: string, filePath: string) => {
    updateFolderDraft(folderId, (draft) => {
      const nextEntries = draft.entries.map((entry) =>
        entry.path === filePath && !entry.budgetOmitted
          ? { ...entry, included: !entry.included }
          : entry
      );
      return rebuildFolderDraft(draft, nextEntries);
    });
  };

  const handleSetAllFolderFiles = (folderId: string, included: boolean) => {
    updateFolderDraft(folderId, (draft) => {
      const nextEntries = draft.entries.map((entry) =>
        entry.budgetOmitted ? entry : { ...entry, included }
      );
      return rebuildFolderDraft(draft, nextEntries);
    });
  };

  const handleRemoveFolderById = (folderId: string) => {
    const idx = documents.findIndex((d) => d.id === folderId);
    if (idx !== -1) removeDocument(idx);
  };

  const handleFolderButtonClick = async () => {
    if (typeof (window as any).showDirectoryPicker === "function") {
      try {
        const dirHandle = await (window as any).showDirectoryPicker({ mode: "read" });
        setIsParsingFiles(true);
        try {
          const result = await processDirectoryHandle(dirHandle);
          applyFolderResults([result]);
        } finally {
          setIsParsingFiles(false);
        }
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") return;
      }
    }
    folderInputRef.current?.click();
  };

  const handleFolderInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      e.target.value = "";
      setIsParsingFiles(true);
      try {
        const result = await processFolderFileList(selectedFiles);
        applyFolderResults([result]);
      } catch (err: any) {
        setAttachmentNotice({
          message: err?.message || "Failed to read selected folder.",
          tone: "warn",
        });
      } finally {
        setIsParsingFiles(false);
      }
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setIsParsingFiles(true);
    try {
      const results = await Promise.all(
        fileList.map(async (file) => {
          try {
            if (isImageFile(file)) {
              return await processFile(file);
            }
            if (isPdfFile(file) || isTextFile(file) || file.size < 15 * 1024 * 1024) {
              return await processFile(file);
            }
          } catch (err) {
            console.error(`Error processing ${file.name}:`, err);
          }
          return null;
        })
      );

      const newImages: string[] = [];
      const newDocs: AttachedDocument[] = [];

      for (const res of results) {
        if (!res) continue;
        if (res.type === "image" && res.dataUrl) {
          newImages.push(res.dataUrl);
        } else if (res.extractedText !== undefined) {
          newDocs.push({
            id: res.id,
            name: res.name,
            type: res.type as "pdf" | "text" | "code",
            size: res.size,
            pageCount: res.pageCount,
            lineCount: res.lineCount,
            extractedText: res.extractedText,
          });
          if (res.fallbackImages && res.fallbackImages.length > 0) {
            newImages.push(...res.fallbackImages);
          }
        } else if (res.fallbackImages && res.fallbackImages.length > 0) {
          newDocs.push({
            id: res.id,
            name: res.name,
            type: "pdf",
            size: res.size,
            pageCount: res.pageCount,
            extractedText: "[Scanned PDF pages attached as visual document]",
          });
          newImages.push(...res.fallbackImages);
        }
      }

      if (newImages.length > 0) {
        setImages((prev) => [...prev, ...newImages]);
      }
      if (newDocs.length > 0) {
        setDocuments((prev) => {
          const existingKeys = new Set(prev.map((d) => `${d.name}:${d.size}`));
          const uniqueNew = newDocs.filter((d) => !existingKeys.has(`${d.name}:${d.size}`));
          return [...prev, ...uniqueNew];
        });
      }
    } catch (err) {
      console.error("Error processing files:", err);
    } finally {
      setIsParsingFiles(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      e.target.value = "";
      handleFiles(selectedFiles);
    }
  };

  // Clipboard Paste Support (Cmd+V of screenshots, copied images or files)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const filesToProcess: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const file = items[i].getAsFile();
      if (file) {
        filesToProcess.push(file);
      }
    }

    if (filesToProcess.length > 0) {
      e.preventDefault();
      handleFiles(filesToProcess);
    }
  };

  // Drag and Drop Support
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!e.dataTransfer) return;

    const payload = captureDropPayload(e.dataTransfer);
    if (payload.directoryEntries.length > 0) {
      setIsParsingFiles(true);
      try {
        const folderResults = await processCapturedDropDirectories(payload.directoryEntries);
        applyFolderResults(folderResults);
      } catch (err: any) {
        setAttachmentNotice({
          message: err?.message || "Failed to read dropped folder.",
          tone: "warn",
        });
      } finally {
        setIsParsingFiles(false);
      }
      if (payload.looseFiles.length > 0) {
        await handleFiles(payload.looseFiles);
      }
      return;
    }

    if (payload.looseFiles.length > 0) {
      await handleFiles(payload.looseFiles);
    }
  };

  const resetComposer = () => {
    setText("");
    setImages([]);
    setDocuments([]);
    setFolderDrafts({});
    setInspectingFolderId(null);
    setAttachmentNotice(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isStreaming) {
      onStopStreaming();
      return;
    }
    const trimmed = text.trim();
    if ((!trimmed && images.length === 0 && documents.length === 0) || isParsingFiles || disabled) return;

    // Check if model is locked before sending
    const isLocked = Boolean(
      selectedModel.requiresPasscode &&
      !isModelUnlocked(selectedModel.id, selectedModel.defaultEffort || reasoningEffort)
    );
    if (isLocked) {
      setPasscodeTarget(selectedModel);
      return;
    }

    onSendMessage(
      trimmed,
      images.length > 0 ? images : undefined,
      documents.length > 0 ? documents : undefined
    );
    resetComposer();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (sendKeyMode === "cmd_enter") {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSubmit();
      }
    } else {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    }
  };

  const wrapperClass = theme ? theme.input.wrapper : "rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/95 focus-within:border-cyan-500/80 shadow-2xl shadow-slate-900/10";
  const textareaClass = theme ? theme.input.textarea : "text-sm text-slate-900 placeholder-slate-400";
  const modelPillClass = theme ? theme.input.modelPill : "text-xs font-semibold text-slate-700 bg-slate-100/80 border border-slate-200 rounded-xl px-2.5 py-1.5";
  const sendBtnClass = theme ? theme.input.sendButton : "bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 rounded-xl shadow-xs";
  const stopBtnClass = theme ? theme.input.stopButton : "bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl shadow-xs";
  const hintClass = theme ? theme.input.keyboardHint : "text-xs text-slate-500";

  return (
    <div className={`shrink-0 w-full mx-auto px-2.5 sm:px-4 pb-[max(0.625rem,env(safe-area-inset-bottom))] sm:pb-3 md:pb-6 pt-1 sm:pt-2 ${theme ? theme.input.container : "max-w-4xl"}`}>
      {/* Hidden File Input — no restrictive accept filter so Android/iOS/desktop allow multi-selecting .py, .txt, .ts, .pdf, images, etc. together */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        className="hidden"
      />
      {/* Hidden Folder Input fallback for browsers without showDirectoryPicker (Safari/Firefox) */}
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderInputChange}
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
      />

      <form onSubmit={handleSubmit} className="relative">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative transition-all duration-300 ${wrapperClass} ${
            isDragging ? "ring-2 ring-cyan-500 bg-cyan-50/20" : ""
          }`}
        >
          {/* Quick Vibe Coding Prompt Shortcuts */}
          {showVibePrompts && (
            <div className="flex items-center gap-1.5 p-2.5 border-b border-slate-200/60 overflow-x-auto [scrollbar-width:none]">
              {[
                { label: "🚀 Full Component", prompt: "Build a complete, drop-in React + Tailwind component for " },
                { label: "🐞 Fix Bug", prompt: "Analyze and fix the error in this code: " },
                { label: "⚡ Refactor", prompt: "Refactor this code for cleaner architecture and maximum performance: " },
                { label: "📂 Folder / Multi-File Review", prompt: "Review the attached folder structure and files together, explain how they interact, and provide any fixes or improvements across files: " },
                { label: "🧪 Write Tests", prompt: "Write comprehensive unit tests with edge cases for " },
                { label: "📝 Explain Code", prompt: "Explain how this code works step-by-step: " },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setText((prev) => (prev ? `${prev}\n${item.prompt}` : item.prompt));
                    setShowVibePrompts(false);
                    textareaRef.current?.focus();
                  }}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-cyan-50 hover:bg-cyan-100 border border-cyan-200/80 text-[11px] font-semibold text-cyan-800 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          {/* Folder / File Import Status Notice */}
          {attachmentNotice && (
            <div className="px-3 pt-2.5">
              <div
                className={`flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl text-[11px] border ${
                  attachmentNotice.tone === "warn"
                    ? "bg-amber-50/90 border-amber-200 text-amber-900"
                    : "bg-cyan-50/90 border-cyan-200 text-cyan-900"
                }`}
              >
                <span className="truncate">{attachmentNotice.message}</span>
                <button
                  type="button"
                  onClick={() => setAttachmentNotice(null)}
                  className="shrink-0 opacity-60 hover:opacity-100 cursor-pointer"
                  title="Dismiss"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* File, Folder & Image Preview Chips (Shown above textarea if attached) */}
          {(images.length > 0 || documents.length > 0 || isParsingFiles) && (
            <div className="flex flex-col gap-1.5 p-3 pb-0">
              {documents.length + images.length > 0 && (documents.length + images.length > 1 || documents.some((d) => d.type === "folder")) && (
                <div className="flex items-center justify-between px-0.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-cyan-700">
                    {documents.length + images.length} {documents.length + images.length === 1 ? "attachment" : "attachments"}
                  </span>
                  <button
                    type="button"
                    onClick={clearAllAttachments}
                    className="text-slate-400 hover:text-rose-600 font-medium transition-colors cursor-pointer"
                    title="Remove all attachments"
                  >
                    Clear all
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none]">
                {/* Document & Folder Chips */}
                {documents.map((doc, idx) => {
                  const isFolder = doc.type === "folder";
                  const isPdf = doc.type === "pdf";
                  const canInspect = isFolder && Boolean(folderDrafts[doc.id]);

                  return (
                    <div
                      key={doc.id || idx}
                      onClick={canInspect ? () => setInspectingFolderId(doc.id) : undefined}
                      title={canInspect ? "Click to inspect or filter files in this folder" : doc.name}
                      className={`relative group shrink-0 inline-flex items-center gap-2.5 pl-2.5 pr-8 py-2 rounded-xl bg-slate-50/90 border shadow-xs text-xs text-slate-800 transition-colors ${
                        canInspect
                          ? "border-amber-200/90 hover:border-amber-400 hover:bg-amber-50/40 cursor-pointer"
                          : "border-slate-200/90"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg flex items-center justify-center ${
                          isFolder
                            ? "bg-amber-50 text-amber-700 border border-amber-200/90"
                            : isPdf
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : "bg-cyan-50 text-cyan-700 border border-cyan-100"
                        }`}
                      >
                        {isFolder ? (
                          <FolderCode className="w-4 h-4 text-amber-600" />
                        ) : isPdf ? (
                          <FileText className="w-4 h-4 text-rose-500" />
                        ) : (
                          <FileCode className="w-4 h-4 text-cyan-600" />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0 pr-1">
                        <span className="font-semibold truncate max-w-[140px] sm:max-w-[190px] text-slate-800" title={doc.name}>
                          {isFolder ? `${doc.name}/` : doc.name}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {isFolder
                            ? `${doc.fileCount ?? 0} ${doc.fileCount === 1 ? "file" : "files"} · Inspect`
                            : isPdf
                            ? "PDF"
                            : doc.name.split(".").pop()?.toUpperCase() || "TXT"}
                          {doc.pageCount ? ` · ${doc.pageCount} ${doc.pageCount === 1 ? "page" : "pages"}` : ""}
                          {doc.lineCount ? ` · ${doc.lineCount.toLocaleString()} ${doc.lineCount === 1 ? "line" : "lines"}` : ""}
                          {doc.size ? ` · ${formatBytes(doc.size)}` : ""}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(idx);
                        }}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={isFolder ? "Remove folder" : "Remove file"}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Parsing Indicator */}
                {isParsingFiles && (
                  <div className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-50/80 border border-cyan-200/80 text-xs text-cyan-800 font-medium animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                    <span>Reading files...</span>
                  </div>
                )}

                {/* Image Chips */}
                {images.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    className="relative group shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100"
                  >
                    <img
                      src={imgSrc}
                      alt={`Attachment preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow-xs"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 w-16 h-16 rounded-xl border border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-cyan-700 transition-colors gap-1 cursor-pointer"
                  title="Add more files (.py, .txt, .pdf, code, or pictures)"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="text-[10px] font-medium">+File</span>
                </button>

                <button
                  type="button"
                  onClick={handleFolderButtonClick}
                  className="shrink-0 w-16 h-16 rounded-xl border border-dashed border-slate-300 hover:border-amber-500 hover:bg-amber-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-amber-700 transition-colors gap-1 cursor-pointer"
                  title="Insert another project folder"
                >
                  <FolderPlus className="w-4 h-4" />
                  <span className="text-[10px] font-medium">+Folder</span>
                </button>
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={
              isMobile
                ? `Message ${selectedModel.name}...`
                : `Message ${selectedModel.name} (attach files, project folders, PDFs or pictures)...`
            }
            rows={1}
            disabled={disabled}
            className={`w-full resize-none bg-transparent pt-3 pb-1 px-3.5 leading-relaxed focus:outline-none min-h-[44px] max-h-[200px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${textareaClass}`}
          />

          {/* Action Row */}
          <div className="flex items-center justify-between px-2.5 pb-2 pt-0.5">
            {/* Interactive Model & Thinking Level Selector Pills */}
            <div className="relative flex items-center gap-1.5 sm:gap-2 min-w-0">
              {/* Model Selector Pill */}
              <div ref={modelMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsModelMenuOpen(!isModelMenuOpen);
                  }}
                  className={`group flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 max-w-[155px] xs:max-w-[210px] sm:max-w-none ${modelPillClass}`}
                  title="Click to switch model"
                >
                  <ModelLogo modelId={selectedModel.id} provider={selectedModel.provider} size={15} />
                  <ModelNameLabel name={selectedModel.name} shortOnMobile={true} />
                  {isSelectedModelLocked && (
                    <LockIcon className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                  )}
                  <ChevronUp
                    className={`w-3.5 h-3.5 opacity-60 transition-transform duration-150 shrink-0 ${
                      isModelMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Popover Menu inside Input Bar */}
                {isModelMenuOpen && onSelectModel && (
                  <div
                    className={`absolute bottom-full mb-2 left-0 z-50 w-[min(300px,calc(100vw-32px))] max-h-[min(75vh,520px)] flex flex-col p-2.5 rounded-2xl shadow-2xl backdrop-blur-2xl border animate-in fade-in zoom-in-95 duration-150 ${
                      isDark
                        ? "bg-stone-950 border-stone-800 text-stone-100 shadow-black/80"
                        : "bg-white border-stone-200 text-stone-900 shadow-2xl"
                    }`}
                  >
                    <div
                      className={`px-2 py-1 mb-1 border-b text-xs font-bold uppercase tracking-wider shrink-0 ${
                        isDark ? "border-stone-800 text-stone-400" : "border-stone-100 text-stone-500"
                      }`}
                    >
                      Switch Model
                    </div>
                    <div className="space-y-1 overflow-y-auto flex-1 pr-1 overscroll-contain">
                      {AVAILABLE_MODELS.map((model) => {
                        const isItemActive = model.id === selectedModel.id;
                        const isLocked = Boolean(
                          model.requiresPasscode && !isModelUnlocked(model.id, model.defaultEffort || reasoningEffort)
                        );

                        const badgeClass = getModelProviderUiStyle(model).badgeClass;

                        return (
                          <button
                            key={model.id}
                            type="button"
                            onClick={() => {
                              if (isLocked) {
                                setPasscodeTarget(model);
                                setIsModelMenuOpen(false);
                                return;
                              }
                              if (model.defaultEffort && onSelectReasoningEffort) {
                                onSelectReasoningEffort(model.defaultEffort);
                              }
                              onSelectModel(model.id);
                              setIsModelMenuOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 border flex items-center justify-between gap-2 cursor-pointer ${
                              isItemActive
                                ? isDark
                                  ? "bg-stone-900 border-cyan-500/80 text-stone-100"
                                  : "bg-cyan-50/70 border-cyan-300 text-stone-950 font-medium"
                                : isDark
                                ? "bg-transparent hover:bg-stone-900 border-transparent text-stone-300"
                                : "bg-transparent hover:bg-stone-100/70 border-transparent text-stone-700"
                            }`}
                          >
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <ModelLogo modelId={model.id} provider={model.provider} size={16} />
                                <span className="truncate">
                                  <ModelNameLabel name={model.name} />
                                </span>
                                {isLocked && (
                                  <LockIcon className="w-3.5 h-3.5 text-stone-900 shrink-0" />
                                )}
                              </div>
                              <div className="pt-0.5">
                                <span
                                  className={`inline-block text-[10px] tracking-tight font-semibold px-2 py-0.5 rounded-full border ${badgeClass}`}
                                >
                                  {model.tag}
                                </span>
                              </div>
                            </div>
                            {isItemActive && (
                              <Check className="w-3.5 h-3.5 shrink-0 text-cyan-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <span className={`hidden md:inline ${hintClass}`}>
                {sendKeyMode === "cmd_enter"
                  ? "⌘/Ctrl + Enter to send · Enter for newline"
                  : "Enter to send · Shift + Enter for newline"}
              </span>
            </div>

            {/* Controls: Attach File/Picture, Vibe Prompts & Send / Stop Generation Button */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowVibePrompts((prev) => !prev)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  showVibePrompts
                    ? "text-cyan-700 bg-cyan-100/90 font-bold shadow-xs"
                    : "text-slate-500 hover:text-cyan-700 hover:bg-slate-100/80 active:scale-95"
                }`}
                title="Vibe code prompt shortcuts"
              >
                <Code2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-500 hover:text-cyan-700 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer"
                title="Attach file (.txt, PDF, code) or picture (Vision)"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleFolderButtonClick}
                disabled={isParsingFiles || disabled}
                className="p-2 rounded-xl text-slate-500 hover:text-amber-700 hover:bg-amber-50/90 active:scale-95 transition-all cursor-pointer disabled:opacity-40"
                title="Insert project folder (preserves file tree & relative paths)"
              >
                <FolderPlus className="w-4 h-4" />
              </button>

              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className={stopBtnClass}
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={(!text.trim() && images.length === 0 && documents.length === 0) || isParsingFiles || disabled}
                  className={`${sendBtnClass} disabled:opacity-30 disabled:pointer-events-none`}
                  title="Send message"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* Passcode Unlock Modal */}
      <PasscodeModal
        isOpen={Boolean(passcodeTarget)}
        onClose={() => setPasscodeTarget(null)}
        onSuccess={(_code, switchedModelId) => {
          setUnlockTick((t) => t + 1);
          const effectiveModelId = switchedModelId || passcodeTarget?.id;
          const target = switchedModelId
            ? AVAILABLE_MODELS.find((m) => m.id === switchedModelId) || passcodeTarget
            : passcodeTarget;

          if (target) {
            if (target.defaultEffort && onSelectReasoningEffort) {
              onSelectReasoningEffort(target.defaultEffort);
            }
            if (onSelectModel && effectiveModelId) {
              onSelectModel(effectiveModelId);
            }
          }
          setPasscodeTarget(null);

          // Auto-send pending message seamlessly when unlocking the active model
          const trimmed = text.trim();
          if (
            (trimmed || images.length > 0 || documents.length > 0) &&
            (!effectiveModelId || effectiveModelId === selectedModel.id)
          ) {
            onSendMessage(
              trimmed,
              images.length > 0 ? images : undefined,
              documents.length > 0 ? documents : undefined
            );
            resetComposer();
          }
        }}
        targetModel={passcodeTarget}
        targetModelName={passcodeTarget?.name}
        reasoningEffort={reasoningEffort}
      />

      {/* Interactive Folder Files Inspector Modal */}
      <FolderInspectorModal
        isOpen={Boolean(inspectingFolderId && folderDrafts[inspectingFolderId])}
        onClose={() => setInspectingFolderId(null)}
        draft={inspectingFolderId ? folderDrafts[inspectingFolderId] : null}
        onToggleFile={(path) => {
          if (inspectingFolderId) handleToggleFolderFile(inspectingFolderId, path);
        }}
        onSetAllFiles={(included) => {
          if (inspectingFolderId) handleSetAllFolderFiles(inspectingFolderId, included);
        }}
        onRemoveFolder={() => {
          if (inspectingFolderId) handleRemoveFolderById(inspectingFolderId);
        }}
      />
    </div>
  );
};
