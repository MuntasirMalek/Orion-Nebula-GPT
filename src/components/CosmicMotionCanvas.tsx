import React, { useEffect, useRef } from "react";
import { ThemeConfig } from "../themes";

interface CosmicMotionCanvasProps {
  theme: ThemeConfig;
  motionEnabled?: boolean;
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasSpikes: boolean;
  spikeLength: number;
}

interface Stardust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface SupernovaSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  prevX: number;
  prevY: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  drag: number;
}

interface SupernovaExplosion {
  x: number;
  y: number;
  age: number;
  maxAge: number;
  coreRadius: number;
  shockwaveRadius: number;
  maxShockwaveRadius: number;
  coreColor: string;
  ringColor: string;
  sparks: SupernovaSpark[];
}

const TWO_PI = Math.PI * 2;

export const CosmicMotionCanvas: React.FC<CosmicMotionCanvasProps> = ({
  theme,
  motionEnabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    vx: number;
    vy: number;
  }>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
  });

  const starsRef = useRef<Star[]>([]);
  const stardustRef = useRef<Stardust[]>([]);
  const explosionsRef = useRef<SupernovaExplosion[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Fast zero-overhead 4-point telescope optical diffraction spikes (Hubble / JWST style)
  const drawDiffractionSpikesFast = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    length: number,
    alpha: number,
    color: string
  ) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Horizontal + Vertical spikes in a single path
    ctx.beginPath();
    ctx.moveTo(x - length, y);
    ctx.lineTo(x + length, y);
    ctx.moveTo(x, y - length);
    ctx.lineTo(x, y + length);

    // 45-degree micro-spikes for brilliant stars
    if (length > 18) {
      const diagLength = length * 0.45;
      ctx.moveTo(x - diagLength, y - diagLength);
      ctx.lineTo(x + diagLength, y + diagLength);
      ctx.moveTo(x - diagLength, y + diagLength);
      ctx.lineTo(x + diagLength, y - diagLength);
    }
    ctx.stroke();
  };

  // Trigger realistic astronomical Supernova Detonation at (x, y)
  const triggerSupernova = (x: number, y: number) => {
    if (!motionEnabled) return;
    const colors =
      theme.canvasColors && theme.canvasColors.length > 0
        ? theme.canvasColors
        : ["#ffffff", "#d97706", "#78350f", "#fef3c7"];

    const primaryColor = colors[0] || "#ffffff";
    const accentColor = colors[1] || colors[0];

    const isMobile = window.innerWidth < 768;
    const sparkCount = isMobile ? 28 : 44; // Optimized spark count for smooth mobile rendering

    const sparks: SupernovaSpark[] = [];
    for (let i = 0; i < sparkCount; i++) {
      const angle = (TWO_PI * i) / sparkCount + (Math.random() - 0.5) * 0.25;
      const speed = Math.random() * 9 + 3.0;
      const col = colors[Math.floor(Math.random() * colors.length)];
      sparks.push({
        x,
        y,
        prevX: x,
        prevY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.2 + 1.0,
        color: col,
        alpha: 1.0,
        decay: Math.random() * 0.024 + 0.015,
        drag: 0.962,
      });
    }

    // High-speed central ejecta
    const centralCount = isMobile ? 8 : 14;
    for (let i = 0; i < centralCount; i++) {
      const angle = Math.random() * TWO_PI;
      const speed = Math.random() * 14 + 6;
      sparks.push({
        x,
        y,
        prevX: x,
        prevY: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 1.5 + 0.8,
        color: "#ffffff",
        alpha: 1.0,
        decay: Math.random() * 0.04 + 0.025,
        drag: 0.945,
      });
    }

    explosionsRef.current.push({
      x,
      y,
      age: 0,
      maxAge: 60,
      coreRadius: isMobile ? 28 : 36,
      shockwaveRadius: 4,
      maxShockwaveRadius: Math.min(window.innerWidth, window.innerHeight) * (isMobile ? 0.32 : 0.38),
      coreColor: primaryColor,
      ringColor: accentColor,
      sparks,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.prevX = width / 2;
    mouseRef.current.prevY = height / 2;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    // Initialize realistic celestial stars (responsive count for phone / desktop)
    const initStars = () => {
      const isMobile = width < 768;
      const count = isMobile
        ? Math.min(40, Math.max(22, Math.floor(width / 10)))
        : Math.min(85, Math.max(45, Math.floor(width / 18)));

      const colors = theme.canvasColors;
      const list: Star[] = [];

      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const baseAlpha = Math.random() * 0.65 + 0.25;
        // The brightest ~20% of stars have telescope optical diffraction spikes
        const hasSpikes = i % 5 === 0;
        const size = hasSpikes
          ? Math.random() * 2.0 + 1.2
          : Math.random() * 1.5 + 0.5;
        const spikeLength = size * (Math.random() * 5 + 6);

        const col =
          colors && colors.length > 0
            ? colors[Math.floor(Math.random() * colors.length)]
            : "#ffffff";

        list.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size,
          alpha: baseAlpha,
          baseAlpha,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * TWO_PI,
          color: col,
          hasSpikes,
          spikeLength,
        });
      }
      starsRef.current = list;
    };

    initStars();

    // Mouse move: capture cursor velocity and spawn subtle stardust
    const handleMouseMove = (e: MouseEvent) => {
      const prevX = mouseRef.current.x;
      const prevY = mouseRef.current.y;
      const vx = e.clientX - prevX;
      const vy = e.clientY - prevY;

      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.prevX = prevX;
      mouseRef.current.prevY = prevY;
      mouseRef.current.vx = vx;
      mouseRef.current.vy = vy;

      if (!motionEnabled) return;

      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > 2.0 && stardustRef.current.length < 35) {
        const colors = theme.canvasColors;
        const col =
          colors && colors.length > 0
            ? colors[Math.floor(Math.random() * colors.length)]
            : "#ffffff";

        stardustRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          vx: vx * 0.12 + (Math.random() - 0.5) * 0.6,
          vy: vy * 0.12 + (Math.random() - 0.5) * 0.6,
          size: Math.random() * 1.8 + 0.8,
          alpha: 0.8,
          color: col,
          life: 0,
          maxLife: 25 + Math.random() * 15,
        });
      }
    };

    // Mobile Touch handling (smooth stardust wake without interfering with scrolling)
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        mouseRef.current.x = touchStartX;
        mouseRef.current.y = touchStartY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!motionEnabled || e.touches.length === 0) return;
      const t = e.touches[0];
      const vx = t.clientX - mouseRef.current.x;
      const vy = t.clientY - mouseRef.current.y;
      mouseRef.current.x = t.clientX;
      mouseRef.current.y = t.clientY;

      if (Math.hypot(vx, vy) > 3 && stardustRef.current.length < 25) {
        const colors = theme.canvasColors;
        const col = colors && colors.length > 0 ? colors[0] : "#ffffff";
        stardustRef.current.push({
          x: t.clientX,
          y: t.clientY,
          vx: vx * 0.1,
          vy: vy * 0.1,
          size: 1.5,
          alpha: 0.7,
          color: col,
          life: 0,
          maxLife: 20,
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const duration = Date.now() - touchStartTime;
      if (duration < 300) {
        const changedTouch = e.changedTouches[0];
        if (changedTouch) {
          const dist = Math.hypot(
            changedTouch.clientX - touchStartX,
            changedTouch.clientY - touchStartY
          );
          if (dist < 15) {
            // It was a quick tap, not a drag scroll!
            const target = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
            if (
              target &&
              !target.closest("button") &&
              !target.closest("input") &&
              !target.closest("textarea") &&
              !target.closest("a")
            ) {
              triggerSupernova(changedTouch.clientX, changedTouch.clientY);
            }
          }
        }
      }
    };

    // Window click: trigger realistic Supernova Detonation
    const handleWindowClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("a")
      ) {
        return;
      }
      triggerSupernova(e.clientX, e.clientY);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("click", handleWindowClick);

    // Visibility change: Pause loop when tab is hidden to save 100% mobile battery
    let isHidden = document.hidden;
    const handleVisibilityChange = () => {
      isHidden = document.hidden;
      if (!isHidden && !animFrameRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // =========================================================================
    // High-Performance 60/120 FPS Optimized Optical Animation Loop
    // =========================================================================
    const render = () => {
      if (isHidden) {
        animFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "screen";

      const mouseNormX = (mouseRef.current.x - width / 2) / width;
      const mouseNormY = (mouseRef.current.y - height / 2) / height;

      // 1. Render Realistic Twinkling Stars (No ctx.save/restore overhead)
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        if (motionEnabled) {
          star.twinklePhase += star.twinkleSpeed;
          star.alpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.28;
          if (star.alpha < 0.12) star.alpha = 0.12;
          else if (star.alpha > 1.0) star.alpha = 1.0;

          const parallax = star.size * 2.8;
          star.x = star.baseX - mouseNormX * parallax;
          star.y = star.baseY - mouseNormY * parallax;
        }

        // Draw soft Airy disc halo
        ctx.globalAlpha = star.alpha;
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, TWO_PI);
        ctx.fill();

        // Draw optical diffraction spikes for major stars
        if (star.hasSpikes && star.alpha > 0.45) {
          drawDiffractionSpikesFast(
            ctx,
            star.x,
            star.y,
            star.spikeLength * (0.8 + star.alpha * 0.4),
            star.alpha * 0.75,
            star.color
          );
        }
      }

      // 2. Render Cursor Stardust Fluid Wake
      const dustList = stardustRef.current;
      for (let i = dustList.length - 1; i >= 0; i--) {
        const dust = dustList[i];
        dust.x += dust.vx;
        dust.y += dust.vy;
        dust.vx *= 0.94;
        dust.vy *= 0.94;
        dust.life++;

        const lifeRatio = dust.life / dust.maxLife;
        const currentAlpha = dust.alpha * (1 - lifeRatio);

        if (lifeRatio >= 1 || currentAlpha <= 0.02) {
          dustList.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = dust.color;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size * (1 - lifeRatio * 0.4), 0, TWO_PI);
        ctx.fill();
      }

      // 3. Render Hyper-Realistic Supernova Detonations
      const explosions = explosionsRef.current;
      for (let eIdx = explosions.length - 1; eIdx >= 0; eIdx--) {
        const exp = explosions[eIdx];
        exp.age++;
        const progress = exp.age / exp.maxAge;

        if (progress >= 1) {
          explosions.splice(eIdx, 1);
          continue;
        }

        // A) Brilliant Core Flash with 4-Point Optical Diffraction Flare (Initial 35%)
        if (progress < 0.35) {
          const coreProgress = progress / 0.35;
          const flashAlpha = (1 - coreProgress) * 0.95;
          const flareRadius = exp.coreRadius * (1 - coreProgress * 0.5);

          const coreGrad = ctx.createRadialGradient(
            exp.x,
            exp.y,
            0,
            exp.x,
            exp.y,
            flareRadius
          );
          coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
          coreGrad.addColorStop(0.35, hexToRgba(exp.coreColor, flashAlpha * 0.7));
          coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.globalAlpha = 1.0;
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, flareRadius, 0, TWO_PI);
          ctx.fill();

          drawDiffractionSpikesFast(
            ctx,
            exp.x,
            exp.y,
            flareRadius * 3.8,
            flashAlpha,
            "#ffffff"
          );
        }

        // B) Expanding Relativistic Plasma Shockwave Ring
        exp.shockwaveRadius += (exp.maxShockwaveRadius - exp.shockwaveRadius) * 0.09;
        const shockAlpha = Math.sin((1 - progress) * Math.PI) * 0.75;

        if (shockAlpha > 0.01) {
          ctx.globalAlpha = 1.0;
          ctx.lineWidth = Math.max(1, 3.2 * (1 - progress));
          ctx.strokeStyle = hexToRgba(exp.ringColor, shockAlpha);
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, exp.shockwaveRadius, 0, TWO_PI);
          ctx.stroke();

          // Subtle inner ionization glow
          const ringGrad = ctx.createRadialGradient(
            exp.x,
            exp.y,
            Math.max(0, exp.shockwaveRadius - 6),
            exp.x,
            exp.y,
            exp.shockwaveRadius + 6
          );
          ringGrad.addColorStop(0, "transparent");
          ringGrad.addColorStop(0.5, hexToRgba(exp.coreColor, shockAlpha * 0.25));
          ringGrad.addColorStop(1, "transparent");
          ctx.fillStyle = ringGrad;
          ctx.beginPath();
          ctx.arc(exp.x, exp.y, exp.shockwaveRadius + 6, 0, TWO_PI);
          ctx.fill();
        }

        // C) Ejecta Sparks with Radiant Velocity Drag & Motion Trails
        for (let sIdx = exp.sparks.length - 1; sIdx >= 0; sIdx--) {
          const spark = exp.sparks[sIdx];
          spark.prevX = spark.x;
          spark.prevY = spark.y;
          spark.x += spark.vx;
          spark.y += spark.vy;
          spark.vx *= spark.drag;
          spark.vy *= spark.drag;
          spark.alpha -= spark.decay;

          if (spark.alpha <= 0.02) {
            exp.sparks.splice(sIdx, 1);
            continue;
          }

          // Motion trail ray
          ctx.globalAlpha = spark.alpha * 0.8;
          ctx.strokeStyle = spark.color;
          ctx.lineWidth = spark.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(spark.prevX, spark.prevY);
          ctx.lineTo(spark.x, spark.y);
          ctx.stroke();

          // Spark head
          ctx.globalAlpha = spark.alpha;
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(spark.x, spark.y, spark.size * 0.5, 0, TWO_PI);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("click", handleWindowClick);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [theme, motionEnabled]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full select-none transform-gpu"
    />
  );
};

// Helper: Convert HEX or RGB to rgba() string
function hexToRgba(hexOrRgb: string, alpha: number): string {
  if (!hexOrRgb) return `rgba(255, 255, 255, ${alpha})`;
  if (hexOrRgb.startsWith("rgba")) return hexOrRgb;
  if (hexOrRgb.startsWith("rgb")) {
    return hexOrRgb.replace("rgb", "rgba").replace(")", `, ${alpha})`);
  }

  const clean = hexOrRgb.replace("#", "");
  let r = 255;
  let g = 255;
  let b = 255;

  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16) || 255;
    g = parseInt(clean[1] + clean[1], 16) || 255;
    b = parseInt(clean[2] + clean[2], 16) || 255;
  } else if (clean.length === 6) {
    r = parseInt(clean.substring(0, 2), 16) || 255;
    g = parseInt(clean.substring(2, 4), 16) || 255;
    b = parseInt(clean.substring(4, 6), 16) || 255;
  }

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
