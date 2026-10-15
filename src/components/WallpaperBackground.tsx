import React from "react";
import bgCenter from "../assets/orion-center-4k.jpg";
import bgJwst from "../assets/orion-jwst-nircam.jpg";
import { ThemeConfig } from "../themes";
import { CosmicMotionCanvas } from "./CosmicMotionCanvas";

interface WallpaperBackgroundProps {
  isSidebarOpen?: boolean;
  adaptiveFraming?: boolean;
  theme: ThemeConfig;
  motionEnabled?: boolean;
}

export const NEBULA_VARIANTS: Record<string, string> = {
  "1": bgJwst,
  "jwst": bgJwst,
  "classic": bgCenter,
  "hubble": bgCenter,
  "2": "/nebula-variations/var_electric_cyan_violet.jpg",
  "3": "/nebula-variations/var_moody_obsidian.jpg",
  "4": "/nebula-variations/var_jwst_nircam.jpg",
  "5": "/nebula-variations/var_jwst_orion_bar.jpg",
  "6": "/nebula-variations/var_hubble_full_mosaic.jpg",
  "7": "/nebula-variations/var_hubble_deep_view.jpg",
  "8": "/nebula-variations/var_eso_vista_wide.jpg",
  "9": "/nebula-variations/var_spitzer_wise_cosmic.jpg",
  "10": bgCenter,
};

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  isSidebarOpen = false,
  adaptiveFraming = false,
  theme,
  motionEnabled = true,
}) => {
  const [activeNebulaSrc, setActiveNebulaSrc] = React.useState<string>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("nebula");
      if (q && NEBULA_VARIANTS[q]) return NEBULA_VARIANTS[q];
      const saved = localStorage.getItem("orion_nebula_variant");
      if (saved && saved !== "jwst" && saved !== "1" && NEBULA_VARIANTS[saved]) return NEBULA_VARIANTS[saved];
    }
    return bgCenter;
  });

  React.useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("nebula");
      if (q && NEBULA_VARIANTS[q]) {
        setActiveNebulaSrc(NEBULA_VARIANTS[q]);
      } else {
        const saved = localStorage.getItem("orion_nebula_variant");
        if (saved && NEBULA_VARIANTS[saved]) setActiveNebulaSrc(NEBULA_VARIANTS[saved]);
        else setActiveNebulaSrc(bgCenter);
      }
    };

    const handleCustomChange = (e: any) => {
      const variantKey = e.detail?.variant;
      if (variantKey && NEBULA_VARIANTS[variantKey]) {
        setActiveNebulaSrc(NEBULA_VARIANTS[variantKey]);
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("orion-nebula-change", handleCustomChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("orion-nebula-change", handleCustomChange);
    };
  }, []);

  return (
    <>
      {/* Dedicated backing for sidebar rail when in Adaptive Framing mode */}
      {adaptiveFraming && (
        <div className="hidden md:block fixed top-0 bottom-0 left-0 w-72 lg:w-80 -z-30 bg-black/30 dark:bg-slate-950 border-r border-black/10 dark:border-slate-800" />
      )}

      {/* 4K Orion Nebula Base Canvas (JWST NIRCam Deep Infrared or Hubble Classic) */}
      <div
        className={`pointer-events-none fixed top-0 bottom-0 right-0 -z-30 overflow-hidden bg-black select-none transform-gpu transition-all duration-500 ease-in-out ${
          adaptiveFraming && isSidebarOpen
            ? "left-0 md:left-72 lg:left-80"
            : "left-0"
        }`}
        style={{ willChange: "left" }}
      >
        <img
          src={activeNebulaSrc}
          alt="Orion Nebula 4K High Quality Wallpaper"
          className="w-full h-full object-cover object-center transform-gpu transition-opacity duration-700"
          decoding="sync"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />

        {/* Subtle theme ambient overlay if defined */}
        {theme.bgOverlay && (
          <div className={`absolute inset-0 transition-all duration-500 ${theme.bgOverlay}`} />
        )}
      </div>

      {/* Realistic Astronomical Starfield, Stellar Wind & Supernova Explosion Canvas */}
      <CosmicMotionCanvas theme={theme} motionEnabled={motionEnabled} />
    </>
  );
};
