export type ThemeId = "observatory" | "cyber" | "editorial" | "hud";

export interface ThemeConfig {
  id: ThemeId;
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
    entryNumberPrefix?: boolean;
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
  // 1. OBSERVATORY GLASS (Cupertino / VisionOS Liquid Frosted Light)
  // -------------------------------------------------------------
  observatory: {
    id: "observatory",
    name: "Observatory Glass",
    tagline: "VisionOS Optical Frosted Glass",
    category: "Luxe Light",
    badge: "Optical Frosted",
    rootClass: "theme-observatory text-slate-900",
    bgOverlay: "bg-white/10",
    header: {
      container: "bg-white/70 backdrop-blur-2xl border-b border-white/80 shadow-xs",
      brandText: "text-sm font-semibold tracking-tight text-slate-900 drop-shadow-xs",
      subText: "text-xs font-medium text-cyan-800",
      button: "p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-white/60 transition-colors",
      badge: "text-xs font-semibold text-cyan-800 bg-cyan-50/90 border border-cyan-200/80 px-2.5 py-1 rounded-full shadow-xs",
    },
    sidebar: {
      container: "bg-white/75 backdrop-blur-3xl border-r border-white/60 shadow-xl",
      header: "border-b border-white/50 bg-white/40",
      brandText: "text-sm font-bold tracking-tight text-slate-900",
      subText: "text-xs font-medium text-cyan-800",
      newChatBtn: "bg-white/80 hover:bg-white border border-white/90 text-slate-900 font-semibold text-xs tracking-wide shadow-sm hover:shadow",
      sessionItemActive: "bg-white/90 border-white/95 text-slate-900 shadow-sm font-semibold",
      sessionItemInactive: "text-slate-700 hover:text-slate-950 hover:bg-white/50 font-medium",
      footer: "border-t border-white/40 bg-white/30 text-xs text-slate-500",
    },
    message: {
      userContainer: "bg-white/90 backdrop-blur-2xl border border-white/95 text-slate-900 shadow-md shadow-slate-900/5 rounded-2xl p-4 md:p-5",
      assistantContainer: "bg-white/80 backdrop-blur-2xl border border-white/80 text-slate-900 shadow-lg shadow-slate-900/10 rounded-2xl p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-full bg-slate-200/90 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-white border border-cyan-200 flex items-center justify-center shadow-xs",
      authorTextUser: "text-xs font-semibold text-slate-900",
      authorTextAssistant: "text-xs font-bold text-slate-900",
      badge: "text-xs font-medium text-cyan-800 bg-cyan-100/70 border border-cyan-200 px-2 py-0.5 rounded-full",
      timestamp: "text-xs text-slate-500 font-normal",
      bodyTextUser: "text-sm leading-relaxed text-slate-900 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-900",
      copyButton: "text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-2xl bg-white/85 backdrop-blur-2xl border border-white/95 shadow-xl shadow-slate-900/10 focus-within:border-cyan-500/70 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.18)] transition-all",
      textarea: "text-sm text-slate-900 placeholder-slate-500",
      modelPill: "text-xs font-semibold text-slate-700 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200 rounded-xl px-2.5 py-1.5 transition-colors",
      modelPillActive: "text-xs font-semibold text-cyan-900 bg-cyan-100/90 border border-cyan-300 rounded-xl px-2.5 py-1.5",
      sendButton: "bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm p-2.5 rounded-xl transition-all active:scale-95",
      stopButton: "bg-rose-500 hover:bg-rose-600 text-white shadow-sm p-2.5 rounded-xl transition-all active:scale-95",
      keyboardHint: "text-xs text-slate-500",
    },
  },

  // -------------------------------------------------------------
  // 2. CYBER-ORBITAL (Linear / Raycast / Obsidian Precision)
  // -------------------------------------------------------------
  cyber: {
    id: "cyber",
    name: "Cyber-Orbital",
    tagline: "Linear & Raycast Precision Dark",
    category: "Developer Tool",
    badge: "Obsidian Slate",
    rootClass: "theme-cyber text-slate-100 dark",
    bgOverlay: "bg-slate-950/60",
    header: {
      container: "bg-slate-950/75 backdrop-blur-2xl border-b border-slate-800/80 shadow-md",
      brandText: "text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-1.5",
      subText: "text-xs font-mono font-medium text-cyan-400",
      button: "p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 transition-colors",
      badge: "text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/80 px-2.5 py-1 rounded-md shadow-xs",
    },
    sidebar: {
      container: "bg-slate-950/80 backdrop-blur-3xl border-r border-slate-800/80 shadow-2xl",
      header: "border-b border-slate-800/80 bg-slate-900/40",
      brandText: "text-sm font-bold tracking-tight text-slate-100",
      subText: "text-xs font-mono text-cyan-400",
      newChatBtn: "bg-slate-900 hover:bg-slate-800 border border-slate-750 text-slate-100 font-semibold text-xs tracking-wide shadow-sm hover:border-cyan-500/50",
      sessionItemActive: "bg-slate-900/90 border-slate-700/80 text-white border-l-2 border-l-cyan-400 shadow-sm font-semibold",
      sessionItemInactive: "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50 font-medium",
      footer: "border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-400 font-mono",
    },
    message: {
      userContainer: "bg-slate-900/80 backdrop-blur-2xl border border-slate-700/70 text-slate-100 shadow-lg shadow-black/30 rounded-xl p-4 md:p-5 border-l-2 border-l-slate-400",
      assistantContainer: "bg-slate-950/85 backdrop-blur-2xl border border-slate-800/90 text-slate-100 shadow-2xl shadow-black/50 rounded-xl p-4 md:p-5 w-full border-l-2 border-l-cyan-500",
      userAvatar: "w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center shadow-xs text-cyan-400",
      authorTextUser: "text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider",
      authorTextAssistant: "text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider",
      badge: "text-xs font-mono font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded",
      timestamp: "text-xs font-mono text-slate-400",
      bodyTextUser: "text-sm leading-relaxed text-slate-200 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-slate-100",
      copyButton: "text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 p-1.5 rounded-lg transition-colors",
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-slate-950/85 backdrop-blur-2xl border border-slate-800 focus-within:border-cyan-500/80 shadow-2xl shadow-black/60 focus-within:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all",
      textarea: "text-sm text-slate-100 placeholder-slate-400 font-sans",
      modelPill: "text-xs font-mono font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 transition-colors",
      modelPillActive: "text-xs font-mono font-semibold text-cyan-300 bg-cyan-950/90 border border-cyan-600 rounded-lg px-2.5 py-1.5",
      sendButton: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md p-2.5 rounded-lg transition-all active:scale-95",
      stopButton: "bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold shadow-md p-2.5 rounded-lg transition-all active:scale-95",
      keyboardHint: "text-xs font-mono text-slate-400",
    },
  },

  // -------------------------------------------------------------
  // 3. EDITORIAL QUARTZ (Stripe Press / Intellectual Monograph)
  // -------------------------------------------------------------
  editorial: {
    id: "editorial",
    name: "Editorial Quartz",
    tagline: "Stripe Press & Intellectual Monograph",
    category: "High-Fashion",
    badge: "Quartz Folio",
    rootClass: "theme-editorial text-stone-900 font-serif-accent",
    bgOverlay: "bg-stone-100/40",
    header: {
      container: "bg-[#faf7f2]/85 backdrop-blur-2xl border-b border-[#e7e1d5] shadow-xs",
      brandText: "text-sm font-semibold tracking-wide text-stone-900 uppercase font-sans",
      subText: "text-xs font-mono tracking-wider text-amber-800 uppercase",
      button: "p-2 rounded-xl text-stone-600 hover:text-stone-950 hover:bg-[#eae4d7] transition-colors",
      badge: "text-xs font-mono tracking-widest text-amber-900 bg-amber-100/80 border border-amber-300/80 px-2.5 py-1 rounded-sm uppercase",
    },
    sidebar: {
      container: "bg-[#f5f0e6]/90 backdrop-blur-3xl border-r border-[#e2dacb] shadow-xl",
      header: "border-b border-[#e2dacb] bg-[#ece4d3]/60",
      brandText: "text-sm font-bold tracking-wider text-stone-900 uppercase font-sans",
      subText: "text-xs font-mono text-amber-900 tracking-wider uppercase",
      newChatBtn: "bg-[#fbf9f5] hover:bg-white border border-[#d6ccb8] text-stone-900 font-medium text-xs tracking-wider uppercase shadow-xs",
      sessionItemActive: "bg-white/95 border-[#d0c5af] text-stone-950 shadow-xs font-semibold border-l-2 border-l-amber-800",
      sessionItemInactive: "text-stone-600 hover:text-stone-950 hover:bg-[#ece4d3]/60 font-medium",
      footer: "border-t border-[#e2dacb] bg-[#ede5d5]/50 text-xs text-stone-500 font-mono tracking-wider uppercase",
    },
    message: {
      userContainer: "bg-[#fbf9f5]/95 backdrop-blur-2xl border border-[#e4dcce] text-stone-900 shadow-md rounded-lg p-4 md:p-5",
      assistantContainer: "bg-[#f7f3eb]/95 backdrop-blur-2xl border border-[#ded5c5] text-stone-900 shadow-lg rounded-lg p-4 md:p-5 w-full",
      userAvatar: "w-8 h-8 rounded-full bg-[#ebe3d3] border border-[#d6ccb8] flex items-center justify-center text-stone-700 shadow-xs",
      assistantAvatar: "w-8 h-8 rounded-full bg-amber-100 border border-amber-300/70 flex items-center justify-center shadow-xs text-amber-900",
      authorTextUser: "text-xs font-mono uppercase tracking-widest text-stone-600 font-medium",
      authorTextAssistant: "text-xs font-mono uppercase tracking-widest text-amber-900 font-bold",
      badge: "text-xs font-mono text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2 py-0.5 rounded-sm tracking-wider uppercase",
      timestamp: "text-xs font-mono text-stone-500",
      bodyTextUser: "text-sm leading-relaxed text-stone-900 font-normal",
      bodyTextAssistant: "text-sm leading-relaxed text-stone-900",
      copyButton: "text-stone-500 hover:text-stone-900 hover:bg-[#eae4d7] p-1.5 rounded transition-colors",
      entryNumberPrefix: true,
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-xl bg-[#faf7f2]/95 backdrop-blur-2xl border border-[#ded5c5] shadow-lg focus-within:border-amber-800 focus-within:ring-1 focus-within:ring-amber-800/20 transition-all",
      textarea: "text-sm text-stone-900 placeholder-stone-500",
      modelPill: "text-xs font-mono text-stone-700 bg-[#ede5d5]/80 hover:bg-[#e4dcce] border border-[#d6ccb8] rounded px-2.5 py-1.5 transition-colors uppercase tracking-wider",
      modelPillActive: "text-xs font-mono font-semibold text-amber-950 bg-amber-100 border border-amber-400 rounded px-2.5 py-1.5 tracking-wider uppercase",
      sendButton: "bg-amber-800 hover:bg-amber-900 text-amber-50 font-medium p-2.5 rounded transition-all active:scale-95 shadow-xs",
      stopButton: "bg-stone-800 hover:bg-stone-900 text-white font-medium p-2.5 rounded transition-all active:scale-95 shadow-xs",
      keyboardHint: "text-xs font-mono text-stone-500 uppercase tracking-widest",
    },
  },

  // -------------------------------------------------------------
  // 4. AEROSPACE HUD (SpaceX Dragon / Interstellar Cockpit Telemetry)
  // -------------------------------------------------------------
  hud: {
    id: "hud",
    name: "Aerospace HUD",
    tagline: "SpaceX Dragon & Interstellar Telemetry",
    category: "Futuristic Tactical",
    badge: "Tactical HUD",
    rootClass: "theme-hud text-cyan-300 dark font-mono-ui",
    bgOverlay: "bg-black/40",
    header: {
      container: "bg-[#060b14]/85 backdrop-blur-2xl border-b border-cyan-500/30 shadow-[0_4px_20px_rgba(6,182,212,0.15)]",
      brandText: "text-sm font-mono font-bold tracking-widest text-cyan-300 uppercase",
      subText: "text-xs font-mono text-cyan-400 tracking-wider",
      button: "p-2 rounded-lg text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60 border border-transparent hover:border-cyan-500/30 transition-all",
      badge: "text-xs font-mono font-bold text-cyan-300 bg-cyan-950/90 border border-cyan-400/60 px-2.5 py-1 rounded shadow-[0_0_10px_rgba(6,182,212,0.25)] tracking-widest uppercase",
    },
    sidebar: {
      container: "bg-[#040810]/90 backdrop-blur-3xl border-r border-cyan-500/30 shadow-2xl",
      header: "border-b border-cyan-500/30 bg-[#070e1c]/60",
      brandText: "text-sm font-mono font-bold tracking-widest text-cyan-300 uppercase",
      subText: "text-xs font-mono text-cyan-400 tracking-widest uppercase",
      newChatBtn: "bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(6,182,212,0.15)]",
      sessionItemActive: "bg-cyan-950/90 border-cyan-400/80 text-cyan-100 font-mono font-bold border-l-2 border-l-cyan-300 shadow-[inset_0_0_12px_rgba(6,182,212,0.15)]",
      sessionItemInactive: "text-cyan-400/70 hover:text-cyan-200 hover:bg-cyan-950/40 font-mono text-xs",
      footer: "border-t border-cyan-500/30 bg-[#03060c]/80 text-xs text-cyan-400/60 font-mono uppercase tracking-widest",
    },
    message: {
      userContainer: "bg-[#091120]/85 backdrop-blur-2xl border border-cyan-500/40 text-cyan-100 shadow-[0_0_20px_rgba(6,182,212,0.1)] rounded-lg p-4 md:p-5 relative",
      assistantContainer: "bg-[#050c18]/90 backdrop-blur-2xl border border-cyan-400/50 text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.15)] rounded-lg p-4 md:p-5 w-full relative",
      userAvatar: "w-8 h-8 rounded bg-cyan-950 border border-cyan-500/60 flex items-center justify-center text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]",
      assistantAvatar: "w-8 h-8 rounded bg-[#031828] border border-cyan-400 flex items-center justify-center shadow-[0_0_12px_rgba(6,182,212,0.4)] text-cyan-300",
      authorTextUser: "text-xs font-mono font-bold uppercase tracking-widest text-cyan-400",
      authorTextAssistant: "text-xs font-mono font-bold uppercase tracking-widest text-cyan-300",
      badge: "text-xs font-mono font-bold text-cyan-300 bg-cyan-950 border border-cyan-400/80 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(6,182,212,0.3)] tracking-widest uppercase",
      timestamp: "text-xs font-mono text-cyan-400/60",
      bodyTextUser: "text-sm leading-relaxed text-cyan-100 font-mono",
      bodyTextAssistant: "text-sm leading-relaxed text-cyan-100",
      copyButton: "text-cyan-400 hover:text-cyan-100 hover:bg-cyan-950/80 border border-transparent hover:border-cyan-500/40 p-1.5 rounded transition-all",
      cornerBrackets: true,
    },
    input: {
      container: "max-w-4xl",
      wrapper: "rounded-lg bg-[#070e1c]/90 backdrop-blur-2xl border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] focus-within:border-cyan-300 focus-within:shadow-[0_0_35px_rgba(6,182,212,0.35)] transition-all relative",
      textarea: "text-sm text-cyan-100 placeholder-cyan-500/50 font-mono",
      modelPill: "text-xs font-mono text-cyan-400 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-600/60 rounded px-2.5 py-1.5 transition-colors uppercase tracking-widest",
      modelPillActive: "text-xs font-mono font-bold text-cyan-200 bg-cyan-900/90 border border-cyan-300 rounded px-2.5 py-1.5 uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.3)]",
      sendButton: "bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-mono font-bold p-2.5 rounded shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all active:scale-95",
      stopButton: "bg-rose-500 hover:bg-rose-400 text-slate-950 font-mono font-bold p-2.5 rounded shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all active:scale-95",
      keyboardHint: "text-xs font-mono text-cyan-400/60 uppercase tracking-widest",
    },
  },
};
