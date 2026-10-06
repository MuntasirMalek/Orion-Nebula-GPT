import React, { useState, useRef, useEffect } from "react";
import { AVAILABLE_MODELS } from "../config";
import { ArrowUp, Square, Sparkles, ChevronUp, Check } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onStopStreaming: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  currentModelId?: string;
  onSelectModel?: (modelId: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onStopStreaming,
  isStreaming,
  disabled = false,
  currentModelId = "gpt-6-astra",
  onSelectModel,
}) => {
  const [text, setText] = useState("");
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === currentModelId) || AVAILABLE_MODELS[0];

  const isClaude = selectedModel.id.includes("claude");

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

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-6 pt-2 pb-safe">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/95 focus-within:border-cyan-500/80 shadow-2xl shadow-slate-900/10 transition-all duration-300 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.2)]">
          {/* Subtle top ambient accent line */}
          <div
            className={`absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent ${
              isClaude ? "via-amber-500/40" : "via-cyan-500/40"
            } to-transparent`}
          />

          {/* Textarea - Clean, No Scrollbar Slider */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedModel.name}...`}
            rows={1}
            disabled={disabled}
            className="w-full resize-none bg-transparent pt-4 pb-12 pl-4 pr-14 text-[15px] leading-relaxed text-slate-900 placeholder-slate-400 focus:outline-none min-h-[58px] max-h-[220px] font-medium overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          />

          {/* Action Row */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
            {/* Interactive Model Selector Pill */}
            <div ref={modelMenuRef} className="relative pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
                className={`group flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all duration-150 cursor-pointer shadow-xs active:scale-95 ${
                  isClaude
                    ? "bg-amber-100 hover:bg-amber-200/80 text-amber-950 border-amber-300"
                    : "bg-cyan-100 hover:bg-cyan-200/80 text-cyan-950 border-cyan-300"
                }`}
                title="Click to switch frontier model"
              >
                <Sparkles
                  className={`w-3 h-3 ${isClaude ? "text-amber-600" : "text-cyan-700"}`}
                />
                <span>{selectedModel.name}</span>
                <ChevronUp
                  className={`w-3 h-3 text-slate-500 transition-transform duration-150 ${
                    isModelMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <span className="hidden sm:inline text-[10px] text-slate-500 font-medium">
                Shift + Enter for newline
              </span>

              {/* Popover Menu inside Input Bar */}
              {isModelMenuOpen && onSelectModel && (
                <div className="absolute bottom-full mb-2 left-0 z-50 w-72 p-2 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/95 shadow-2xl shadow-slate-950/20 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1 mb-1 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Switch Active Model
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
                          className={`w-full text-left p-2.5 rounded-xl transition-all border flex items-start justify-between gap-2 ${
                            isItemActive
                              ? isItemClaude
                                ? "bg-amber-50 border-amber-300"
                                : "bg-cyan-50 border-cyan-300"
                              : "bg-white/60 hover:bg-white border-transparent hover:border-slate-200"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="text-xs font-bold text-slate-900 truncate">
                                {model.name}
                              </span>
                              {isItemActive && (
                                <Check className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                              )}
                            </div>
                            <span
                              className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                                isItemClaude
                                  ? "bg-amber-100 text-amber-950 border-amber-300"
                                  : "bg-cyan-100 text-cyan-950 border-cyan-300"
                              }`}
                            >
                              {model.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Send / Stop button */}
            <div className="pointer-events-auto">
              {isStreaming ? (
                <button
                  type="button"
                  onClick={onStopStreaming}
                  className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 transition-all duration-150 active:scale-95 shadow-sm"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!text.trim() || disabled}
                  className={`flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 active:scale-95 ${
                    text.trim() && !disabled
                      ? isClaude
                        ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/30 cursor-pointer hover:opacity-95"
                        : "bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30 cursor-pointer hover:opacity-95"
                      : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                  }`}
                  title="Send prompt"
                >
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
