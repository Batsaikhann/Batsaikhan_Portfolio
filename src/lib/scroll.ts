// Native scrolling only. Smooth anchor scrolling comes from CSS `scroll-behavior`,
// so an immediate jump has to ask for "instant" explicitly.
export function scrollToY(y: number, immediate = false) {
  window.scrollTo({ top: y, behavior: immediate ? "instant" : "smooth" });
}

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
