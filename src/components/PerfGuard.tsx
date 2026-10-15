"use client";

import { useEffect } from "react";

const SAMPLES = 240; // ~4 s of scrolling at 60 fps
const SLOW_FRAME_MS = 34; // under ~30 fps
const SLOW_SHARE = 0.3;

/**
 * Some Chromium-based browsers (Dia, Arc, machines without GPU raster) can't keep up with the
 * full-screen effects that run smoothly in Chrome. While the visitor scrolls, this watches real
 * frame times; if too many frames are dropped it switches the site to `html.is-lite` (see
 * globals.css), which removes the expensive layers, and remembers that for this browser.
 */
export function PerfGuard() {
  useEffect(() => {
    const root = document.documentElement;
    let forced: string | null = null;
    try {
      forced = localStorage.getItem("lite");
    } catch {}
    if (forced !== null || root.classList.contains("is-lite")) return;

    let total = 0;
    let slow = 0;
    let frame = 0;
    let last = 0;
    let lastScroll = 0;

    const sample = (now: number) => {
      // Stop sampling shortly after scrolling ends so idle frames aren't counted.
      if (now - lastScroll > 250) {
        frame = 0;
        last = 0;
        return;
      }
      // The preloader and route curtain are expected to be busy — don't judge those frames.
      if (last && !root.hasAttribute("data-loading") && document.visibilityState === "visible") {
        total++;
        if (now - last > SLOW_FRAME_MS) slow++;
      }
      last = now;
      if (total >= SAMPLES) {
        stop();
        if (slow / total > SLOW_SHARE) {
          root.classList.add("is-lite");
          try {
            localStorage.setItem("lite", "1");
          } catch {}
        }
        return;
      }
      frame = requestAnimationFrame(sample);
    };
    const onScroll = () => {
      lastScroll = performance.now();
      if (!frame) frame = requestAnimationFrame(sample);
    };
    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      removeEventListener("scroll", onScroll);
    }
    addEventListener("scroll", onScroll, { passive: true });
    return stop;
  }, []);

  return null;
}
