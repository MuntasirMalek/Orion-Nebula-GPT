import React, { useState } from "react";
import { ThemeId, THEMES } from "../themes";
import { Sparkles, Terminal, BookOpen, Radio, Check, Copy, ChevronDown, ChevronUp } from "lucide-react";

interface ThemeStudioToolbarProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export const ThemeStudioToolbar: React.FC<ThemeStudioToolbarProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedTheme, setCopiedTheme] = useState<string | null>(null);

  const copyUrl = (theme: ThemeId) => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("theme", theme);
    navigator.clipboard.writeText(url.toString());
    setCopiedTheme(theme);
    setTimeout(() => setCopiedTheme(null), 2000);
  };

  const getThemeIcon = (theme: ThemeId) => {
    switch (theme) {
      case "observatory":
        return <Sparkles className="w-3.5 h-3.5 text-cyan-600" />;
      case "cyber":
        return <Terminal className="w-3.5 h-3.5 text-cyan-400" />;
      case "editorial":
        return <BookOpen className="w-3.5 h-3.5 text-amber-700" />;
      case "hud":
        return <Radio className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />;
    }
  };

  const activeThemeConfig = THEMES[currentTheme];

  return (
    <div className="fixed top-3 right-16 z-40 flex items-center">
      {isOpen ? (
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/90 shadow-2xl shadow-slate-950/15">
          <div className="flex items-center gap-1 px-2 py-1 text-slate-400 border-r border-slate-200/80 mr-0.5">
            <span className="text-[11px] font-mono font-bold tracking-tight text-slate-700 uppercase">
              Design
            </span>
          </div>

          {/* Theme 1: Observatory Glass */}
          <button
            onClick={() => onThemeChange("observatory")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTheme === "observatory"
                ? "bg-cyan-600 text-white shadow-xs shadow-cyan-600/30"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
            }`}
            title="Variation 1: Observatory Glass (Apple Vision Pro & Liquid Frosted Light)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1. Observatory</span>
          </button>

          {/* Theme 2: Cyber-Orbital */}
          <button
            onClick={() => onThemeChange("cyber")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTheme === "cyber"
                ? "bg-slate-900 text-cyan-300 border border-cyan-500/40 shadow-xs"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
            }`}
            title="Variation 2: Cyber-Orbital (Linear & Raycast Precision Dark)"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>2. Cyber</span>
          </button>

          {/* Theme 3: Editorial Quartz */}
          <button
            onClick={() => onThemeChange("editorial")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTheme === "editorial"
                ? "bg-[#78350f] text-amber-50 shadow-xs shadow-amber-900/30"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
            }`}
            title="Variation 3: Editorial Quartz (Stripe Press & Intellectual Folio)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>3. Editorial</span>
          </button>

          {/* Theme 4: Aerospace HUD */}
          <button
            onClick={() => onThemeChange("hud")}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              currentTheme === "hud"
                ? "bg-[#051120] text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                : "text-slate-700 hover:text-slate-950 hover:bg-white/60"
            }`}
            title="Variation 4: Aerospace HUD (SpaceX Dragon & Interstellar Telemetry)"
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>4. HUD</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={() => copyUrl(currentTheme)}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors ml-0.5"
            title="Copy URL for current design variation"
          >
            {copiedTheme === currentTheme ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Minimize button */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
            title="Minimize Design Toolbar"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-xl border border-white/90 shadow-lg text-xs font-semibold text-slate-800 hover:bg-white transition-all active:scale-95"
          title="Expand Design Variations"
        >
          {getThemeIcon(currentTheme)}
          <span>{activeThemeConfig.name}</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      )}
    </div>
  );
};
