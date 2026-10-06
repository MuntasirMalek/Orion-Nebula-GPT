import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Sparkles, ChevronUp, Check, Image as ImageIcon, Paperclip, X, Lock } from "lucide-react";
import { AVAILABLE_MODELS, ModelOption, isModelUnlocked } from "../config";
import { ThemeConfig } from "../themes";
import { PasscodeModal } from "./PasscodeModal";
import { ModelNameLabel } from "./ModelNameLabel";

interface ChatInputProps {
  onSendMessage: (content: string, images?: string[]) => void;
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

  // Process image file to base64 with canvas downscaling for token & bandwidth optimization
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (!result) return reject(new Error("Failed to read image file"));

        // If file is > 1MB, downscale using canvas to preserve token quota and speed up upload
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
  };

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((file) => file.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    try {
      const base64List = await Promise.all(validFiles.map(processImageFile));
      setImages((prev) => [...prev, ...base64List]);
    } catch {
      // Ignore read errors
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  // Clipboard Paste Support (Cmd+V of screenshots or copied images)
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) imageFiles.push(file);
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      handleFiles(imageFiles);
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

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isStreaming) {
      onStopStreaming();
      return;
    }
    const trimmed = text.trim();
    if ((!trimmed && images.length === 0) || disabled) return;

    // Check if model is locked before sending
    const isLocked = Boolean(
      selectedModel.requiresPasscode &&
      !isModelUnlocked(selectedModel.id, selectedModel.defaultEffort || reasoningEffort)
    );
    if (isLocked) {
      setPasscodeTarget(selectedModel);
      return;
    }

    onSendMessage(trimmed, images.length > 0 ? images : undefined);
    setText("");
    setImages([]);
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
    <div className={`w-full mx-auto px-4 pb-4 md:pb-6 pt-2 ${theme ? theme.input.container : "max-w-4xl"}`}>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
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
          {/* Image Preview Chips (Shown above textarea if pictures are attached) */}
          {images.length > 0 && (
            <div className="flex items-center gap-2 p-3 pb-0 overflow-x-auto [scrollbar-width:none]">
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
                title="Add more images"
              >
                <ImageIcon className="w-4 h-4" />
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
            placeholder={`Message ${selectedModel.name} (paste or attach pictures)...`}
            rows={1}
            disabled={disabled}
            className={`w-full resize-none bg-transparent pt-4 pb-12 pl-4 pr-14 leading-relaxed focus:outline-none min-h-[58px] max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${textareaClass}`}
          />

          {/* Action Row */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Interactive Model & Thinking Level Selector Pills */}
            <div className="relative pointer-events-auto flex items-center gap-1.5 sm:gap-2">
              {/* Model Selector Pill */}
              <div ref={modelMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsModelMenuOpen(!isModelMenuOpen);
                  }}
                  className={`group flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 ${modelPillClass}`}
                  title="Click to switch frontier model"
                >
                  <Sparkles className="w-3.5 h-3.5 opacity-80 shrink-0" />
                  <ModelNameLabel name={selectedModel.name} iconClassName="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 inline -mt-0.5" />
                  <ChevronUp
                    className={`w-3.5 h-3.5 opacity-60 transition-transform duration-150 ${
                      isModelMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Popover Menu inside Input Bar */}
                {isModelMenuOpen && onSelectModel && (
                  <div
                    className={`absolute bottom-full mb-2 left-0 z-50 w-72 max-h-[min(75vh,520px)] flex flex-col p-2.5 rounded-2xl shadow-2xl backdrop-blur-2xl border animate-in fade-in zoom-in-95 duration-150 ${
                      isDark
                        ? "bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/80"
                        : "bg-white/95 border-white/95 text-slate-900 shadow-slate-950/20"
                    }`}
                  >
                    <div
                      className={`px-2 py-1 mb-1 border-b text-xs font-bold uppercase tracking-wider shrink-0 ${
                        isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
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
                                    ? "bg-amber-950/60 border-amber-500/80"
                                    : isItemDeepSeek
                                    ? "bg-blue-950/60 border-blue-500/80"
                                    : "bg-emerald-950/60 border-emerald-500/80"
                                  : isItemClaude
                                  ? "bg-amber-50 border-amber-300"
                                  : isItemDeepSeek
                                  ? "bg-blue-50 border-blue-300"
                                  : "bg-emerald-50 border-emerald-300"
                                : isDark
                                ? "bg-transparent hover:bg-slate-900 border-transparent text-slate-300"
                                : "bg-transparent hover:bg-slate-100/70 border-transparent text-slate-700"
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs font-semibold">
                                <ModelNameLabel name={model.name} />
                                {isLocked && (
                                  <Lock className="w-3 h-3 text-amber-500" />
                                )}
                              </div>
                              <div className="pt-0.5">
                                <span
                                  className={`inline-block text-[10px] tracking-tight font-semibold px-2 py-0.5 rounded-full border ${
                                    isItemClaude
                                      ? "bg-amber-100/90 text-amber-900 border-amber-300"
                                      : isItemDeepSeek
                                      ? "bg-blue-100/90 text-blue-900 border-blue-300"
                                      : "bg-emerald-100/90 text-emerald-950 border-emerald-300"
                                  }`}
                                >
                                  {model.tag}
                                </span>
                              </div>
                            </div>
                            {isItemActive && (
                              <Check className={`w-3.5 h-3.5 shrink-0 ${
                                isItemClaude ? "text-amber-600" : isItemDeepSeek ? "text-blue-600" : "text-emerald-600"
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

            {/* Controls: Attach Picture & Send / Stop Generation Button */}
            <div className="pointer-events-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-slate-500 hover:text-cyan-700 hover:bg-slate-100/80 active:scale-95 transition-all cursor-pointer"
                title="Attach picture (Vision)"
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
                  disabled={(!text.trim() && images.length === 0) || disabled}
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
          if (trimmed || images.length > 0) {
            onSendMessage(trimmed, images.length > 0 ? images : undefined);
            setText("");
            setImages([]);
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
