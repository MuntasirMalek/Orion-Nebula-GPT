import React from "react";

interface ModelNameLabelProps {
  name: string;
  iconClassName?: string;
  className?: string;
  shortOnMobile?: boolean;
}

export function getShortModelName(name: string): string {
  // 1. If has parentheses like "Claude Opus 5.5 (Low Thinking)", extract base name
  const match = name.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    return match[1];
  }

  // 2. Models without parentheses: compact labels for mobile pills
  if (name.includes("DeepSeek V4.1 Flash") || name.includes("DeepSeek 4.1")) return "DeepSeek 4.1";
  if (name.includes("DeepSeek V4 Flash") || name.includes("DeepSeek 4.0")) return "DeepSeek V4";
  if (name.includes("GLM-5.3 Flash") || name.includes("GLM 5.3")) return "GLM 5.3";
  if (name.includes("Nemotron 3.5 Super VL") || name.includes("Nemotron 3.5")) return "Nemotron 3.5";
  if (name.includes("Qwen 3.8 Omni Flash")) return "Qwen Omni";
  if (name.includes("Qwen 3.8 Max")) return "Qwen Max";
  if (name.includes("Mistral Large 4")) return "Mistral 4";
  if (name.includes("Claude 4.5 Sonnet")) return "Claude 4.5";
  if (name.includes("GPT-6.1 Sol")) return "GPT-6.1";
  if (name.includes("Claude Opus 5.5")) return "Opus 5.5";
  return name;
}

export const ModelNameLabel: React.FC<ModelNameLabelProps> = ({
  name,
  className = "",
  shortOnMobile = false,
}) => {
  const match = name.match(/^(.*?)\s*\((.*?)\)$/);
  if (match) {
    const baseName = match[1];
    const bracketContent = match[2];

    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <span>{baseName}</span>
        <span
          className={`opacity-75 font-normal whitespace-nowrap text-[0.9em] ${
            shortOnMobile ? "hidden sm:inline" : ""
          }`}
        >
          ({bracketContent})
        </span>
      </span>
    );
  }

  if (shortOnMobile) {
    const shortName = getShortModelName(name);
    if (shortName !== name) {
      return (
        <span className={className}>
          <span className="sm:hidden">{shortName}</span>
          <span className="hidden sm:inline">{name}</span>
        </span>
      );
    }
  }

  return <span className={className}>{name}</span>;
};
