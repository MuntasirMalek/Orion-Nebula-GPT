import React from "react";
import bgCenter from "../assets/orion-center-4k.jpg";

interface WallpaperBackgroundProps {
  isSidebarOpen?: boolean;
  adaptiveFraming?: boolean;
}

export const WallpaperBackground: React.FC<WallpaperBackgroundProps> = ({
  isSidebarOpen = false,
  adaptiveFraming = false,
}) => {
  return (
    <>
      {/* Dedicated backing for sidebar rail when in Adaptive Framing mode */}
      {adaptiveFraming && (
        <div className="hidden md:block fixed top-0 bottom-0 left-0 w-72 lg:w-80 -z-30 bg-slate-950 border-r border-slate-800" />
      )}

      {/* 4K Hubble Orion Nebula Optical Canvas - GPU Accelerated & Pre-baked */}
      <div
        className={`pointer-events-none fixed top-0 bottom-0 right-0 -z-20 overflow-hidden bg-black select-none transform-gpu transition-all duration-300 ease-in-out ${
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
          decoding="async"
          // @ts-ignore
          fetchpriority="high"
        />
      </div>
    </>
  );
};
