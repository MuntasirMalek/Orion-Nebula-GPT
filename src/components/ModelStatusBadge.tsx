import React, { useState, useRef, useEffect } from "react";
import { AVAILABLE_MODELS } from "../config";
import { ChevronDown, Check, Sparkles, Cpu } from "lucide-react";

interface ModelStatusBadgeProps {
  currentModelId?: string;
  onSelectModel: (modelId: string) => void;
  isStreaming?: boolean;
}

export const ModelStatusBadge: React.FC<ModelStatusBadgeProps> = ({
  currentModelId = "gpt-6-astra",
  onSelectModel,
  isStreaming = false,
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

  return (
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-white/90 hover:border-cyan-400 transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
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
        <span className="text-xs font-bold tracking-wide text-slate-900">
          {selectedModel.name}
        </span>

        {/* Tag Pill */}
        <span
          className={`hidden sm:inline-flex items-center text-[10px] tracking-tight font-bold px-2 py-0.5 rounded-full border ${
            isClaude
              ? "bg-amber-100 text-amber-900 border-amber-300"
              : "bg-cyan-100 text-cyan-900 border-cyan-300"
          }`}
        >
          {selectedModel.tag}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Model Selection Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-50 w-72 sm:w-80 p-2.5 rounded-2xl bg-white/95 backdrop-blur-2xl border border-white/95 shadow-2xl shadow-slate-950/20 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2 py-1.5 mb-1.5 border-b border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-700" />
              <span>Frontier Intelligence Models</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
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
                      ? isModelClaude
                        ? "bg-amber-50/90 border-amber-400/80 shadow-xs"
                        : "bg-cyan-50/90 border-cyan-400/80 shadow-xs"
                      : "bg-white/60 hover:bg-white border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {model.name}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-cyan-700 shrink-0" />
                      )}
                    </div>

                    {/* Most Powerful Model Tag Badge */}
                    <div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isModelClaude
                            ? "bg-amber-100 text-amber-950 border-amber-300"
                            : "bg-cyan-100 text-cyan-950 border-cyan-300"
                        }`}
                      >
                        {model.tag}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {model.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono pt-0.5">
                      <Sparkles className="w-3 h-3 text-cyan-600" />
                      <span>{model.contextWindow}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 px-2 text-[10px] text-slate-500 leading-relaxed">
            Requests are authenticated securely by your private serverless proxy.
          </div>
        </div>
      )}
    </div>
  );
};
