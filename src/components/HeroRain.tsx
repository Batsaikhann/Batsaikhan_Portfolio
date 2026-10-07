"use client";

import { useEffect, useRef } from "react";

// Mongolian Cyrillic + code glyphs — all inside the mono font, so the rain never hits a fallback font.
const GLYPHS = "БГДЁЖЗИЙЛПФЦЧШЩЪЫЬЭЮЯӨҮбгджзлпфцшщыэюяөү0123456789{}<>/=+*";

type Drop = { x: number; y: number; speed: number; size: number; alpha: number; length: number; chars: string[] };

const pick = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

/**
 * Red falling-glyph rain behind the hero. Columns live on three depth layers
 * (small/dim/slow far away, large/bright/fast up close) to fake depth of field.
 * Paused when the hero is off screen or the tab is hidden; static with reduced motion.
 */
export function HeroRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    const dpr = Math.min(devicePixelRatio, 1.5);

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = width < 700 ? 0.5 : 1;
      const layers = [
        { size: 12, alpha: 0.22, speed: 0.6, count: 26 },
        { size: 18, alpha: 0.38, speed: 1.1, count: 16 },
        { size: 30, alpha: 0.6, speed: 1.8, count: 7 },
      ];
      drops = layers.flatMap((layer) =>
        Array.from({ length: Math.round(layer.count * density) }, () => ({
          x: Math.random() * width,
          y: Math.random() * height * 1.5 - height * 0.5,
          speed: layer.speed * (0.7 + Math.random() * 0.6),
          size: layer.size * (0.85 + Math.random() * 0.3),
          alpha: layer.alpha,
          length: 6 + ((Math.random() * 14) | 0),
          chars: Array.from({ length: 20 }, pick),
        })),
      );
    };

    // Canvas can't resolve CSS variables, so read the hashed next/font family name once.
    const monoFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      for (const d of drops) {
        ctx.font = `600 ${d.size}px ${monoFamily}`;
        for (let i = 0; i < d.length; i++) {
          const y = d.y - i * d.size * 1.1;
          if (y < -d.size || y > height + d.size) continue;
          const fade = 1 - i / d.length;
          // Bright pinkish head, deep red tail.
          ctx.fillStyle =
            i === 0 ? `rgba(255, 150, 160, ${d.alpha * 1.4})` : `rgba(229, 36, 59, ${d.alpha * fade * 0.9})`;
          ctx.fillText(d.chars[i % d.chars.length], d.x, y);
        }
      }
    };

    const step = () => {
      for (const d of drops) {
        d.y += d.speed;
        if (Math.random() < 0.04) d.chars[(Math.random() * d.chars.length) | 0] = pick();
        if (d.y - d.length * d.size * 1.1 > height) {
          d.y = -Math.random() * height * 0.3;
          d.x = Math.random() * width;
        }
      }
    };

    seed();
    draw();
    const resizeObserver = new ResizeObserver(() => {
      seed();
      draw();
    });
    resizeObserver.observe(canvas);
    if (reduced) return () => resizeObserver.disconnect();

    let frame = 0;
    let last = 0;
    let visible = true;
    // Once the hero story has moved past the hero, the rain is faded out — stop drawing it.
    const story = canvas.closest<HTMLElement>(".story");
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop);
      if (!visible || document.hidden || now - last < 33) return; // ~30fps is plenty
      if (story && /portal|work|next/.test(story.dataset.phase ?? "")) return;
      last = now;
      step();
      draw();
    };
    frame = requestAnimationFrame(loop);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas className="hero-rain" ref={canvasRef} aria-hidden="true" />;
}
