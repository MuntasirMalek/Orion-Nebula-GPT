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
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  language?: string;
  code: string;
}

const CodeBlockComponent: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const cleanLang = (language || "text").toLowerCase().replace(/^language-/, "");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy code to clipboard:", err);
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
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white transition-colors duration-150 active:scale-95 text-[11px] font-medium"
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

      {/* Code Body */}
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

      {/* Code Bottom Bar (for multi-line code snippets) */}
      {code.includes("\n") && (
        <div className="flex items-center justify-between px-4 py-2 bg-[#1e293b]/90 border-t border-slate-700/60 text-xs">
          <span className="text-[11px] font-mono text-slate-400">
            {code.split("\n").length} lines • {cleanLang}
          </span>
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
      )}
    </div>
  );
};

export const CodeBlock = React.memo<CodeBlockProps>(
  CodeBlockComponent,
  (prev, next) => prev.code === next.code && prev.language === next.language
);
