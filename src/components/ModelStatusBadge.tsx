import React, { useState, useRef, useEffect } from "react";
import { AVAILABLE_MODELS, ModelOption, isModelUnlocked } from "../config";
import { ThemeConfig } from "../themes";
import { ChevronDown, Check, Sparkles, Lock, Unlock } from "lucide-react";
import { PasscodeModal } from "./PasscodeModal";
import { ModelNameLabel } from "./ModelNameLabel";

interface ModelStatusBadgeProps {
  currentModelId?: string;
  onSelectModel: (modelId: string) => void;
  isStreaming?: boolean;
  theme?: ThemeConfig;
}

export const ModelStatusBadge: React.FC<ModelStatusBadgeProps> = ({
  currentModelId = "gpt-6-astra-low",
  onSelectModel,
  isStreaming = false,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setIsUnlocked] = useState<boolean>(
    () => typeof window !== "undefined" && localStorage.getItem("astra_frontier_unlocked") === "true"
  );
  const [passcodeTarget, setPasscodeTarget] = useState<ModelOption | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedModel =
    AVAILABLE_MODELS.find((m) => m.id === currentModelId) || AVAILABLE_MODELS[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSelectModel = (model: ModelOption) => {
    if (model.id === currentModelId) {
      setIsOpen(false);
      return;
    }
    if (model.requiresPasscode && !isModelUnlocked(model.id, model.defaultEffort)) {
      setPasscodeTarget(model);
      setIsOpen(false);
      return;
    }
    onSelectModel(model.id);
    setIsOpen(false);
  };

  const handlePasscodeSuccess = (_code?: string, switchedModelId?: string) => {
    setIsUnlocked(true);
    const targetId = switchedModelId || passcodeTarget?.id;
    if (targetId) {
      onSelectModel(targetId);
      setPasscodeTarget(null);
    }
  };

  const isClaude = selectedModel.id.includes("claude");
  const isDeepSeek = selectedModel.id.includes("deepseek");

  const btnBase = theme ? theme.header.badge : "text-xs font-semibold text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 shadow-sm";

  return (
    <>
      {/* Mobile backdrop to easily close on tap */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div ref={containerRef} className="relative inline-flex items-center">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className={`group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 transition-all duration-200 cursor-pointer shadow-sm active:scale-98 shrink-0 ${btnBase}`}
          aria-label="Select AI Model"
        >
          {/* Pulsing online status indicator */}
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isStreaming
                  ? "bg-cyan-500 animate-ping"
                  : isClaude
                  ? "bg-rose-500 animate-ping duration-1000"
                  : isDeepSeek
                  ? "bg-sky-500 animate-ping duration-1000"
                  : "bg-emerald-500 animate-ping duration-1000"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isStreaming
                  ? "bg-cyan-600"
                  : isClaude
                  ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                  : isDeepSeek
                  ? "bg-sky-600 shadow-[0_0_8px_rgba(2,132,199,0.6)]"
                  : "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"
              }`}
            />
          </span>

          {/* Current Model Name */}
          <span className="text-[11px] sm:text-xs font-bold tracking-wide truncate max-w-[95px] xs:max-w-[140px] sm:max-w-none">
            <ModelNameLabel name={selectedModel.name} shortOnMobile={true} />
          </span>

          {/* Tag Pill */}
          <span
            className={`hidden sm:inline-flex items-center text-[10px] tracking-tight font-semibold px-2 py-0.5 rounded-full border ${
              isClaude
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : isDeepSeek
                ? "bg-sky-50 text-sky-800 border-sky-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            {selectedModel.tag}
          </span>

          <ChevronDown
            className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu Window: Bulletproof responsive positioning & crisp solid card */}
        {isOpen && (
          <div
            className="fixed inset-x-3 top-16 sm:absolute sm:inset-x-auto sm:top-full sm:mt-2 sm:left-0 z-50 w-auto sm:w-[380px] max-h-[min(540px,calc(100vh-84px))] flex flex-col p-3 rounded-2xl bg-white border border-stone-200 shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 text-stone-900"
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-xs shrink-0">
              <span className="font-bold tracking-wider uppercase text-[10px] text-stone-500 font-mono">
                Select Frontier Model
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Active
              </span>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 overscroll-contain">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = model.id === selectedModel.id;
                const isModelClaude = model.id.includes("claude");
                const isModelDeepSeek = model.id.includes("deepseek");
                const isLocked = Boolean(
                  model.requiresPasscode && !isModelUnlocked(model.id, model.defaultEffort)
                );

                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => handleSelectModel(model)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all duration-150 border flex items-start justify-between gap-2.5 cursor-pointer ${
                      isSelected
                        ? "bg-stone-100 border-stone-300 text-stone-950 font-medium shadow-sm"
                        : "bg-white hover:bg-stone-50 border-stone-200 hover:border-stone-300 text-stone-800"
                    }`}
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-stone-900 truncate">
                            <ModelNameLabel name={model.name} />
                          </span>
                          {isLocked ? (
                            <Lock className="w-3 h-3 text-stone-400 shrink-0" />
                          ) : (
                            <Unlock className="w-3 h-3 text-emerald-600 shrink-0 opacity-80" />
                          )}
                        </div>
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 shrink-0 ${
                            isModelClaude ? "text-rose-600" : isModelDeepSeek ? "text-sky-600" : "text-emerald-600"
                          }`} />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                            isModelClaude
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : isModelDeepSeek
                              ? "bg-sky-50 text-sky-800 border-sky-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {model.tag}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                          <Sparkles className="w-3 h-3 text-stone-400" />
                          <span>{model.contextWindow}</span>
                        </div>
                      </div>

                      <p className="text-[11px] leading-snug text-stone-600 line-clamp-1">
                        {model.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Passcode Unlock Modal */}
      <PasscodeModal
        isOpen={Boolean(passcodeTarget)}
        onClose={() => setPasscodeTarget(null)}
        onSuccess={handlePasscodeSuccess}
        targetModel={passcodeTarget}
        targetModelName={passcodeTarget?.name}
      />
    </>
  );
};
