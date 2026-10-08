import React from "react";
import bgCenter from "../assets/orion-center-4k.jpg";
import { ThemeConfig } from "../themes";
import { CosmicMotionCanvas } from "./CosmicMotionCanvas";

interface WallpaperBackgroundProps {
  isSidebarOpen?: boolean;
  adaptiveFraming?: boolean;
  theme: ThemeConfig;
  motionEnabled?: boolean;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  isSidebarOpen = false,
  adaptiveFraming = false,
  theme,
  motionEnabled = true,
}) => {
  return (
    <>
      {/* Dedicated backing for sidebar rail when in Adaptive Framing mode */}
      {adaptiveFraming && (
        <div className="hidden md:block fixed top-0 bottom-0 left-0 w-72 lg:w-80 -z-30 bg-black/30 dark:bg-slate-950 border-r border-black/10 dark:border-slate-800" />
      )}

      {/* 4K Hubble Orion Nebula Base Canvas - 100% NATURAL UNTOUCHED OPTICAL MOSAIC (ZERO COLOR FILTERS) */}
      <div
        className={`pointer-events-none fixed top-0 bottom-0 right-0 -z-30 overflow-hidden bg-black select-none transform-gpu transition-all duration-300 ease-in-out ${
          adaptiveFraming && isSidebarOpen
            ? "left-0 md:left-72 lg:left-80"
            : "left-0"
        }`}
        style={{ willChange: "left" }}
      >
        <img
          src={bgCenter}
          alt="Orion Nebula 4K Hubble Mosaic"
          className="w-full h-full object-cover object-center transform-gpu"
          decoding="sync"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />

        {/* Subtle theme ambient overlay if defined (e.g. gentle vignette, no harsh color tint) */}
        {theme.bgOverlay && (
          <div className={`absolute inset-0 transition-all duration-500 ${theme.bgOverlay}`} />
        )}
      </div>

      {/* Realistic Astronomical Starfield, Stellar Wind & Supernova Explosion Canvas */}
      <CosmicMotionCanvas theme={theme} motionEnabled={motionEnabled} />
    </>
  );
};
