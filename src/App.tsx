import { useState, useEffect } from "react";
import { useChat } from "./hooks/useChat";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { SettingsModal } from "./components/SettingsModal";
import { WallpaperBackground } from "./components/WallpaperBackground";
import { THEMES, ThemeId } from "./themes";
import { ThemeStudioToolbar } from "./components/ThemeStudioToolbar";

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

  // Theme selection state with URL query param support (?theme=observatory|cyber|editorial|hud)
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get("theme") as ThemeId;
      if (themeParam && THEMES[themeParam]) {
        return themeParam;
      }
    }
    return "observatory";
  });

  const handleThemeChange = (newTheme: ThemeId) => {
    setCurrentTheme(newTheme);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("theme", newTheme);
      window.history.replaceState({}, "", url.toString());
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const themeParam = params.get("theme") as ThemeId;
      if (themeParam && THEMES[themeParam]) {
        setCurrentTheme(themeParam);
      }
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

  const activeThemeConfig = THEMES[currentTheme] || THEMES.observatory;

  return (
    <div className={`relative flex h-screen h-[100dvh] w-screen overflow-hidden ${activeThemeConfig.rootClass} selection:bg-cyan-500/25 selection:text-cyan-950 transition-colors duration-300`}>
      {/* Orion Nebula 4K Optical Background (Option 1: Balanced Center) */}
      <WallpaperBackground />

      {/* Theme specific ambient scrim */}
      <div className={`pointer-events-none fixed inset-0 -z-10 transition-colors duration-500 ${activeThemeConfig.bgOverlay}`} />

      {/* Theme Switcher Toolbar */}
      <ThemeStudioToolbar
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
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
          currentModelId={currentSession.model || settings.selectedModel || "gpt-6-astra"}
          onSelectModel={changeModel}
          onSendMessage={sendMessage}
          onStopStreaming={stopStreaming}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
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
