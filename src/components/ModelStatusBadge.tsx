import React, { useState, useRef, useEffect } from "react";
import { AVAILABLE_MODELS } from "../config";
import { ThemeConfig } from "../themes";
import { ChevronDown, Check, Sparkles, Cpu } from "lucide-react";

interface ModelStatusBadgeProps {
  currentModelId?: string;
  onSelectModel: (modelId: string) => void;
  isStreaming?: boolean;
  theme?: ThemeConfig;
}

export const ModelStatusBadge: React.FC<ModelStatusBadgeProps> = ({
  currentModelId = "gpt-6-astra",
  onSelectModel,
  isStreaming = false,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const isClaude = selectedModel.id.includes("claude");

  // Dynamic theme classes
  const isDark = theme?.id === "cyber" || theme?.id === "hud";
  const btnBase = theme ? theme.header.badge : "text-xs font-semibold text-slate-800 bg-white/80 hover:bg-white border border-white/90";

  return (
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
                : "bg-emerald-500 animate-ping duration-1000"
            }`}
          />
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isStreaming
                ? "bg-cyan-600"
                : isClaude
                ? "bg-amber-500 shadow-[0_0_8px_#f59e0b]"
                : "bg-emerald-500 shadow-[0_0_8px_#10b981]"
            }`}
          />
        </span>

        {/* Current Model Name */}
        <span className="text-xs font-bold tracking-wide">
          {selectedModel.name}
        </span>

        {/* Tag Pill */}
        <span
          className={`hidden sm:inline-flex items-center text-xs tracking-tight font-semibold px-2 py-0.5 rounded-full border ${
            isClaude
              ? isDark
                ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                : "bg-amber-100/90 text-amber-900 border-amber-300"
              : isDark
              ? "bg-cyan-950/80 text-cyan-300 border-cyan-700/60"
              : "bg-cyan-100/90 text-cyan-900 border-cyan-300"
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

      {/* Model Selection Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-50 w-72 sm:w-80 p-3 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-150 backdrop-blur-2xl border ${
            isDark
              ? "bg-slate-950/95 border-slate-800 text-slate-100 shadow-black/80"
              : "bg-white/95 border-white/95 text-slate-900 shadow-slate-950/20"
          }`}
        >
          <div
            className={`px-2 py-1.5 mb-2 border-b flex items-center justify-between ${
              isDark ? "border-slate-800" : "border-slate-100"
            }`}
          >
            <span
              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              <span>Frontier Models</span>
            </span>
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isDark
                  ? "text-emerald-400 bg-emerald-950/80 border-emerald-800/80"
                  : "text-emerald-800 bg-emerald-50 border-emerald-200"
              }`}
            >
              Active
            </span>
          </div>

          <div className="space-y-1.5">
            {AVAILABLE_MODELS.map((model) => {
              const isSelected = model.id === selectedModel.id;
              const isModelClaude = model.id.includes("claude");

              return (
                <button
                  key={model.id}
                  onClick={() => {
                    onSelectModel(model.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-150 border flex items-start justify-between gap-3 ${
                    isSelected
                      ? isDark
                        ? isModelClaude
                          ? "bg-amber-950/60 border-amber-500/80 shadow-xs"
                          : "bg-cyan-950/60 border-cyan-500/80 shadow-xs"
                        : isModelClaude
                        ? "bg-amber-50/90 border-amber-400/80 shadow-xs"
                        : "bg-cyan-50/90 border-cyan-400/80 shadow-xs"
                      : isDark
                      ? "bg-slate-900/40 hover:bg-slate-900/80 border-transparent hover:border-slate-850"
                      : "bg-white/60 hover:bg-white border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">
                        {model.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      )}
                    </div>

                    {/* Most Powerful Model Tag Badge */}
                    <div>
                      <span
                        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          isModelClaude
                            ? isDark
                              ? "bg-amber-950/80 text-amber-300 border-amber-700/60"
                              : "bg-amber-100 text-amber-950 border-amber-300"
                            : isDark
                            ? "bg-cyan-950/80 text-cyan-300 border-cyan-700/60"
                            : "bg-cyan-100 text-cyan-950 border-cyan-300"
                        }`}
                      >
                        {model.tag}
                      </span>
                    </div>

                    <p
                      className={`text-xs leading-relaxed ${
                        isDark ? "text-slate-400" : "text-slate-600"
                      }`}
                    >
                      {model.description}
                    </p>

                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono pt-0.5 ${
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

          <div
            className={`mt-2.5 pt-2 border-t px-2 text-xs leading-relaxed ${
              isDark ? "border-slate-800 text-slate-500" : "border-slate-100 text-slate-500"
            }`}
          >
            Authenticated securely by your Netlify serverless proxy.
          </div>
        </div>
      )}
    </div>
  );
};
