import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, Square, Sparkles, ChevronUp, Check } from "lucide-react";
import { AVAILABLE_MODELS } from "../config";
import { ThemeConfig } from "../themes";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  currentModelId?: string;
  onSelectModel?: (modelId: string) => void;
  theme?: ThemeConfig;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled = false,
  currentModelId = "gpt-6-astra",
  onSelectModel,
  theme,
}) => {
  const [text, setText] = useState("");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === currentModelId) || AVAILABLE_MODELS[0];
  const isDark = theme?.id === "cyber" || theme?.id === "hud";

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

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isStreaming) {
      onStopStreaming();
      return;
    }
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
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
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-300 ${wrapperClass}`}>
          {/* Tactical HUD Corner Reticles (if HUD mode) */}
          {theme?.id === "hud" && (
            <>
              <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-cyan-400 pointer-events-none" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-cyan-400 pointer-events-none" />
              <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-cyan-400 pointer-events-none" />
              <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-cyan-400 pointer-events-none" />
            </>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedModel.name}...`}
            rows={1}
            disabled={disabled}
            className={`w-full resize-none bg-transparent pt-4 pb-12 pl-4 pr-14 leading-relaxed focus:outline-none min-h-[58px] max-h-[220px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${textareaClass}`}
          />

          {/* Action Row */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Interactive Model Selector Pill */}
            <div ref={modelMenuRef} className="relative pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className={`group flex items-center gap-1.5 transition-all duration-150 cursor-pointer active:scale-95 ${modelPillClass}`}
                title="Click to switch frontier model"
              >
                <Sparkles className="w-3.5 h-3.5 opacity-80" />
                <span>{selectedModel.name}</span>
                <ChevronUp
                  className={`w-3.5 h-3.5 opacity-60 transition-transform duration-150 ${
                    isModelMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <span className={`hidden sm:inline ${hintClass}`}>
                Shift + Enter for newline
              </span>

              {/* Popover Menu inside Input Bar */}
              {isModelMenuOpen && onSelectModel && (
                <div
                  className={`absolute bottom-full mb-2 left-0 z-50 w-72 p-2.5 rounded-2xl shadow-2xl backdrop-blur-2xl border animate-in fade-in zoom-in-95 duration-150 ${
                    isDark
                      ? "bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/80"
                      : "bg-white/95 border-white/95 text-slate-900 shadow-slate-950/20"
                  }`}
                >
                  <div
                    className={`px-2 py-1 mb-1 border-b text-xs font-bold uppercase tracking-wider ${
                      isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
                    }`}
                  >
                    Switch Model
                  </div>
                  <div className="space-y-1">
                    {AVAILABLE_MODELS.map((model) => {
                      const isItemActive = model.id === selectedModel.id;
                      const isItemClaude = model.id.includes("claude");

                      return (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => {
                            onSelectModel(model.id);
                            setIsModelMenuOpen(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 border flex items-center justify-between gap-2 ${
                            isItemActive
                              ? isDark
                                ? isItemClaude
                                  ? "bg-amber-950/60 border-amber-500/80"
                                  : "bg-cyan-950/60 border-cyan-500/80"
                                : isItemClaude
                                ? "bg-amber-50 border-amber-300"
                                : "bg-cyan-50 border-cyan-300"
                              : isDark
                              ? "bg-transparent hover:bg-slate-900 border-transparent text-slate-300"
                              : "bg-transparent hover:bg-slate-100/70 border-transparent text-slate-700"
                          }`}
                        >
                          <div className="space-y-0.5">
                            <div className="text-xs font-semibold">{model.name}</div>
                            <div className="text-[11px] opacity-75">{model.tag}</div>
                          </div>
                          {isItemActive && (
                            <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Send / Stop Generation Button */}
            <div className="pointer-events-auto flex items-center gap-1.5">
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
                  disabled={!text.trim() || disabled}
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
    </div>
  );
};
