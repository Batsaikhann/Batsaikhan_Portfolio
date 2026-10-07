"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion, scrollToY } from "@/lib/scroll";
import { Icon } from "./Icon";

const R = 21;
const C = 2 * Math.PI * R;

/**
 * Floating "back to top" button. Appears once the page is scrolled past the first screen;
 * its ring fills with overall scroll progress. Updates only on (passive) scroll.
 */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      ringRef.current?.style.setProperty("stroke-dashoffset", String(C * (1 - p)));
      setShown(scrollY > innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${shown ? " is-shown" : ""}`}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      onClick={() => scrollToY(0, prefersReducedMotion())}
      data-cursor="Top"
    >
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle className="back-to-top-track" cx="24" cy="24" r={R} />
        <circle className="back-to-top-ring" ref={ringRef} cx="24" cy="24" r={R} strokeDasharray={C} strokeDashoffset={C} />
      </svg>
      <Icon name="arrowDown" size={16} />
    </button>
  );
}
