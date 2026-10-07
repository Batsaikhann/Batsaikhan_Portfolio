import type Lenis from "lenis";

// The active Lenis instance (null with reduced motion or before hydration), so components
// can scroll programmatically without fighting the smooth-scroll loop.
let lenis: Lenis | null = null;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};

export function scrollToY(y: number, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.1 });
  else window.scrollTo({ top: y, behavior: immediate ? "auto" : "smooth" });
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
