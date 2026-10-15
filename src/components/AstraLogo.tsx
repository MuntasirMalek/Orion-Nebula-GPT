import React from "react";

export interface AstraLogoProps {
  className?: string;
  size?: number;
  variant?: 1 | 2 | 3 | 4;
}

/**
 * 4 Curated Variations of the User's Custom 4-Pointed Celestial Star Design:
 * 
 * Variation 1: Silver Starlight (Exact match to user's uploaded image)
 *   - Luminous metallic starlight silver body (#f1f5f9 -> #94a3b8)
 *   - Pure white core disc (#ffffff)
 *   - 4 silver orbital satellites (#cbd5e1)
 *   - Soft cyan/blue celestial ambient glow
 * 
 * Variation 2: Electric Cyan Astra (High-Energy Cyber Glow)
 *   - Vibrant cyan-to-azure gradient (#22d3ee -> #0284c7)
 *   - White-hot core disc
 *   - Glowing electric cyan satellites (#38bdf8)
 *   - Rich cyan plasma aura
 * 
 * Variation 3: Orion Cosmic Prismatic (Multi-Spectral Core)
 *   - Multi-spectral Orion Nebula gradient (#22d3ee -> #818cf8 -> #c084fc)
 *   - Brilliant white core disc
 *   - Chromatic quad-satellite dots
 *   - Violet & cyan dual aura
 * 
 * Variation 4: Supernova Solar Flare (Golden Amber Ignition)
 *   - Molten solar gold to amber gradient (#fde047 -> #f59e0b)
 *   - White-hot fusion core
 *   - Glowing amber satellites (#fbbf24)
 *   - Warm solar coronal halo
 */
export const AstraLogo: React.FC<AstraLogoProps> = ({
  className = "",
  size = 28,
  variant: propVariant,
}) => {
  const [activeVariant, setActiveVariant] = React.useState<number>(() => {
    if (propVariant !== undefined) return propVariant;
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const l = params.get("logo");
      if (l) {
        const parsed = parseInt(l, 10);
        if (parsed >= 1 && parsed <= 4) return parsed;
      }
      const saved = localStorage.getItem("orion_logo_variant");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 4) return parsed;
      }
    }
    return 3; // Default to user's chosen Variation 3 (Orion Cosmic Prismatic)
  });

  React.useEffect(() => {
    if (propVariant !== undefined) {
      setActiveVariant(propVariant);
      return;
    }
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const l = params.get("logo");
      if (l) {
        const parsed = parseInt(l, 10);
        if (parsed >= 1 && parsed <= 4) {
          setActiveVariant(parsed);
          return;
        }
      }
      const saved = localStorage.getItem("orion_logo_variant");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (parsed >= 1 && parsed <= 4) {
          setActiveVariant(parsed);
          return;
        }
      }
      setActiveVariant(3);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [propVariant]);

  // Ambient glow color based on active variation
  const getGlowColor = () => {
    switch (activeVariant) {
      case 2:
        return "bg-cyan-500/35";
      case 3:
        return "bg-indigo-500/30";
      case 4:
        return "bg-amber-500/35";
      case 1:
      default:
        return "bg-sky-400/25";
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-label={`Orion Nebula 4-Point Star Logo (Variation #${activeVariant})`}
    >
      {/* Outer ambient glow matching user's image background aura */}
      <div
        className={`absolute inset-0 rounded-full blur-md pointer-events-none transition-colors duration-300 ${getGlowColor()}`}
        style={{ transform: "scale(1.25)" }}
      />

      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_8px_rgba(56,189,248,0.45)]"
      >
        <defs>
          {/* Variation 1: Silver Starlight Metallic (User Original) */}
          <linearGradient id="v1_silverGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Variation 2: Electric Cyan Astra */}
          <linearGradient id="v2_cyanGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Variation 3: Orion Cosmic Prismatic */}
          <linearGradient id="v3_prismaticGrad" x1="16" y1="2" x2="16" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>

          {/* Variation 4: Supernova Solar Flare */}
          <linearGradient id="v4_goldGrad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* VARIATION 1: Pure Silver Starlight (Exact Match to User Upload) */}
        {activeVariant === 1 && (
          <g>
            {/* 4-Point Concave Cosmic Star */}
            <path
              d="M 16 2 C 16.6 9.8 22.2 15.4 30 16 C 22.2 16.6 16.6 22.2 16 30 C 15.4 22.2 9.8 16.6 2 16 C 9.8 15.4 15.4 9.8 16 2 Z"
              fill="url(#v1_silverGrad)"
            />
            {/* Central Luminous White Core Disc */}
            <circle cx="16" cy="16" r="2.4" fill="#ffffff" />
            {/* 4 Diagonal Orbital Satellite Dots */}
            <circle cx="9.5" cy="9.5" r="1.5" fill="#cbd5e1" />
            <circle cx="22.5" cy="9.5" r="1.5" fill="#cbd5e1" />
            <circle cx="9.5" cy="22.5" r="1.5" fill="#cbd5e1" />
            <circle cx="22.5" cy="22.5" r="1.5" fill="#cbd5e1" />
          </g>
        )}

        {/* VARIATION 2: Electric Cyan Astra */}
        {activeVariant === 2 && (
          <g>
            <path
              d="M 16 2 C 16.6 9.8 22.2 15.4 30 16 C 22.2 16.6 16.6 22.2 16 30 C 15.4 22.2 9.8 16.6 2 16 C 9.8 15.4 15.4 9.8 16 2 Z"
              fill="url(#v2_cyanGrad)"
            />
            <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
            <circle cx="9.5" cy="9.5" r="1.5" fill="#38bdf8" />
            <circle cx="22.5" cy="9.5" r="1.5" fill="#38bdf8" />
            <circle cx="9.5" cy="22.5" r="1.5" fill="#38bdf8" />
            <circle cx="22.5" cy="22.5" r="1.5" fill="#38bdf8" />
          </g>
        )}

        {/* VARIATION 3: Orion Cosmic Prismatic */}
        {activeVariant === 3 && (
          <g>
            <path
              d="M 16 2 C 16.6 9.8 22.2 15.4 30 16 C 22.2 16.6 16.6 22.2 16 30 C 15.4 22.2 9.8 16.6 2 16 C 9.8 15.4 15.4 9.8 16 2 Z"
              fill="url(#v3_prismaticGrad)"
            />
            <circle cx="16" cy="16" r="2.4" fill="#ffffff" />
            <circle cx="9.5" cy="9.5" r="1.5" fill="#38bdf8" />
            <circle cx="22.5" cy="9.5" r="1.5" fill="#818cf8" />
            <circle cx="9.5" cy="22.5" r="1.5" fill="#c084fc" />
            <circle cx="22.5" cy="22.5" r="1.5" fill="#22d3ee" />
          </g>
        )}

        {/* VARIATION 4: Supernova Solar Flare */}
        {activeVariant === 4 && (
          <g>
            <path
              d="M 16 2 C 16.6 9.8 22.2 15.4 30 16 C 22.2 16.6 16.6 22.2 16 30 C 15.4 22.2 9.8 16.6 2 16 C 9.8 15.4 15.4 9.8 16 2 Z"
              fill="url(#v4_goldGrad)"
            />
            <circle cx="16" cy="16" r="2.5" fill="#ffffff" />
            <circle cx="9.5" cy="9.5" r="1.5" fill="#fef08a" />
            <circle cx="22.5" cy="9.5" r="1.5" fill="#fbbf24" />
            <circle cx="9.5" cy="22.5" r="1.5" fill="#fbbf24" />
            <circle cx="22.5" cy="22.5" r="1.5" fill="#f59e0b" />
          </g>
        )}
      </svg>
    </div>
  );
};
