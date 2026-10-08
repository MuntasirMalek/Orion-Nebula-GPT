export type ThemeId =
  | "citrus_lime"        // 1. ⚡ Citrus Lime (User Favorite from Screenshot 1 & 5)
  | "seafoam_teal"       // 2. 🌊 Seafoam Teal (From Screenshot 2 & 3)
  | "warm_sage"          // 3. 🌿 Warm Sage (From Screenshot 3 & 4)
  | "matcha_mint"        // 4. 🍃 Matcha Mint (From Screenshot 3 & 4)
  | "emerald_light"      // 5. ☀️ Emerald Light (From Screenshot 2 & 3)
  | "hubble_classic"     // 6. 🌌 Hubble Optical Classic (Pristine 100% Hubble Mosaic)
  | "rose_nebula"        // 7. 🌸 M42 Ionized Core (Hydrogen-Alpha Magenta Glow)
  | "trapezium_diamond"  // 8. 💎 Trapezium Starlight Core (Brilliant Diamond Stars)
  | "amber_dust"         // 9. 🪐 Stellar Amber Dust (Cosmic Gold Filaments)
  | "ultraviolet_o3"     // 10. 🔮 Ultraviolet O-III (Deep Cosmic Amethyst)
  | "stripe_press"       // 11. 📖 Stripe Press Folio (Literary Serif Publishing)
  | "kyoto_washi"        // 12. 📜 Kyoto Washi (Handmade Paper & Sumi Ink)
  | "nordic_alabaster"   // 13. 🏛️ Nordic Alabaster (Copenhagen Minimalist Gallery)
  | "swiss_modernist"    // 14. 📐 Swiss Modernist (1958 Zurich Brutalist Pop)
  | "espresso_starlight" // 15. ☕ Espresso & Starlight (Warm Coffee Studio)
  | "cyber_neon"         // 16. ⚡ Cyber Neon Lime (Matrix HUD Monospace)
  | "nasa_telemetry"     // 17. 🛰️ NASA Mission Control (Telemetry Crosshairs)
  | "raycast_pearl"      // 18. 🪞 Raycast Pearl Glass (Cupertino Liquid Glass Dock)
  | "subzero_pulsar"     // 19. ❄️ Sub-Zero Glacial Ice (Cryogenic Sapphire)
  | "supernova_ignite";  // 20. 🔥 Supernova Ignite (Molten Solar Plasma Flare)

export interface ThemeConfig {
  id: ThemeId;
  index: number;
  name: string;
  emoji: string;
  tagline: string;
  category: "Fresh Pastel & Organic" | "Orion Deep Cosmic" | "Editorial & Archival" | "Aerospace & Cyber";
  badge: string;
  isDark?: boolean;
  
  bgGradient: string;
  canvasColors: string[];
  rootClass: string;
  bgOverlay?: string;
  
  header: {
    container: string;
    brandText: string;
    subText: string;
    button: string;
    badge: string;
  };

  sidebar: {
    container: string;
    header: string;
    brandText: string;
    subText: string;
    newChatBtn: string;
    sessionItemActive: string;
    sessionItemInactive: string;
    footer: string;
  };

  message: {
    userContainer: string;
    assistantContainer: string;
    userAvatar: string;
    assistantAvatar: string;
    authorTextUser: string;
    authorTextAssistant: string;
    badge: string;
    timestamp: string;
    bodyTextUser: string;
    bodyTextAssistant: string;
    copyButton: string;
    cornerBrackets?: boolean;
    entryNumberPrefix?: string;
  };

  input: {
    container: string;
    wrapper: string;
    textarea: string;
    modelPill: string;
    modelPillActive: string;
    sendButton: string;
    stopButton: string;
    keyboardHint: string;
  };
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  // =========================================================================
  // FAMILY 1: FRESH PASTEL & ORGANIC (INSPIRED BY USER SCREENSHOTS)
  // =========================================================================

  // 1. ⚡ CITRUS LIME (User's #1 Favorite from Screenshot 1 & 5)
  citrus_lime: {
    id: "citrus_lime",
    index: 1,
    name: "Citrus Lime",
    emoji: "⚡",
    tagline: "Vibrant Lemon-Lime Aura & Spring Meadow Energy",
    category: "Fresh Pastel & Organic",
    badge: "Citrus Lime",
    isDark: false,
    bgGradient: "from-[#f4fde6] via-[#e8fcd2] to-[#ddf9bd]",
    canvasColors: ["#84cc16", "#bef264", "#22c55e", "#ffffff"],
    rootClass: "theme-citrus-lime text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#ecfccb]/95 backdrop-blur-2xl border-b-2 border-[#bef264] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#14532d] font-sans",
      subText: "text-xs font-mono font-bold text-[#166534] tracking-wider",
      button: "p-2 rounded-xl text-[#166534] hover:text-[#14532d] hover:bg-[#d9f99d] transition-colors",
      badge: "text-xs font-mono font-bold text-[#14532d] bg-[#d9f99d] border border-[#bef264] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f7fee7]/95 backdrop-blur-3xl border-r-2 border-[#bef264] shadow-xl",
      header: "border-b-2 border-[#bef264] bg-[#ecfccb]/80",
      brandText: "text-sm font-bold tracking-tight text-[#14532d] font-sans",
      subText: "text-xs font-mono text-[#166534] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#15803d] hover:bg-[#166534] border border-[#14532d] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#84cc16] text-[#14532d] shadow-sm font-bold border-l-4 border-l-[#15803d] rounded-xl",
      sessionItemInactive: "text-[#2d5032] hover:text-[#14532d] hover:bg-[#ecfccb]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#bef264] bg-[#ecfccb]/80 text-xs text-[#166534] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#ecfccb]/95 backdrop-blur-2xl border-2 border-[#bef264] text-[#14532d] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#84cc16] text-[#143217] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#15803d]",
      userAvatar: "w-8 h-8 rounded-full bg-[#d9f99d] border border-[#bef264] flex items-center justify-center text-[#15803d] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#15803d] border border-[#14532d] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#15803d] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#166534] font-bold",
      badge: "text-xs font-mono font-bold text-[#14532d] bg-[#d9f99d] border border-[#bef264] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#4d7c0f]",
      bodyTextUser: "text-sm leading-relaxed text-[#143217] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#143217]",
      copyButton: "text-[#15803d] hover:text-[#14532d] hover:bg-[#d9f99d] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#84cc16] shadow-lg focus-within:border-[#15803d] focus-within:ring-2 focus-within:ring-[#84cc16]/30 transition-all",
      textarea: "text-sm text-[#143217] placeholder-[#65a30d]/60 font-sans",
      modelPill: "text-xs font-mono text-[#15803d] bg-[#f7fee7] hover:bg-[#ecfccb] border border-[#bef264] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#14532d] bg-[#d9f99d] border border-[#84cc16] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#15803d] hover:bg-[#166534] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#4d7c0f] tracking-wider",
    },
  },

  // 2. 🌊 SEAFOAM TEAL (From Screenshot 2 & 3)
  seafoam_teal: {
    id: "seafoam_teal",
    index: 2,
    name: "Seafoam Teal",
    emoji: "🌊",
    tagline: "Cool Aquamarine Lagoon & Oceanic Ether",
    category: "Fresh Pastel & Organic",
    badge: "Seafoam Teal",
    isDark: false,
    bgGradient: "from-[#f0fdfa] via-[#ccfbf1] to-[#99f6e4]",
    canvasColors: ["#14b8a6", "#5eead4", "#0284c7", "#ffffff"],
    rootClass: "theme-seafoam-teal text-slate-900",
    bgOverlay: "",
    header: {
      container: "bg-[#ccfbf1]/95 backdrop-blur-2xl border-b-2 border-[#5eead4] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#115e59] font-sans",
      subText: "text-xs font-mono font-bold text-[#0d9488] tracking-wider",
      button: "p-2 rounded-xl text-[#0d9488] hover:text-[#115e59] hover:bg-[#99f6e4] transition-colors",
      badge: "text-xs font-mono font-bold text-[#115e59] bg-[#99f6e4] border border-[#5eead4] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f0fdfa]/95 backdrop-blur-3xl border-r-2 border-[#5eead4] shadow-xl",
      header: "border-b-2 border-[#5eead4] bg-[#ccfbf1]/80",
      brandText: "text-sm font-bold tracking-tight text-[#115e59] font-sans",
      subText: "text-xs font-mono text-[#0d9488] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#0d9488] hover:bg-[#0f766e] border border-[#115e59] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#14b8a6] text-[#115e59] shadow-sm font-bold border-l-4 border-l-[#0d9488] rounded-xl",
      sessionItemInactive: "text-[#134e4a] hover:text-[#042f2e] hover:bg-[#ccfbf1]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#5eead4] bg-[#ccfbf1]/80 text-xs text-[#0d9488] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#ccfbf1]/95 backdrop-blur-2xl border-2 border-[#5eead4] text-[#042f2e] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#14b8a6] text-[#042f2e] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#0d9488]",
      userAvatar: "w-8 h-8 rounded-full bg-[#99f6e4] border border-[#5eead4] flex items-center justify-center text-[#0d9488] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#0d9488] border border-[#115e59] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#0d9488] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#115e59] font-bold",
      badge: "text-xs font-mono font-bold text-[#115e59] bg-[#99f6e4] border border-[#5eead4] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#0f766e]",
      bodyTextUser: "text-sm leading-relaxed text-[#042f2e] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#042f2e]",
      copyButton: "text-[#0d9488] hover:text-[#115e59] hover:bg-[#99f6e4] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#14b8a6] shadow-lg focus-within:border-[#0d9488] focus-within:ring-2 focus-within:ring-[#14b8a6]/30 transition-all",
      textarea: "text-sm text-[#042f2e] placeholder-[#0d9488]/60 font-sans",
      modelPill: "text-xs font-mono text-[#0d9488] bg-[#f0fdfa] hover:bg-[#ccfbf1] border border-[#5eead4] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#115e59] bg-[#99f6e4] border border-[#14b8a6] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#0d9488] hover:bg-[#0f766e] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#0f766e] tracking-wider",
    },
  },

  // 3. 🌿 WARM SAGE (From Screenshot 3 & 4)
  warm_sage: {
    id: "warm_sage",
    index: 3,
    name: "Warm Sage",
    emoji: "🌿",
    tagline: "Calming Herbal Botanicals & Earthy Mineral Serenity",
    category: "Fresh Pastel & Organic",
    badge: "Warm Sage",
    isDark: false,
    bgGradient: "from-[#f4f7f4] via-[#e3eae1] to-[#cbd8c7]",
    canvasColors: ["#52796f", "#84a98c", "#2f3e46", "#ffffff"],
    rootClass: "theme-warm-sage text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#e3eae1]/95 backdrop-blur-2xl border-b-2 border-[#cbd8c7] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#2d4030] font-sans",
      subText: "text-xs font-mono font-bold text-[#354f52] tracking-wider",
      button: "p-2 rounded-xl text-[#354f52] hover:text-[#2d4030] hover:bg-[#cbd8c7] transition-colors",
      badge: "text-xs font-mono font-bold text-[#2d4030] bg-[#cbd8c7] border border-[#a3b18a] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f4f7f4]/95 backdrop-blur-3xl border-r-2 border-[#cbd8c7] shadow-xl",
      header: "border-b-2 border-[#cbd8c7] bg-[#e3eae1]/80",
      brandText: "text-sm font-bold tracking-tight text-[#2d4030] font-sans",
      subText: "text-xs font-mono text-[#354f52] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#2d4030] hover:bg-[#1e2b20] border border-[#1e2b20] text-[#f4f7f4] font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#52796f] text-[#2d4030] shadow-sm font-bold border-l-4 border-l-[#2d4030] rounded-xl",
      sessionItemInactive: "text-[#354f52] hover:text-[#1e2b20] hover:bg-[#e3eae1]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#cbd8c7] bg-[#e3eae1]/80 text-xs text-[#354f52] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#e3eae1]/95 backdrop-blur-2xl border-2 border-[#cbd8c7] text-[#1e2b20] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#52796f] text-[#1e2b20] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#2d4030]",
      userAvatar: "w-8 h-8 rounded-full bg-[#cbd8c7] border border-[#a3b18a] flex items-center justify-center text-[#2d4030] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#2d4030] border border-[#1e2b20] flex items-center justify-center shadow-xs text-[#f4f7f4] font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#2d4030] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#354f52] font-bold",
      badge: "text-xs font-mono font-bold text-[#2d4030] bg-[#cbd8c7] border border-[#a3b18a] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#52796f]",
      bodyTextUser: "text-sm leading-relaxed text-[#1e2b20] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#1e2b20]",
      copyButton: "text-[#354f52] hover:text-[#2d4030] hover:bg-[#cbd8c7] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#52796f] shadow-lg focus-within:border-[#2d4030] focus-within:ring-2 focus-within:ring-[#52796f]/30 transition-all",
      textarea: "text-sm text-[#1e2b20] placeholder-[#52796f]/60 font-sans",
      modelPill: "text-xs font-mono text-[#354f52] bg-[#f4f7f4] hover:bg-[#e3eae1] border border-[#cbd8c7] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#2d4030] bg-[#cbd8c7] border border-[#52796f] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#2d4030] hover:bg-[#1e2b20] text-[#f4f7f4] font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#52796f] tracking-wider",
    },
  },

  // 4. 🍃 MATCHA MINT (From Screenshot 3 & 4)
  matcha_mint: {
    id: "matcha_mint",
    index: 4,
    name: "Matcha Mint",
    emoji: "🍃",
    tagline: "Ceremonial Uji Matcha & Crisp Spearmint Dew",
    category: "Fresh Pastel & Organic",
    badge: "Matcha Mint",
    isDark: false,
    bgGradient: "from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]",
    canvasColors: ["#22c55e", "#86efac", "#15803d", "#ffffff"],
    rootClass: "theme-matcha-mint text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#dcfce7]/95 backdrop-blur-2xl border-b-2 border-[#86efac] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#14532d] font-sans",
      subText: "text-xs font-mono font-bold text-[#166534] tracking-wider",
      button: "p-2 rounded-xl text-[#166534] hover:text-[#14532d] hover:bg-[#bbf7d0] transition-colors",
      badge: "text-xs font-mono font-bold text-[#14532d] bg-[#bbf7d0] border border-[#86efac] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f0fdf4]/95 backdrop-blur-3xl border-r-2 border-[#86efac] shadow-xl",
      header: "border-b-2 border-[#86efac] bg-[#dcfce7]/80",
      brandText: "text-sm font-bold tracking-tight text-[#14532d] font-sans",
      subText: "text-xs font-mono text-[#166534] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#166534] hover:bg-[#14532d] border border-[#14532d] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#22c55e] text-[#14532d] shadow-sm font-bold border-l-4 border-l-[#166534] rounded-xl",
      sessionItemInactive: "text-[#166534] hover:text-[#14532d] hover:bg-[#dcfce7]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#86efac] bg-[#dcfce7]/80 text-xs text-[#166534] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#dcfce7]/95 backdrop-blur-2xl border-2 border-[#86efac] text-[#14532d] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#22c55e] text-[#14532d] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#166534]",
      userAvatar: "w-8 h-8 rounded-full bg-[#bbf7d0] border border-[#86efac] flex items-center justify-center text-[#166534] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#166534] border border-[#14532d] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#166534] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#14532d] font-bold",
      badge: "text-xs font-mono font-bold text-[#14532d] bg-[#bbf7d0] border border-[#86efac] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#15803d]",
      bodyTextUser: "text-sm leading-relaxed text-[#14532d] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#14532d]",
      copyButton: "text-[#166534] hover:text-[#14532d] hover:bg-[#bbf7d0] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#22c55e] shadow-lg focus-within:border-[#166534] focus-within:ring-2 focus-within:ring-[#22c55e]/30 transition-all",
      textarea: "text-sm text-[#14532d] placeholder-[#166534]/60 font-sans",
      modelPill: "text-xs font-mono text-[#166534] bg-[#f0fdf4] hover:bg-[#dcfce7] border border-[#86efac] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#14532d] bg-[#bbf7d0] border border-[#22c55e] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#166534] hover:bg-[#14532d] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#15803d] tracking-wider",
    },
  },

  // 5. ☀️ EMERALD LIGHT (From Screenshot 2 & 3)
  emerald_light: {
    id: "emerald_light",
    index: 5,
    name: "Emerald Light",
    emoji: "☀️",
    tagline: "Sunlit Radiant Foliage & Vivid Emerald Bloom",
    category: "Fresh Pastel & Organic",
    badge: "Emerald Light",
    isDark: false,
    bgGradient: "from-[#ecfdf5] via-[#d1fae5] to-[#a7f3d0]",
    canvasColors: ["#10b981", "#6ee7b7", "#059669", "#ffffff"],
    rootClass: "theme-emerald-light text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#d1fae5]/95 backdrop-blur-2xl border-b-2 border-[#6ee7b7] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#065f46] font-sans",
      subText: "text-xs font-mono font-bold text-[#047857] tracking-wider",
      button: "p-2 rounded-xl text-[#047857] hover:text-[#065f46] hover:bg-[#a7f3d0] transition-colors",
      badge: "text-xs font-mono font-bold text-[#065f46] bg-[#a7f3d0] border border-[#6ee7b7] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#ecfdf5]/95 backdrop-blur-3xl border-r-2 border-[#6ee7b7] shadow-xl",
      header: "border-b-2 border-[#6ee7b7] bg-[#d1fae5]/80",
      brandText: "text-sm font-bold tracking-tight text-[#065f46] font-sans",
      subText: "text-xs font-mono text-[#047857] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#059669] hover:bg-[#047857] border border-[#065f46] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#10b981] text-[#065f46] shadow-sm font-bold border-l-4 border-l-[#059669] rounded-xl",
      sessionItemInactive: "text-[#047857] hover:text-[#065f46] hover:bg-[#d1fae5]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#6ee7b7] bg-[#d1fae5]/80 text-xs text-[#047857] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#d1fae5]/95 backdrop-blur-2xl border-2 border-[#6ee7b7] text-[#065f46] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#10b981] text-[#064e3b] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#059669]",
      userAvatar: "w-8 h-8 rounded-full bg-[#a7f3d0] border border-[#6ee7b7] flex items-center justify-center text-[#059669] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#059669] border border-[#065f46] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#059669] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#065f46] font-bold",
      badge: "text-xs font-mono font-bold text-[#065f46] bg-[#a7f3d0] border border-[#6ee7b7] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#047857]",
      bodyTextUser: "text-sm leading-relaxed text-[#064e3b] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#064e3b]",
      copyButton: "text-[#047857] hover:text-[#065f46] hover:bg-[#a7f3d0] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#10b981] shadow-lg focus-within:border-[#059669] focus-within:ring-2 focus-within:ring-[#10b981]/30 transition-all",
      textarea: "text-sm text-[#064e3b] placeholder-[#059669]/60 font-sans",
      modelPill: "text-xs font-mono text-[#059669] bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#6ee7b7] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#065f46] bg-[#a7f3d0] border border-[#10b981] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#059669] hover:bg-[#047857] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#047857] tracking-wider",
    },
  },

  // =========================================================================
  // FAMILY 2: ORION DEEP COSMIC & HUBBLE NATURAL (HONORING REAL NEBULA PHOTO)
  // =========================================================================

  // 6. 🌌 HUBBLE OPTICAL CLASSIC (Pristine 100% Hubble Mosaic Heritage)
  hubble_classic: {
    id: "hubble_classic",
    index: 6,
    name: "Hubble Classic",
    emoji: "🌌",
    tagline: "Pristine 4K Optical Mosaic Heritage in Deep Space Obsidian",
    category: "Orion Deep Cosmic",
    badge: "Hubble Heritage",
    isDark: true,
    bgGradient: "from-black via-slate-950 to-black",
    canvasColors: ["#38bdf8", "#818cf8", "#f472b6", "#ffffff"],
    rootClass: "theme-hubble-classic text-slate-100",
    bgOverlay: "bg-black/25",
    header: {
      container: "bg-black/70 backdrop-blur-3xl border-b border-white/15 text-white shadow-lg",
      brandText: "text-sm font-bold tracking-tight text-white font-sans",
      subText: "text-xs font-mono font-medium text-cyan-400 tracking-wider",
      button: "p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors",
      badge: "text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-500/50 px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-black/85 backdrop-blur-3xl border-r border-white/15 text-white shadow-2xl",
      header: "border-b border-white/15 bg-white/5",
      brandText: "text-sm font-bold tracking-tight text-white font-sans",
      subText: "text-xs font-mono text-cyan-400 uppercase tracking-wider",
      newChatBtn: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/30 text-white font-bold text-xs tracking-wider shadow-lg rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white/15 border border-cyan-400/50 text-white shadow-md font-semibold border-l-4 border-l-cyan-400 rounded-xl",
      sessionItemInactive: "text-slate-300 hover:text-white hover:bg-white/10 font-medium rounded-xl transition-colors",
      footer: "border-t border-white/15 bg-white/5 text-xs text-slate-400 font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-white/10 backdrop-blur-3xl border border-white/20 text-white shadow-lg rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-black/75 backdrop-blur-3xl border border-white/20 text-slate-100 shadow-2xl rounded-2xl p-4 md:p-5 w-full border-l-4 border-l-cyan-400",
      userAvatar: "w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-cyan-500 border border-cyan-400 flex items-center justify-center shadow-xs text-slate-950 font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-pink-400 font-bold",
      badge: "text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-500/50 px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-slate-400",
      bodyTextUser: "text-sm leading-relaxed text-slate-100 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-100",
      copyButton: "text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-black/80 backdrop-blur-3xl border border-white/25 shadow-2xl focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/25 transition-all",
      textarea: "text-sm text-slate-100 placeholder-slate-400 font-sans",
      modelPill: "text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-white bg-cyan-600/80 border border-cyan-400 rounded-xl px-2.5 py-1.5 uppercase shadow-xs",
      sendButton: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-cyan-500/30",
      stopButton: "bg-rose-600 hover:bg-rose-700 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-slate-400 tracking-wider",
    },
  },

  // 7. 🌸 M42 IONIZED CORE (Hydrogen-Alpha Magenta Glow)
  rose_nebula: {
    id: "rose_nebula",
    index: 7,
    name: "M42 Core Magenta",
    emoji: "🌸",
    tagline: "Glowing Ionized Hydrogen-Alpha Gas & Starbirth Ruby",
    category: "Orion Deep Cosmic",
    badge: "H-Alpha Core",
    isDark: false,
    bgGradient: "from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]",
    canvasColors: ["#f43f5e", "#fb7185", "#fda4af", "#ffffff"],
    rootClass: "theme-rose-nebula text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#ffe4e6]/95 backdrop-blur-2xl border-b-2 border-[#fda4af] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#881337] font-sans",
      subText: "text-xs font-mono font-bold text-[#be123c] tracking-wider",
      button: "p-2 rounded-xl text-[#be123c] hover:text-[#881337] hover:bg-[#fecdd3] transition-colors",
      badge: "text-xs font-mono font-bold text-[#881337] bg-[#fecdd3] border border-[#fda4af] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#fff1f2]/95 backdrop-blur-3xl border-r-2 border-[#fda4af] shadow-xl",
      header: "border-b-2 border-[#fda4af] bg-[#ffe4e6]/80",
      brandText: "text-sm font-bold tracking-tight text-[#881337] font-sans",
      subText: "text-xs font-mono text-[#be123c] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#e11d48] hover:bg-[#be123c] border border-[#9f1239] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#f43f5e] text-[#881337] shadow-sm font-bold border-l-4 border-l-[#e11d48] rounded-xl",
      sessionItemInactive: "text-[#9f1239] hover:text-[#881337] hover:bg-[#ffe4e6]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#fda4af] bg-[#ffe4e6]/80 text-xs text-[#be123c] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#ffe4e6]/95 backdrop-blur-2xl border-2 border-[#fda4af] text-[#881337] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#f43f5e] text-[#4c0519] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#e11d48]",
      userAvatar: "w-8 h-8 rounded-full bg-[#fecdd3] border border-[#fda4af] flex items-center justify-center text-[#e11d48] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#e11d48] border border-[#be123c] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#e11d48] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#881337] font-bold",
      badge: "text-xs font-mono font-bold text-[#881337] bg-[#fecdd3] border border-[#fda4af] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#be123c]",
      bodyTextUser: "text-sm leading-relaxed text-[#4c0519] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#4c0519]",
      copyButton: "text-[#be123c] hover:text-[#881337] hover:bg-[#fecdd3] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#f43f5e] shadow-lg focus-within:border-[#e11d48] focus-within:ring-2 focus-within:ring-[#f43f5e]/30 transition-all",
      textarea: "text-sm text-[#4c0519] placeholder-[#e11d48]/60 font-sans",
      modelPill: "text-xs font-mono text-[#be123c] bg-[#fff1f2] hover:bg-[#ffe4e6] border border-[#fda4af] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#881337] bg-[#fecdd3] border border-[#f43f5e] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#e11d48] hover:bg-[#be123c] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-800 hover:bg-rose-900 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#be123c] tracking-wider",
    },
  },

  // 8. 💎 TRAPEZIUM STARLIGHT CORE (Brilliant Diamond Stars)
  trapezium_diamond: {
    id: "trapezium_diamond",
    index: 8,
    name: "Trapezium Starlight",
    emoji: "💎",
    tagline: "Theta 1 Orionis Central Star Cluster & Crystalline Diamond",
    category: "Orion Deep Cosmic",
    badge: "Trapezium Cluster",
    isDark: false,
    bgGradient: "from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]",
    canvasColors: ["#0284c7", "#38bdf8", "#7dd3fc", "#ffffff"],
    rootClass: "theme-trapezium-diamond text-slate-900",
    bgOverlay: "",
    header: {
      container: "bg-[#e0f2fe]/95 backdrop-blur-2xl border-b-2 border-[#7dd3fc] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#0369a1] font-sans",
      subText: "text-xs font-mono font-bold text-[#0284c7] tracking-wider",
      button: "p-2 rounded-xl text-[#0284c7] hover:text-[#0369a1] hover:bg-[#bae6fd] transition-colors",
      badge: "text-xs font-mono font-bold text-[#0369a1] bg-[#bae6fd] border border-[#7dd3fc] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f0f9ff]/95 backdrop-blur-3xl border-r-2 border-[#7dd3fc] shadow-xl",
      header: "border-b-2 border-[#7dd3fc] bg-[#e0f2fe]/80",
      brandText: "text-sm font-bold tracking-tight text-[#0369a1] font-sans",
      subText: "text-xs font-mono text-[#0284c7] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#0284c7] hover:bg-[#0369a1] border border-[#075985] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#0ea5e9] text-[#0369a1] shadow-sm font-bold border-l-4 border-l-[#0284c7] rounded-xl",
      sessionItemInactive: "text-[#075985] hover:text-[#0369a1] hover:bg-[#e0f2fe]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#7dd3fc] bg-[#e0f2fe]/80 text-xs text-[#0284c7] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#e0f2fe]/95 backdrop-blur-2xl border-2 border-[#7dd3fc] text-[#082f49] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#0ea5e9] text-[#082f49] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#0284c7]",
      userAvatar: "w-8 h-8 rounded-full bg-[#bae6fd] border border-[#7dd3fc] flex items-center justify-center text-[#0284c7] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#0284c7] border border-[#0369a1] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#0284c7] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#0369a1] font-bold",
      badge: "text-xs font-mono font-bold text-[#0369a1] bg-[#bae6fd] border border-[#7dd3fc] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#0284c7]",
      bodyTextUser: "text-sm leading-relaxed text-[#082f49] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#082f49]",
      copyButton: "text-[#0284c7] hover:text-[#0369a1] hover:bg-[#bae6fd] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#0ea5e9] shadow-lg focus-within:border-[#0284c7] focus-within:ring-2 focus-within:ring-[#0ea5e9]/30 transition-all",
      textarea: "text-sm text-[#082f49] placeholder-[#0284c7]/60 font-sans",
      modelPill: "text-xs font-mono text-[#0284c7] bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#7dd3fc] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#0369a1] bg-[#bae6fd] border border-[#0ea5e9] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#0284c7] tracking-wider",
    },
  },

  // 9. 🪐 STELLAR AMBER DUST (Interstellar Terracotta Dust Lanes)
  amber_dust: {
    id: "amber_dust",
    index: 9,
    name: "Stellar Amber Dust",
    emoji: "🪐",
    tagline: "Warm Cosmic Dust Lanes & Golden Infrared Filaments",
    category: "Orion Deep Cosmic",
    badge: "Amber Dust",
    isDark: false,
    bgGradient: "from-[#fffbeb] via-[#fef3c7] to-[#fde68a]",
    canvasColors: ["#d97706", "#f59e0b", "#fbbf24", "#ffffff"],
    rootClass: "theme-amber-dust text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#fef3c7]/95 backdrop-blur-2xl border-b-2 border-[#fcd34d] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#78350f] font-sans",
      subText: "text-xs font-mono font-bold text-[#b45309] tracking-wider",
      button: "p-2 rounded-xl text-[#b45309] hover:text-[#78350f] hover:bg-[#fde68a] transition-colors",
      badge: "text-xs font-mono font-bold text-[#78350f] bg-[#fde68a] border border-[#fcd34d] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#fffbeb]/95 backdrop-blur-3xl border-r-2 border-[#fcd34d] shadow-xl",
      header: "border-b-2 border-[#fcd34d] bg-[#fef3c7]/80",
      brandText: "text-sm font-bold tracking-tight text-[#78350f] font-sans",
      subText: "text-xs font-mono text-[#b45309] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#d97706] hover:bg-[#b45309] border border-[#92400e] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#f59e0b] text-[#78350f] shadow-sm font-bold border-l-4 border-l-[#d97706] rounded-xl",
      sessionItemInactive: "text-[#92400e] hover:text-[#78350f] hover:bg-[#fef3c7]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#fcd34d] bg-[#fef3c7]/80 text-xs text-[#b45309] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#fef3c7]/95 backdrop-blur-2xl border-2 border-[#fcd34d] text-[#451a03] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#f59e0b] text-[#451a03] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#d97706]",
      userAvatar: "w-8 h-8 rounded-full bg-[#fde68a] border border-[#fcd34d] flex items-center justify-center text-[#d97706] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#d97706] border border-[#b45309] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#d97706] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#78350f] font-bold",
      badge: "text-xs font-mono font-bold text-[#78350f] bg-[#fde68a] border border-[#fcd34d] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#b45309]",
      bodyTextUser: "text-sm leading-relaxed text-[#451a03] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#451a03]",
      copyButton: "text-[#b45309] hover:text-[#78350f] hover:bg-[#fde68a] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#f59e0b] shadow-lg focus-within:border-[#d97706] focus-within:ring-2 focus-within:ring-[#f59e0b]/30 transition-all",
      textarea: "text-sm text-[#451a03] placeholder-[#d97706]/60 font-sans",
      modelPill: "text-xs font-mono text-[#b45309] bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#fcd34d] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#78350f] bg-[#fde68a] border border-[#f59e0b] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#d97706] hover:bg-[#b45309] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#b45309] tracking-wider",
    },
  },

  // 10. 🔮 ULTRAVIOLET O-III (Deep Space Amethyst Ether)
  ultraviolet_o3: {
    id: "ultraviolet_o3",
    index: 10,
    name: "Ultraviolet O-III",
    emoji: "🔮",
    tagline: "Ionized Oxygen-III Radiation & Deep Space Amethyst",
    category: "Orion Deep Cosmic",
    badge: "O-III Ionized",
    isDark: true,
    bgGradient: "from-[#0a0512] via-[#120924] to-[#0a0512]",
    canvasColors: ["#8b5cf6", "#a78bfa", "#c084fc", "#ffffff"],
    rootClass: "theme-ultraviolet-o3 text-purple-100",
    bgOverlay: "bg-black/35",
    header: {
      container: "bg-[#0f0919]/80 backdrop-blur-3xl border-b border-[#7c3aed]/30 text-purple-200 shadow-lg",
      brandText: "text-sm font-bold tracking-tight text-white font-sans",
      subText: "text-xs font-mono font-medium text-purple-400 tracking-wider",
      button: "p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-900/30 transition-colors",
      badge: "text-xs font-mono font-bold text-purple-200 bg-purple-950/80 border border-purple-500/50 px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#130b20]/90 backdrop-blur-3xl border-r border-[#7c3aed]/30 text-purple-200 shadow-2xl",
      header: "border-b border-[#7c3aed]/30 bg-purple-950/20",
      brandText: "text-sm font-bold tracking-tight text-white font-sans",
      subText: "text-xs font-mono text-purple-400 uppercase tracking-wider",
      newChatBtn: "bg-[#7c3aed] hover:bg-[#6d28d9] border border-[#5b21b6] text-white font-bold text-xs tracking-wider shadow-lg shadow-purple-900/40 rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-[#24143d] border border-[#a78bfa] text-purple-100 shadow-sm font-semibold border-l-4 border-l-[#a78bfa] rounded-xl",
      sessionItemInactive: "text-purple-300 hover:text-white hover:bg-purple-900/30 font-medium rounded-xl transition-colors",
      footer: "border-t border-[#7c3aed]/30 bg-purple-950/20 text-xs text-purple-400 font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#1b0e30]/80 backdrop-blur-3xl border border-[#7c3aed]/40 text-purple-100 shadow-lg rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-[#130b20]/90 backdrop-blur-3xl border border-[#7c3aed]/40 text-purple-100 shadow-2xl rounded-2xl p-4 md:p-5 w-full border-l-4 border-l-[#a78bfa]",
      userAvatar: "w-8 h-8 rounded-full bg-[#24143d] border border-[#a78bfa]/50 flex items-center justify-center text-purple-300 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#7c3aed] border border-[#6d28d9] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-purple-300 font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#c084fc] font-bold",
      badge: "text-xs font-mono font-bold text-purple-200 bg-purple-950/80 border border-purple-500/50 px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-purple-400",
      bodyTextUser: "text-sm leading-relaxed text-purple-100 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-purple-100",
      copyButton: "text-purple-400 hover:text-white hover:bg-purple-900/30 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-[#130b20]/95 backdrop-blur-3xl border border-[#7c3aed]/40 shadow-2xl focus-within:border-[#a78bfa] focus-within:ring-2 focus-within:ring-[#7c3aed]/30 transition-all",
      textarea: "text-sm text-purple-100 placeholder-purple-400/60 font-sans",
      modelPill: "text-xs font-mono text-purple-300 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/40 rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-white bg-purple-700/80 border border-purple-400 rounded-xl px-2.5 py-1.5 uppercase shadow-xs",
      sendButton: "bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-purple-500/30",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-purple-400 tracking-wider",
    },
  },

  // =========================================================================
  // FAMILY 3: EDITORIAL & ARCHIVAL (RICH TYPOGRAPHY, PAPER & CRAFT)
  // =========================================================================

  // 11. 📖 STRIPE PRESS FOLIO (Literary Serif Book Publishing)
  stripe_press: {
    id: "stripe_press",
    index: 11,
    name: "Stripe Press Folio",
    emoji: "📖",
    tagline: "Intellectual Book Publishing Folio & Archival Editorial",
    category: "Editorial & Archival",
    badge: "Press Folio",
    isDark: false,
    bgGradient: "from-[#fcfbf9] via-[#f7f5f0] to-[#ece7de]",
    canvasColors: ["#78350f", "#92400e", "#d97706", "#ffffff"],
    rootClass: "theme-stripe-press text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#fcfbf9]/95 backdrop-blur-2xl border-b border-stone-200 text-[#1c1917] shadow-sm",
      brandText: "text-sm font-semibold tracking-tight text-stone-900 font-serif",
      subText: "text-xs font-mono font-medium text-stone-500 tracking-wider",
      button: "p-2 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors",
      badge: "text-xs font-mono font-semibold text-stone-900 bg-white hover:bg-stone-50 border border-stone-200 shadow-sm hover:border-stone-300 px-2.5 py-1.5 rounded-xl uppercase tracking-wider transition-all",
    },
    sidebar: {
      container: "bg-[#faf9f6]/95 backdrop-blur-3xl border-r border-stone-200 text-[#1c1917] shadow-xl",
      header: "border-b border-stone-200 bg-stone-100/60",
      brandText: "text-sm font-bold tracking-tight text-stone-900 font-serif",
      subText: "text-xs font-mono text-stone-500 uppercase tracking-wider",
      newChatBtn: "bg-[#1c1917] hover:bg-black text-[#fafaf9] font-serif font-bold text-xs tracking-wider uppercase shadow-sm rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border border-stone-300 text-stone-950 shadow-sm font-serif font-semibold rounded-xl",
      sessionItemInactive: "text-stone-600 hover:text-stone-950 hover:bg-stone-100/60 font-medium rounded-xl transition-colors",
      footer: "border-t border-stone-200 bg-stone-100/60 text-xs text-stone-500 font-mono tracking-wider uppercase",
    },
    message: {
      userContainer: "bg-white/95 backdrop-blur-2xl border border-stone-200 text-stone-900 shadow-sm rounded-xl p-4 md:p-5",
      assistantContainer: "bg-[#fdfcf9]/95 backdrop-blur-2xl border border-stone-200 text-stone-900 shadow-md rounded-xl p-4 md:p-5 w-full font-serif",
      userAvatar: "w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm",
      assistantAvatar: "w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center shadow-sm text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-stone-600 font-medium",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-stone-900 font-bold",
      badge: "text-xs font-mono text-stone-700 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded tracking-wider uppercase",
      timestamp: "text-xs font-mono text-stone-500",
      bodyTextUser: "text-sm leading-relaxed text-stone-900 font-serif font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-stone-900 font-serif",
      copyButton: "text-stone-500 hover:text-stone-900 hover:bg-stone-100 p-1.5 rounded transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-white backdrop-blur-2xl border-2 border-stone-200 shadow-sm focus-within:border-stone-800 transition-all",
      textarea: "text-sm text-stone-900 placeholder-stone-400 font-serif",
      modelPill: "text-xs font-mono text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-stone-950 bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#1c1917] hover:bg-black text-[#fafaf9] font-serif font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-sm",
      stopButton: "bg-rose-800 hover:bg-rose-900 text-white font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-sm",
      keyboardHint: "text-xs font-mono text-stone-500 tracking-wider",
    },
  },

  // 12. 📜 KYOTO WASHI (Handmade Artisanal Paper & Sumi Ink)
  kyoto_washi: {
    id: "kyoto_washi",
    index: 12,
    name: "Kyoto Washi",
    emoji: "📜",
    tagline: "Handmade Artisanal Paper Texture & Japanese Sumi Ink",
    category: "Editorial & Archival",
    badge: "Washi Scroll",
    isDark: false,
    bgGradient: "from-[#faf6ee] via-[#f5efe4] to-[#ebdcd0]",
    canvasColors: ["#854d0e", "#a16207", "#713f12", "#ffffff"],
    rootClass: "theme-kyoto-washi text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#faf6ee]/95 backdrop-blur-2xl border-b border-[#d6c7b2] text-[#292524] shadow-xs",
      brandText: "text-sm font-serif font-bold tracking-tight text-[#292524]",
      subText: "text-xs font-mono font-bold text-[#78350f] tracking-wider",
      button: "p-2 rounded-xl text-[#78350f] hover:text-[#292524] hover:bg-[#ede3d1] transition-colors",
      badge: "text-xs font-mono font-bold text-[#78350f] bg-[#ede3d1] border border-[#d6c7b2] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f5efe4]/95 backdrop-blur-3xl border-r border-[#d6c7b2] text-[#292524] shadow-xl",
      header: "border-b border-[#d6c7b2] bg-[#ede3d1]/40",
      brandText: "text-sm font-serif font-bold tracking-tight text-[#292524]",
      subText: "text-xs font-mono text-[#78350f] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#1c1917] hover:bg-black border border-black text-[#faf7f2] font-serif font-bold text-xs tracking-wider shadow-sm rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white/95 border-[#c5b59e] text-[#1c1917] shadow-sm font-serif font-semibold border-l-4 border-l-[#854d0e] rounded-xl",
      sessionItemInactive: "text-[#57534e] hover:text-[#292524] hover:bg-[#ede3d1]/50 font-medium rounded-xl transition-colors",
      footer: "border-t border-[#d6c7b2] bg-[#ede3d1]/40 text-xs text-[#78350f] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-white/95 backdrop-blur-2xl border border-[#d6c7b2] text-[#292524] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-[#fcfaf7]/95 backdrop-blur-2xl border border-[#d6c7b2] text-[#292524] shadow-md rounded-2xl p-4 md:p-5 w-full border-l-4 border-l-[#854d0e] font-serif",
      userAvatar: "w-8 h-8 rounded-full bg-[#ede3d1] border border-[#d6c7b2] flex items-center justify-center text-[#292524] shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#1c1917] border border-black flex items-center justify-center shadow-xs text-[#faf7f2] font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#57534e] font-semibold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#78350f] font-bold",
      badge: "text-xs font-mono font-bold text-[#78350f] bg-[#ede3d1] border border-[#d6c7b2] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#a8a29e]",
      bodyTextUser: "text-sm leading-relaxed text-[#292524] font-serif font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#292524] font-serif",
      copyButton: "text-[#78350f] hover:text-[#292524] hover:bg-[#ede3d1] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#d6c7b2] shadow-lg focus-within:border-[#854d0e] focus-within:ring-2 focus-within:ring-[#854d0e]/20 transition-all",
      textarea: "text-sm text-[#292524] placeholder-[#a8a29e] font-serif",
      modelPill: "text-xs font-mono text-[#57534e] bg-[#faf6ee] hover:bg-[#ede3d1] border border-[#d6c7b2] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#292524] bg-[#ede3d1] border border-[#854d0e] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#1c1917] hover:bg-black text-[#faf7f2] font-serif font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-sm",
      stopButton: "bg-rose-800 hover:bg-rose-900 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-sm",
      keyboardHint: "text-xs font-mono text-[#a8a29e] tracking-wider",
    },
  },

  // 13. 🏛️ NORDIC ALABASTER (Copenhagen Minimalist Gallery)
  nordic_alabaster: {
    id: "nordic_alabaster",
    index: 13,
    name: "Nordic Alabaster",
    emoji: "🏛️",
    tagline: "Copenhagen Minimalist Gallery & Chalk Precision",
    category: "Editorial & Archival",
    badge: "Nordic Gallery",
    isDark: false,
    bgGradient: "from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]",
    canvasColors: ["#64748b", "#94a3b8", "#cbd5e1", "#ffffff"],
    rootClass: "theme-nordic-alabaster text-slate-900",
    bgOverlay: "",
    header: {
      container: "bg-[#f8fafc]/95 backdrop-blur-2xl border-b border-slate-200 text-slate-900 shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-slate-900 font-sans",
      subText: "text-xs font-mono font-medium text-slate-600 tracking-widest uppercase",
      button: "p-2 rounded-lg text-slate-600 hover:text-slate-950 hover:bg-slate-200/60 transition-colors",
      badge: "text-xs font-mono font-bold text-slate-800 bg-slate-200 border border-slate-300 px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f1f5f9]/95 backdrop-blur-3xl border-r border-slate-200 text-slate-900 shadow-xl",
      header: "border-b border-slate-200 bg-slate-200/50",
      brandText: "text-sm font-bold tracking-tight text-slate-900 font-sans",
      subText: "text-xs font-mono text-slate-600 uppercase tracking-wider",
      newChatBtn: "bg-[#0f172a] hover:bg-[#1e293b] text-white font-mono font-bold text-xs tracking-wider uppercase shadow-md rounded-lg py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border border-slate-300 text-slate-950 shadow-xs font-semibold border-l-4 border-l-slate-800 rounded-lg",
      sessionItemInactive: "text-slate-600 hover:text-slate-950 hover:bg-slate-200/60 font-medium rounded-lg transition-colors",
      footer: "border-t border-slate-200 bg-slate-200/50 text-xs text-slate-500 font-mono tracking-wider uppercase",
    },
    message: {
      userContainer: "bg-white/95 backdrop-blur-2xl border border-slate-200 text-slate-900 shadow-sm rounded-xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border border-slate-200 text-slate-900 shadow-sm rounded-xl p-4 md:p-5 w-full border-l-4 border-l-slate-800",
      userAvatar: "w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#0f172a] border border-slate-800 flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-slate-600 font-semibold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-slate-900 font-bold",
      badge: "text-xs font-mono font-bold text-slate-800 bg-slate-200 border border-slate-300 px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-slate-400",
      bodyTextUser: "text-sm leading-relaxed text-slate-900 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-900",
      copyButton: "text-slate-500 hover:text-slate-900 hover:bg-slate-200 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-white/95 backdrop-blur-2xl border-2 border-slate-300 shadow-sm focus-within:border-slate-800 transition-all",
      textarea: "text-sm text-slate-900 placeholder-slate-400 font-sans",
      modelPill: "text-xs font-mono text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-slate-950 bg-slate-200 border border-slate-400 rounded-lg px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-slate-400 tracking-wider",
    },
  },

  // 14. 📐 SWISS MODERNIST (1958 Zurich Brutalist Pop)
  swiss_modernist: {
    id: "swiss_modernist",
    index: 14,
    name: "Swiss Modernist",
    emoji: "📐",
    tagline: "1958 Zurich Typographic Brutalism & High-Contrast Tactile Pop",
    category: "Editorial & Archival",
    badge: "Zurich 1958",
    isDark: false,
    bgGradient: "from-white via-[#fafafa] to-[#f4f4f5]",
    canvasColors: ["#ef4444", "#000000", "#dc2626", "#ffffff"],
    rootClass: "theme-swiss-modernist text-black",
    bgOverlay: "",
    header: {
      container: "bg-white border-b-2 border-black text-black shadow-xs",
      brandText: "text-sm font-black tracking-tight text-black font-sans uppercase",
      subText: "text-xs font-mono font-black text-red-600 tracking-wider uppercase",
      button: "p-2 rounded-none text-black hover:bg-black hover:text-white transition-colors border border-black",
      badge: "text-xs font-mono font-black text-white bg-red-600 border border-black px-2.5 py-1 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#fafafa] border-r-2 border-black text-black shadow-xl",
      header: "border-b-2 border-black bg-white",
      brandText: "text-sm font-black tracking-tight text-black font-sans uppercase",
      subText: "text-xs font-mono text-red-600 font-bold uppercase tracking-wider",
      newChatBtn: "bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-widest rounded-none py-2.5 px-3 shadow-[3px_3px_0px_0px_rgba(239,68,68,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all",
      sessionItemActive: "bg-white border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-bold rounded-none border-l-8 border-l-red-600",
      sessionItemInactive: "text-neutral-700 hover:text-black hover:bg-neutral-200 font-bold rounded-none transition-colors",
      footer: "border-t-2 border-black bg-white text-xs text-neutral-600 font-mono tracking-wider uppercase",
    },
    message: {
      userContainer: "bg-white border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none p-4 md:p-5",
      assistantContainer: "bg-white border-2 border-black text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] rounded-none p-4 md:p-5 w-full border-l-8 border-l-red-600",
      userAvatar: "w-8 h-8 rounded-none bg-neutral-200 border-2 border-black flex items-center justify-center text-black font-black",
      assistantAvatar: "w-8 h-8 rounded-none bg-red-600 border-2 border-black flex items-center justify-center text-white font-black",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-black font-black",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-red-600 font-black",
      badge: "text-xs font-mono font-black text-white bg-black border border-black px-2 py-0.5 rounded-none uppercase tracking-wider",
      timestamp: "text-xs font-mono text-neutral-500",
      bodyTextUser: "text-sm leading-relaxed text-black font-medium",
      bodyTextAssistant: "text-sm leading-relaxed text-black font-medium",
      copyButton: "text-black hover:bg-neutral-200 p-1.5 rounded-none border border-black transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-none bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[6px_6px_0px_0px_rgba(239,68,68,1)] transition-all",
      textarea: "text-sm text-black placeholder-neutral-400 font-sans font-medium",
      modelPill: "text-xs font-mono text-black bg-neutral-100 hover:bg-neutral-200 border border-black rounded-none px-2.5 py-1.5 transition-colors uppercase font-bold",
      modelPillActive: "text-xs font-mono font-black text-white bg-black border border-black rounded-none px-2.5 py-1.5 uppercase",
      sendButton: "bg-black hover:bg-neutral-800 text-white font-black p-2.5 rounded-none shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] transition-all active:translate-x-0.5 active:translate-y-0.5",
      stopButton: "bg-red-600 hover:bg-red-700 text-white font-black p-2.5 rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-0.5 active:translate-y-0.5",
      keyboardHint: "text-xs font-mono text-neutral-600 tracking-wider",
    },
  },

  // 15. ☕ ESPRESSO & STARLIGHT (Warm Coffee Studio)
  espresso_starlight: {
    id: "espresso_starlight",
    index: 15,
    name: "Espresso Starlight",
    emoji: "☕",
    tagline: "Dark Roasted Espresso, Oat Milk Foam & Bronze Starlight",
    category: "Editorial & Archival",
    badge: "Espresso Bar",
    isDark: false,
    bgGradient: "from-[#fbf7f4] via-[#f5ede6] to-[#ebdcd0]",
    canvasColors: ["#b45309", "#d97706", "#78350f", "#ffffff"],
    rootClass: "theme-espresso-starlight text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#fbf7f4]/95 backdrop-blur-2xl border-b border-[#e7ded4] text-[#3b2314] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#3b2314] font-sans",
      subText: "text-xs font-mono font-bold text-[#9a3412] tracking-wider",
      button: "p-2 rounded-xl text-[#9a3412] hover:text-[#3b2314] hover:bg-[#ede0d4] transition-colors",
      badge: "text-xs font-mono font-bold text-[#3b2314] bg-[#ebdcd0] border border-[#d5c7b8] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f5ede6]/95 backdrop-blur-3xl border-r border-[#e7ded4] text-[#3b2314] shadow-xl",
      header: "border-b border-[#e7ded4] bg-[#ebdcd0]/40",
      brandText: "text-sm font-bold tracking-tight text-[#3b2314] font-sans",
      subText: "text-xs font-mono text-[#9a3412] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#3b2314] hover:bg-[#2b190d] border border-[#2b190d] text-[#f7f3ee] font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white/95 border border-[#c4b5a5] text-[#3b2314] shadow-sm font-semibold border-l-4 border-l-[#9a3412] rounded-xl",
      sessionItemInactive: "text-[#78350f] hover:text-[#3b2314] hover:bg-[#ebdcd0]/60 font-medium rounded-xl transition-colors",
      footer: "border-t border-[#e7ded4] bg-[#ebdcd0]/40 text-xs text-[#9a3412] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-white/95 backdrop-blur-2xl border border-[#e7ded4] text-[#3b2314] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-[#fcfaf7]/95 backdrop-blur-2xl border border-[#e7ded4] text-[#29170e] rounded-2xl shadow-md p-4 w-full border-l-4 border-l-[#9a3412]",
      userAvatar: "w-8 h-8 rounded-full bg-[#ebdcd0] border border-[#d5c7b8] flex items-center justify-center text-[#3b2314] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#3b2314] border border-[#2b190d] flex items-center justify-center shadow-xs text-[#f7f3ee] font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#9a3412] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#3b2314] font-bold",
      badge: "text-xs font-mono font-bold text-[#3b2314] bg-[#ebdcd0] border border-[#d5c7b8] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#a8a29e]",
      bodyTextUser: "text-sm leading-relaxed text-[#29170e] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#29170e]",
      copyButton: "text-[#9a3412] hover:text-[#3b2314] hover:bg-[#ebdcd0] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#d5c7b8] shadow-lg focus-within:border-[#3b2314] focus-within:ring-2 focus-within:ring-[#3b2314]/20 transition-all",
      textarea: "text-sm text-[#29170e] placeholder-[#a8a29e] font-sans",
      modelPill: "text-xs font-mono text-[#78350f] bg-[#fbf7f4] hover:bg-[#f5ede6] border border-[#e7ded4] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#3b2314] bg-[#ebdcd0] border border-[#9a3412] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#3b2314] hover:bg-[#2b190d] text-[#f7f3ee] font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-800 hover:bg-rose-900 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#a8a29e] tracking-wider",
    },
  },

  // =========================================================================
  // FAMILY 4: AEROSPACE & CYBER HOLOGRAPHIC (HIGH-TECH HUD & DATA READOUTS)
  // =========================================================================

  // 16. ⚡ CYBER NEON LIME (Matrix HUD Data Interface)
  cyber_neon: {
    id: "cyber_neon",
    index: 16,
    name: "Cyber Neon Lime",
    emoji: "⚡",
    tagline: "High-Contrast Cyberpunk Neon Lime & Monospace Reticles",
    category: "Aerospace & Cyber",
    badge: "Matrix HUD",
    isDark: true,
    bgGradient: "from-black via-[#060a02] to-black",
    canvasColors: ["#84cc16", "#a3e635", "#bef264", "#ffffff"],
    rootClass: "theme-cyber-neon text-[#d9f99d]",
    bgOverlay: "bg-black/45",
    header: {
      container: "bg-black/85 backdrop-blur-3xl border-b border-[#84cc16]/40 text-[#84cc16] shadow-lg",
      brandText: "text-sm font-mono font-bold tracking-tight text-[#84cc16] uppercase",
      subText: "text-xs font-mono font-bold text-[#bef264] tracking-widest",
      button: "p-2 rounded-lg text-[#84cc16] hover:bg-[#84cc16]/20 transition-colors border border-[#84cc16]/30",
      badge: "text-xs font-mono font-bold text-black bg-[#84cc16] border border-[#84cc16] px-2.5 py-1 rounded-md shadow-[0_0_10px_rgba(132,204,22,0.5)] uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-black/92 backdrop-blur-3xl border-r border-[#84cc16]/30 text-[#84cc16] shadow-2xl",
      header: "border-b border-[#84cc16]/30 bg-[#84cc16]/10",
      brandText: "text-sm font-mono font-bold tracking-tight text-[#84cc16] uppercase",
      subText: "text-xs font-mono text-[#bef264] uppercase tracking-wider",
      newChatBtn: "bg-[#84cc16] hover:bg-[#65a30d] text-black font-mono font-black text-xs uppercase tracking-wider rounded-lg py-2.5 px-3 shadow-[0_0_15px_rgba(132,204,22,0.4)] active:scale-95 transition-all",
      sessionItemActive: "bg-[#132205] border border-[#84cc16] text-[#bef264] font-mono font-bold rounded-lg shadow-[0_0_10px_rgba(132,204,22,0.2)] border-l-4 border-l-[#84cc16]",
      sessionItemInactive: "text-[#65a30d] hover:text-[#bef264] hover:bg-[#84cc16]/10 font-mono font-medium rounded-lg transition-colors",
      footer: "border-t border-[#84cc16]/30 bg-[#84cc16]/10 text-xs text-[#65a30d] font-mono tracking-wider uppercase",
    },
    message: {
      userContainer: "bg-[#0b1404]/90 backdrop-blur-3xl border border-[#84cc16]/40 text-[#bef264] shadow-xl rounded-xl p-4 md:p-5 font-mono",
      assistantContainer: "bg-[#060a02]/95 backdrop-blur-3xl border border-[#84cc16]/40 text-[#d9f99d] rounded-xl shadow-2xl p-4 md:p-5 w-full border-l-4 border-l-[#84cc16] font-mono",
      userAvatar: "w-8 h-8 rounded-lg bg-[#132205] border border-[#84cc16] flex items-center justify-center text-[#84cc16] font-mono font-bold",
      assistantAvatar: "w-8 h-8 rounded-lg bg-[#84cc16] border border-[#a3e635] flex items-center justify-center text-black font-mono font-black",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#84cc16] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#bef264] font-black",
      badge: "text-xs font-mono font-bold text-black bg-[#84cc16] px-2 py-0.5 rounded uppercase tracking-wider shadow-[0_0_8px_rgba(132,204,22,0.4)]",
      timestamp: "text-xs font-mono text-[#65a30d]",
      bodyTextUser: "text-sm leading-relaxed text-[#bef264] font-mono",
      bodyTextAssistant: "text-sm leading-relaxed text-[#d9f99d] font-mono",
      copyButton: "text-[#84cc16] hover:bg-[#84cc16]/20 p-1.5 rounded-lg border border-[#84cc16]/40 transition-colors",
      cornerBrackets: true,
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-[#060a02]/95 backdrop-blur-3xl border-2 border-[#84cc16]/40 shadow-2xl focus-within:border-[#84cc16] focus-within:shadow-[0_0_20px_rgba(132,204,22,0.3)] transition-all",
      textarea: "text-sm text-[#bef264] placeholder-[#65a30d]/60 font-mono",
      modelPill: "text-xs font-mono text-[#84cc16] bg-[#0b1404] hover:bg-[#132205] border border-[#84cc16]/40 rounded-lg px-2.5 py-1.5 transition-colors uppercase font-bold",
      modelPillActive: "text-xs font-mono font-black text-black bg-[#84cc16] border border-[#84cc16] rounded-lg px-2.5 py-1.5 uppercase shadow-[0_0_10px_rgba(132,204,22,0.4)]",
      sendButton: "bg-[#84cc16] hover:bg-[#65a30d] text-black font-mono font-black p-2.5 rounded-lg transition-all active:scale-95 shadow-[0_0_15px_rgba(132,204,22,0.5)]",
      stopButton: "bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#65a30d] tracking-wider",
    },
  },

  // 17. 🛰️ NASA TELEMETRY HUD (Spacecraft Mission Control)
  nasa_telemetry: {
    id: "nasa_telemetry",
    index: 17,
    name: "NASA Telemetry HUD",
    emoji: "🛰️",
    tagline: "Orbital Spacecraft Telemetry & Coordinate Readout HUD",
    category: "Aerospace & Cyber",
    badge: "NASA Telemetry",
    isDark: true,
    bgGradient: "from-[#030712] via-[#080e1a] to-[#030712]",
    canvasColors: ["#38bdf8", "#3b82f6", "#60a5fa", "#ffffff"],
    rootClass: "theme-nasa-telemetry text-sky-100",
    bgOverlay: "bg-black/35",
    header: {
      container: "bg-[#080e1a]/85 backdrop-blur-3xl border-b border-[#1e3a8a]/60 text-sky-400 font-mono shadow-lg",
      brandText: "text-sm font-mono font-bold tracking-tight text-white uppercase",
      subText: "text-xs font-mono font-bold text-sky-400 tracking-widest",
      button: "p-2 rounded-lg text-sky-400 hover:bg-sky-950/40 transition-colors border border-sky-800/50",
      badge: "text-xs font-mono font-bold text-sky-200 bg-[#1e3a8a]/60 border border-[#3b82f6] px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#060a14]/92 backdrop-blur-3xl border-r border-[#1e3a8a]/50 text-sky-400 font-mono shadow-2xl",
      header: "border-b border-[#1e3a8a]/50 bg-sky-950/20",
      brandText: "text-sm font-mono font-bold tracking-tight text-white uppercase",
      subText: "text-xs font-mono text-sky-400 uppercase tracking-wider",
      newChatBtn: "bg-[#1d4ed8] hover:bg-[#1e40af] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md rounded-lg py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-[#0f1d38] border border-[#3b82f6] text-sky-200 font-mono font-semibold rounded-lg border-l-4 border-l-[#3b82f6]",
      sessionItemInactive: "text-sky-400/80 hover:text-white hover:bg-sky-950/40 font-mono font-medium rounded-lg transition-colors",
      footer: "border-t border-[#1e3a8a]/50 bg-sky-950/20 text-xs text-sky-400 font-mono tracking-wider uppercase",
    },
    message: {
      userContainer: "bg-[#0c1527]/90 backdrop-blur-3xl border border-[#1e3a8a]/60 text-sky-100 shadow-xl rounded-lg p-4 md:p-5 font-mono",
      assistantContainer: "bg-[#080e1c]/90 backdrop-blur-3xl border border-[#1e3a8a]/60 text-sky-100 rounded-lg shadow-2xl p-4 md:p-5 w-full border-l-4 border-l-[#3b82f6] font-mono",
      userAvatar: "w-8 h-8 rounded-lg bg-[#0f1d38] border border-[#3b82f6] flex items-center justify-center text-sky-300 font-mono font-bold",
      assistantAvatar: "w-8 h-8 rounded-lg bg-[#1d4ed8] border border-[#3b82f6] flex items-center justify-center text-white font-mono font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-sky-400 font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#60a5fa] font-bold",
      badge: "text-xs font-mono font-bold text-sky-200 bg-[#1e3a8a]/60 border border-[#3b82f6] px-2 py-0.5 rounded uppercase tracking-wider",
      timestamp: "text-xs font-mono text-sky-400/70",
      bodyTextUser: "text-sm leading-relaxed text-sky-100 font-mono",
      bodyTextAssistant: "text-sm leading-relaxed text-sky-100 font-mono",
      copyButton: "text-sky-400 hover:text-white hover:bg-sky-950/40 p-1.5 rounded-lg border border-sky-800/50 transition-colors",
      cornerBrackets: true,
      entryNumberPrefix: "SAT_",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-lg bg-[#080e1c]/95 backdrop-blur-3xl border border-[#1e3a8a]/70 shadow-2xl focus-within:border-[#3b82f6] transition-all",
      textarea: "text-sm text-sky-100 placeholder-sky-400/50 font-mono",
      modelPill: "text-xs font-mono text-sky-300 bg-[#0c1527] hover:bg-[#0f1d38] border border-[#1e3a8a] rounded-md px-2.5 py-1.5 transition-colors uppercase font-bold",
      modelPillActive: "text-xs font-mono font-bold text-white bg-[#1d4ed8] border border-[#3b82f6] rounded-md px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-mono font-bold p-2.5 rounded-md transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-mono font-bold p-2.5 rounded-md transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-sky-400/70 tracking-wider",
    },
  },

  // 18. 🪞 RAYCAST PEARL GLASS (Cupertino Liquid Glass Deck)
  raycast_pearl: {
    id: "raycast_pearl",
    index: 18,
    name: "Raycast Pearl Glass",
    emoji: "🪞",
    tagline: "Cupertino Liquid Glassmorphism & Prismatic Pearl Reflection",
    category: "Aerospace & Cyber",
    badge: "Pearl Glass",
    isDark: false,
    bgGradient: "from-white/90 via-slate-50/90 to-indigo-50/80",
    canvasColors: ["#818cf8", "#a855f7", "#38bdf8", "#ffffff"],
    rootClass: "theme-raycast-pearl text-slate-800",
    bgOverlay: "",
    header: {
      container: "bg-white/80 backdrop-blur-3xl border-b border-white/60 text-slate-800 shadow-xs",
      brandText: "text-sm font-semibold tracking-tight text-slate-900 font-sans",
      subText: "text-xs font-mono font-medium text-indigo-600 tracking-wider",
      button: "p-2 rounded-xl text-slate-600 hover:text-slate-950 hover:bg-white/60 transition-colors",
      badge: "text-xs font-mono font-bold text-indigo-950 bg-indigo-100/80 border border-indigo-200/80 px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-white/85 backdrop-blur-3xl border-r border-white/60 text-slate-800 shadow-xl",
      header: "border-b border-white/40 bg-white/40",
      brandText: "text-sm font-bold tracking-tight text-slate-900 font-sans",
      subText: "text-xs font-mono text-indigo-600 uppercase tracking-wider",
      newChatBtn: "bg-slate-900 hover:bg-black text-white font-semibold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white/90 border border-indigo-200 text-indigo-950 shadow-sm font-semibold border-l-4 border-l-indigo-600 rounded-xl",
      sessionItemInactive: "text-slate-700 hover:text-slate-950 hover:bg-white/60 font-medium rounded-xl transition-colors",
      footer: "border-t border-white/40 bg-white/40 text-xs text-slate-600 font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-white/90 backdrop-blur-3xl border border-white/70 text-slate-900 shadow-md rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/90 backdrop-blur-3xl border border-white/80 text-slate-900 shadow-xl rounded-2xl p-4 md:p-5 w-full border-l-4 border-l-indigo-500",
      userAvatar: "w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-indigo-600 border border-indigo-500 flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-indigo-600 font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-indigo-950 font-bold",
      badge: "text-xs font-mono font-bold text-indigo-950 bg-indigo-100/90 border border-indigo-200 px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-slate-400",
      bodyTextUser: "text-sm leading-relaxed text-slate-900 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-900",
      copyButton: "text-slate-500 hover:text-slate-900 hover:bg-white/60 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/90 backdrop-blur-3xl border-2 border-white/90 shadow-2xl focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-300/30 transition-all",
      textarea: "text-sm text-slate-900 placeholder-slate-400 font-sans",
      modelPill: "text-xs font-mono text-indigo-700 bg-white/80 hover:bg-white border border-indigo-100 rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-indigo-950 bg-indigo-100 border border-indigo-300 rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-600 hover:bg-rose-700 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-slate-400 tracking-wider",
    },
  },

  // 19. ❄️ SUB-ZERO PULSAR (Cryogenic Glacial Sapphire)
  subzero_pulsar: {
    id: "subzero_pulsar",
    index: 19,
    name: "Sub-Zero Pulsar",
    emoji: "❄️",
    tagline: "Cryogenic Polar Sapphire & Sub-Zero Diamond Rays",
    category: "Aerospace & Cyber",
    badge: "Sub-Zero Pulsar",
    isDark: false,
    bgGradient: "from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]",
    canvasColors: ["#0284c7", "#38bdf8", "#0369a1", "#ffffff"],
    rootClass: "theme-subzero-pulsar text-sky-950",
    bgOverlay: "",
    header: {
      container: "bg-[#e0f2fe]/95 backdrop-blur-2xl border-b-2 border-[#38bdf8] text-[#0369a1] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#0369a1] font-sans",
      subText: "text-xs font-mono font-bold text-[#0284c7] tracking-wider",
      button: "p-2 rounded-xl text-[#0284c7] hover:text-[#0369a1] hover:bg-[#bae6fd] transition-colors",
      badge: "text-xs font-mono font-bold text-[#0369a1] bg-[#bae6fd] border border-[#38bdf8] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f0f9ff]/95 backdrop-blur-3xl border-r-2 border-[#38bdf8] text-[#0369a1] shadow-xl",
      header: "border-b-2 border-[#38bdf8] bg-[#e0f2fe]/80",
      brandText: "text-sm font-bold tracking-tight text-[#0369a1] font-sans",
      subText: "text-xs font-mono text-[#0284c7] font-bold uppercase tracking-wider",
      newChatBtn: "bg-[#0369a1] hover:bg-[#075985] text-white font-bold text-xs tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#0284c7] text-[#0369a1] shadow-sm font-bold border-l-4 border-l-[#0369a1] rounded-xl",
      sessionItemInactive: "text-[#075985] hover:text-[#0369a1] hover:bg-[#e0f2fe]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#38bdf8] bg-[#e0f2fe]/80 text-xs text-[#0284c7] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#e0f2fe]/95 backdrop-blur-2xl border-2 border-[#38bdf8] text-[#082f49] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#0284c7] text-[#082f49] rounded-2xl shadow-md p-4 w-full border-l-8 border-l-[#0369a1]",
      userAvatar: "w-8 h-8 rounded-full bg-[#bae6fd] border border-[#38bdf8] flex items-center justify-center text-[#0369a1] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#0369a1] border border-[#075985] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#0369a1] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#0284c7] font-bold",
      badge: "text-xs font-mono font-bold text-[#0369a1] bg-[#bae6fd] border border-[#38bdf8] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#0284c7]",
      bodyTextUser: "text-sm leading-relaxed text-[#082f49] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#082f49]",
      copyButton: "text-[#0284c7] hover:text-[#0369a1] hover:bg-[#bae6fd] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#0284c7] shadow-lg focus-within:border-[#0369a1] focus-within:ring-2 focus-within:ring-[#0284c7]/30 transition-all",
      textarea: "text-sm text-[#082f49] placeholder-[#0284c7]/60 font-sans",
      modelPill: "text-xs font-mono text-[#0284c7] bg-[#f0f9ff] hover:bg-[#e0f2fe] border border-[#38bdf8] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-[#0369a1] bg-[#bae6fd] border border-[#0284c7] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-[#0369a1] hover:bg-[#075985] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#0284c7] tracking-wider",
    },
  },

  // 20. 🔥 SUPERNOVA IGNITE (Molten Solar Plasma Flare)
  supernova_ignite: {
    id: "supernova_ignite",
    index: 20,
    name: "Supernova Ignite",
    emoji: "🔥",
    tagline: "Thermonuclear Solar Plasma & Molten Coronal Flare",
    category: "Aerospace & Cyber",
    badge: "Solar Plasma",
    isDark: false,
    bgGradient: "from-[#fffbeb] via-[#fef3c7] to-[#fed7aa]",
    canvasColors: ["#ea580c", "#f97316", "#f59e0b", "#ffffff"],
    rootClass: "theme-supernova-ignite text-stone-900",
    bgOverlay: "",
    header: {
      container: "bg-[#fef3c7]/95 backdrop-blur-2xl border-b-2 border-[#f59e0b] text-[#78350f] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-[#7c2d12] font-sans",
      subText: "text-xs font-mono font-bold text-[#c2410c] tracking-wider",
      button: "p-2 rounded-xl text-[#c2410c] hover:text-[#7c2d12] hover:bg-[#fed7aa] transition-colors",
      badge: "text-xs font-mono font-bold text-white bg-gradient-to-r from-[#ea580c] to-[#d97706] border border-[#c2410c] px-2.5 py-1 rounded-lg shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#fffbeb]/95 backdrop-blur-3xl border-r-2 border-[#f59e0b] text-[#78350f] shadow-xl",
      header: "border-b-2 border-[#f59e0b] bg-[#fef3c7]/80",
      brandText: "text-sm font-bold tracking-tight text-[#7c2d12] font-sans",
      subText: "text-xs font-mono text-[#c2410c] font-bold uppercase tracking-wider",
      newChatBtn: "bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:from-[#c2410c] hover:to-[#b45309] text-white font-bold text-xs uppercase tracking-wider shadow-md rounded-xl py-2.5 px-3 active:scale-95 transition-all",
      sessionItemActive: "bg-white border-2 border-[#ea580c] text-[#7c2d12] shadow-sm font-bold border-l-4 border-l-[#ea580c] rounded-xl",
      sessionItemInactive: "text-[#9a3412] hover:text-[#7c2d12] hover:bg-[#fef3c7]/80 font-medium rounded-xl transition-colors",
      footer: "border-t-2 border-[#f59e0b] bg-[#fef3c7]/80 text-xs text-[#c2410c] font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#fef3c7]/95 backdrop-blur-2xl border-2 border-[#f59e0b] text-[#7c2d12] shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/95 backdrop-blur-2xl border-2 border-[#f97316] text-[#431407] shadow-lg rounded-2xl p-4 md:p-5 w-full border-l-8 border-l-[#ea580c]",
      userAvatar: "w-8 h-8 rounded-full bg-[#fed7aa] border border-[#f59e0b] flex items-center justify-center text-[#ea580c] shadow-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#ea580c] border border-[#c2410c] flex items-center justify-center shadow-xs text-white font-bold",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#ea580c] font-bold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#7c2d12] font-bold",
      badge: "text-xs font-mono font-bold text-white bg-gradient-to-r from-[#ea580c] to-[#d97706] border border-[#c2410c] px-2 py-0.5 rounded-md uppercase tracking-wider",
      timestamp: "text-xs font-mono text-[#c2410c]",
      bodyTextUser: "text-sm leading-relaxed text-[#431407] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#431407]",
      copyButton: "text-[#c2410c] hover:text-[#7c2d12] hover:bg-[#fed7aa] p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/95 backdrop-blur-2xl border-2 border-[#f97316] shadow-lg focus-within:border-[#ea580c] focus-within:ring-2 focus-within:ring-[#f97316]/30 transition-all",
      textarea: "text-sm text-[#431407] placeholder-[#ea580c]/60 font-sans",
      modelPill: "text-xs font-mono text-[#c2410c] bg-[#fffbeb] hover:bg-[#fef3c7] border border-[#f59e0b] rounded-xl px-2.5 py-1.5 transition-colors uppercase font-medium",
      modelPillActive: "text-xs font-mono font-bold text-white bg-gradient-to-r from-[#ea580c] to-[#d97706] border border-[#c2410c] rounded-xl px-2.5 py-1.5 uppercase",
      sendButton: "bg-gradient-to-r from-[#ea580c] to-[#d97706] hover:from-[#c2410c] hover:to-[#b45309] text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      stopButton: "bg-rose-700 hover:bg-rose-800 text-white font-bold p-2.5 rounded-xl transition-all active:scale-95 shadow-md",
      keyboardHint: "text-xs font-mono text-[#c2410c] tracking-wider",
    },
  },
};

// Aliases mapping for easy numbers 1-20 or backward-compatibility keys
export const THEME_ALIASES: Record<string, ThemeId> = {
  "1": "citrus_lime",
  "citrus": "citrus_lime",
  "lime": "citrus_lime",
  "citrus_lime": "citrus_lime",

  "2": "seafoam_teal",
  "seafoam": "seafoam_teal",
  "teal": "seafoam_teal",
  "seafoam_teal": "seafoam_teal",

  "3": "warm_sage",
  "sage": "warm_sage",
  "warm_sage": "warm_sage",

  "4": "matcha_mint",
  "matcha": "matcha_mint",
  "mint": "matcha_mint",
  "matcha_mint": "matcha_mint",

  "5": "emerald_light",
  "emerald": "emerald_light",
  "emerald_light": "emerald_light",

  "6": "hubble_classic",
  "cosmic_orion": "hubble_classic",
  "hubble": "hubble_classic",
  "hubble_classic": "hubble_classic",

  "7": "rose_nebula",
  "rose": "rose_nebula",
  "m42": "rose_nebula",
  "magenta": "rose_nebula",
  "rose_nebula": "rose_nebula",

  "8": "trapezium_diamond",
  "trapezium": "trapezium_diamond",
  "diamond": "trapezium_diamond",
  "celestial_cyan": "trapezium_diamond",
  "trapezium_diamond": "trapezium_diamond",

  "9": "amber_dust",
  "amber": "amber_dust",
  "dust": "amber_dust",
  "amber_dust": "amber_dust",

  "10": "ultraviolet_o3",
  "ultraviolet": "ultraviolet_o3",
  "violet_aurora": "ultraviolet_o3",
  "o3": "ultraviolet_o3",
  "ultraviolet_o3": "ultraviolet_o3",

  "11": "stripe_press",
  "stripe": "stripe_press",
  "press": "stripe_press",
  "stripe_press": "stripe_press",

  "12": "kyoto_washi",
  "kyoto": "kyoto_washi",
  "washi": "kyoto_washi",
  "kyoto_washi": "kyoto_washi",

  "13": "nordic_alabaster",
  "nordic": "nordic_alabaster",
  "alabaster": "nordic_alabaster",
  "nordic_alabaster": "nordic_alabaster",

  "14": "swiss_modernist",
  "swiss": "swiss_modernist",
  "modernist": "swiss_modernist",
  "brutalist": "swiss_modernist",
  "swiss_modernist": "swiss_modernist",

  "15": "espresso_starlight",
  "espresso": "espresso_starlight",
  "coffee": "espresso_starlight",
  "mocha_cosmos": "espresso_starlight",
  "espresso_starlight": "espresso_starlight",

  "16": "cyber_neon",
  "cyber": "cyber_neon",
  "neon": "cyber_neon",
  "matrix": "cyber_neon",
  "cyber_nebula": "cyber_neon",
  "cyber_neon": "cyber_neon",

  "17": "nasa_telemetry",
  "nasa": "nasa_telemetry",
  "telemetry": "nasa_telemetry",
  "hud": "nasa_telemetry",
  "nasa_telemetry": "nasa_telemetry",

  "18": "raycast_pearl",
  "raycast": "raycast_pearl",
  "pearl": "raycast_pearl",
  "opal_pearl": "raycast_pearl",
  "raycast_pearl": "raycast_pearl",

  "19": "subzero_pulsar",
  "subzero": "subzero_pulsar",
  "pulsar": "subzero_pulsar",
  "arctic_pulsar": "subzero_pulsar",
  "subzero_pulsar": "subzero_pulsar",

  "20": "supernova_ignite",
  "solar_supernova": "supernova_ignite",
  "supernova": "supernova_ignite",
  "ignite": "supernova_ignite",
  "solar": "supernova_ignite",
  "supernova_ignite": "supernova_ignite",
};

export const RESOLVE_THEME_ID = (key: string | null | undefined): ThemeId => {
  if (!key) return "stripe_press";
  const normalized = key.toLowerCase().trim();
  if (THEME_ALIASES[normalized]) {
    return THEME_ALIASES[normalized];
  }
  if (THEMES[normalized as ThemeId]) {
    return normalized as ThemeId;
  }
  return "stripe_press";
};
