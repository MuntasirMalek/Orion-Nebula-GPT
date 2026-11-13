import React from "react";

interface LockIconProps {
  className?: string;
}

export const LockIcon: React.FC<LockIconProps> = ({ className = "w-3.5 h-3.5" }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Thick arched shackle */}
      <path
        d="M7.75 10.5V7.75C7.75 5.40279 9.65279 3.5 12 3.5C14.3472 3.5 16.25 5.40279 16.25 7.75V10.5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="butt"
      />
      {/* Solid padlock body with hollow keyhole cutout */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.7 10H18.3C19.515 10 20.5 10.985 20.5 12.2V19.8C20.5 21.015 19.515 22 18.3 22H5.7C4.485 22 3.5 21.015 3.5 19.8V12.2C3.5 10.985 4.485 10 5.7 10ZM11.05 16.145A1.9 1.9 0 1 1 12.95 16.145V19.3H11.05V16.145Z"
        fill="currentColor"
      />
    </svg>
  );
};
