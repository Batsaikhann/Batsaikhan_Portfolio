"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { setLenis } from "@/lib/scroll";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#*+<>";

function scramble(host: HTMLElement) {
  const lang = document.documentElement.dataset.lang === "mn" ? "mn" : "en";
  const el = host.querySelector<HTMLElement>(`.t-${lang}`) ?? host;
  const final = el.textContent ?? "";
  const frames = 16;
  let frame = 0;
  const id = window.setInterval(() => {
    const solved = (frame / frames) * final.length;
    el.textContent = [...final]
      .map((char, i) =>
        i < solved || /[\s/·•]/.test(char) ? char : GLYPHS[(Math.random() * GLYPHS.length) | 0],
      )
      .join("");
    if (++frame > frames) {
      window.clearInterval(id);
      el.textContent = final;
    }
  }, 38);
}

function countUp(el: HTMLElement) {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - start) / 1600);
    el.textContent = Math.round(target * (1 - Math.pow(2, -10 * p))).toLocaleString("en-US");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

type Layer = { el: HTMLElement; depth: number; ease: number; x: number; y: number };

/**
 * Site-wide motion layer. Everything is driven by data attributes so sections stay
 * server-rendered:
 *   data-reveal      fade/rise in when scrolled into view (adds .is-visible)
 *   data-scramble    glyph-scramble text when it enters the viewport
 *   data-count       count a number up from 0
 *   data-depth=n     hero layer that follows the cursor by n px (data-lag = slower)
 *   data-parallax=n  drifts vertically at n × scroll speed (data-parallax-x=n drifts sideways)
 *   data-progress    exposes --progress (0 → 1) as the element scrolls past the viewport's
 *                    reading line; descendants with data-step get .is-reached as the line passes them
 *   data-follow      hero light that trails the cursor inside its positioned parent
 *   data-tilt=n      3D tilt up to n degrees; exposes --rx --ry --mx --my --sx --sy
 *   data-magnetic    element is pulled toward the cursor
 *   data-cursor=txt  custom cursor shows a label over this element
 */
export function Interactions() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const wide = matchMedia("(min-width: 761px)").matches;
    const cleanups: Array<() => void> = [];
    const listen = <K extends keyof WindowEventMap>(
      target: Window | HTMLElement | Document,
      type: K,
      handler: (event: WindowEventMap[K]) => void,
    ) => {
      target.addEventListener(type, handler as EventListener, { passive: true });
      cleanups.push(() => target.removeEventListener(type, handler as EventListener));
    };
    const cleanup = () => cleanups.forEach((fn) => fn());

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          if (el.hasAttribute("data-reveal")) el.classList.add("is-visible");
          if (el.hasAttribute("data-scramble") && !reduced) scramble(el);
          if (el.hasAttribute("data-count") && !reduced) countUp(el);
        }),
      { threshold: 0.15 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-reveal], [data-scramble], [data-count]")
      .forEach((el) => observer.observe(el));
    cleanups.push(() => observer.disconnect());

    // Highlight the nav link of the section in the middle of the viewport.
    const navLinks = [...document.querySelectorAll<HTMLAnchorElement>(".nav-links a")];
    const sectionObserver = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => a.classList.toggle("is-active", a.hash === `#${entry.target.id}`));
        }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((el) => sectionObserver.observe(el));
    cleanups.push(() => sectionObserver.disconnect());

    if (reduced) return cleanup;

    const lenis = new Lenis({ autoRaf: true, anchors: true, lerp: 0.16 });
    setLenis(lenis);
    cleanups.push(() => {
      setLenis(null);
      lenis.destroy();
    });

    if (finePointer) {
      root.classList.add("has-cursor");
      cleanups.push(() => root.classList.remove("has-cursor"));

      listen(document, "pointerover", (event) => {
        const target = event.target as HTMLElement;
        const labelled = target.closest<HTMLElement>("[data-cursor]");
        const interactive = target.closest("a, button");
        ringRef.current?.classList.toggle("is-label", Boolean(labelled));
        ringRef.current?.classList.toggle("is-hover", Boolean(interactive) && !labelled);
        dotRef.current?.classList.toggle("is-hidden", Boolean(labelled));
        if (labelled && labelRef.current) labelRef.current.textContent = labelled.dataset.cursor ?? "";
      });
      listen(window, "pointerdown", () => ringRef.current?.classList.add("is-down"));
      listen(window, "pointerup", () => ringRef.current?.classList.remove("is-down"));
      listen(document, "pointerleave", () => root.classList.add("cursor-away"));
      listen(document, "pointerenter", () => root.classList.remove("cursor-away"));

      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        listen(el, "pointermove", (event) => {
          const rect = el.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          el.style.transition = "translate .2s ease-out";
          el.style.translate = `${x * 0.28}px ${y * 0.38}px`;
          el.style.setProperty("--gx", `${(event.clientX - rect.left).toFixed(0)}px`);
          el.style.setProperty("--gy", `${(event.clientY - rect.top).toFixed(0)}px`);
        });
        listen(el, "pointerleave", () => {
          el.style.transition = "translate .6s cubic-bezier(.2,.9,.2,1)";
          el.style.translate = "";
        });
      });

      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const max = Number(el.dataset.tilt) || 3;
        listen(el, "pointermove", (event) => {
          const rect = el.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          el.style.setProperty("--rx", `${(-py * max * 2).toFixed(2)}deg`);
          el.style.setProperty("--ry", `${(px * max * 2).toFixed(2)}deg`);
          el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
          el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
          el.style.setProperty("--sx", px.toFixed(3));
          el.style.setProperty("--sy", py.toFixed(3));
        });
        listen(el, "pointerleave", () => {
          ["--rx", "--ry", "--sx", "--sy"].forEach((prop) => el.style.removeProperty(prop));
        });
      });
    }

    const heroLayers: Layer[] =
      finePointer && wide
        ? [...document.querySelectorAll<HTMLElement>("[data-depth]")].map((el) => ({
            el,
            depth: Number(el.dataset.depth),
            ease: el.hasAttribute("data-lag") ? 0.045 : 0.1,
            x: 0,
            y: 0,
          }))
        : [];
    const parallax = wide ? [...document.querySelectorAll<HTMLElement>("[data-parallax], [data-parallax-x]")] : [];
    const progressHosts = [...document.querySelectorAll<HTMLElement>("[data-progress]")].map((el) => ({
      el,
      steps: [...el.querySelectorAll<HTMLElement>("[data-step]")],
    }));
    const follow = finePointer && wide ? document.querySelector<HTMLElement>("[data-follow]") : null;
    let followX = 0;
    let followY = 0;
    const nav = document.querySelector<HTMLElement>(".nav");
    const heroCopy = document.querySelector<HTMLElement>(".hero-copy");
    const ticker = document.querySelector<HTMLElement>(".ticker-track");
    if (ticker) ticker.style.animation = "none";

    let tickerHover = false;
    const tickerBand = ticker?.parentElement;
    if (tickerBand) {
      listen(tickerBand, "pointerenter", () => (tickerHover = true));
      listen(tickerBand, "pointerleave", () => (tickerHover = false));
    }

    let mouseX = innerWidth / 2;
    let mouseY = innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;
    let lastY = scrollY;
    let tickerX = 0;
    let tickerSpeed = 0.6;
    let direction = 1;
    let skew = 0;
    let frame = 0;
    let lastProgressY = -1;

    // Layout values that only change on resize — reading them every frame forces reflows.
    let maxScroll = 0;
    let tickerHalf = 0;
    const measure = () => {
      maxScroll = root.scrollHeight - innerHeight;
      tickerHalf = ticker ? ticker.scrollWidth / 2 : 0;
    };
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(document.body);
    if (ticker) resizeObserver.observe(ticker);
    cleanups.push(() => resizeObserver.disconnect());

    listen(window, "pointermove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      // Cursor tracks the pointer 1:1 on the event itself — no easing, no frame of lag.
      const at = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      if (dotRef.current) dotRef.current.style.transform = at;
      if (ringRef.current) ringRef.current.style.transform = at;
    });

    const loop = () => {
      const y = scrollY;
      const velocity = y - lastY;
      if (velocity !== 0) direction = velocity > 0 ? 1 : -1;

      // Read all geometry first, then write styles, so the frame lays out only once.
      const followHost = follow && y < innerHeight * 1.2 ? follow.parentElement!.getBoundingClientRect() : null;
      const parallaxRects = parallax.map((el) => el.parentElement!.getBoundingClientRect());
      const line = innerHeight * 0.62;
      const progressRects =
        y !== lastProgressY
          ? progressHosts.map(({ el, steps }) => ({
              rect: el.getBoundingClientRect(),
              stepTops: steps.map((step) => step.getBoundingClientRect().top),
            }))
          : null;

      if (finePointer) {
        glowX += (mouseX - glowX) * 0.06;
        glowY += (mouseY - glowY) * 0.06;
        if (glowRef.current) glowRef.current.style.transform = `translate3d(${glowX - 300}px, ${glowY - 300}px, 0)`;
      }

      nav?.classList.toggle("is-scrolled", y > 40);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${maxScroll > 0 ? Math.min(1, y / maxScroll) : 0})`;

      if (heroCopy && y < innerHeight * 1.2) {
        heroCopy.style.translate = `0 ${y * 0.18}px`;
        heroCopy.style.opacity = String(Math.max(0, 1 - y / (innerHeight * 0.8)));
      }

      const nx = mouseX / innerWidth - 0.5;
      const ny = mouseY / innerHeight - 0.5;
      for (const layer of heroLayers) {
        layer.x += (nx * layer.depth - layer.x) * layer.ease;
        layer.y += (ny * layer.depth - layer.y) * layer.ease;
        layer.el.style.translate = `${layer.x.toFixed(2)}px ${layer.y.toFixed(2)}px`;
      }

      if (follow && followHost) {
        followX += (mouseX - followHost.left - followX) * 0.07;
        followY += (mouseY - followHost.top - followY) * 0.07;
        follow.style.transform = `translate3d(${followX.toFixed(1)}px, ${followY.toFixed(1)}px, 0)`;
      }

      for (const [i, el] of parallax.entries()) {
        const host = parallaxRects[i];
        const offset = host.top + host.height / 2 - innerHeight / 2;
        if (Math.abs(offset) < innerHeight * 1.5) {
          const vy = Number(el.dataset.parallax ?? 0);
          const vx = Number(el.dataset.parallaxX ?? 0);
          el.style.translate = `${(offset * vx).toFixed(1)}px ${(-offset * vy).toFixed(1)}px`;
        }
      }

      // Scroll-linked progress only needs work when the page actually moved.
      if (progressRects) {
        lastProgressY = y;
        progressHosts.forEach(({ el, steps }, i) => {
          const { rect, stepTops } = progressRects[i];
          if (rect.bottom < -innerHeight || rect.top > innerHeight * 2) return;
          const p = Math.min(1, Math.max(0, (line - rect.top) / rect.height));
          el.style.setProperty("--progress", p.toFixed(4));
          steps.forEach((step, j) => step.classList.toggle("is-reached", stepTops[j] < line));
        });
      }

      if (ticker) {
        const half = tickerHalf;
        const target = tickerHover ? 0.15 : 0.6 + Math.min(Math.abs(velocity), 60) * 0.3;
        tickerSpeed += (target - tickerSpeed) * 0.08;
        tickerX -= tickerSpeed * direction;
        if (tickerX <= -half) tickerX += half;
        if (tickerX > 0) tickerX -= half;
        skew += (Math.max(-6, Math.min(6, -velocity * 0.3)) - skew) * 0.1;
        ticker.style.transform = `translate3d(${tickerX}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
      }

      lastY = y;
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    cleanups.push(() => cancelAnimationFrame(frame));

    return cleanup;
  }, [pathname]);

  return (
    <>
      <div className="scroll-progress" ref={progressRef} />
      <div className="pointer-glow" ref={glowRef} />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
      <div className="cursor" ref={ringRef} aria-hidden="true">
        <span ref={labelRef} />
      </div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
