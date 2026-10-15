import React from "react";

export interface ModelLogoProps {
  modelId?: string;
  provider?: string;
  size?: number;
  className?: string;
}

/**
 * High-fidelity, crisp SVG logos for all frontier AI models & providers:
 * - DeepSeek (Iconic whale / star in oceanic cyan & deep blue)
 * - OpenAI / GPT-6 Astra (Official OpenAI vortex spiral in emerald/cyan)
 * - Anthropic / Claude (Official sunburst asterisk in warm terracotta)
 * - Mistral AI (Official pixelated interlocking M blocks in vibrant orange)
 * - Alibaba Qwen (Official geometric loop / isometric hexagon in indigo/violet)
 * - Meta AI (Official infinity loop in electric blue)
 */
export const ModelLogo: React.FC<ModelLogoProps> = ({
  modelId = "",
  provider = "",
  size = 18,
  className = "",
}) => {
  const normalized = `${modelId} ${provider}`.toLowerCase();

  // 1. DeepSeek
  if (normalized.includes("deepseek")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-[0_1px_4px_rgba(2,132,199,0.3)] ${className}`}
        aria-label="DeepSeek Logo"
      >
        <defs>
          <linearGradient id="deepseekGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        {/* DeepSeek Whale Silhouette & Breaching Spout */}
        <path
          d="M6 19C6 14 10 9 18 8C23 7.3 26 9.5 27 12C28 14.5 26.5 17 24 18.5C21.5 20 18.5 20.2 16 21C13 22 10.5 23.5 8 26C8.5 23.5 8.2 21.5 6 19Z"
          fill="url(#deepseekGrad)"
        />
        <path
          d="M17 8C17 5 19 3 21 2C20.5 4 21.5 5.5 23 6C20.5 6.5 18.5 7 17 8Z"
          fill="#38bdf8"
        />
        <circle cx="23" cy="12" r="1.5" fill="#ffffff" />
      </svg>
    );
  }

  // 2. Mistral AI
  if (normalized.includes("mistral")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-[0_1px_4px_rgba(249,115,22,0.35)] ${className}`}
        aria-label="Mistral AI Logo"
      >
        <rect x="3" y="5" width="5.2" height="5.2" rx="0.8" fill="#f97316" />
        <rect x="23.8" y="5" width="5.2" height="5.2" rx="0.8" fill="#f97316" />
        <rect x="3" y="10.2" width="5.2" height="5.2" rx="0.8" fill="#f97316" />
        <rect x="8.2" y="10.2" width="5.2" height="5.2" rx="0.8" fill="#ea580c" />
        <rect x="18.6" y="10.2" width="5.2" height="5.2" rx="0.8" fill="#ea580c" />
        <rect x="23.8" y="10.2" width="5.2" height="5.2" rx="0.8" fill="#f97316" />
        <rect x="3" y="15.4" width="5.2" height="5.2" rx="0.8" fill="#f97316" />
        <rect x="8.2" y="15.4" width="5.2" height="5.2" rx="0.8" fill="#ea580c" />
        <rect x="13.4" y="15.4" width="5.2" height="5.2" rx="0.8" fill="#c2410c" />
        <rect x="18.6" y="15.4" width="5.2" height="5.2" rx="0.8" fill="#ea580c" />
        <rect x="23.8" y="15.4" width="5.2" height="5.2" rx="0.8" fill="#f97316" />
        <rect x="3" y="20.6" width="5.2" height="5.2" rx="0.8" fill="#ea580c" />
        <rect x="13.4" y="20.6" width="5.2" height="5.2" rx="0.8" fill="#c2410c" />
        <rect x="23.8" y="20.6" width="5.2" height="5.2" rx="0.8" fill="#ea580c" />
        <rect x="3" y="25.8" width="5.2" height="5.2" rx="0.8" fill="#c2410c" />
        <rect x="23.8" y="25.8" width="5.2" height="5.2" rx="0.8" fill="#c2410c" />
      </svg>
    );
  }

  // 3. Alibaba Qwen
  if (normalized.includes("qwen") || normalized.includes("alibaba")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-[0_1px_4px_rgba(99,102,241,0.35)] ${className}`}
        aria-label="Qwen Logo"
      >
        <defs>
          <linearGradient id="qwenGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
        {/* Interlocking Hexagonal Prism Loop */}
        <path
          d="M16 3L27 9.5V22.5L16 29L5 22.5V9.5L16 3Z"
          stroke="url(#qwenGrad)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M16 11L21.5 14.2V20.8L16 24L10.5 20.8V14.2L16 11Z"
          fill="url(#qwenGrad)"
        />
      </svg>
    );
  }

  // 4. Meta AI (Muse Spark)
  if (normalized.includes("meta") || normalized.includes("muse")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-[0_1px_4px_rgba(0,129,251,0.35)] ${className}`}
        aria-label="Meta Logo"
      >
        <defs>
          <linearGradient id="metaGrad" x1="2" y1="16" x2="30" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0064e0" />
            <stop offset="40%" stopColor="#0081fb" />
            <stop offset="80%" stopColor="#00b2ff" />
          </linearGradient>
        </defs>
        {/* Meta Official Infinity Ribbon */}
        <path
          d="M8.8 8C5.2 8 2.5 11 2.5 15.5C2.5 20 5.4 23 9 23C12.3 23 14.6 20.5 16 18.2C17.4 20.5 19.7 23 23 23C26.6 23 29.5 20 29.5 15.5C29.5 11 26.8 8 23.2 8C19.9 8 17.6 10.5 16 12.8C14.4 10.5 12.1 8 8.8 8ZM9 11.5C11.2 11.5 12.8 13.4 14.2 15.5C12.8 17.6 11.2 19.5 9 19.5C6.9 19.5 5.5 17.8 5.5 15.5C5.5 13.2 6.9 11.5 9 11.5ZM23 11.5C25.1 11.5 26.5 13.2 26.5 15.5C26.5 17.8 25.1 19.5 23 19.5C20.8 19.5 19.2 17.6 17.8 15.5C19.2 13.4 20.8 11.5 23 11.5Z"
          fill="url(#metaGrad)"
        />
      </svg>
    );
  }

  // 5. Anthropic / Claude
  if (normalized.includes("claude") || normalized.includes("anthropic")) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 drop-shadow-[0_1px_4px_rgba(217,119,6,0.35)] ${className}`}
        aria-label="Claude Logo"
      >
        <defs>
          <linearGradient id="claudeGrad" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
        {/* Anthropic Sunburst Asterisk */}
        <path
          d="M16 2.5V29.5M2.5 16H29.5M6.5 6.5L25.5 25.5M6.5 25.5L25.5 6.5"
          stroke="url(#claudeGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <circle cx="16" cy="16" r="3.2" fill="#d97706" />
      </svg>
    );
  }

  // 6. OpenAI / GPT-6 Astra (Default)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_1px_4px_rgba(16,185,129,0.35)] ${className}`}
      aria-label="OpenAI Logo"
    >
      <defs>
        <linearGradient id="openAIGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* OpenAI Vortex Knot */}
      <path
        d="M26.8 13.8C26.3 10.9 24.3 8.6 21.6 7.8V10.8C22.8 11.3 23.8 12.5 24.1 14.1L26.8 13.8ZM18.2 5.2C15.6 4.3 12.6 4.9 10.5 6.8L12.5 9.1C13.8 7.9 15.8 7.6 17.4 8.2L18.2 5.2ZM7.8 10.4C6 12.6 5.6 15.7 6.7 18.3L9.5 17.3C8.8 15.6 9.1 13.5 10.2 12.1L7.8 10.4ZM8.2 21.6C9.5 24.1 12.1 25.8 15.1 25.9V22.9C13.3 22.8 11.6 21.7 10.8 20.1L8.2 21.6ZM19.5 25.3C22.2 24.5 24.3 22.3 25.1 19.5L22.2 18.6C21.7 20.4 20.3 21.8 18.5 22.3L19.5 25.3Z"
        fill="url(#openAIGrad)"
      />
      <circle cx="16" cy="16" r="3" fill="#10b981" />
    </svg>
  );
};
