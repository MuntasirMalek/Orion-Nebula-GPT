import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Lock, X, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { ModelOption } from "../config";

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string, switchedModelId?: string) => void;
  targetModel?: ModelOption | null;
  targetModelName?: string;
  reasoningEffort?: "low" | "medium" | "high";
  backendUrl?: string;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetModel,
  targetModelName,
  backendUrl: _backendUrl,
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const modelId = targetModel?.id || "gpt-6-astra-medium";
  const modelName = targetModel?.name || targetModelName || "Frontier Model";

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setError(false);
      setErrorMessage("");
      setIsSuccess(false);
      setIsVerifying(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const entered = code.trim();
    if (!entered || isVerifying) return;

    setIsVerifying(true);
    setError(false);
    setErrorMessage("");

    // Determine target tier
    const isDeepSeekTarget = modelId.includes("deepseek");
    const isLowTarget = modelId.includes("-low");

    // Salted cryptographic hashes of authorized cohort passcodes
    // Prevents plaintext passcodes from being exposed in public repositories
    const MASTER_HASH = "814f76ba52f531349ec55800af3850e356bbda4352d32a057533b47b1f3eee80";
    const DEEPSEEK_HASH = "922d49186cfbe2d73264530da0850e2bfebd5ff5f1dbbca3887cdd5c2c111f0b";
    const LOW_HASH = "a373b6750a7851b7e0f56fca634c454569a86a22b2f762017600bea041420074";

    let isValid = false;
    let switchedModelId: string | undefined = undefined;

    try {
      const enc = new TextEncoder().encode(`orion_frontier_salt_2026_${entered}`);
      const buf = await crypto.subtle.digest("SHA-256", enc);
      const enteredHash = Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (enteredHash === MASTER_HASH) {
        // Master code unlocks everything
        isValid = true;
        localStorage.setItem("orion_unlocked_all", "true");
        localStorage.setItem("orion_unlocked_deepseek", "true");
        localStorage.setItem("orion_unlocked_low", "true");
        localStorage.setItem("orion_unlocked_medium_high", "true");
        localStorage.setItem("orion_access_code", entered);
        localStorage.setItem("orion_code_deepseek", entered);
        localStorage.setItem("orion_code_low", entered);
        localStorage.setItem("orion_code_medium_high", entered);
        localStorage.setItem("astra_frontier_unlocked", "true");
        localStorage.setItem("astra_frontier_unlocked_code", entered);
      } else if (enteredHash === DEEPSEEK_HASH) {
        // DeepSeek passcode
        isValid = true;
        localStorage.setItem("orion_unlocked_deepseek", "true");
        localStorage.setItem("orion_code_deepseek", entered);
        localStorage.setItem("orion_access_code", entered);
        localStorage.setItem("astra_frontier_unlocked", "true");
        localStorage.setItem("astra_frontier_unlocked_code", entered);
        if (!isDeepSeekTarget) {
          switchedModelId = "deepseek-v4-flash";
        }
      } else if (enteredHash === LOW_HASH) {
        // Low thinking passcode
        if (isDeepSeekTarget) {
          setIsVerifying(false);
          setError(true);
          setErrorMessage("Incorrect passcode. Access denied.");
          setCode("");
          inputRef.current?.focus();
          return;
        }
        isValid = true;
        localStorage.setItem("orion_unlocked_low", "true");
        localStorage.setItem("orion_code_low", entered);
        localStorage.setItem("orion_access_code", entered);
        localStorage.setItem("astra_frontier_unlocked", "true");
        localStorage.setItem("astra_frontier_unlocked_code", entered);
        if (!isLowTarget) {
          switchedModelId = "gpt-6-astra-low";
        }
      }
    } catch {
      // Ignore subtle crypto failure
    }

    if (isValid) {
      setIsSuccess(true);
      setIsVerifying(false);

      setTimeout(() => {
        onSuccess(entered, switchedModelId);
        onClose();
      }, 350);
      return;
    }

    setIsVerifying(false);
    setError(true);
    setErrorMessage("Incorrect passcode. Access denied.");
    setCode("");
    inputRef.current?.focus();
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150 p-6 space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div
            className={`p-3 rounded-2xl border transition-all ${
              isSuccess
                ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                : error
                ? "bg-rose-50 border-rose-200 text-rose-600 animate-shake"
                : "bg-cyan-50 border-cyan-200 text-cyan-700"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Protected Model Passcode</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter passcode to unlock <span className="font-semibold text-slate-800">{modelName}</span>
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div className="space-y-1">
            <input
              ref={inputRef}
              type="password"
              inputMode="numeric"
              maxLength={16}
              disabled={isVerifying || isSuccess}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(false);
              }}
              placeholder="Enter passcode"
              className={`w-full text-center tracking-widest text-lg font-mono py-2.5 px-4 rounded-xl border bg-slate-50 focus:outline-none transition-all ${
                error
                  ? "border-rose-400 focus:border-rose-500 bg-rose-50/30 text-rose-800"
                  : isSuccess
                  ? "border-emerald-400 bg-emerald-50/30 text-emerald-800"
                  : "border-slate-300 focus:border-cyan-600 text-slate-900"
              }`}
            />
            {error && (
              <p className="text-[11px] text-rose-600 text-center font-medium pt-1">
                {errorMessage || "Incorrect passcode. Access denied."}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="flex-1 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!code.trim() || isVerifying || isSuccess}
              className="flex-1 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-700 text-white transition-all shadow-xs cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : isSuccess ? (
                "Unlocked!"
              ) : (
                "Unlock"
              )}
            </button>
          </div>
        </form>

        {/* Passcode Security Notice */}
        <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1 text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
            <span>Authorized Access Only</span>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalNode, document.body)
    : modalNode;
};
