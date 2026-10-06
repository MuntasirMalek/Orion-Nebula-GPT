import React from "react";
import { Brain } from "lucide-react";

interface ModelNameLabelProps {
  name: string;
  iconClassName?: string;
  className?: string;
}

export const ModelNameLabel: React.FC<ModelNameLabelProps> = ({
  name,
  iconClassName,
  className = "",
}) => {
  const match = name.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const baseName = match[1];
    const bracketContent = match[2];

    const isClaude = name.toLowerCase().includes("claude");
    const isDeepSeek = name.toLowerCase().includes("deepseek");
    const autoColor = isClaude
      ? "text-amber-600 dark:text-amber-400"
      : isDeepSeek
      ? "text-blue-600 dark:text-blue-400"
      : "text-emerald-600 dark:text-emerald-400";

    const resolvedIconClass = iconClassName || `w-3 h-3 ${autoColor} shrink-0 inline -mt-0.5`;

    return (
      <span className={className}>
        <span>{baseName}</span>{" "}
        <span className="inline-flex items-center opacity-90 font-medium whitespace-nowrap">
          (<Brain className={`${resolvedIconClass} mx-0.5`} />{bracketContent})
        </span>
      </span>
    );
  }
  return <span className={className}>{name}</span>;
};
