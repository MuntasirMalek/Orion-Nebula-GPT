import React, { useState } from "react";
import { ChatSession } from "../types";
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
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent | React.FormEvent) => {
    e.stopPropagation();
    onRenameSession(id, editTitle);
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container with Translucent Frosted Glass */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col bg-white/40 backdrop-blur-2xl transition-all duration-300 ease-in-out shadow-2xl md:shadow-none overflow-hidden ${
          isOpen
            ? "w-72 lg:w-80 translate-x-0 border-r border-white/30 opacity-100"
            : "w-0 -translate-x-full md:translate-x-0 border-r-0 pointer-events-none opacity-0"
        }`}
      >
        <div className="w-72 lg:w-80 flex flex-col h-full shrink-0">
          {/* Top Header */}
          <div className="flex items-center justify-between px-4 h-14 md:h-16 border-b border-white/30 bg-white/20">
          <div className="flex items-center gap-2.5">
            <AstraLogo size={24} />
            <div>
              <span className="text-sm font-bold tracking-wide text-slate-900 drop-shadow-xs">Orion Nebula GPT</span>
              <span className="block text-[10px] text-cyan-900 font-mono font-semibold">Frontier Intelligence</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-white/40 transition-colors md:flex hidden"
            title="Collapse Sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-950 hover:bg-white/40 transition-colors md:hidden"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 768) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/70 hover:bg-white/90 border border-white/80 hover:border-cyan-400 text-slate-900 font-semibold text-xs tracking-wide transition-all duration-200 shadow-md active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 text-cyan-700" />
            <span>New Chat Session</span>
          </button>
        </div>

        {/* Search Chats */}
        {sessions.length > 3 && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/60 border border-white/70 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-cyan-600 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 py-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700">
            Recent Conversations ({sessions.length})
          </div>

          {filteredSessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-600">
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
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
                    isActive
                      ? "bg-white/85 text-slate-950 font-bold border border-cyan-500/50 shadow-md"
                      : "text-slate-800 hover:text-slate-950 hover:bg-white/50 border border-transparent font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? "text-cyan-700" : "text-slate-600 group-hover:text-slate-800"
                      }`}
                    />

                    {isEditing ? (
                      <form
                        onSubmit={(e) => handleSaveRename(session.id, e)}
                        className="flex items-center gap-1 flex-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          autoFocus
                          className="bg-white border border-cyan-500 rounded px-1.5 py-0.5 text-xs text-slate-900 focus:outline-none w-full"
                        />
                        <button
                          type="submit"
                          className="p-1 text-emerald-600 hover:text-emerald-700"
                          title="Save"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelRename}
                          className="p-1 text-slate-600 hover:text-slate-800"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </form>
                    ) : (
                      <span className="truncate">{session.title}</span>
                    )}
                  </div>

                  {/* Actions on hover/active */}
                  {!isEditing && (
                    <div
                      className={`flex items-center gap-1 shrink-0 ${
                        isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      } transition-opacity`}
                    >
                      <button
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1 rounded text-slate-600 hover:text-cyan-800 hover:bg-white/60"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                        className="p-1 rounded text-slate-600 hover:text-rose-600 hover:bg-white/60"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Utility Controls */}
        {sessions.length > 1 && (
          <div className="p-3 border-t border-white/30 bg-white/15 pb-safe">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to delete all saved conversations?")) {
                  onClearAll();
                }
              }}
              className="w-full text-center py-1 text-[10px] text-slate-700 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
            >
              Clear all chat history
            </button>
          </div>
        )}
      </div>
      </aside>
    </>
  );
};
