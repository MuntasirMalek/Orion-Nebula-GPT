export type ThemeId =
  | "stripe_press"
  | "nordic_alabaster"
  | "swiss_modern"
  | "kyoto_paper"
  | "vision_glass"
  | "bauhaus_ceramic"
  | "monocle_dispatch"
  | "prism_opaline"
  | "archival_vellum"
  | "raycast_pearl";

export interface ThemeConfig {
  id: ThemeId;
  index: number;
  name: string;
  tagline: string;
  category: string;
  badge: string;
  
  // Container & Global styling
  rootClass: string;
  bgOverlay: string;
  
  // Header styling
  header: {
    container: string;
    brandText: string;
    subText: string;
    button: string;
    badge: string;
  };

  // Sidebar styling
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

  // Chat message styling
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

  // Input area styling
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
  // -------------------------------------------------------------
  // 1. STRIPE PRESS MONOGRAPH (Robin Sloan / Tech Book Publisher)
  // -------------------------------------------------------------
  stripe_press: {
    id: "stripe_press",
    index: 1,
    name: "Stripe Press",
    tagline: "Intellectual Book Publishing Folio",
    category: "Literary Folio",
    badge: "Press Folio",
    rootClass: "theme-stripe-press text-stone-900",
    bgOverlay: "bg-stone-900/10",
    header: {
      container: "bg-[#fcfbf9]/90 backdrop-blur-2xl border-b border-[#e6e0d4] shadow-xs",
      brandText: "text-sm font-semibold tracking-tight text-stone-900 font-sans",
      subText: "text-xs font-mono font-medium text-amber-900 tracking-wider",
      button: "p-2 rounded-lg text-stone-600 hover:text-stone-950 hover:bg-[#ede7da] transition-colors",
      badge: "text-xs font-mono font-semibold text-amber-950 bg-amber-100/80 border border-amber-300/80 px-2.5 py-1 rounded-md shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f7f4ec]/92 backdrop-blur-3xl border-r border-[#e6e0d4] shadow-xl",
      header: "border-b border-[#e6e0d4] bg-[#ede7da]/60",
      brandText: "text-sm font-bold tracking-tight text-stone-900 font-sans",
      subText: "text-xs font-mono text-amber-900 uppercase tracking-wider",
      newChatBtn: "bg-[#fdfcf9] hover:bg-white border border-[#d8d0bf] text-stone-900 font-medium text-xs tracking-wider uppercase shadow-xs",
      sessionItemActive: "bg-white/95 border-[#d4cbba] text-stone-950 shadow-xs font-semibold border-l-3 border-l-amber-800",
      sessionItemInactive: "text-stone-600 hover:text-stone-950 hover:bg-[#ede7da]/60 font-medium",
      footer: "border-t border-[#e6e0d4] bg-[#efe9dc]/60 text-xs text-stone-500 font-mono tracking-wider uppercase",
    },
    message: {
      userContainer: "bg-[#fdfcf9]/95 backdrop-blur-2xl border border-[#e4dccf] text-stone-900 shadow-sm rounded-xl p-4 md:p-5",
      assistantContainer: "bg-[#faf6ee]/95 backdrop-blur-2xl border border-[#ded5c5] text-stone-900 shadow-md rounded-xl p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-full bg-[#ede5d5] border border-[#d6ccb8] flex items-center justify-center text-stone-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center shadow-xs text-amber-900",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-stone-600 font-medium",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-amber-950 font-bold",
      badge: "text-xs font-mono text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded tracking-wider uppercase",
      timestamp: "text-xs font-mono text-stone-500",
      bodyTextUser: "text-sm leading-relaxed text-stone-900 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-stone-900",
      copyButton: "text-stone-500 hover:text-stone-900 hover:bg-[#eae4d7] p-1.5 rounded transition-colors",
      entryNumberPrefix: "FOLIO_",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-[#fdfcf9]/95 backdrop-blur-2xl border border-[#ded5c5] shadow-lg focus-within:border-amber-800 focus-within:ring-1 focus-within:ring-amber-800/20 transition-all",
      textarea: "text-sm text-stone-900 placeholder-stone-500",
      modelPill: "text-xs font-mono text-stone-700 bg-[#ede5d5]/80 hover:bg-[#e4dcce] border border-[#d6ccb8] rounded px-2.5 py-1.5 transition-colors uppercase tracking-wider",
      modelPillActive: "text-xs font-mono font-semibold text-amber-950 bg-amber-100 border border-amber-400 rounded px-2.5 py-1.5 tracking-wider uppercase",
      sendButton: "bg-amber-800 hover:bg-amber-900 text-amber-50 font-medium p-2.5 rounded transition-all active:scale-95 shadow-xs",
      stopButton: "bg-stone-800 hover:bg-stone-900 text-white font-medium p-2.5 rounded transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs font-mono text-stone-500 uppercase tracking-widest",
    },
  },

  // -------------------------------------------------------------
  // 2. NORDIC ALABASTER (Copenhagen Studio / Minimalist Quiet Luxury)
  // -------------------------------------------------------------
  nordic_alabaster: {
    id: "nordic_alabaster",
    index: 2,
    name: "Nordic Alabaster",
    tagline: "Copenhagen Minimalist Quiet Luxury",
    category: "Quiet Luxury",
    badge: "Nordic Pure",
    rootClass: "theme-nordic-alabaster text-slate-800",
    bgOverlay: "bg-white/15",
    header: {
      container: "bg-[#f8fafc]/85 backdrop-blur-2xl border-b border-slate-200/80 shadow-xs",
      brandText: "text-sm font-medium tracking-normal text-slate-900",
      subText: "text-xs font-normal text-slate-500 tracking-wide",
      button: "p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors",
      badge: "text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full shadow-xs",
    },
    sidebar: {
      container: "bg-[#f1f5f9]/85 backdrop-blur-3xl border-r border-slate-200/70 shadow-lg",
      header: "border-b border-slate-200/60 bg-white/40",
      brandText: "text-sm font-semibold tracking-normal text-slate-900",
      subText: "text-xs text-slate-500",
      newChatBtn: "bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs rounded-full shadow-xs",
      sessionItemActive: "bg-white border-slate-200 text-slate-900 shadow-xs font-medium rounded-xl",
      sessionItemInactive: "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-normal rounded-xl",
      footer: "border-t border-slate-200/60 bg-white/30 text-xs text-slate-500",
    },
    message: {
      userContainer: "bg-white/92 backdrop-blur-2xl border border-slate-200/80 text-slate-800 shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-[#f8fafc]/92 backdrop-blur-2xl border border-slate-200/80 text-slate-800 shadow-md rounded-2xl p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-600 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shadow-xs text-slate-700",
      authorTextUser: "text-xs font-medium text-slate-700",
      authorTextAssistant: "text-xs font-semibold text-slate-900",
      badge: "text-xs font-medium text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full",
      timestamp: "text-xs text-slate-400 font-normal",
      bodyTextUser: "text-sm leading-relaxed text-slate-800 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-800",
      copyButton: "text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 p-1.5 rounded-full transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/90 backdrop-blur-2xl border border-slate-200 shadow-lg focus-within:border-slate-400 transition-all",
      textarea: "text-sm text-slate-800 placeholder-slate-400",
      modelPill: "text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full px-3 py-1.5 transition-colors",
      modelPillActive: "text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-full px-3 py-1.5 shadow-xs",
      sendButton: "bg-slate-800 hover:bg-slate-900 text-white rounded-full p-2.5 transition-all active:scale-95 shadow-xs",
      stopButton: "bg-rose-600 hover:bg-rose-700 text-white rounded-full p-2.5 transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs text-slate-400",
    },
  },

  // -------------------------------------------------------------
  // 3. SWISS MODERN (Josef Müller-Brockmann / Modernist Grid)
  // -------------------------------------------------------------
  swiss_modern: {
    id: "swiss_modern",
    index: 3,
    name: "Swiss International",
    tagline: "Josef Müller-Brockmann Typographic Grid",
    category: "Swiss Modernism",
    badge: "Swiss Grid",
    rootClass: "theme-swiss-modern text-black",
    bgOverlay: "bg-white/20",
    header: {
      container: "bg-white/95 backdrop-blur-2xl border-b-2 border-black shadow-xs",
      brandText: "text-sm font-black tracking-tight text-black uppercase font-mono",
      subText: "text-xs font-mono font-bold text-red-600 uppercase tracking-wider",
      button: "p-2 rounded-none text-black hover:bg-black hover:text-white border border-transparent hover:border-black transition-colors",
      badge: "text-xs font-mono font-bold text-white bg-red-600 border border-red-700 px-2.5 py-1 rounded-none shadow-xs uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-white/95 backdrop-blur-3xl border-r-2 border-black shadow-2xl",
      header: "border-b-2 border-black bg-neutral-100",
      brandText: "text-sm font-black tracking-tight text-black uppercase font-mono",
      subText: "text-xs font-mono font-bold text-red-600 uppercase",
      newChatBtn: "bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase rounded-none border border-black",
      sessionItemActive: "bg-neutral-100 border-2 border-black text-black font-bold rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      sessionItemInactive: "text-neutral-700 hover:text-black hover:bg-neutral-100 font-medium rounded-none",
      footer: "border-t-2 border-black bg-neutral-100 text-xs text-black font-mono uppercase font-bold",
    },
    message: {
      userContainer: "bg-white border-2 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none p-4 md:p-5",
      assistantContainer: "bg-[#fbfbfb] border-2 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-none bg-black border-2 border-black flex items-center justify-center text-white font-mono text-xs font-bold",
      assistantAvatar: "w-8 h-8 rounded-none bg-red-600 border-2 border-black flex items-center justify-center text-white font-mono text-xs font-bold",
      authorTextUser: "text-xs font-mono font-bold uppercase tracking-wider text-black",
      authorTextAssistant: "text-xs font-mono font-black uppercase tracking-wider text-red-600",
      badge: "text-xs font-mono font-bold text-black bg-neutral-200 border border-black px-2 py-0.5 rounded-none uppercase",
      timestamp: "text-xs font-mono text-neutral-600 font-medium",
      bodyTextUser: "text-sm leading-relaxed text-black font-medium",
      bodyTextAssistant: "text-sm leading-relaxed text-black",
      copyButton: "text-black hover:bg-black hover:text-white border border-black p-1.5 rounded-none transition-colors",
      entryNumberPrefix: "SWISS_",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-none bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] transition-all",
      textarea: "text-sm text-black placeholder-neutral-500 font-sans font-medium",
      modelPill: "text-xs font-mono font-bold text-black bg-neutral-100 hover:bg-neutral-200 border border-black rounded-none px-2.5 py-1.5 uppercase",
      modelPillActive: "text-xs font-mono font-bold text-white bg-red-600 border border-black rounded-none px-2.5 py-1.5 uppercase",
      sendButton: "bg-black hover:bg-red-600 text-white font-mono font-bold p-2.5 rounded-none transition-colors active:translate-x-0.5 active:translate-y-0.5",
      stopButton: "bg-red-600 hover:bg-red-700 text-white font-mono font-bold p-2.5 rounded-none transition-colors",
      keyboardHint: "text-xs font-mono text-neutral-600 uppercase font-bold",
    },
  },

  // -------------------------------------------------------------
  // 4. KYOTO BOTANICAL (Handmade Washi Paper & Bamboo Green)
  // -------------------------------------------------------------
  kyoto_paper: {
    id: "kyoto_paper",
    index: 4,
    name: "Kyoto Botanical",
    tagline: "Handmade Washi Paper & Bamboo Green",
    category: "Organic Zen",
    badge: "Washi Zen",
    rootClass: "theme-kyoto-paper text-stone-800",
    bgOverlay: "bg-[#f5f2ea]/25",
    header: {
      container: "bg-[#f7f5ee]/90 backdrop-blur-2xl border-b border-[#dfd8ca] shadow-xs",
      brandText: "text-sm font-medium tracking-wide text-stone-900",
      subText: "text-xs font-mono text-[#3e4f32] tracking-widest uppercase font-semibold",
      button: "p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#eae5d8] transition-colors",
      badge: "text-xs font-mono text-[#2f3d26] bg-[#e4ded0] border border-[#cfc8b8] px-2.5 py-1 rounded-lg tracking-wider",
    },
    sidebar: {
      container: "bg-[#f2efe6]/92 backdrop-blur-3xl border-r border-[#dfd8ca] shadow-lg",
      header: "border-b border-[#dfd8ca] bg-[#e9e4d6]/60",
      brandText: "text-sm font-semibold tracking-wide text-stone-900",
      subText: "text-xs font-mono text-[#3e4f32] tracking-wider",
      newChatBtn: "bg-[#fbfaf6] hover:bg-white border border-[#d2cbba] text-stone-800 font-medium text-xs rounded-xl shadow-xs",
      sessionItemActive: "bg-white/95 border-[#cec7b5] text-stone-900 font-medium shadow-xs border-l-3 border-l-[#3e4f32] rounded-xl",
      sessionItemInactive: "text-stone-600 hover:text-stone-900 hover:bg-[#eae5d8]/60 font-normal rounded-xl",
      footer: "border-t border-[#dfd8ca] bg-[#ebe6d8]/60 text-xs text-stone-500 font-mono tracking-wider",
    },
    message: {
      userContainer: "bg-[#fbfaf6]/95 backdrop-blur-2xl border border-[#ded8cb] text-stone-800 shadow-sm rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-[#f6f3ea]/95 backdrop-blur-2xl border border-[#d7cfbf] text-stone-800 shadow-md rounded-2xl p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-full bg-[#e8e2d4] border border-[#d2cabb] flex items-center justify-center text-stone-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-[#3e4f32] border border-[#2f3d26] flex items-center justify-center shadow-xs text-[#f7f5ee]",
      authorTextUser: "text-xs font-mono text-stone-600 tracking-wider",
      authorTextAssistant: "text-xs font-mono text-[#2f3d26] font-bold tracking-wider",
      badge: "text-xs font-mono text-[#2f3d26] bg-[#e6dfd1] border border-[#d0c9b9] px-2 py-0.5 rounded tracking-wider",
      timestamp: "text-xs font-mono text-stone-400",
      bodyTextUser: "text-sm leading-relaxed text-stone-800 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-stone-800",
      copyButton: "text-stone-400 hover:text-stone-800 hover:bg-[#eae5d8] p-1.5 rounded-lg transition-colors",
      entryNumberPrefix: "ZEN_",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-[#fbfaf6]/95 backdrop-blur-2xl border border-[#d7cfbf] shadow-lg focus-within:border-[#3e4f32] focus-within:ring-1 focus-within:ring-[#3e4f32]/20 transition-all",
      textarea: "text-sm text-stone-800 placeholder-stone-400",
      modelPill: "text-xs font-mono text-stone-700 bg-[#ebe5d7] hover:bg-[#dfd9ca] border border-[#d0c9b9] rounded-xl px-2.5 py-1.5 transition-colors tracking-wide",
      modelPillActive: "text-xs font-mono font-semibold text-[#f7f5ee] bg-[#3e4f32] border border-[#2f3d26] rounded-xl px-2.5 py-1.5 tracking-wide",
      sendButton: "bg-[#3e4f32] hover:bg-[#2f3d26] text-[#f7f5ee] font-medium p-2.5 rounded-xl transition-all active:scale-95 shadow-xs",
      stopButton: "bg-stone-700 hover:bg-stone-800 text-white font-medium p-2.5 rounded-xl transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs font-mono text-stone-400",
    },
  },

  // -------------------------------------------------------------
  // 5. VISION ALABASTER (Cupertino Liquid Glass / VisionOS)
  // -------------------------------------------------------------
  vision_glass: {
    id: "vision_glass",
    index: 5,
    name: "Vision Alabaster",
    tagline: "Apple VisionOS Liquid Optical Glass",
    category: "Luxe Optical Glass",
    badge: "Vision Glass",
    rootClass: "theme-vision-glass text-slate-900",
    bgOverlay: "bg-white/10",
    header: {
      container: "bg-white/75 backdrop-blur-3xl border-b border-white/80 shadow-xs",
      brandText: "text-sm font-semibold tracking-tight text-slate-900",
      subText: "text-xs font-medium text-sky-700",
      button: "p-2 rounded-2xl text-slate-700 hover:text-slate-950 hover:bg-white/60 transition-colors",
      badge: "text-xs font-semibold text-sky-800 bg-sky-50/90 border border-sky-200/80 px-3 py-1 rounded-full shadow-xs",
    },
    sidebar: {
      container: "bg-white/75 backdrop-blur-3xl border-r border-white/70 shadow-xl",
      header: "border-b border-white/50 bg-white/40",
      brandText: "text-sm font-bold tracking-tight text-slate-900",
      subText: "text-xs font-medium text-sky-700",
      newChatBtn: "bg-white/85 hover:bg-white border border-white/95 text-slate-900 font-semibold text-xs tracking-wide shadow-sm hover:shadow rounded-2xl",
      sessionItemActive: "bg-white/95 border-white text-slate-900 shadow-sm font-semibold rounded-2xl",
      sessionItemInactive: "text-slate-700 hover:text-slate-950 hover:bg-white/50 font-medium rounded-2xl",
      footer: "border-t border-white/40 bg-white/30 text-xs text-slate-500",
    },
    message: {
      userContainer: "bg-white/90 backdrop-blur-3xl border border-white/95 text-slate-900 shadow-lg shadow-slate-900/5 rounded-3xl p-4 md:p-5",
      assistantContainer: "bg-white/82 backdrop-blur-3xl border border-white/85 text-slate-900 shadow-xl shadow-slate-900/10 rounded-3xl p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-white border border-sky-200 flex items-center justify-center shadow-xs text-sky-600",
      authorTextUser: "text-xs font-semibold text-slate-900",
      authorTextAssistant: "text-xs font-bold text-slate-900",
      badge: "text-xs font-medium text-sky-800 bg-sky-100/70 border border-sky-200 px-2.5 py-0.5 rounded-full",
      timestamp: "text-xs text-slate-400 font-normal",
      bodyTextUser: "text-sm leading-relaxed text-slate-900 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-900",
      copyButton: "text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-1.5 rounded-full transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-3xl bg-white/85 backdrop-blur-3xl border border-white/95 shadow-xl shadow-slate-900/10 focus-within:border-sky-500/70 focus-within:shadow-[0_0_25px_rgba(14,165,233,0.18)] transition-all",
      textarea: "text-sm text-slate-900 placeholder-slate-400",
      modelPill: "text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 rounded-full px-3 py-1.5 transition-colors",
      modelPillActive: "text-xs font-semibold text-sky-900 bg-sky-100/90 border border-sky-300 rounded-full px-3 py-1.5",
      sendButton: "bg-sky-500 hover:bg-sky-600 text-white shadow-sm p-2.5 rounded-full transition-all active:scale-95",
      stopButton: "bg-rose-500 hover:bg-rose-600 text-white shadow-sm p-2.5 rounded-full transition-all active:scale-95",
      keyboardHint: "text-xs text-slate-400",
    },
  },

  // -------------------------------------------------------------
  // 6. BAUHAUS CERAMIC (Dieter Rams / Braun Industrial White)
  // -------------------------------------------------------------
  bauhaus_ceramic: {
    id: "bauhaus_ceramic",
    index: 6,
    name: "Bauhaus Ceramic",
    tagline: "Dieter Rams & Braun Functional Porcelain",
    category: "Industrial Design",
    badge: "Bauhaus 1960",
    rootClass: "theme-bauhaus-ceramic text-neutral-800",
    bgOverlay: "bg-[#f2f1ec]/20",
    header: {
      container: "bg-[#f6f5f0]/92 backdrop-blur-2xl border-b border-[#d8d5cb] shadow-xs",
      brandText: "text-sm font-bold tracking-tight text-neutral-900 font-mono",
      subText: "text-xs font-mono font-medium text-blue-700",
      button: "p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-[#e6e3d8] transition-colors",
      badge: "text-xs font-mono font-bold text-neutral-800 bg-[#e7e4d8] border border-[#cfccbe] px-2.5 py-1 rounded-md shadow-xs uppercase",
    },
    sidebar: {
      container: "bg-[#eeebe3]/92 backdrop-blur-3xl border-r border-[#d8d5cb] shadow-xl",
      header: "border-b border-[#d8d5cb] bg-[#e4e1d5]/60",
      brandText: "text-sm font-bold tracking-tight text-neutral-900 font-mono",
      subText: "text-xs font-mono text-blue-700 uppercase",
      newChatBtn: "bg-[#faf9f5] hover:bg-white border border-[#cdc9ba] text-neutral-900 font-mono font-bold text-xs rounded-lg shadow-xs",
      sessionItemActive: "bg-white border-[#c9c5b5] text-neutral-900 font-bold border-l-4 border-l-blue-600 rounded-lg shadow-xs",
      sessionItemInactive: "text-neutral-600 hover:text-neutral-900 hover:bg-[#e4e1d5]/60 font-medium rounded-lg",
      footer: "border-t border-[#d8d5cb] bg-[#e6e3d7]/60 text-xs text-neutral-500 font-mono uppercase",
    },
    message: {
      userContainer: "bg-[#faf9f5]/95 backdrop-blur-2xl border border-[#d8d5cb] text-neutral-900 shadow-sm rounded-xl p-4 md:p-5",
      assistantContainer: "bg-[#f5f4ee]/95 backdrop-blur-2xl border border-[#d2cec3] text-neutral-900 shadow-md rounded-xl p-4 md:p-5 w-full border-l-4 border-l-blue-600",
      userAvatar: "w-8 h-8 rounded-lg bg-[#e4e1d5] border border-[#cfccbe] flex items-center justify-center text-neutral-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-lg bg-blue-600 border border-blue-700 flex items-center justify-center shadow-xs text-white",
      authorTextUser: "text-xs font-mono font-bold uppercase tracking-wider text-neutral-700",
      authorTextAssistant: "text-xs font-mono font-bold uppercase tracking-wider text-blue-700",
      badge: "text-xs font-mono font-bold text-neutral-800 bg-[#e4e1d5] border border-[#cfccbe] px-2 py-0.5 rounded uppercase",
      timestamp: "text-xs font-mono text-neutral-500",
      bodyTextUser: "text-sm leading-relaxed text-neutral-800 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-neutral-900",
      copyButton: "text-neutral-500 hover:text-neutral-900 hover:bg-[#e6e3d8] p-1.5 rounded transition-colors",
      entryNumberPrefix: "FIG_",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-[#faf9f5]/95 backdrop-blur-2xl border border-[#d2cec3] shadow-lg focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600/30 transition-all",
      textarea: "text-sm text-neutral-900 placeholder-neutral-500 font-sans",
      modelPill: "text-xs font-mono font-bold text-neutral-700 bg-[#e8e5db] hover:bg-[#dcd9ce] border border-[#cfccbe] rounded-lg px-2.5 py-1.5 transition-colors uppercase",
      modelPillActive: "text-xs font-mono font-bold text-white bg-blue-600 border border-blue-700 rounded-lg px-2.5 py-1.5 uppercase",
      sendButton: "bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-xs",
      stopButton: "bg-neutral-800 hover:bg-neutral-900 text-white font-mono font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs font-mono text-neutral-500 uppercase",
    },
  },

  // -------------------------------------------------------------
  // 7. MONOCLE DISPATCH (Diplomatic Journal & British Green)
  // -------------------------------------------------------------
  monocle_dispatch: {
    id: "monocle_dispatch",
    index: 7,
    name: "Monocle Dispatch",
    tagline: "International Correspondent & Racing Green",
    category: "Diplomatic Editorial",
    badge: "Dispatch London",
    rootClass: "theme-monocle-dispatch text-zinc-900",
    bgOverlay: "bg-[#f8f5ee]/25",
    header: {
      container: "bg-[#fbf9f4]/90 backdrop-blur-2xl border-b border-[#ded7c6] shadow-xs",
      brandText: "text-sm font-serif font-bold tracking-wide text-zinc-900 uppercase",
      subText: "text-xs font-mono font-bold text-[#14532d] uppercase tracking-widest",
      button: "p-2 rounded text-zinc-600 hover:text-zinc-950 hover:bg-[#eae3d2] transition-colors",
      badge: "text-xs font-mono font-bold text-[#14532d] bg-[#dcfce7]/80 border border-[#86efac]/80 px-2.5 py-1 rounded-sm uppercase tracking-widest",
    },
    sidebar: {
      container: "bg-[#f4efe4]/92 backdrop-blur-3xl border-r border-[#ded7c6] shadow-xl",
      header: "border-b border-[#ded7c6] bg-[#eae3d2]/60",
      brandText: "text-sm font-serif font-bold tracking-wide text-zinc-900 uppercase",
      subText: "text-xs font-mono text-[#14532d] uppercase tracking-widest",
      newChatBtn: "bg-[#fcfbf7] hover:bg-white border border-[#d2c9b4] text-zinc-900 font-serif font-bold text-xs uppercase tracking-wider rounded-sm shadow-xs",
      sessionItemActive: "bg-white border-[#cbc1a9] text-zinc-950 font-semibold border-l-3 border-l-[#14532d] rounded-sm shadow-xs",
      sessionItemInactive: "text-zinc-600 hover:text-zinc-950 hover:bg-[#eae3d2]/60 font-medium rounded-sm",
      footer: "border-t border-[#ded7c6] bg-[#ece5d5]/60 text-xs text-zinc-500 font-mono tracking-widest uppercase",
    },
    message: {
      userContainer: "bg-[#fcfbf7]/95 backdrop-blur-2xl border border-[#dfd7c5] text-zinc-900 shadow-sm rounded-md p-4 md:p-5",
      assistantContainer: "bg-[#f7f4ec]/95 backdrop-blur-2xl border border-[#d6cdb8] text-zinc-900 shadow-md rounded-md p-4 md:p-5 w-full border-t-2 border-t-[#14532d]",
      userAvatar: "w-8 h-8 rounded-sm bg-[#e8e1d0] border border-[#d2c9b4] flex items-center justify-center text-zinc-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-sm bg-[#14532d] border border-[#0f3d21] flex items-center justify-center shadow-xs text-white",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-zinc-600 font-semibold",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#14532d] font-bold",
      badge: "text-xs font-mono text-[#14532d] bg-[#dcfce7]/90 border border-[#86efac] px-2 py-0.5 rounded-sm tracking-wider uppercase",
      timestamp: "text-xs font-mono text-zinc-500",
      bodyTextUser: "text-sm leading-relaxed text-zinc-900 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-zinc-900",
      copyButton: "text-zinc-500 hover:text-zinc-900 hover:bg-[#eae3d2] p-1.5 rounded-sm transition-colors",
      entryNumberPrefix: "DISPATCH_",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-md bg-[#fcfbf7]/95 backdrop-blur-2xl border border-[#d6cdb8] shadow-lg focus-within:border-[#14532d] focus-within:ring-1 focus-within:ring-[#14532d]/20 transition-all",
      textarea: "text-sm text-zinc-900 placeholder-zinc-500",
      modelPill: "text-xs font-mono text-zinc-700 bg-[#ebe3d2] hover:bg-[#dfd6c2] border border-[#d0c6af] rounded-sm px-2.5 py-1.5 transition-colors uppercase tracking-wider",
      modelPillActive: "text-xs font-mono font-semibold text-white bg-[#14532d] border border-[#0f3d21] rounded-sm px-2.5 py-1.5 tracking-wider uppercase",
      sendButton: "bg-[#14532d] hover:bg-[#0f3d21] text-white font-mono font-bold p-2.5 rounded-sm transition-all active:scale-95 shadow-xs",
      stopButton: "bg-zinc-800 hover:bg-zinc-900 text-white font-mono font-bold p-2.5 rounded-sm transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs font-mono text-zinc-500 uppercase tracking-widest",
    },
  },

  // -------------------------------------------------------------
  // 8. PRISM OPALINE (Pearlescent Holographic Light)
  // -------------------------------------------------------------
  prism_opaline: {
    id: "prism_opaline",
    index: 8,
    name: "Prism Opaline",
    tagline: "Iridescent Pearlescent Crystalline Sheen",
    category: "Luminous Opal",
    badge: "Opaline Sheen",
    rootClass: "theme-prism-opaline text-slate-800",
    bgOverlay: "bg-white/10",
    header: {
      container: "bg-white/85 backdrop-blur-3xl border-b border-indigo-100/90 shadow-[0_4px_20px_rgba(129,140,248,0.06)]",
      brandText: "text-sm font-semibold tracking-tight text-slate-900",
      subText: "text-xs font-medium text-violet-600",
      button: "p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-violet-50 transition-colors",
      badge: "text-xs font-semibold text-violet-700 bg-violet-50/90 border border-violet-200/80 px-2.5 py-1 rounded-full shadow-xs",
    },
    sidebar: {
      container: "bg-white/85 backdrop-blur-3xl border-r border-indigo-100/90 shadow-xl",
      header: "border-b border-indigo-100/60 bg-white/40",
      brandText: "text-sm font-bold tracking-tight text-slate-900",
      subText: "text-xs font-medium text-violet-600",
      newChatBtn: "bg-gradient-to-r from-violet-50 to-indigo-50 hover:from-violet-100 hover:to-indigo-100 border border-indigo-200/70 text-violet-950 font-semibold text-xs rounded-xl shadow-xs",
      sessionItemActive: "bg-white border-indigo-200 text-slate-900 shadow-sm font-semibold rounded-xl border-l-3 border-l-violet-600",
      sessionItemInactive: "text-slate-600 hover:text-slate-950 hover:bg-violet-50/60 font-medium rounded-xl",
      footer: "border-t border-indigo-100/60 bg-white/40 text-xs text-slate-500",
    },
    message: {
      userContainer: "bg-white/92 backdrop-blur-3xl border border-indigo-100 text-slate-800 shadow-md shadow-violet-500/5 rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/88 backdrop-blur-3xl border border-indigo-100 text-slate-800 shadow-lg shadow-indigo-500/8 rounded-2xl p-4 md:p-5 w-full ring-1 ring-violet-500/10",
      userAvatar: "w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 border border-violet-400 flex items-center justify-center shadow-xs text-white",
      authorTextUser: "text-xs font-semibold text-slate-700",
      authorTextAssistant: "text-xs font-bold text-violet-700",
      badge: "text-xs font-medium text-violet-700 bg-violet-100/80 border border-violet-200 px-2.5 py-0.5 rounded-full",
      timestamp: "text-xs text-slate-400 font-normal",
      bodyTextUser: "text-sm leading-relaxed text-slate-800 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-800",
      copyButton: "text-slate-400 hover:text-violet-700 hover:bg-violet-50 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/90 backdrop-blur-3xl border border-indigo-200/80 shadow-xl shadow-indigo-500/10 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/15 transition-all",
      textarea: "text-sm text-slate-800 placeholder-slate-400",
      modelPill: "text-xs font-medium text-slate-700 bg-slate-100 hover:bg-violet-50 border border-slate-200 rounded-xl px-2.5 py-1.5 transition-colors",
      modelPillActive: "text-xs font-semibold text-violet-900 bg-violet-100 border border-violet-300 rounded-xl px-2.5 py-1.5 shadow-xs",
      sendButton: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-500/25",
      stopButton: "bg-rose-500 hover:bg-rose-600 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs text-slate-400",
    },
  },

  // -------------------------------------------------------------
  // 9. ARCHIVAL VELLUM (Rare Manuscripts & Classical Humanities)
  // -------------------------------------------------------------
  archival_vellum: {
    id: "archival_vellum",
    index: 9,
    name: "Archival Vellum",
    tagline: "Rare Manuscript & Classical Humanities",
    category: "Historical Archive",
    badge: "Vellum Folio",
    rootClass: "theme-archival-vellum text-[#2a241e]",
    bgOverlay: "bg-[#ebe4d2]/25",
    header: {
      container: "bg-[#fbf7ee]/90 backdrop-blur-2xl border-b border-[#dad0b8] shadow-xs",
      brandText: "text-sm font-serif font-bold tracking-wide text-[#2a241e]",
      subText: "text-xs font-mono font-bold text-[#854d0e] uppercase tracking-wider",
      button: "p-2 rounded text-[#57493b] hover:text-[#2a241e] hover:bg-[#e8dec7] transition-colors",
      badge: "text-xs font-mono font-medium text-[#713f12] bg-[#fef9c3]/70 border border-[#fde047] px-2.5 py-1 rounded-none uppercase tracking-wider",
    },
    sidebar: {
      container: "bg-[#f3ece0]/92 backdrop-blur-3xl border-r border-[#dad0b8] shadow-xl",
      header: "border-b border-[#dad0b8] bg-[#e8dec7]/60",
      brandText: "text-sm font-serif font-bold tracking-wide text-[#2a241e]",
      subText: "text-xs font-mono text-[#854d0e] uppercase",
      newChatBtn: "bg-[#faf6ee] hover:bg-white border border-[#cfc3a7] text-[#2a241e] font-serif font-semibold text-xs uppercase tracking-wider rounded-none shadow-xs",
      sessionItemActive: "bg-white border-[#c9bca0] text-[#2a241e] font-semibold border-l-3 border-l-[#9a3412] rounded-none shadow-xs",
      sessionItemInactive: "text-[#57493b] hover:text-[#2a241e] hover:bg-[#e8dec7]/60 font-medium rounded-none",
      footer: "border-t border-[#dad0b8] bg-[#eae0cb]/60 text-xs text-[#786653] font-mono tracking-widest uppercase",
    },
    message: {
      userContainer: "bg-[#faf6ee]/95 backdrop-blur-2xl border border-[#dad0b8] text-[#2a241e] shadow-sm rounded-none p-4 md:p-5",
      assistantContainer: "bg-[#f5efe3]/95 backdrop-blur-2xl border border-[#d2c6ac] text-[#2a241e] shadow-md rounded-none p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-none bg-[#e8deca] border border-[#cfc3a7] flex items-center justify-center text-[#57493b] shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-none bg-[#78350f] border border-[#582509] flex items-center justify-center shadow-xs text-[#fef3c7]",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-[#786653] font-medium",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-[#9a3412] font-bold",
      badge: "text-xs font-mono text-[#713f12] bg-[#fef9c3]/80 border border-[#fde047] px-2 py-0.5 rounded-none tracking-wider uppercase",
      timestamp: "text-xs font-mono text-[#786653]",
      bodyTextUser: "text-sm leading-relaxed text-[#2a241e] font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-[#2a241e]",
      copyButton: "text-[#786653] hover:text-[#2a241e] hover:bg-[#e8dec7] p-1.5 rounded-none transition-colors",
      entryNumberPrefix: "SPECIMEN_",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-none bg-[#faf6ee]/95 backdrop-blur-2xl border border-[#d2c6ac] shadow-lg focus-within:border-[#9a3412] focus-within:ring-1 focus-within:ring-[#9a3412]/20 transition-all",
      textarea: "text-sm text-[#2a241e] placeholder-[#8a7662]",
      modelPill: "text-xs font-mono text-[#57493b] bg-[#eadeca] hover:bg-[#ded1bc] border border-[#cfc3a7] rounded-none px-2.5 py-1.5 transition-colors uppercase tracking-wider",
      modelPillActive: "text-xs font-mono font-semibold text-[#fef3c7] bg-[#78350f] border border-[#582509] rounded-none px-2.5 py-1.5 tracking-wider uppercase",
      sendButton: "bg-[#78350f] hover:bg-[#92400e] text-[#fef3c7] font-medium p-2.5 rounded-none transition-all active:scale-95 shadow-xs",
      stopButton: "bg-stone-800 hover:bg-stone-900 text-white font-medium p-2.5 rounded-none transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs font-mono text-[#786653] uppercase tracking-widest",
    },
  },

  // -------------------------------------------------------------
  // 10. RAYCAST PEARL (Raycast & Linear Modern Dev Light Mode)
  // -------------------------------------------------------------
  raycast_pearl: {
    id: "raycast_pearl",
    index: 10,
    name: "Raycast Pearl",
    tagline: "Raycast & Linear High-Velocity Dev Light",
    category: "Developer Tool",
    badge: "Raycast Light",
    rootClass: "theme-raycast-pearl text-slate-900",
    bgOverlay: "bg-slate-100/15",
    header: {
      container: "bg-slate-50/90 backdrop-blur-2xl border-b border-slate-200 shadow-xs",
      brandText: "text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-1.5",
      subText: "text-xs font-mono font-medium text-indigo-600",
      button: "p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 transition-colors",
      badge: "text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md shadow-xs",
    },
    sidebar: {
      container: "bg-slate-100/90 backdrop-blur-3xl border-r border-slate-200 shadow-xl",
      header: "border-b border-slate-200 bg-slate-50/60",
      brandText: "text-sm font-bold tracking-tight text-slate-900",
      subText: "text-xs font-mono text-indigo-600",
      newChatBtn: "bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 font-semibold text-xs tracking-wide shadow-xs hover:border-indigo-500/50 rounded-lg",
      sessionItemActive: "bg-white border-slate-300 text-slate-900 border-l-3 border-l-indigo-600 shadow-xs font-semibold rounded-lg",
      sessionItemInactive: "text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium rounded-lg",
      footer: "border-t border-slate-200 bg-slate-100 text-xs text-slate-500 font-mono",
    },
    message: {
      userContainer: "bg-white/95 backdrop-blur-2xl border border-slate-200 text-slate-900 shadow-sm rounded-xl p-4 md:p-5 border-l-3 border-l-slate-400",
      assistantContainer: "bg-slate-50/95 backdrop-blur-2xl border border-slate-200 text-slate-900 shadow-md rounded-xl p-4 md:p-5 w-full border-l-3 border-l-indigo-600",
      userAvatar: "w-8 h-8 rounded-lg bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center shadow-xs text-indigo-700 font-bold",
      authorTextUser: "text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider",
      authorTextAssistant: "text-xs font-mono font-semibold text-indigo-700 uppercase tracking-wider",
      badge: "text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded",
      timestamp: "text-xs font-mono text-slate-400",
      bodyTextUser: "text-sm leading-relaxed text-slate-800 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-900",
      copyButton: "text-slate-400 hover:text-slate-800 hover:bg-slate-200/80 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-lg focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all",
      textarea: "text-sm text-slate-900 placeholder-slate-400 font-sans",
      modelPill: "text-xs font-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors",
      modelPillActive: "text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-300 rounded-lg px-2.5 py-1.5",
      sendButton: "bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-xs",
      stopButton: "bg-rose-600 hover:bg-rose-700 text-white font-bold p-2.5 rounded-lg transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs font-mono text-slate-400",
    },
  },
};

// Aliases mapping for easy numbers 1-10 or backward-compatibility keys
export const THEME_ALIASES: Record<string, ThemeId> = {
  "1": "stripe_press",
  "stripe": "stripe_press",
  "stripe_press": "stripe_press",
  "editorial": "stripe_press",

  "2": "nordic_alabaster",
  "nordic": "nordic_alabaster",
  "nordic_alabaster": "nordic_alabaster",

  "3": "swiss_modern",
  "swiss": "swiss_modern",
  "swiss_modern": "swiss_modern",

  "4": "kyoto_paper",
  "kyoto": "kyoto_paper",
  "kyoto_paper": "kyoto_paper",
  "washi": "kyoto_paper",

  "5": "vision_glass",
  "vision": "vision_glass",
  "vision_glass": "vision_glass",
  "observatory": "vision_glass",

  "6": "bauhaus_ceramic",
  "bauhaus": "bauhaus_ceramic",
  "bauhaus_ceramic": "bauhaus_ceramic",
  "ceramic": "bauhaus_ceramic",

  "7": "monocle_dispatch",
  "monocle": "monocle_dispatch",
  "monocle_dispatch": "monocle_dispatch",

  "8": "prism_opaline",
  "prism": "prism_opaline",
  "prism_opaline": "prism_opaline",
  "opal": "prism_opaline",

  "9": "archival_vellum",
  "archival": "archival_vellum",
  "archival_vellum": "archival_vellum",
  "vellum": "archival_vellum",

  "10": "raycast_pearl",
  "raycast": "raycast_pearl",
  "raycast_pearl": "raycast_pearl",
  "pearl": "raycast_pearl",
  "cyber": "raycast_pearl",
  "hud": "raycast_pearl",
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
