import React, { useState } from "react";
import { ChatSession } from "../types";
import { ThemeConfig } from "../themes";
import { AstraLogo } from "./AstraLogo";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  PanelLeftClose,
  Search,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onClearAll: () => void;
  onExport?: (format: "markdown" | "json") => void;
  onOpenSettings?: () => void;
  theme?: ThemeConfig;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  sessions,
  currentSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onClearAll,
  theme,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const containerClass = theme ? theme.sidebar.container : "bg-white/40 backdrop-blur-2xl border-r border-white/30";
  const headerClass = theme ? theme.sidebar.header : "border-b border-white/30 bg-white/20";
  const brandClass = theme ? theme.sidebar.brandText : "text-sm font-bold tracking-wide text-slate-900";
  const subClass = theme ? theme.sidebar.subText : "text-xs font-semibold text-cyan-900";
  const newChatClass = theme ? theme.sidebar.newChatBtn : "bg-white/70 hover:bg-white/90 border border-white/80 text-slate-900 font-semibold text-xs";
  const activeClass = theme ? theme.sidebar.sessionItemActive : "bg-white/90 border border-white/95 text-slate-950 font-semibold";
  const inactiveClass = theme ? theme.sidebar.sessionItemInactive : "text-slate-700 hover:text-slate-950 hover:bg-white/40 font-medium";
  const footerClass = theme ? theme.sidebar.footer : "border-t border-white/30 bg-white/20 text-xs text-slate-600";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out shadow-2xl md:shadow-none overflow-hidden ${containerClass} ${
          isOpen
            ? "w-72 lg:w-80 translate-x-0 opacity-100"
            : "w-0 -translate-x-full md:translate-x-0 border-r-0 pointer-events-none opacity-0"
        }`}
      >
        <div className="w-72 lg:w-80 flex flex-col h-full shrink-0">
          {/* Top Header */}
          <div className={`flex items-center justify-between px-4 h-14 md:h-16 ${headerClass}`}>
            <div className="flex items-center gap-2.5">
              <AstraLogo size={24} />
              <div>
                <span className={brandClass}>Orion Nebula GPT</span>
                <span className={`block ${subClass}`}>Frontier Intelligence</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/40 transition-colors md:flex hidden"
              title="Collapse Sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-white/40 transition-colors md:hidden"
              title="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <div className="p-3">
            <button
              onClick={() => {
                onNewSession();
                if (window.innerWidth < 768) onClose();
              }}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] ${newChatClass}`}
            >
              <Plus className="w-4 h-4 text-cyan-600" />
              <span>New Conversation</span>
            </button>
          </div>

          {/* Search Chats */}
          {sessions.length > 3 && (
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 opacity-50" />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/40 dark:bg-slate-900/40 border border-white/50 dark:border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
            <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider opacity-60">
              Recent Conversations ({sessions.length})
            </div>

            {filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-xs opacity-60">
                {searchQuery ? "No matching chats found." : "No saved chats yet."}
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isActive = session.id === currentSessionId;
                const isEditing = editingId === session.id;

                return (
                  <div
                    key={session.id}
                    onClick={() => {
                      onSelectSession(session.id);
                      if (window.innerWidth < 768) onClose();
                    }}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                      isActive ? activeClass : inactiveClass
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <MessageSquare className="w-3.5 h-3.5 shrink-0 opacity-60" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveRename(session.id, e as any);
                            if (e.key === "Escape") handleCancelRename(e as any);
                          }}
                          autoFocus
                          className="bg-white dark:bg-slate-900 border border-cyan-400 rounded px-1.5 py-0.5 text-xs focus:outline-none flex-1 min-w-0"
                        />
                      ) : (
                        <span className="truncate">{session.title}</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={(e) => handleSaveRename(session.id, e)}
                            className="p-1 hover:text-emerald-500 rounded"
                            title="Save"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="p-1 hover:text-rose-500 rounded"
                            title="Cancel"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => handleStartRename(session, e)}
                            className="p-1 hover:opacity-100 rounded"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession(session.id);
                            }}
                            className="p-1 hover:text-rose-500 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className={`p-3 flex items-center justify-between ${footerClass}`}>
            <span className="text-xs opacity-75">
              Zero-Server Client History
            </span>
            {sessions.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-rose-500 hover:text-rose-600 transition-colors"
                title="Clear all stored sessions"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
