import React, { useState, useEffect } from "react";
import { AppSettings, HealthCheckResult, BalanceInfo } from "../types";
import { DEFAULT_BACKEND_URL, DEFAULT_SYSTEM_PROMPT, AVAILABLE_MODELS, DEFAULT_MODEL_ID, ModelOption, isModelUnlocked } from "../config";
import { testBackendHealth, fetchBalanceInfo } from "../services/api";
import { PasscodeModal } from "./PasscodeModal";
import { ModelNameLabel } from "./ModelNameLabel";
import {
  X,
  Server,
  Activity,
  Sliders,
  CheckCircle2,
  XCircle,
  Loader2,
  RotateCcw,
  Shield,
  Check,
  Cpu,
  Wallet,
  RefreshCw,
  Lock,
  ShieldCheck,
  GraduationCap,
  Lightbulb,
  Zap,
  Keyboard,
} from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSave: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [backendUrl, setBackendUrl] = useState(settings.backendUrl);
  const [temperature, setTemperature] = useState(settings.temperature);
  const [systemPrompt, setSystemPrompt] = useState(
    settings.systemPrompt?.includes("You are a premier frontier intelligence model")
      ? ""
      : settings.systemPrompt || ""
  );
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel || DEFAULT_MODEL_ID);
  const [sendKeyMode, setSendKeyMode] = useState<"enter" | "cmd_enter">(settings.sendKeyMode || "enter");
  const [reasoningEffort, setReasoningEffort] = useState<"low" | "medium" | "high">(
    settings.reasoningEffort || "medium"
  );
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState<BalanceInfo | null>(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [, setIsUnlocked] = useState<boolean>(
    () => typeof window !== "undefined" && localStorage.getItem("astra_frontier_unlocked") === "true"
  );
  const [passcodeTarget, setPasscodeTarget] = useState<ModelOption | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadBalance();
    }
  }, [isOpen, backendUrl]);

  const loadBalance = async () => {
    setIsFetchingBalance(true);
    try {
      const info = await fetchBalanceInfo(backendUrl);
      setBalanceInfo(info);
    } catch {
      // Fallback
    } finally {
      setIsFetchingBalance(false);
    }
  };

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setHealthStatus(null);
    try {
      const res = await testBackendHealth(backendUrl);
      setHealthStatus(res);
      loadBalance();
    } catch {
      setHealthStatus({ status: "offline", message: "Failed to reach proxy endpoint." });
    } finally {
      setIsTesting(false);
    }
  };

  const handleResetDefaults = () => {
    setBackendUrl(DEFAULT_BACKEND_URL);
    setTemperature(0.7);
    setSystemPrompt(DEFAULT_SYSTEM_PROMPT);
    setSelectedModel(DEFAULT_MODEL_ID);
    setReasoningEffort("low");
    setSendKeyMode("enter");
    setHealthStatus(null);
  };

  const handleSave = () => {
    onSave({
      ...settings,
      backendUrl: backendUrl.trim(),
      temperature,
      systemPrompt,
      selectedModel,
      maxContextMessages: 8,
      reasoningEffort,
      sendKeyMode,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">System Settings</h2>
              <p className="text-[11px] text-slate-500">Proxy routing, token pruning, and stealth balance monitor</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* API Usage Spent (Pure spent amount only - zero quota or numbers shown) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Wallet className="w-4 h-4 text-cyan-600" />
                <span>API Usage Spent</span>
              </div>
              <button
                type="button"
                onClick={loadBalance}
                disabled={isFetchingBalance}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Refresh usage statistics"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isFetchingBalance ? "animate-spin text-cyan-600" : ""}`} />
              </button>
            </div>

            {balanceInfo ? (
              <div className="p-3.5 rounded-lg bg-white border border-slate-200/90 shadow-2xs">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">Total Spent</div>
                <div className="text-xl font-black text-slate-900 mt-0.5">
                  ${balanceInfo.consumption.toFixed(2)} <span className="text-xs font-normal text-slate-500">USD</span>
                </div>
              </div>
            ) : (
              <div className="py-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>{isFetchingBalance ? "Fetching usage from serverless proxy..." : "Usage data available via live proxy endpoint."}</span>
                {!isFetchingBalance && (
                  <button
                    type="button"
                    onClick={loadBalance}
                    className="text-cyan-700 font-semibold hover:underline cursor-pointer"
                  >
                    Check
                  </button>
                )}
              </div>
            )}

            <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-0.5">
              <Shield className="w-3 h-3 text-cyan-600 shrink-0" />
              <span>Direct Serverless Proxy: Provider credentials and wallet details remain hidden.</span>
            </div>
          </div>

          {/* Backend Proxy URL Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Backend Proxy URL</span>
              </label>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="text-[11px] font-medium text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
              >
                {isTesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                <span>{isTesting ? "Testing..." : "Test Connection"}</span>
              </button>
            </div>
            <input
              type="text"
              value={backendUrl}
              onChange={(e) => setBackendUrl(e.target.value)}
              placeholder="https://your-site.netlify.app/api/chat"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 font-mono"
            />
            {healthStatus && (
              <div
                className={`p-2 rounded-lg text-xs flex items-center gap-2 border ${
                  healthStatus.status === "online"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : healthStatus.status === "offline"
                    ? "bg-rose-50 text-rose-800 border-rose-200"
                    : "bg-amber-50 text-amber-800 border-amber-200"
                }`}
              >
                {healthStatus.status === "online" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                )}
                <span>
                  {healthStatus.message}{" "}
                  {healthStatus.latencyMs ? `(${healthStatus.latencyMs}ms)` : ""}
                </span>
              </div>
            )}
          </div>

          {/* Frontier Model Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-700" />
                <span>Frontier Model Selection</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                const isClaude = model.id.includes("claude");
                const isDeepSeek = model.id.includes("deepseek");
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
                        return;
                      }
                      if (model.defaultEffort) {
                        setReasoningEffort(model.defaultEffort);
                      }
                      setSelectedModel(model.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? isClaude
                          ? "bg-amber-50/90 border-amber-400 shadow-xs"
                          : isDeepSeek
                          ? "bg-blue-50/90 border-blue-400 shadow-xs"
                          : "bg-emerald-50/90 border-emerald-400 shadow-xs"
                        : "bg-white/60 hover:bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          <ModelNameLabel name={model.name} />
                        </span>
                        {isLocked && <Lock className="w-3 h-3 text-amber-500 inline ml-1 -mt-0.5 align-middle" />}
                      </div>
                      {isSelected && (
                        <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          isClaude ? "text-amber-600" : isDeepSeek ? "text-blue-600" : "text-emerald-600"
                        }`} />
                      )}
                    </div>
                    <span
                      className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full border mb-1 ${
                        isClaude
                          ? "bg-amber-100 text-amber-950 border-amber-300"
                          : isDeepSeek
                          ? "bg-blue-100 text-blue-950 border-blue-300"
                          : "bg-emerald-100 text-emerald-950 border-emerald-300"
                      }`}
                    >
                      {model.tag}
                    </span>
                    <p className="text-[10px] text-slate-500 leading-tight">
                      {model.contextWindow}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cohort Quota Shield (Enforced Token Guard) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-bold text-slate-800">Cohort Quota Shield</span>
              </div>
              <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-100/80 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Enforced
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Automated sliding-window token pruning is permanently locked by administrator. Expensive models (GPT-6 Astra & Claude) are strictly pruned on Question 3 to protect shared API credits and eliminate latency.
            </p>
          </div>

          {/* Send Message Shortcut (Input Ergonomics) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Keyboard className="w-3.5 h-3.5 text-cyan-700" />
                <span>Send Message Shortcut</span>
              </label>
              <span className="font-mono text-cyan-800 text-xs font-semibold">
                {sendKeyMode === "cmd_enter" ? "⌘/Ctrl + Enter" : "Enter"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  mode: "enter",
                  label: "Press Enter",
                  desc: "Standard chat mode",
                },
                {
                  mode: "cmd_enter",
                  label: "Press ⌘ / Ctrl + Enter",
                  desc: "Draft multi-line code safely",
                },
              ].map((opt) => {
                const isActive = sendKeyMode === opt.mode;
                return (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => setSendKeyMode(opt.mode as "enter" | "cmd_enter")}
                    className={`py-2 px-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-50 border-cyan-400 text-cyan-950 font-bold shadow-xs"
                        : "bg-white/70 hover:bg-white border-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="text-xs font-semibold">{opt.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Response Style (Temperature) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-700" />
                <span>Response Style (Temperature)</span>
              </label>
              <span className="font-mono text-cyan-800 text-xs font-semibold">{temperature}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Precise", val: 0.2, desc: "Factual & Code" },
                { label: "Balanced", val: 0.7, desc: "Default" },
                { label: "Creative", val: 1.0, desc: "Exploratory" },
              ].map((preset) => {
                const isActive = temperature === preset.val;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setTemperature(preset.val)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-50 border-cyan-400 text-cyan-950 font-bold shadow-xs"
                        : "bg-white/70 hover:bg-white border-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="text-xs">{preset.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{preset.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* System Instructions & Study Personas */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-cyan-700" />
                <span>Cohort Study Persona</span>
              </label>
              <button
                type="button"
                onClick={() => setSystemPrompt("")}
                className="text-[10px] text-slate-500 hover:text-cyan-700 flex items-center gap-1 cursor-pointer"
                title="Clear to blank (native model default)"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Clear
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  id: "scholar",
                  label: "Cohort Scholar",
                  icon: GraduationCap,
                  desc: "Rigorous & Code",
                  prompt:
                    "You are Orion Nebula GPT, a premier frontier AI study companion for the student cohort. You provide rigorous, deeply structured, and clear analyses with precision engineering and high-order cognitive synthesis.",
                },
                {
                  id: "socratic",
                  label: "Socratic Tutor",
                  icon: Lightbulb,
                  desc: "Guided Inquiry",
                  prompt:
                    "You are a Socratic tutor for the student cohort. Do not simply provide direct answers. Guide the student with thought-provoking questions, hints, and structured reasoning to foster genuine deep learning.",
                },
                {
                  id: "exam",
                  label: "Exam Cram",
                  icon: Zap,
                  desc: "High-Yield Bullets",
                  prompt:
                    "You are a concise exam-prep study companion for the student cohort. Deliver high-yield summaries, key formulas, bulleted facts, and rapid review points with maximum brevity and zero fluff.",
                },
              ].map((mode) => {
                const isActive = systemPrompt.trim() === mode.prompt.trim();
                const IconComp = mode.icon;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setSystemPrompt(isActive ? "" : mode.prompt)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-cyan-50 border-cyan-400 text-cyan-950 font-bold shadow-xs"
                        : "bg-white/70 hover:bg-white border-slate-200 text-slate-700 font-medium"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1 text-xs">
                      <IconComp className="w-3 h-3 text-cyan-600 shrink-0" />
                      <span className="truncate">{mode.label}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">{mode.desc}</div>
                  </button>
                );
              })}
            </div>

            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              placeholder="Blank by default (pure native frontier model). You can optionally enter custom instructions, style constraints, or pick a study persona above..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-xs cursor-pointer"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>

      {/* Passcode Unlock Modal */}
      <PasscodeModal
        isOpen={Boolean(passcodeTarget)}
        onClose={() => setPasscodeTarget(null)}
        onSuccess={(_code) => {
          setIsUnlocked(true);
          if (passcodeTarget) {
            if (passcodeTarget.defaultEffort) {
              setReasoningEffort(passcodeTarget.defaultEffort);
            }
            setSelectedModel(passcodeTarget.id);
            setPasscodeTarget(null);
          }
        }}
        targetModel={passcodeTarget}
        targetModelName={passcodeTarget?.name}
        reasoningEffort={reasoningEffort}
      />
    </div>
  );
};
