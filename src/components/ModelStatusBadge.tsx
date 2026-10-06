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
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectModel = (model: ModelOption) => {
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

  const isDark = false;
  const btnBase = theme ? theme.header.badge : "text-xs font-semibold text-slate-800 bg-white/80 hover:bg-white border border-white/90";

  return (
    <>
      <div ref={containerRef} className="relative inline-flex items-center">
        {/* Trigger Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2 px-3 py-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-98 ${btnBase}`}
          aria-label="Select AI Model"
        >
          {/* Pulsing online status indicator */}
          <span className="relative flex h-2 w-2">
            <span
              className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isStreaming
                  ? "bg-cyan-500 animate-ping"
                  : isClaude
                  ? "bg-amber-500 animate-ping duration-1000"
                  : isDeepSeek
                  ? "bg-blue-500 animate-ping duration-1000"
                  : "bg-emerald-500 animate-ping duration-1000"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isStreaming
                  ? "bg-cyan-600"
                  : isClaude
                  ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
                  : isDeepSeek
                  ? "bg-blue-600 shadow-[0_0_8px_#2563eb]"
                  : "bg-emerald-500 shadow-[0_0_8px_#10b981]"
              }`}
            />
          </span>

          {/* Current Model Name */}
          <span className="text-xs font-bold tracking-wide">
            <ModelNameLabel name={selectedModel.name} iconClassName="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0 inline -mt-0.5" />
          </span>

          {/* Tag Pill */}
          <span
            className={`hidden sm:inline-flex items-center text-xs tracking-tight font-semibold px-2 py-0.5 rounded-full border ${
              isClaude
                ? "bg-amber-100/90 text-amber-900 border-amber-300"
                : isDeepSeek
                ? "bg-blue-100/90 text-blue-900 border-blue-300"
                : "bg-emerald-100/90 text-emerald-950 border-emerald-300"
            }`}
          >
            {selectedModel.tag}
          </span>

          <ChevronDown
            className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className={`absolute top-full mt-2 left-0 z-50 w-80 p-3 rounded-2xl shadow-2xl backdrop-blur-2xl border transition-all duration-200 animate-in fade-in zoom-in-95 ${
              isDark
                ? "bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/80"
                : "bg-white/95 border-white/95 text-slate-900 shadow-slate-950/20"
            }`}
          >
            <div
              className={`flex items-center justify-between pb-2 mb-2 border-b text-xs ${
                isDark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"
              }`}
            >
              <span className="font-bold tracking-wider uppercase text-[10px]">
                Available Models
              </span>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                Active
              </span>
            </div>

            <div className="space-y-1.5">
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
                    className={`w-full text-left p-3 rounded-xl transition-all duration-150 border flex items-start justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? isModelClaude
                          ? "bg-amber-50/90 border-amber-400/80 shadow-xs"
                          : isModelDeepSeek
                          ? "bg-blue-50/90 border-blue-400/80 shadow-xs"
                          : "bg-emerald-50/90 border-emerald-400/80 shadow-xs"
                        : "bg-white/60 hover:bg-white border-transparent hover:border-slate-200"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold">
                            <ModelNameLabel name={model.name} />
                          </span>
                          {isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5 text-emerald-600 shrink-0 opacity-80" />
                          )}
                        </div>
                        {isSelected && (
                          <Check className={`w-3.5 h-3.5 shrink-0 ${
                            isModelClaude ? "text-amber-600" : isModelDeepSeek ? "text-blue-600" : "text-emerald-600"
                          }`} />
                        )}
                      </div>

                      {/* Model Tag Badge */}
                      <div>
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                            isModelClaude
                              ? "bg-amber-100 text-amber-950 border-amber-300"
                              : isModelDeepSeek
                              ? "bg-blue-100 text-blue-950 border-blue-300"
                              : "bg-emerald-100 text-emerald-950 border-emerald-300"
                          }`}
                        >
                          {model.tag}
                        </span>
                      </div>

                      <p
                        className={`text-[11px] leading-relaxed ${
                          isDark ? "text-slate-400" : "text-slate-600"
                        }`}
                      >
                        {model.description}
                      </p>

                      <div
                        className={`flex items-center gap-1.5 text-[11px] font-mono pt-0.5 ${
                          isDark ? "text-slate-500" : "text-slate-500"
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-cyan-500" />
                        <span>{model.contextWindow}</span>
                      </div>
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
