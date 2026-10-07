"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";
import { TransitionLink } from "./RouteTransition";
import { T, Tx } from "./T";

const pad = (n: number) => String(n).padStart(2, "0");
const HOVER_MS = 140;

/** Browser mockup with the phone overlapping its lower-left corner — real screenshots only. */
function ShowcaseVisual({ project }: { project: Project }) {
  const desktop = project.shots.find((shot) => shot.device === "desktop");
  const phone = project.shots.find((shot) => shot.device === "mobile");

  if (!desktop) {
    return (
      <div className="sc-visual is-motif">
        <div className="sc-browser">
          <ProjectVisual type={project.visual} />
        </div>
      </div>
    );
  }
  return (
    <div className={`sc-visual${phone ? " has-phone" : ""}`}>
      <div className="sc-browser">
        <BrowserFrame shot={desktop} sizes="(max-width: 760px) 92vw, (max-width: 1100px) 70vw, 760px" />
      </div>
      {phone && (
        <div className="sc-phone">
          <BrowserFrame shot={phone} sizes="(max-width: 760px) 30vw, 180px" />
        </div>
      )}
    </div>
  );
}

/**
 * Selected work: one large featured panel, a project list on the left and a thumbnail strip below.
 * Projects change via the list (click or hover), thumbnails, arrows, dots, ← → keys while the
 * section is on screen, or a horizontal swipe — page scrolling is never intercepted.
 * Only the active project's large screenshots are rendered; thumbnails lazy-load.
 */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const count = projects.length;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const hostRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const hover = useRef(0);
  const inView = useRef(false);
  // Latest index for handlers created once (keyboard, hover timer).
  const activeRef = useRef(0);

  const project = projects[active];

  const go = (i: number, direction?: number) => {
    const current = activeRef.current;
    const target = (i + count) % count;
    if (target === current) return;
    activeRef.current = target;
    setDir(direction ?? (target > current ? 1 : -1));
    setActive(target);
  };
  const step = (d: number) => go(activeRef.current + d, d);

  // ← → switch projects while the section is on screen (ignored while typing or with modifiers).
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), { threshold: 0.35 });
    io.observe(host);
    const onKey = (event: KeyboardEvent) => {
      if (!inView.current || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        step(event.key === "ArrowLeft" ? -1 : 1);
      }
    };
    addEventListener("keydown", onKey);
    return () => {
      io.disconnect();
      removeEventListener("keydown", onKey);
      clearTimeout(hover.current);
    };
    // step only reads refs and stable setters, so the first render's copy stays correct.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the active thumbnail in view inside the strip (horizontal only — never moves the page).
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb || strip.scrollWidth <= strip.clientWidth) return;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  }, [active]);

  // Hovering a list item previews it after a short pause, so sweeping the pointer past doesn't flicker.
  const preview = (i: number) => {
    clearTimeout(hover.current);
    hover.current = window.setTimeout(() => go(i), HOVER_MS);
  };
  const cancelPreview = () => clearTimeout(hover.current);

  // Desktop depth: the phone and glow drift a few px against the pointer (CSS vars, transitions do the easing).
  const onPanelMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--px", ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    event.currentTarget.style.setProperty("--py", ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };
  const onPanelLeave = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.removeProperty("--px");
    event.currentTarget.style.removeProperty("--py");
  };

  return (
    <div className="showcase" ref={hostRef} data-reveal>
      <ol className="sc-list" aria-label="Projects" onPointerLeave={cancelPreview}>
        {projects.map((p, i) => (
          <li key={p.slug}>
            <button
              type="button"
              className={i === active ? "is-active" : undefined}
              aria-current={i === active ? "true" : undefined}
              onClick={() => {
                cancelPreview();
                go(i);
              }}
              onPointerEnter={(event) => event.pointerType === "mouse" && preview(i)}
            >
              <span className="sc-list-num">{p.number}</span>
              <span className="sc-list-text">
                <b>{p.title}</b>
                <small>
                  <Tx text={p.category} />
                </small>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div
        className="sc-panel"
        style={{ "--dir": dir } as CSSProperties}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") swipe.current = { x: event.clientX, y: event.clientY };
        }}
        onPointerUp={(event) => {
          const start = swipe.current;
          swipe.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - start.y) * 1.5) step(dx < 0 ? 1 : -1);
        }}
        onPointerCancel={() => (swipe.current = null)}
        onPointerMove={onPanelMove}
        onPointerLeave={onPanelLeave}
      >
        {/* Corner ticks frame the panel like a film plate. */}
        <span className="sc-corners" aria-hidden="true">
          <i /> <i /> <i /> <i />
        </span>
        {/* Re-keyed per project so each change replays the short entrance animations. */}
        <span className="sc-glow" key={`glow-${project.slug}`} aria-hidden="true" />
        {/* Static scenery behind the device: red-lit rocks and haze (no animation). */}
        <span className="sc-terrain" aria-hidden="true" />

        <div className="sc-copy" key={`copy-${project.slug}`}>
          <p className="sc-meta">
            <span className={`status-badge is-${project.status.kind}`}>
              <Tx text={project.status.label} />
            </span>
          </p>
          <p className="sc-category">
            <Tx text={project.category} /> · {project.year}
          </p>
          <h3>{project.title}</h3>
          <p className="sc-desc">
            <Tx text={project.description} />
          </p>
          <i className="sc-rule-h" aria-hidden="true" />
          <div className="tags">
            {project.stack.slice(0, 6).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <TransitionLink className="sc-cta" href={`/work/${project.slug}`} label={project.title} data-cursor="View">
            <T en="View case study" mn="Кейс судалгаа үзэх" /> <Icon name="arrow" size={16} />
          </TransitionLink>
        </div>

        <TransitionLink
          className="sc-media"
          key={`media-${project.slug}`}
          href={`/work/${project.slug}`}
          label={project.title}
          expand
          tabIndex={-1}
          aria-hidden="true"
          data-cursor="View"
          data-expand
        >
          <ShowcaseVisual project={project} />
        </TransitionLink>

        <div className="sc-pager">
          <span className="sc-count" aria-live="polite">
            <b>{pad(active + 1)}</b> / {pad(count)}
          </span>
          <div className="sc-pager-row">
            <button type="button" className="sc-pager-arrow is-prev" aria-label="Previous project" onClick={() => step(-1)}>
              <Icon name="arrow" size={16} />
            </button>
            <i className="sc-rule" aria-hidden="true" />
            <div className="sc-dots" role="group" aria-label="Choose project">
              {projects.map((p, i) => (
                <button
                  key={p.slug}
                  type="button"
                  className={i === active ? "is-active" : undefined}
                  aria-label={`${p.title} (${i + 1} of ${count})`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <i className="sc-rule" aria-hidden="true" />
            <button type="button" className="sc-pager-arrow" aria-label="Next project" onClick={() => step(1)}>
              <Icon name="arrow" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="sc-thumbs" ref={thumbsRef} role="group" aria-label="Project thumbnails">
        {projects.map((p, i) => {
          const cover = p.shots.find((shot) => shot.device === "desktop");
          return (
            <button
              key={p.slug}
              type="button"
              className={i === active ? "is-active" : undefined}
              aria-current={i === active ? "true" : undefined}
              aria-label={`Show ${p.title}`}
              onClick={() => go(i)}
            >
              <span className="sc-thumb-img">
                {cover ? <Image src={cover.src} alt="" sizes="(max-width: 760px) 160px, 280px" /> : <ProjectVisual type={p.visual} />}
                <span className="sc-thumb-num" aria-hidden="true">{p.number}</span>
              </span>
              <span className="sc-thumb-name">
                {p.title}
                <small>
                  <Tx text={p.category} />
                </small>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
