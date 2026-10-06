import React from "react";

interface AstraLogoProps {
  className?: string;
  size?: number;
}

export const AstraLogo: React.FC<AstraLogoProps> = ({ className = "", size = 28 }) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer ambient glow */}
      <div
        className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md animate-pulse-slow"
        style={{ transform: "scale(1.2)" }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]"
      >
        <defs>
          <linearGradient id="astraGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="astraCore" x1="16" y1="6" x2="16" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a5f3fc" />
          </linearGradient>
        </defs>

        {/* Outer 8-pointed geometric cosmic star */}
        <path
          d="M16 2L18.8 11.2L28 14L18.8 16.8L16 26L13.2 16.8L4 14L13.2 11.2L16 2Z"
          fill="url(#astraGrad)"
          opacity="0.9"
        />

        {/* Diagonal accents */}
        <circle cx="9" cy="9" r="1.5" fill="#38bdf8" opacity="0.8" />
        <circle cx="23" cy="9" r="1.5" fill="#c084fc" opacity="0.8" />
        <circle cx="9" cy="23" r="1.5" fill="#818cf8" opacity="0.8" />
        <circle cx="23" cy="23" r="1.5" fill="#22d3ee" opacity="0.8" />

        {/* Inner core diamond */}
        <polygon points="16,8 20,16 16,24 12,16" fill="url(#astraCore)" />
      </svg>
    </div>
  );
};
