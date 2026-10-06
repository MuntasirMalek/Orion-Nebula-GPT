import React, { useState } from "react";
import { AppSettings, HealthCheckResult } from "../types";
import { DEFAULT_BACKEND_URL, DEFAULT_SYSTEM_PROMPT, AVAILABLE_MODELS, DEFAULT_MODEL_ID } from "../config";
import { testBackendHealth } from "../services/api";
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
  const [systemPrompt, setSystemPrompt] = useState(settings.systemPrompt);
  const [selectedModel, setSelectedModel] = useState(settings.selectedModel || DEFAULT_MODEL_ID);
  const [healthStatus, setHealthStatus] = useState<HealthCheckResult | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setHealthStatus(null);
    try {
      const res = await testBackendHealth(backendUrl);
      setHealthStatus(res);
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
    setHealthStatus(null);
  };

  const handleSave = () => {
    onSave({
      ...settings,
      backendUrl: backendUrl.trim(),
      temperature,
      systemPrompt,
      selectedModel,
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
              <p className="text-[11px] text-slate-500">Configure proxy routing and Orion Nebula GPT parameters</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Zero-Tinkering Architecture Notice */}
          <div className="p-3.5 rounded-xl bg-cyan-50/90 border border-cyan-200 text-xs flex items-start gap-3">
            <Shield className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-700 leading-relaxed">
              <span className="font-semibold text-cyan-900">Decoupled Security:</span> Guests never need an API key. All upstream authentication tokens are securely managed by your Netlify Serverless Proxy.
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
                disabled={isTesting || !backendUrl.trim()}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-700 hover:text-cyan-900 disabled:opacity-40 transition-colors"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3 h-3" />
                    <span>Test Ping</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={backendUrl}
                onChange={(e) => {
                  setBackendUrl(e.target.value);
                  setHealthStatus(null);
                }}
                placeholder="https://your-site.netlify.app/api/chat"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 font-mono"
              />
            </div>

            {/* Health Status Indicator */}
            {healthStatus && (
              <div
                className={`p-2.5 rounded-lg text-xs flex items-center justify-between ${
                  healthStatus.status === "online"
                    ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border border-rose-200 text-rose-800"
                }`}
              >
                <div className="flex items-center gap-2">
                  {healthStatus.status === "online" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span className="text-[11px] font-medium">{healthStatus.message || healthStatus.status}</span>
                </div>
                {healthStatus.latencyMs !== undefined && (
                  <span className="text-[10px] font-mono opacity-80">
                    {healthStatus.latencyMs}ms
                  </span>
                )}
              </div>
            )}

            <p className="text-[10px] text-slate-500">
              Direct Netlify function path (e.g. <code className="text-cyan-700 font-mono">https://site.netlify.app/api/chat</code> or <code className="text-cyan-700 font-mono">/.netlify/functions/chat</code>).
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-700" />
                <span>Frontier Model Selection</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                const isClaude = model.id.includes("claude");

                return (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setSelectedModel(model.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? isClaude
                          ? "bg-amber-50/90 border-amber-400 shadow-xs"
                          : "bg-cyan-50/90 border-cyan-400 shadow-xs"
                        : "bg-white/60 hover:bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{model.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-700" />}
                    </div>
                    <span
                      className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full border mb-1 ${
                        isClaude
                          ? "bg-amber-100 text-amber-950 border-amber-300"
                          : "bg-cyan-100 text-cyan-950 border-cyan-300"
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

          {/* Temperature Presets (No slider) */}
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
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
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

          {/* System Prompt Customization */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-800">
                System Instructions
              </label>
              <button
                type="button"
                onClick={() => setSystemPrompt(DEFAULT_SYSTEM_PROMPT)}
                className="text-[10px] text-slate-500 hover:text-cyan-700 flex items-center gap-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-xs"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
