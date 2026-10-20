"use client";

import { useEffect, useRef, useState } from "react";
import { EFFECTS, applyOff, labEnabled, offEffects, type Effect } from "@/lib/perf-lab";

// Effects that are pure CSS are switched off here; the JS-driven ones check effectOff() where they start.
const CSS_OFF = `
html[data-perf-off~="cursor"] :is(.cursor, .cursor-dot) { display: none !important; }
html[data-perf-off~="cursor"].has-cursor, html[data-perf-off~="cursor"].has-cursor * { cursor: auto !important; }
html[data-perf-off~="glow"] .pointer-glow { display: none !important; }
html[data-perf-off~="follow"] .hero-light { display: none !important; }
html[data-perf-off~="rain"] .hero-rain { display: none !important; }
html[data-perf-off~="grain"] .grain { display: none !important; }
html[data-perf-off~="vignette"] .vignette { display: none !important; }
html[data-perf-off~="grid"] .site-shell::before { display: none !important; }
html[data-perf-off~="filters"] *:not(.perf-lab *) { filter: none !important; }
html[data-perf-off~="backdrop"] * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
html[data-perf-off~="blend"] * { mix-blend-mode: normal !important; }
html[data-perf-off~="masks"] :is(*, *::before, *::after) { mask-image: none !important; -webkit-mask-image: none !important; }
html[data-perf-off~="animations"] :is(*, *::before, *::after) { animation-play-state: paused !important; }
.perf-lab { position: fixed; z-index: 2147483000; left: 12px; bottom: 12px; width: 300px; max-height: calc(100vh - 24px); overflow: auto; padding: 12px; border: 1px solid #444; border-radius: 8px; color: #eee; background: rgba(10, 10, 10, .94); font: 11px/1.45 ui-monospace, Menlo, monospace; }
.perf-lab, .perf-lab * { cursor: auto !important; }
.perf-lab pre { margin: 0 0 10px; white-space: pre-wrap; }
.perf-lab label { display: flex; gap: 6px; align-items: center; }
.perf-lab button { margin: 8px 6px 0 0; padding: 4px 8px; border: 1px solid #666; border-radius: 4px; color: #eee; background: #222; font: inherit; }
`;

const WINDOW_MS = 5000;

type Script = { invoker?: string; sourceURL?: string; sourceFunctionName?: string; duration: number; forcedStyleAndLayoutDuration?: number };
type Loaf = PerformanceEntry & { blockingDuration: number; scripts: Script[] };

/** Temporary diagnostics panel — see src/lib/perf-lab.ts. */
export function PerfLab() {
  // Rendered client-only (see PerfLabLoader), so storage can be read during the first render.
  const [enabled] = useState(labEnabled);
  const [off, setOff] = useState(offEffects);
  const textRef = useRef<HTMLPreElement>(null);
  const reportRef = useRef<object>({});

  useEffect(() => {
    if (!enabled) return;
    const current = offEffects();
    document.documentElement.dataset.perfOff = current.join(" ");

    const frames: number[] = []; // [timestamp, delta, timestamp, delta, …]
    const moves: number[] = []; // [timestamp, input delay, coalesced count, …]
    const loafs: Loaf[] = [];
    const longTasks: PerformanceEntry[] = [];

    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (last) frames.push(now, now - last);
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      moves.push(now, now - event.timeStamp, event.getCoalescedEvents?.().length ?? 1);
    };
    addEventListener("pointermove", onMove, { capture: true, passive: true });

    const observers: PerformanceObserver[] = [];
    const observe = (type: string, sink: PerformanceEntry[]) => {
      try {
        const o = new PerformanceObserver((list) => sink.push(...list.getEntries()));
        o.observe({ type, buffered: false });
        observers.push(o);
      } catch {
        // Entry type not supported in this browser.
      }
    };
    observe("long-animation-frame", loafs);
    observe("longtask", longTasks);

    const prune = (list: number[], stride: number, cutoff: number) => {
      let i = 0;
      while (i < list.length && list[i] < cutoff) i += stride;
      list.splice(0, i);
    };

    const report = () => {
      const now = performance.now();
      const cutoff = now - WINDOW_MS;
      prune(frames, 2, cutoff);
      prune(moves, 3, cutoff);
      while (loafs.length && loafs[0].startTime < cutoff) loafs.shift();
      while (longTasks.length && longTasks[0].startTime < cutoff) longTasks.shift();

      const deltas = frames.filter((_, i) => i % 2 === 1);
      const sorted = [...deltas].sort((a, b) => a - b);
      const avg = deltas.reduce((a, b) => a + b, 0) / Math.max(1, deltas.length);
      const delays = moves.filter((_, i) => i % 3 === 1);
      const coalesced = moves.filter((_, i) => i % 3 === 2);

      const scripts = new Map<string, { ms: number; forced: number; n: number }>();
      let loafMs = 0;
      let blockingMs = 0;
      for (const entry of loafs) {
        loafMs += entry.duration;
        blockingMs += entry.blockingDuration;
        for (const s of entry.scripts) {
          const file = (s.sourceURL || "(no source)").split("/").pop()?.split("?")[0];
          const key = `${s.invoker ?? "?"} · ${file}${s.sourceFunctionName ? ` · ${s.sourceFunctionName}` : ""}`;
          const row = scripts.get(key) ?? { ms: 0, forced: 0, n: 0 };
          row.ms += s.duration;
          row.forced += s.forcedStyleAndLayoutDuration ?? 0;
          row.n++;
          scripts.set(key, row);
        }
      }
      const top = [...scripts.entries()].sort((a, b) => b[1].ms - a[1].ms).slice(0, 5);

      const data = {
        fps: +(1000 / avg).toFixed(1),
        p95FrameMs: +(sorted[Math.floor(sorted.length * 0.95)] ?? 0).toFixed(1),
        framesOver33ms: deltas.filter((d) => d > 33).length,
        framesOver50ms: deltas.filter((d) => d > 50).length,
        pointerEventsPerSec: +(delays.length / (WINDOW_MS / 1000)).toFixed(0),
        avgInputDelayMs: +(delays.reduce((a, b) => a + b, 0) / Math.max(1, delays.length)).toFixed(1),
        maxInputDelayMs: +Math.max(0, ...delays).toFixed(1),
        avgCoalesced: +(coalesced.reduce((a, b) => a + b, 0) / Math.max(1, coalesced.length)).toFixed(1),
        longAnimationFrames: loafs.length,
        loafTotalMs: Math.round(loafMs),
        loafBlockingMs: Math.round(blockingMs),
        longTasks: longTasks.length,
        topScripts: top.map(([key, v]) => ({ script: key, ms: Math.round(v.ms), forcedStyleLayoutMs: Math.round(v.forced), calls: v.n })),
      };
      reportRef.current = {
        when: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: `${innerWidth}x${innerHeight}@${devicePixelRatio}`,
        lite: document.documentElement.classList.contains("is-lite"),
        off: current,
        page: location.pathname,
        lastSeconds: WINDOW_MS / 1000,
        ...data,
      };
      if (textRef.current) {
        textRef.current.textContent = [
          `last ${WINDOW_MS / 1000}s · ${document.documentElement.classList.contains("is-lite") ? "LITE MODE ON" : "full mode"}`,
          `fps ${data.fps}  p95 ${data.p95FrameMs}ms  >33ms ${data.framesOver33ms}  >50ms ${data.framesOver50ms}`,
          `pointer ${data.pointerEventsPerSec}/s  delay avg ${data.avgInputDelayMs}ms max ${data.maxInputDelayMs}ms  coalesced ${data.avgCoalesced}`,
          `long frames ${data.longAnimationFrames} (${data.loafTotalMs}ms, blocking ${data.loafBlockingMs}ms)  long tasks ${data.longTasks}`,
          ...data.topScripts.map((s) => `  ${s.ms}ms${s.forcedStyleLayoutMs ? ` (forced ${s.forcedStyleLayoutMs})` : ""} ×${s.calls} ${s.script}`),
        ].join("\n");
      }
    };
    const interval = window.setInterval(report, 500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
      removeEventListener("pointermove", onMove, { capture: true });
      observers.forEach((o) => o.disconnect());
    };
  }, [enabled]);

  if (!enabled) return null;

  const toggle = (effect: Effect) => setOff((list) => (list.includes(effect) ? list.filter((e) => e !== effect) : [...list, effect]));

  return (
    <div className="perf-lab">
      <style>{CSS_OFF}</style>
      <pre ref={textRef}>collecting…</pre>
      {(Object.keys(EFFECTS) as Effect[]).map((effect) => (
        <label key={effect}>
          <input type="checkbox" checked={!off.includes(effect)} onChange={() => toggle(effect)} /> {EFFECTS[effect]}
        </label>
      ))}
      <button type="button" onClick={() => applyOff(off)}>
        Apply &amp; reload
      </button>
      <button type="button" onClick={() => applyOff([])}>
        All on
      </button>
      <button type="button" onClick={() => applyOff(Object.keys(EFFECTS))}>
        All off
      </button>
      <button type="button" onClick={() => void navigator.clipboard.writeText(JSON.stringify(reportRef.current, null, 2))}>
        Copy report
      </button>
      <button
        type="button"
        onClick={() => {
          try {
            localStorage.setItem("lite", "0");
          } catch {}
          location.reload();
        }}
      >
        Force full mode
      </button>
    </div>
  );
}
