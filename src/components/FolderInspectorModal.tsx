import React, { useEffect, useMemo, useState } from "react";
import { Check, FileCode, FolderCode, Search, X } from "lucide-react";
import { AttachedDocument } from "../types";
import { formatBytes } from "../utils/fileAttachment";
import { FolderAttachmentDraft } from "../utils/folderAttachment";

interface FolderInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft?: FolderAttachmentDraft | null;
  document?: AttachedDocument | null;
  onToggleFile?: (path: string) => void;
  onSetAllFiles?: (included: boolean) => void;
  onRemoveFolder?: () => void;
}

interface DisplayRow {
  path: string;
  size: number;
  lineCount?: number;
  pageCount?: number;
  truncated?: boolean;
  included: boolean;
  budgetOmitted?: boolean;
}

export const FolderInspectorModal: React.FC<FolderInspectorModalProps> = ({
  isOpen,
  onClose,
  draft,
  document,
  onToggleFile,
  onSetAllFiles,
  onRemoveFolder,
}) => {
  const [query, setQuery] = useState("");
  const isEditable = Boolean(draft && onToggleFile);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const activeDoc = draft?.document || document;

  const rows: DisplayRow[] = useMemo(() => {
    if (draft) {
      return draft.entries.map((entry) => ({
        path: entry.path,
        size: entry.size,
        lineCount: entry.lineCount,
        pageCount: entry.pageCount,
        truncated: entry.truncated,
        included: entry.included,
        budgetOmitted: entry.budgetOmitted,
      }));
    }
    if (document?.folderFiles) {
      return document.folderFiles.map((f) => ({
        path: f.path,
        size: f.size,
        lineCount: f.lineCount,
        pageCount: f.pageCount,
        truncated: f.truncated,
        included: true,
      }));
    }
    return [];
  }, [draft, document]);

  const filteredRows = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return rows;
    return rows.filter((row) => row.path.toLowerCase().includes(trimmed));
  }, [rows, query]);

  if (!isOpen || !activeDoc) return null;

  const selectableCount = rows.filter((r) => !r.budgetOmitted).length;
  const includedCount = rows.filter((r) => r.included).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-700 shrink-0">
              <FolderCode className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">
                {activeDoc.name}/
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                {activeDoc.fileCount ?? includedCount} {(activeDoc.fileCount ?? includedCount) === 1 ? "file" : "files"}
                {activeDoc.lineCount ? ` · ${activeDoc.lineCount.toLocaleString()} lines` : ""}
                {activeDoc.size ? ` · ${formatBytes(activeDoc.size)}` : ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
            title="Close folder preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auto-skipped notice (node_modules, .git, lockfiles, binaries, etc.) */}
        {activeDoc.skippedSummary && activeDoc.skippedSummary.length > 0 && (
          <div className="px-4 sm:px-6 py-2.5 bg-amber-50/70 border-b border-amber-100 text-[11px] text-amber-900 shrink-0">
            <span className="font-semibold">Auto-excluded:</span>{" "}
            {activeDoc.skippedSummary.join(", ")}
          </div>
        )}

        {/* Filter & Bulk Controls */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2 shrink-0 bg-white">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter files by relative path..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {isEditable && onSetAllFiles && selectableCount > 0 && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSetAllFiles(true)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-cyan-50 text-cyan-800 hover:bg-cyan-100 border border-cyan-200/80 transition-colors cursor-pointer"
              >
                Select all ({selectableCount})
              </button>
              <button
                type="button"
                onClick={() => onSetAllFiles(false)}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200 transition-colors cursor-pointer"
              >
                None
              </button>
            </div>
          )}
        </div>

        {/* File Path List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 px-2 sm:px-4 py-1.5">
          {filteredRows.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-400">
              No files match &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredRows.map((row) => {
              const disabledRow = Boolean(row.budgetOmitted);
              return (
                <div
                  key={row.path}
                  onClick={() => {
                    if (isEditable && !disabledRow && onToggleFile) {
                      onToggleFile(row.path);
                    }
                  }}
                  className={`flex items-center justify-between gap-3 px-2.5 py-2 rounded-xl transition-colors ${
                    isEditable && !disabledRow ? "cursor-pointer hover:bg-slate-50" : ""
                  } ${disabledRow ? "opacity-55" : ""}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isEditable && (
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          row.included
                            ? "bg-cyan-600 border-cyan-600 text-white"
                            : "bg-white border-slate-300 text-transparent"
                        }`}
                      >
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </div>
                    )}
                    <FileCode className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span
                      className={`text-xs font-mono truncate ${
                        row.included ? "text-slate-800" : "text-slate-400 line-through"
                      }`}
                      title={row.path}
                    >
                      {row.path}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-[10px] text-slate-500">
                    {row.budgetOmitted && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold">
                        context limit
                      </span>
                    )}
                    {row.truncated && (
                      <span className="px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 font-semibold">
                        truncated
                      </span>
                    )}
                    {row.pageCount ? (
                      <span>{row.pageCount}p</span>
                    ) : row.lineCount !== undefined ? (
                      <span>{row.lineCount} lines</span>
                    ) : null}
                    <span>· {formatBytes(row.size)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-2 shrink-0">
          <div>
            {isEditable && onRemoveFolder && (
              <button
                type="button"
                onClick={() => {
                  onRemoveFolder();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer"
              >
                Remove folder
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
