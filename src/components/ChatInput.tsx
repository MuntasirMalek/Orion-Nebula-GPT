import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Sparkles, ChevronUp, Check, Paperclip, X, Lock, FileText, FileCode, Loader2 } from "lucide-react";
import { AVAILABLE_MODELS, ModelOption, isModelUnlocked } from "../config";
import { ThemeConfig } from "../themes";
import { AttachedDocument } from "../types";
import { processFile, isImageFile, isPdfFile, isTextFile, formatBytes } from "../utils/fileAttachment";
import { PasscodeModal } from "./PasscodeModal";
import { ModelNameLabel } from "./ModelNameLabel";

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
  currentModelId = "gpt-6-astra-low",
  onSelectModel,
  reasoningEffort = "medium",
  onSelectReasoningEffort,
  sendKeyMode = "enter",
  theme,
}) => {
  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [documents, setDocuments] = useState<AttachedDocument[]>([]);
  const [isParsingFiles, setIsParsingFiles] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [, setIsUnlocked] = useState<boolean>(
    () => typeof window !== "undefined" && localStorage.getItem("astra_frontier_unlocked") === "true"
  );
  const [passcodeTarget, setPasscodeTarget] = useState<ModelOption | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === currentModelId) || AVAILABLE_MODELS[0];
  const isDark = false;

  // Auto-resize textarea based on input content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        220
      )}px`;
    }
  }, [text]);

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

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const removeDocument = (indexToRemove: number) => {
    setDocuments((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    if (fileList.length === 0) return;

    setIsParsingFiles(true);
    try {
      for (const file of fileList) {
        if (isImageFile(file)) {
          const res = await processFile(file);
          if (res.dataUrl) {
            setImages((prev) => [...prev, res.dataUrl!]);
          }
        } else if (isPdfFile(file) || isTextFile(file) || file.size < 10 * 1024 * 1024) {
          const res = await processFile(file);
          if (res.extractedText) {
            const docItem: AttachedDocument = {
              id: res.id,
              name: res.name,
              type: res.type as "pdf" | "text" | "code",
              size: res.size,
              pageCount: res.pageCount,
              extractedText: res.extractedText,
            };
            setDocuments((prev) => [...prev, docItem]);

            // If scanned PDF produced vision fallback images, attach them to images
            if (res.fallbackImages && res.fallbackImages.length > 0) {
              setImages((prev) => [...prev, ...res.fallbackImages!]);
            }
          } else if (res.fallbackImages && res.fallbackImages.length > 0) {
            // Scanned PDF with fallback images for vision
            const docItem: AttachedDocument = {
              id: res.id,
              name: res.name,
              type: "pdf",
              size: res.size,
              pageCount: res.pageCount,
              extractedText: "[Scanned PDF pages attached as visual document]",
            };
            setDocuments((prev) => [...prev, docItem]);
            setImages((prev) => [...prev, ...res.fallbackImages!]);
          }
        }
      }
    } catch (err) {
      console.error("Error processing files:", err);
    } finally {
      setIsParsingFiles(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files) {
      handleFiles(e.dataTransfer.files);
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
    setText("");
    setImages([]);
    setDocuments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
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
    <div className={`shrink-0 w-full mx-auto px-2.5 sm:px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:pb-6 pt-1 sm:pt-2 ${theme ? theme.input.container : "max-w-4xl"}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf,.pdf,.txt,.md,.markdown,.json,.csv,.js,.jsx,.ts,.tsx,.py,.html,.css,.yaml,.yml,.xml,.sql,.sh,.log,.env"
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
          {/* File & Image Preview Chips (Shown above textarea if files or pictures are attached) */}
          {(images.length > 0 || documents.length > 0 || isParsingFiles) && (
            <div className="flex items-center gap-2 p-3 pb-0 overflow-x-auto [scrollbar-width:none]">
              {/* Document Chips */}
              {documents.map((doc, idx) => (
                <div
                  key={doc.id || idx}
                  className="relative group shrink-0 inline-flex items-center gap-2.5 pl-2.5 pr-8 py-2 rounded-xl bg-slate-50/90 border border-slate-200/90 shadow-xs text-xs text-slate-800"
                >
                  <div className={`p-1.5 rounded-lg flex items-center justify-center ${doc.type === "pdf" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-cyan-50 text-cyan-700 border border-cyan-100"}`}>
                    {doc.type === "pdf" ? (
                      <FileText className="w-4 h-4 text-rose-500" />
                    ) : (
                      <FileCode className="w-4 h-4 text-cyan-600" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="font-semibold truncate max-w-[130px] sm:max-w-[180px] text-slate-800" title={doc.name}>
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {doc.type.toUpperCase()}{doc.pageCount ? ` · ${doc.pageCount} ${doc.pageCount === 1 ? 'page' : 'pages'}` : ""}{doc.size ? ` · ${formatBytes(doc.size)}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(idx)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Parsing Indicator */}
              {isParsingFiles && (
                <div className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-50/80 border border-cyan-200/80 text-xs text-cyan-800 font-medium animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                  <span>Reading document...</span>
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
                className="shrink-0 w-16 h-16 rounded-xl border border-dashed border-slate-300 hover:border-cyan-500 hover:bg-cyan-50/50 flex flex-col items-center justify-center text-slate-400 hover:text-cyan-700 transition-colors gap-1"
                title="Add more files or pictures"
              >
                <Paperclip className="w-4 h-4" />
                <span className="text-[10px] font-medium">+Add</span>
              </button>
            </div>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder={`Message ${selectedModel.name} (paste, attach PDF, file or picture)...`}
            rows={1}
            disabled={disabled}
            className={`w-full resize-none bg-transparent pt-3.5 pb-12 pl-3.5 pr-14 leading-relaxed focus:outline-none min-h-[54px] max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${textareaClass}`}
          />

          {/* Action Row */}
          <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {/* Interactive Model & Thinking Level Selector Pills */}
            <div className="relative pointer-events-auto flex items-center gap-1.5 sm:gap-2 min-w-0">
              {/* Model Selector Pill */}
              <div ref={modelMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsModelMenuOpen(!isModelMenuOpen);
                  }}
                  className={`group flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 max-w-[155px] xs:max-w-[210px] sm:max-w-none ${modelPillClass}`}
                  title="Click to switch frontier model"
                >
                  <Sparkles className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  <ModelNameLabel name={selectedModel.name} shortOnMobile={true} />
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
                        const isItemClaude = model.id.includes("claude");
                        const isItemDeepSeek = model.id.includes("deepseek");
                        const isLocked = Boolean(
                          model.requiresPasscode && !isModelUnlocked(model.id, model.defaultEffort || reasoningEffort)
                        );

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
                                  ? isItemClaude
                                    ? "bg-rose-950/60 border-rose-500/80"
                                    : isItemDeepSeek
                                    ? "bg-sky-950/60 border-sky-500/80"
                                    : "bg-emerald-950/60 border-emerald-500/80"
                                  : isItemClaude
                                  ? "bg-rose-50 border-rose-300"
                                  : isItemDeepSeek
                                  ? "bg-sky-50 border-sky-300"
                                  : "bg-emerald-50 border-emerald-300"
                                : isDark
                                ? "bg-transparent hover:bg-stone-900 border-transparent text-stone-300"
                                : "bg-transparent hover:bg-stone-100/70 border-transparent text-stone-700"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold">
                                <ModelNameLabel name={model.name} />
                                {isLocked && (
                                  <Lock className="w-3 h-3 text-stone-400" />
                                )}
                              </div>
                              <div className="pt-0.5">
                                <span
                                  className={`inline-block text-[10px] tracking-tight font-semibold px-2 py-0.5 rounded-full border ${
                                    isItemClaude
                                      ? "bg-rose-50 text-rose-800 border-rose-200"
                                      : isItemDeepSeek
                                      ? "bg-sky-50 text-sky-800 border-sky-200"
                                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  }`}
                                >
                                  {model.tag}
                                </span>
                              </div>
                            </div>
                            {isItemActive && (
                              <Check className={`w-3.5 h-3.5 shrink-0 ${
                                isItemClaude ? "text-rose-600" : isItemDeepSeek ? "text-sky-600" : "text-emerald-600"
                              }`} />
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

            {/* Controls: Attach File/Picture & Send / Stop Generation Button */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-500 hover:text-cyan-700 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer"
                title="Attach file (PDF, documents, code) or picture (Vision)"
              >
                <Paperclip className="w-4 h-4" />
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
          setIsUnlocked(true);
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

          // Auto-send pending message seamlessly upon unlock
          const trimmed = text.trim();
          if (trimmed || images.length > 0 || documents.length > 0) {
            onSendMessage(
              trimmed,
              images.length > 0 ? images : undefined,
              documents.length > 0 ? documents : undefined
            );
            setText("");
            setImages([]);
            setDocuments([]);
            if (textareaRef.current) {
              textareaRef.current.style.height = "auto";
            }
          }
        }}
        targetModel={passcodeTarget}
        targetModelName={passcodeTarget?.name}
        reasoningEffort={reasoningEffort}
      />
    </div>
  );
};
