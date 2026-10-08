import React from "react";

interface ModelNameLabelProps {
  name: string;
  iconClassName?: string;
  className?: string;
  shortOnMobile?: boolean;
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
  return <span className={className}>{name}</span>;
};
