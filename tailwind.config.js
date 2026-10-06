/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        astra: {
          bg: "#05070e",
          card: "rgba(11, 15, 29, 0.65)",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(34, 211, 238, 0.3)",
          accent: "#06b6d4",
          accentPurple: "#8b5cf6",
          accentGlow: "rgba(6, 182, 212, 0.15)",
          muted: "#94a3b8",
          dark: "#080c18",
          surface: "rgba(18, 24, 43, 0.7)",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "'Fira Code'",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.35)",
        "glow-purple": "0 0 25px -5px rgba(139, 92, 246, 0.35)",
        "glow-subtle": "0 0 40px -10px rgba(56, 189, 248, 0.15)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "cosmic-spin": "spin 20s linear infinite",
        "aurora": "aurora 15s ease infinite alternate",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -20px) scale(1.05)" },
          "100%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
      },
    },
  },
  plugins: [],
};
