"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type ReactNode } from "react";
import { Icon } from "./Icon";
import { T } from "./T";

// Scroll windows (fractions of the pinned distance) for each chapter of the story.
// The whole story is ~65vh of extra scroll. Chapters overlap so one scene is always
// cross-fading into the next — there is never a frame with only the dark background.
const PHASES = [
  ["--orbit", 0, 0.3],
  ["--portal", 0.2, 0.6],
  ["--next", 0.4, 0.85],
] as const;
// The hero is fully faded (portrait opacity hits 0 at --portal = 1) from here on.
const HERO_GONE = 0.6;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Pins the hero briefly and scrubs a short story on top of it, 1:1 with native scroll:
 * orbit (cards tilt into depth) → red portal → "Next: About" teaser.
 * Progress is written as CSS variables (--orbit, --portal, --next, each 0 → 1, plus --out for the
 * About bridge leaving as the pin releases) from
 * passive scroll events only — nothing runs while the page is still or the story is off screen.
 * Phones, short windows and reduced motion get the regular hero with no pinning.
 */
export function HeroStory({ children, silhouette }: { children: ReactNode; silhouette: StaticImageData }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const fits = matchMedia("(min-width: 761px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let last = -1;
    const update = () => {
      frame = 0;
      const rect = host.getBoundingClientRect();
      const distance = rect.height - innerHeight;
      const p = distance > 0 ? clamp(-rect.top / distance) : 0;
      // After the pin releases, the bridge scene fades out over ~60vh of normal scrolling.
      const out = distance > 0 ? clamp((-rect.top - distance) / (innerHeight * 0.6)) : 0;
      const key = p + out * 2;
      if (Math.abs(key - last) < 0.0005) return;
      last = key;
      for (const [name, from, to] of PHASES) host.style.setProperty(name, clamp((p - from) / (to - from)).toFixed(4));
      host.style.setProperty("--out", out.toFixed(4));
      const phase = p < 0.01 ? "hero" : p < 0.2 ? "orbit" : p < 0.4 ? "portal" : "next";
      if (host.dataset.phase !== phase) host.dataset.phase = phase;
      host.toggleAttribute("data-hero-gone", p >= HERO_GONE);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      last = -1;
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (fits.matches) {
        host.dataset.story = "on";
        addEventListener("scroll", onScroll, { passive: true });
        addEventListener("resize", onScroll, { passive: true });
        update();
      } else {
        delete host.dataset.story;
        host.dataset.phase = "hero";
        host.removeAttribute("data-hero-gone");
      }
    };
    sync();
    fits.addEventListener("change", sync);
    return () => {
      fits.removeEventListener("change", sync);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      delete host.dataset.story;
    };
  }, []);

  return (
    <div className="story" ref={ref} data-phase="hero">
      <div className="story-pin">
        {children}

        {/* 1 · Orbit: a glowing ring draws once around the portrait. */}
        <div className="story-orbit" aria-hidden="true">
          <div className="story-ring">
            <span className="story-ring-line" />
          </div>
        </div>

        {/* 2 · Portal: one ring expands out of the planet, with a brief flash on entry. */}
        <div className="story-portal" aria-hidden="true">
          <span className="portal-ring" />
          <span className="portal-flash" />
        </div>

        {/* 3 · Next: a quiet editorial bridge into About — giant type, the portrait as a dark silhouette, a low horizon. */}
        <div className="story-next">
          <span className="next-grid" aria-hidden="true" />
          <span className="next-marks" aria-hidden="true">
            <i /> <i /> <i /> <i />
          </span>
          <div className="next-side is-left" aria-hidden="true">
            <p>
              <i /> <T en="Ulaanbaatar, Mongolia" mn="Улаанбаатар, Монгол" />
            </p>
            <ol>
              <li>Build <b>01</b></li>
              <li>Ship <b>02</b></li>
              <li>Scale <b>03</b></li>
            </ol>
          </div>
          <ul className="next-side is-right" aria-hidden="true">
            <li>Ideas</li>
            <li>Systems</li>
            <li>People</li>
          </ul>
          <small className="next-label">
            <T en="Next" mn="Дараагийнх" /> /
          </small>
          <p className="next-title" aria-hidden="true">
            <T en="About" mn="Тухай" />
          </p>
          <span className="next-figure" aria-hidden="true">
            {/* Eager, so the first reveal doesn't stall on a lazy load + decode mid-scroll. */}
            <Image src={silhouette} alt="" sizes="(max-width: 760px) 60vw, 380px" loading="eager" />
          </span>
          <span className="next-horizon" aria-hidden="true" />
          <div className="next-copy">
            <p className="next-lead">
              <T en="More than code." mn="Кодоос илүү." />
            </p>
            <p className="next-sub">
              <T en="I build products, systems and teams that scale." mn="Би өсөн тэлэх бүтээгдэхүүн, систем, баг бүтээдэг." />
            </p>
            <a className="next-link" href="#about">
              <T en="Scroll to continue" mn="Үргэлжлүүлэх" />
              <Icon name="arrowDown" size={14} />
            </a>
          </div>
          <span className="next-vignette" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
