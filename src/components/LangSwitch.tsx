"use client";

import { useRef } from "react";

/**
 * EN / MN pill. The thumb position is driven purely by <html data-lang> in CSS,
 * so there is no hydration mismatch and no React state to keep in sync.
 */
export function LangSwitch() {
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.lang === "mn" ? "en" : "mn";
    root.dataset.lang = next;
    root.lang = next;
    try {
      localStorage.setItem("lang", next);
    } catch {
      // Storage can be blocked (private mode); the switch still works for this visit.
    }
    // Restart the squash-and-stretch animation on every click.
    const button = ref.current;
    if (button) {
      button.classList.remove("is-switching");
      void button.offsetWidth;
      button.classList.add("is-switching");
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      className="lang-switch"
      onClick={toggle}
      onAnimationEnd={(event) => event.currentTarget.classList.remove("is-switching")}
      aria-label="Switch language / Хэл солих"
    >
      <span className="lang-thumb" aria-hidden="true" />
      <span className="lang-opt lang-opt-en">EN</span>
      <span className="lang-opt lang-opt-mn">MN</span>
    </button>
  );
}
