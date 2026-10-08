import { useState, useEffect } from "react";
import { useChat } from "./hooks/useChat";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { SettingsModal } from "./components/SettingsModal";
import { WallpaperBackground } from "./components/WallpaperBackground";
import { THEMES, ThemeId, RESOLVE_THEME_ID } from "./themes";
import { DEFAULT_MODEL_ID } from "./config";

export default function App() {
  const {
    sessions,
    currentSession,
    currentSessionId,
    settings,
    setSettings,
    isStreaming,
    sendMessage,
    stopStreaming,
    createNewSession,
    switchSession,
    deleteSession,
    renameSession,
    clearAllSessions,
    changeModel,
  } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Theme selection state with URL query param support (?theme=1..20 or name)
  // Default is set to Stripe Press Folio (User's chosen favorite!)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTheme = params.get("theme");
      if (urlTheme) return RESOLVE_THEME_ID(urlTheme);
      const saved = localStorage.getItem("orion_theme_v3");
      if (saved) return RESOLVE_THEME_ID(saved);
    }
    return "stripe_press";
  });

  // Cosmic Motion & Supernova click animation toggle
  const [motionEnabled] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("orion_motion_enabled");
      if (saved !== null) return saved === "true";
    }
    return true; // Enabled by default for rich visual interactivity
  });

  // Extra variation: Adaptive Canvas Framing
  const [adaptiveFraming, setAdaptiveFraming] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const framingParam = params.get("framing");
      if (framingParam === "adaptive") return true;
      if (framingParam === "full") return false;
      const saved = localStorage.getItem("orion_adaptive_framing");
      if (saved !== null) return saved === "true";
    }
    return false; // Full bleed wallpaper across entire screen
  });

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setCurrentTheme(RESOLVE_THEME_ID(params.get("theme")));
      const framingParam = params.get("framing");
      if (framingParam === "adaptive") setAdaptiveFraming(true);
      if (framingParam === "full") setAdaptiveFraming(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);


  // Auto-open sidebar on wide desktop screens
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    checkWidth();
  }, []);

  const activeThemeConfig = THEMES[currentTheme] || THEMES.stripe_press;

  return (
    <div
      className={`relative flex h-screen h-[100dvh] w-screen overflow-hidden ${activeThemeConfig.rootClass} selection:bg-lime-500/25 selection:text-lime-950 transition-colors duration-300`}
    >
      {/* Dynamic Background with Interactive Nebula Motion, Starfield & Supernova Explosions */}
      <WallpaperBackground
        isSidebarOpen={isSidebarOpen}
        adaptiveFraming={adaptiveFraming}
        theme={activeThemeConfig}
        motionEnabled={motionEnabled}
      />

      {/* Translucent Glass Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={switchSession}
        onNewSession={createNewSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        onClearAll={clearAllSessions}
        theme={activeThemeConfig}
      />

      {/* Main Chat Interface */}
      <main className="relative z-10 flex flex-1 flex-col h-full w-full max-w-full min-w-0 overflow-hidden bg-transparent">
        <ChatInterface
          messages={currentSession.messages}
          isStreaming={isStreaming}
          currentModelId={currentSession.model || settings.selectedModel || DEFAULT_MODEL_ID}
          onSelectModel={changeModel}
          reasoningEffort={settings.reasoningEffort || "medium"}
          onSelectReasoningEffort={(effort) =>
            setSettings((prev) => ({ ...prev, reasoningEffort: effort }))
          }
          onSendMessage={sendMessage}
          onStopStreaming={stopStreaming}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          sendKeyMode={settings.sendKeyMode || "enter"}
          theme={activeThemeConfig}
        />
      </main>

      {/* Configuration Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={setSettings}
      />
    </div>
  );
}
