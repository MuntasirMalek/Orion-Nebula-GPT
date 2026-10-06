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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Theme selection state with URL query param support (?theme=1..10 or name)
  // Default is permanently set to Variation 10: Raycast Pearl
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      return RESOLVE_THEME_ID(params.get("theme"));
    }
    return "raycast_pearl";
  });

  // Extra variation: Adaptive Canvas Framing
  // When ON: Wallpaper fills the chat workspace when the sidebar is open, and auto-expands to full screen when sidebar is hidden
  const [adaptiveFraming, setAdaptiveFraming] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const framingParam = params.get("framing");
      if (framingParam === "adaptive") return true;
      if (framingParam === "full") return false;
      const saved = localStorage.getItem("orion_adaptive_framing");
      if (saved !== null) return saved === "true";
    }
    return true; // Default to Adaptive Framing so wallpaper fills chat screen when sidebar is on
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

  const activeThemeConfig = THEMES[currentTheme] || THEMES.raycast_pearl;

  return (
    <div className={`relative flex h-screen h-[100dvh] w-screen overflow-hidden ${activeThemeConfig.rootClass} selection:bg-indigo-500/25 selection:text-indigo-950 transition-colors duration-300`}>
      {/* Orion Nebula 4K Optical Background (with Adaptive Framing & Crisp Optical Contrast) */}
      <WallpaperBackground
        isSidebarOpen={isSidebarOpen}
        adaptiveFraming={adaptiveFraming}
      />

      {/* Translucent Glass Sidebar - True Edge-to-Edge Continuity */}
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
      <main className="relative z-10 flex flex-1 flex-col h-full min-w-0 bg-transparent">
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
