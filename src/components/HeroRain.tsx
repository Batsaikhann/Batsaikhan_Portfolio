"use client";

import { useEffect, useRef } from "react";
import { effectOff } from "@/lib/perf-lab";

// Mongolian Cyrillic + code glyphs — all inside the mono font, so the rain never hits a fallback font.
const GLYPHS = "БГДЁЖЗИЙЛПФЦЧШЩЪЫЬЭЮЯӨҮбгджзлпфцшщыэюяөү0123456789{}<>/=+*";

const LAYERS = [
  { size: 12, alpha: 0.22, speed: 0.6, count: 26 },
  { size: 18, alpha: 0.38, speed: 1.1, count: 16 },
  { size: 30, alpha: 0.6, speed: 1.8, count: 7 },
];

/** One layer's glyphs pre-drawn in both colours, cell by cell, at the layer's largest drop size. */
type Sheet = { head: HTMLCanvasElement; tail: HTMLCanvasElement; cell: number; baseline: number; fontPx: number };

type Drop = { x: number; y: number; speed: number; size: number; alpha: number; length: number; sheet: number; chars: number[] };

const pick = () => (Math.random() * GLYPHS.length) | 0;

/**
 * Red falling-glyph rain behind the hero. Columns live on three depth layers
 * (small/dim/slow far away, large/bright/fast up close) to fake depth of field.
 * Paused when the hero is off screen or the tab is hidden; static with reduced motion; lighter on touch / small screens.
 */
export function HeroRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || effectOff("rain")) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones, tablets and in-app browsers: same rain, cheaper — 1× pixels and 20 redraws a second
    // (each step moves 1.5× as far, so it falls at the same speed).
    const lite = matchMedia("(max-width: 760px), (hover: none)").matches;
    const interval = lite ? 50 : 33;
    const pace = lite ? 1.5 : 1;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    const dpr = lite ? 1 : Math.min(devicePixelRatio, 1.5);

    // Canvas can't resolve CSS variables, so read the hashed next/font family name once.
    const monoFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";

    // fillText on a canvas that is in the page makes the browser resolve that canvas's style first. With ~600
    // glyphs a frame, that forced a full style recalc on every frame the cursor had just moved something. The
    // glyphs are drawn once onto off-page sheets instead, and each frame only copies them with drawImage.
    let sheets: Sheet[] = [];
    const drawSheets = () => {
      sheets = LAYERS.map((layer) => {
        const fontPx = layer.size * 1.15 * dpr; // largest drop of the layer, so cells are only ever scaled down
        const cell = Math.ceil(fontPx * 1.3);
        const baseline = Math.round(cell * 0.8);
        const paint = (color: string) => {
          const sheet = document.createElement("canvas");
          sheet.width = cell * GLYPHS.length;
          sheet.height = cell;
          const g = sheet.getContext("2d")!;
          g.font = `600 ${fontPx}px ${monoFamily}`;
          g.textAlign = "center";
          g.fillStyle = color;
          for (let i = 0; i < GLYPHS.length; i++) g.fillText(GLYPHS[i], i * cell + cell / 2, baseline);
          return sheet;
        };
        // Bright pinkish head, deep red tail.
        return { head: paint("rgb(255, 150, 160)"), tail: paint("rgb(229, 36, 59)"), cell, baseline, fontPx };
      });
    };

    const seed = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const density = width < 700 ? 0.5 : 1;
      drops = LAYERS.flatMap((layer, sheet) =>
        Array.from({ length: Math.round(layer.count * density) }, () => ({
          x: Math.random() * width,
          y: Math.random() * height * 1.5 - height * 0.5,
          speed: layer.speed * (0.7 + Math.random() * 0.6),
          size: layer.size * (0.85 + Math.random() * 0.3),
          alpha: layer.alpha,
          length: 6 + ((Math.random() * 14) | 0),
          sheet,
          chars: Array.from({ length: 20 }, pick),
        })),
      );
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const d of drops) {
        const { head, tail, cell, baseline, fontPx } = sheets[d.sheet];
        // Sheet pixels → CSS px: the sheet was drawn at fontPx device pixels, the drop is d.size CSS px.
        const k = d.size / fontPx;
        const w = cell * k;
        for (let i = 0; i < d.length; i++) {
          const y = d.y - i * d.size * 1.1;
          if (y < -d.size || y > height + d.size) continue;
          const fade = 1 - i / d.length;
          ctx.globalAlpha = i === 0 ? Math.min(1, d.alpha * 1.4) : d.alpha * fade * 0.9;
          const glyph = d.chars[i % d.chars.length];
          ctx.drawImage(i === 0 ? head : tail, glyph * cell, 0, cell, cell, d.x - w / 2, y - baseline * k, w, w);
        }
      }
      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const d of drops) {
        d.y += d.speed * pace;
        if (Math.random() < 0.04) d.chars[(Math.random() * d.chars.length) | 0] = pick();
        if (d.y - d.length * d.size * 1.1 > height) {
          d.y = -Math.random() * height * 0.3;
          d.x = Math.random() * width;
        }
      }
    };

    drawSheets();
    seed();
    draw();
    // Redraw the sheets once the mono web font is ready, in case they were drawn with the fallback.
    let disposed = false;
    document.fonts.ready.then(() => {
      if (disposed) return;
      drawSheets();
      draw();
    });
    const resizeObserver = new ResizeObserver(() => {
      seed();
      draw();
    });
    resizeObserver.observe(canvas);
    if (reduced)
      return () => {
        disposed = true;
        resizeObserver.disconnect();
      };

    let frame = 0;
    let last = 0;
    let visible = true;
    const running = () => visible && !document.hidden;
    const loop = (now: number) => {
      if (!running()) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(loop);
      if (now - last < interval) return; // ~30fps is plenty (20 on touch)
      last = now;
      step();
      draw();
    };
    const resume = () => {
      if (!frame && running()) frame = requestAnimationFrame(loop);
    };
    resume();
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      resume();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", resume);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas className="hero-rain" ref={canvasRef} aria-hidden="true" />;
}
