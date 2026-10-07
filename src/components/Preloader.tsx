"use client";

import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";

const STATUS = [
  [0, "Loading assets"],
  [30, "Building interface"],
  [62, "Wiring systems"],
  [90, "Ready"],
] as const;

// First visit in a tab gets the full show; reloads in the same session only wait for real loading.
const MIN_FIRST_MS = 1900;
const MIN_REPEAT_MS = 700;
const MAX_MS = 8000;
const EXIT_MS = 1300;

/**
 * Full-screen intro shown on the first page load while the above-the-fold assets arrive.
 * Progress is real: eager images in the document, web fonts and the window load event, eased into a
 * 000 → 100 counter. At 100 the screen splits along a red line and opens onto the page; <html data-loading>
 * (set on the server) is removed at that moment, so the hero's intro animations start as it opens.
 * Client-side navigations never show it — the layout (and this component) stays mounted.
 */
export function Preloader() {
  const [state, setState] = useState<"loading" | "done" | "gone">("loading");
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const start = performance.now();
    let seen = false;
    try {
      seen = sessionStorage.getItem("pl-seen") === "1";
    } catch {}
    const minMs = seen ? MIN_REPEAT_MS : MIN_FIRST_MS;

    // Only what the first screen needs: lazy images further down load on scroll, so they don't count.
    const images = [...document.images].filter((img) => img.loading !== "lazy");
    const total = images.length + 2; // + fonts + window load
    let loaded = 0;
    const tick = () => loaded++;
    images.forEach((img) => {
      if (img.complete) tick();
      else {
        img.addEventListener("load", tick, { once: true });
        img.addEventListener("error", tick, { once: true });
      }
    });
    document.fonts.ready.then(tick);
    if (document.readyState === "complete") tick();
    else addEventListener("load", tick, { once: true });

    let shown = 0;
    let frame = 0;
    let exitTimer = 0;
    let lastStatus = "";
    const step = (now: number) => {
      const elapsed = now - start;
      // Real progress, but never ahead of the minimum show time, so the counter always travels smoothly.
      const real = loaded / total;
      const pacing = Math.min(1, elapsed / minMs);
      const target = elapsed > MAX_MS ? 1 : Math.min(real, pacing);
      shown += (target - shown) * 0.12;
      if (target === 1 && 1 - shown < 0.004) shown = 1;

      const pct = Math.round(shown * 100);
      if (countRef.current) countRef.current.textContent = String(pct).padStart(3, "0");
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown})`;
      const status = STATUS.findLast(([at]) => pct >= at)?.[1] ?? "";
      if (status !== lastStatus && statusRef.current) statusRef.current.textContent = lastStatus = status;

      if (shown < 1) {
        frame = requestAnimationFrame(step);
        return;
      }
      setState("done");
      root.removeAttribute("data-loading");
      try {
        sessionStorage.setItem("pl-seen", "1");
      } catch {}
      exitTimer = window.setTimeout(() => setState("gone"), EXIT_MS);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      removeEventListener("load", tick);
      // data-loading is left alone here: dev Strict Mode re-runs this effect, and the page must stay locked.
    };
  }, []);

  if (state === "gone") return null;

  return (
    <div className="preloader" data-state={state} role="status" aria-label="Loading">
      <span className="pl-panel is-top" aria-hidden="true" />
      <span className="pl-panel is-bottom" aria-hidden="true" />
      <span className="pl-seam" aria-hidden="true" />

      <div className="pl-ui" aria-hidden="true">
        <p className="pl-corner is-tl">Portfolio · ©2026</p>
        <p className="pl-corner is-tr">
          <i /> Ulaanbaatar, MN
        </p>

        <div className="pl-stage">
          <div className="pl-mark">
            <span className="pl-ring" />
            <span className="pl-orbit" />
            <Logo height={58} priority />
          </div>
          <p className="pl-name">
            Batsaikhan <span>Product builder</span>
          </p>
        </div>

        <div className="pl-foot">
          <p className="pl-status" ref={statusRef}>
            Loading assets
          </p>
          <p className="pl-count">
            <span ref={countRef}>000</span>
            <i>%</i>
          </p>
        </div>
        <span className="pl-bar">
          <i ref={barRef} />
        </span>
      </div>
    </div>
  );
}
