"use client";

import { useEffect, useRef } from "react";

// Mongolian Cyrillic + code glyphs — all inside the mono font, so the rain never hits a fallback font.
const GLYPHS = "БГДЁЖЗИЙЛПФЦЧШЩЪЫЬЭЮЯӨҮбгджзлпфцшщыэюяөү0123456789{}<>/=+*";

const LAYERS = [
  { size: 12, alpha: 0.22, speed: 0.6, count: 26 },
  { size: 18, alpha: 0.38, speed: 1.1, count: 16 },
  { size: 30, alpha: 0.6, speed: 1.8, count: 7 },
];

// Dia stalls the page's main thread for 50–80 ms about eight times a second while one canvas — or several
// touching canvases — covers more than roughly half of the viewport (measured in Dia 1.53; Chrome is unaffected).
// So the rain is drawn on side-by-side strips with a hairline gap between them, and no drop is placed across a
// gap, which keeps it looking exactly like one canvas.
const STRIPS = 3;
const GAP = 2; // CSS px

/** One layer's glyphs pre-drawn in both colours, cell by cell, at the layer's largest drop size. */
type Sheet = { head: CanvasImageSource; tail: CanvasImageSource; cell: number; baseline: number; fontPx: number };

type Drop = { x: number; y: number; speed: number; size: number; alpha: number; length: number; sheet: number; chars: number[] };

type Strip = { ctx: CanvasRenderingContext2D; x0: number; x1: number };

const pick = () => (Math.random() * GLYPHS.length) | 0;

/**
 * Red falling-glyph rain behind the hero. Columns live on three depth layers
 * (small/dim/slow far away, large/bright/fast up close) to fake depth of field.
 * Paused when the hero is off screen or the tab is hidden; static with reduced motion; lighter on touch / small screens.
 */
export function HeroRain() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvases = host ? [...host.querySelectorAll("canvas")] : [];
    if (!host) return;
    const contexts = canvases.map((canvas) => canvas.getContext("2d"));
    if (contexts.some((ctx) => !ctx)) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Phones, tablets and in-app browsers: same rain, cheaper — 1× pixels and 20 redraws a second
    // (each step moves 1.5× as far, so it falls at the same speed).
    const lite = matchMedia("(max-width: 760px), (hover: none)").matches;
    const interval = lite ? 50 : 33;
    const pace = lite ? 1.5 : 1;

    let width = 0;
    let height = 0;
    let drops: Drop[] = [];
    let strips: Strip[] = [];
    let gaps: number[] = []; // centre x of each gap between strips
    let disposed = false;
    const dpr = lite ? 1 : Math.min(devicePixelRatio, 1.5);

    // Canvas can't resolve CSS variables, so read the hashed next/font family name once.
    const monoFamily = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";

    // fillText on a canvas that is in the page makes the browser resolve that canvas's style first. With ~600
    // glyphs a frame, that forced a full style recalc on every frame the cursor had just moved something. The
    // glyphs are drawn once onto off-page sheets instead, and each frame only copies them with drawImage.
    let sheets: Sheet[] = [];
    const drawSheets = () => {
      for (const old of sheets) for (const image of [old.head, old.tail]) if (image instanceof ImageBitmap) image.close();
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
        const sheet: Sheet = { head: paint("rgb(255, 150, 160)"), tail: paint("rgb(229, 36, 59)"), cell, baseline, fontPx };
        // Drawing from a canvas snapshots it on every call; a bitmap is copied as is.
        Promise.all([createImageBitmap(sheet.head as HTMLCanvasElement), createImageBitmap(sheet.tail as HTMLCanvasElement)])
          .then(([head, tail]) => {
            if (disposed || !sheets.includes(sheet)) return void (head.close(), tail.close());
            sheet.head = head;
            sheet.tail = tail;
          })
          .catch(() => {});
        return sheet;
      });
    };

    // A random column position whose glyphs never straddle a gap between strips.
    const placeX = (size: number) => {
      const clearance = size * 0.45 + GAP / 2; // mono glyphs are ~0.6em wide
      for (let tries = 0; tries < 20; tries++) {
        const x = Math.random() * width;
        if (gaps.every((g) => Math.abs(x - g) > clearance)) return x;
      }
      return (strips[0].x0 + strips[0].x1) / 2;
    };

    const seed = () => {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const stripWidth = (width - GAP * (STRIPS - 1)) / STRIPS;
      strips = canvases.map((canvas, i) => {
        const x0 = i * (stripWidth + GAP);
        canvas.style.left = `${x0}px`;
        canvas.style.width = `${stripWidth}px`;
        canvas.width = Math.round(stripWidth * dpr);
        canvas.height = Math.round(height * dpr);
        return { ctx: contexts[i]!, x0, x1: x0 + stripWidth };
      });
      gaps = strips.slice(1).map((s) => s.x0 - GAP / 2);
      const density = width < 700 ? 0.5 : 1;
      drops = LAYERS.flatMap((layer, sheet) =>
        Array.from({ length: Math.round(layer.count * density) }, () => {
          const size = layer.size * (0.85 + Math.random() * 0.3);
          return {
            x: placeX(size),
            y: Math.random() * height * 1.5 - height * 0.5,
            speed: layer.speed * (0.7 + Math.random() * 0.6),
            size,
            alpha: layer.alpha,
            length: 6 + ((Math.random() * 14) | 0),
            sheet,
            chars: Array.from({ length: 20 }, pick),
          };
        }),
      );
    };

    const draw = () => {
      for (const { ctx, x0, x1 } of strips) {
        // Each strip draws the same scene, shifted so it shows only its own slice.
        ctx.setTransform(dpr, 0, 0, dpr, -x0 * dpr, 0);
        ctx.clearRect(x0, 0, x1 - x0, height);
        for (const d of drops) {
          const { head, tail, cell, baseline, fontPx } = sheets[d.sheet];
          // Sheet pixels → CSS px: the sheet was drawn at fontPx device pixels, the drop is d.size CSS px.
          const k = d.size / fontPx;
          const w = cell * k;
          if (d.x + w / 2 < x0 || d.x - w / 2 > x1) continue;
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
      }
    };

    const step = () => {
      for (const d of drops) {
        d.y += d.speed * pace;
        if (Math.random() < 0.04) d.chars[(Math.random() * d.chars.length) | 0] = pick();
        if (d.y - d.length * d.size * 1.1 > height) {
          d.y = -Math.random() * height * 0.3;
          d.x = placeX(d.size);
        }
      }
    };

    drawSheets();
    seed();
    draw();
    // Redraw the sheets once the mono web font is ready, in case they were drawn with the fallback.
    document.fonts.ready.then(() => {
      if (disposed) return;
      drawSheets();
      draw();
    });
    const resizeObserver = new ResizeObserver(() => {
      seed();
      draw();
    });
    resizeObserver.observe(host);
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
    io.observe(host);
    document.addEventListener("visibilitychange", resume);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="hero-rain" ref={hostRef} aria-hidden="true">
      {Array.from({ length: STRIPS }, (_, i) => (
        <canvas key={i} />
      ))}
    </div>
  );
}
