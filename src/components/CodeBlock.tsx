import React, { useState, useMemo } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-go";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-docker";
import { Check, Copy, Terminal, Download, Play, Code as CodeIcon } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

const CodeBlockComponent: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const cleanLang = (language || "text").toLowerCase().replace(/^language-/, "");
  const isPreviewable = cleanLang === "html" || cleanLang === "svg";

  // Auto-detect filename from top comment or fallback to sensible file extension
  const detectedFilename = useMemo(() => {
    const firstFewLines = code.split("\n").slice(0, 4).join("\n");
    const match = firstFewLines.match(/(?:\/\/|#|\/\*|<!--)\s*(?:filepath|filename):\s*([a-zA-Z0-9_\-./\\]+)/i);
    if (match && match[1]) {
      const parsed = match[1].trim().split("/").pop()?.split("\\").pop();
      if (parsed) return parsed;
    }

    const extMap: Record<string, string> = {
      typescript: "snippet.ts",
      ts: "snippet.ts",
      tsx: "Component.tsx",
      jsx: "Component.jsx",
      javascript: "script.js",
      js: "script.js",
      python: "script.py",
      py: "script.py",
      html: "index.html",
      css: "styles.css",
      json: "data.json",
      sql: "query.sql",
      bash: "script.sh",
      sh: "script.sh",
      rust: "main.rs",
      rs: "main.rs",
      go: "main.go",
      diff: "changes.diff",
      yaml: "config.yaml",
      yml: "config.yaml",
      text: "notes.txt",
      txt: "notes.txt",
    };
    return extMap[cleanLang] || `code.${cleanLang || "txt"}`;
  }, [code, cleanLang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy code to clipboard:", err);
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = detectedFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("Failed to download file:", err);
    }
  };

  const highlightedHtml = useMemo(() => {
    try {
      const grammar = Prism.languages[cleanLang] || Prism.languages.text;
      if (grammar) {
        return Prism.highlight(code, grammar, cleanLang);
      }
    } catch {
      // Fallback
    }
    return null;
  }, [code, cleanLang]);

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-slate-700/60 bg-[#0f172a] shadow-lg group">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b]/90 border-b border-slate-700/60 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-mono">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="uppercase tracking-wider font-semibold text-[11px] text-cyan-300">
            {cleanLang}
          </span>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            ({detectedFilename})
          </span>
        </div>

        {/* Live Preview Toggle for HTML / SVG snippets */}
        {isPreviewable && (
          <div className="flex items-center gap-1 bg-black/40 rounded-lg p-0.5 border border-slate-700/60">
            <button
              type="button"
              onClick={() => setIsPreviewMode(false)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                !isPreviewMode
                  ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CodeIcon className="w-3 h-3" />
              Code
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewMode(true)}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors flex items-center gap-1 ${
                isPreviewMode
                  ? "bg-emerald-500/20 text-emerald-300 font-semibold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              Live Preview
            </button>
          </div>
        )}
      </div>

      {/* Code Body or Live Preview */}
      {isPreviewMode && isPreviewable ? (
        <div className="p-3 bg-white border-b border-slate-700/60">
          <iframe
            srcDoc={code}
            sandbox="allow-scripts allow-modals"
            title="Interactive Live Preview"
            className="w-full min-h-[280px] border border-slate-200 rounded-lg bg-white"
          />
        </div>
      ) : (
        <div className="p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
          {highlightedHtml ? (
            <pre
              className="!bg-transparent !p-0 !m-0 font-mono text-slate-200"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          ) : (
            <pre className="!bg-transparent !p-0 !m-0 font-mono text-slate-200 whitespace-pre">
              {code}
            </pre>
          )}
        </div>
      )}

      {/* Code Bottom Bar: Stats, Download File & Copy Code */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b]/90 border-t border-slate-700/60 text-xs">
        <span className="text-[11px] font-mono text-slate-400">
          {code.split("\n").length} {code.split("\n").length === 1 ? "line" : "lines"} • {cleanLang}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Download File Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors duration-150 active:scale-95 text-[11px] font-medium cursor-pointer"
            title={`Download as ${detectedFilename}`}
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[120px]">{detectedFilename}</span>
          </button>

          {/* Copy Code Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors duration-150 active:scale-95 text-[11px] font-medium cursor-pointer"
            title="Copy code to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy code</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CodeBlock = React.memo<CodeBlockProps>(
  CodeBlockComponent,
  (prev, next) => prev.code === next.code && prev.language === next.language
);
