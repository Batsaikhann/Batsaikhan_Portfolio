// Temporary performance lab: switch expensive effects off one at a time to find what makes a browser lag.
// Only exists in `next dev` or in a build made with NEXT_PUBLIC_PERF_LAB=1 — in a normal production build
// PERF_LAB is the constant `false`, so every check below folds away and the panel is never bundled.
//
// Open any page with ?perflab=1 to show the panel (?perflab=0 hides it again).

export const PERF_LAB = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_PERF_LAB === "1";

export const EFFECTS = {
  cursor: "Custom cursor (ring + dot)",
  glow: "Pointer glow",
  parallax: "Hero parallax layers",
  follow: "Hero light follow",
  magnetic: "Magnetic buttons",
  tilt: "Tilt cards",
  webgl: "WebGL hero scene",
  rain: "Code rain canvas",
  grain: "Grain overlay",
  vignette: "Vignette",
  grid: "Background grid mask",
  filters: "CSS filter: blur()",
  backdrop: "backdrop-filter",
  blend: "mix-blend-mode",
  masks: "mask-image",
  animations: "CSS animations",
} as const;

export type Effect = keyof typeof EFFECTS;

const OFF_KEY = "perf-off";
const LAB_KEY = "perflab";

let state: { enabled: boolean; off: Set<string> } | null = null;

function read() {
  if (state) return state;
  state = { enabled: false, off: new Set() };
  try {
    const param = new URLSearchParams(location.search).get(LAB_KEY);
    if (param === "1") localStorage.setItem(LAB_KEY, "1");
    if (param === "0") localStorage.removeItem(LAB_KEY);
    state.enabled = localStorage.getItem(LAB_KEY) === "1";
    if (state.enabled) state.off = new Set((localStorage.getItem(OFF_KEY) ?? "").split(",").filter(Boolean));
  } catch {
    // Storage blocked — the lab simply stays off.
  }
  return state;
}

/** Whether the lab panel is enabled for this browser. */
export const labEnabled = () => PERF_LAB && read().enabled;

/** True when `effect` was switched off in the lab. Always false outside the lab. */
export const effectOff = (effect: Effect) => PERF_LAB && read().enabled && read().off.has(effect);

export const offEffects = () => (labEnabled() ? [...read().off] : []);

/** Saves a new set of disabled effects and reloads, so every effect starts from a clean slate. */
export function applyOff(off: string[]) {
  try {
    localStorage.setItem(OFF_KEY, off.join(","));
  } catch {}
  location.reload();
}
