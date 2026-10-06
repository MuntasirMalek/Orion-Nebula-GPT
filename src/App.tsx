import { useState, useEffect } from "react";
import { useChat } from "./hooks/useChat";
import { Sidebar } from "./components/Sidebar";
import { ChatInterface } from "./components/ChatInterface";
import { SettingsModal } from "./components/SettingsModal";
import { WallpaperBackground } from "./components/WallpaperBackground";

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

  return (
    <div className="relative flex h-screen h-[100dvh] w-screen overflow-hidden text-slate-900 font-sans selection:bg-cyan-500/25 selection:text-cyan-950">
      {/* Orion Nebula 4K Optical Background (Option 1: Balanced Center) */}
      <WallpaperBackground />

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
