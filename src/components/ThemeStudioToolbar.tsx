import React, { useState } from "react";
import { ThemeId, THEMES } from "../themes";
import {
  Sparkles,
  BookOpen,
  Feather,
  Grid,
  Layers,
  Compass,
  Newspaper,
  Gem,
  Scroll,
  Terminal,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface ThemeStudioToolbarProps {
  currentTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
  adaptiveFraming: boolean;
  onToggleAdaptiveFraming: () => void;
}

const THEME_ICONS: Record<ThemeId, React.ReactNode> = {
  stripe_press: <BookOpen className="w-3.5 h-3.5 text-amber-800" />,
  nordic_alabaster: <Feather className="w-3.5 h-3.5 text-slate-600" />,
  swiss_modern: <Grid className="w-3.5 h-3.5 text-red-600" />,
  kyoto_paper: <Compass className="w-3.5 h-3.5 text-emerald-800" />,
  vision_glass: <Sparkles className="w-3.5 h-3.5 text-sky-600" />,
  bauhaus_ceramic: <Layers className="w-3.5 h-3.5 text-blue-600" />,
  monocle_dispatch: <Newspaper className="w-3.5 h-3.5 text-emerald-900" />,
  prism_opaline: <Gem className="w-3.5 h-3.5 text-violet-600" />,
  archival_vellum: <Scroll className="w-3.5 h-3.5 text-amber-900" />,
  raycast_pearl: <Terminal className="w-3.5 h-3.5 text-indigo-600" />,
};

const THEME_LIST = Object.values(THEMES);

export const ThemeStudioToolbar: React.FC<ThemeStudioToolbarProps> = ({
  currentTheme,
  onThemeChange,
  adaptiveFraming,
  onToggleAdaptiveFraming,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyUrl = (themeId: ThemeId, themeIndex: number) => {
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set("theme", themeIndex.toString());
    if (adaptiveFraming) {
      url.searchParams.set("framing", "adaptive");
    }
    navigator.clipboard.writeText(url.toString());
    setCopiedKey(themeId);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const activeThemeConfig = THEMES[currentTheme] || THEMES.raycast_pearl;

  return (
    <div className="fixed top-2.5 right-14 sm:right-16 z-40 flex items-center">
      {isOpen ? (
        <div className="flex flex-col bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl shadow-slate-900/15 rounded-2xl p-1.5 max-w-[94vw] sm:max-w-none transition-all duration-200">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-1.5 px-2 border-b border-slate-200/80 text-xs gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-[11px] text-slate-800 uppercase tracking-wider">
                Theme Studio
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium text-[11px] hidden sm:inline">
                Permanent: <strong className="text-indigo-600">{activeThemeConfig.index}. {activeThemeConfig.name}</strong>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Extra Variation Toggle: Adaptive Canvas Screen Framing */}
              <button
                onClick={onToggleAdaptiveFraming}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                  adaptiveFraming
                    ? "bg-indigo-600 text-white font-bold shadow-xs hover:bg-indigo-700"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                }`}
                title={
                  adaptiveFraming
                    ? "Adaptive Mode ACTIVE: Wallpaper fills chat workspace when sidebar is open, and auto-expands to full screen when sidebar is hidden."
                    : "Full Window Mode: Wallpaper spans the entire browser behind both sidebar and chat."
                }
              >
                {adaptiveFraming ? (
                  <Minimize2 className="w-3 h-3" />
                ) : (
                  <Maximize2 className="w-3 h-3" />
                )}
                <span>Adaptive Screen: {adaptiveFraming ? "ON" : "OFF"}</span>
              </button>

              {/* Copy URL */}
              <button
                onClick={() => copyUrl(currentTheme, activeThemeConfig.index)}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Copy shareable URL"
              >
                {copiedKey === currentTheme ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied URL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              {/* Minimize button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-0.5"
                title="Minimize toolbar"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Number Pills Row */}
          <div className="flex items-center gap-1 pt-1.5 overflow-x-auto no-scrollbar py-0.5 px-0.5">
            {THEME_LIST.map((th) => {
              const isSelected = currentTheme === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => onThemeChange(th.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                  }`}
                  title={`${th.index}. ${th.name} — ${th.tagline}`}
                >
                  <span className="font-mono text-[11px] opacity-80">{th.index}.</span>
                  <span>{th.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-slate-200 shadow-lg text-xs font-semibold text-slate-800 hover:bg-white transition-all active:scale-95"
          title="Open Theme Studio"
        >
          {THEME_ICONS[currentTheme]}
          <span>Variation {activeThemeConfig.index}: {activeThemeConfig.name}</span>
          <span className="text-indigo-600 text-[10px] font-mono bg-indigo-50 px-1.5 py-0.5 rounded">
            {adaptiveFraming ? "Adaptive" : "Full"}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      )}
    </div>
  );
};
