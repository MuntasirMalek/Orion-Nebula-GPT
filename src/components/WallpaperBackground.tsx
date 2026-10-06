import React from "react";
import bgCenter from "../assets/orion-center-4k.jpg";

export const WallpaperBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-black select-none">
      <img
        src={bgCenter}
        alt="Orion Nebula 4K Hubble Mosaic"
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};
