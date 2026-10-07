"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";
import { TransitionLink } from "./RouteTransition";
import { T, Tx } from "./T";

const FRAME_MS = 3200;
const pad = (n: number) => String(n).padStart(2, "0");

/** Screenshot composition for a project: browser frame with an optional phone in front. */
function ShowcaseVisual({ project, frame = 0, priority }: { project: Project; frame?: number; priority?: boolean }) {
  const [desktop, ...more] = project.shots.filter((shot) => shot.device === "desktop");
  const phone = project.shots.find((shot) => shot.device === "mobile");

  if (!desktop) {
    return (
      <div className="sc-visual is-motif">
        <ProjectVisual type={project.visual} />
      </div>
    );
  }
  return (
    <div className={`sc-visual${phone ? " has-phone" : ""}`}>
      <div className="sc-browser">
        <BrowserFrame shot={desktop} frames={more} frame={frame} sizes="(max-width: 760px) 92vw, 620px" priority={priority} />
      </div>
      {phone && (
        <div className="sc-phone">
          <BrowserFrame shot={phone} sizes="160px" />
        </div>
      )}
    </div>
  );
}

/**
 * Featured work as a single active showcase. Exactly one project is active and clickable;
 * its neighbours sit behind it as faint, non-interactive previews. Projects change only via
 * the list, arrows, dots, ← → keys or a horizontal swipe — page scrolling is never touched.
 */
export function ProjectShowcase({ projects }: { projects: Project[] }) {
  const count = projects.length;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [inView, setInView] = useState(false);
  // Walkthrough frame, tagged with its project so a newly active one starts at frame 0.
  const [walk, setWalk] = useState({ card: 0, frame: 0 });
  const hostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const project = projects[active];
  const prev = projects[(active - 1 + count) % count];
  const next = projects[(active + 1) % count];

  const go = (i: number, direction?: number) => {
    const target = (i + count) % count;
    if (target === active) return;
    setDir(direction ?? (target > active ? 1 : -1));
    setActive(target);
  };
  const step = (d: number) => go(active + d, d);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(host);
    return () => io.disconnect();
  }, []);

  // The active project quietly cycles through its real screens while on screen.
  useEffect(() => {
    if (!inView || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setWalk((w) => (w.card === active ? { card: active, frame: w.frame + 1 } : { card: active, frame: 1 })),
      FRAME_MS,
    );
    return () => window.clearInterval(id);
  }, [active, inView]);
  const frame = walk.card === active ? walk.frame : 0;

  // Mobile thumbnail strip: keep the active project in view (horizontal only — never moves the page).
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !thumb || !strip.offsetParent) return;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" });
  }, [active]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") step(-1);
    if (event.key === "ArrowRight") step(1);
  };

  // Subtle image depth on desktop: the visual drifts a few px with the pointer.
  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--px", ((event.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    card.style.setProperty("--py", ((event.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };
  const onPointerLeave = () => {
    cardRef.current?.style.removeProperty("--px");
    cardRef.current?.style.removeProperty("--py");
  };

  return (
    <div className="showcase" ref={hostRef} onKeyDown={onKeyDown} data-reveal>
      {/* Mobile header: title, position and arrows above the card. */}
      <div className="sc-mhead">
        <div>
          <p className="sc-mtitle">
            <T
              en={
                <>
                  Featured <em>work</em>
                </>
              }
              mn={
                <>
                  Онцлох <em>ажлууд</em>
                </>
              }
            />
          </p>
          <p className="sc-mcount">
            <span>{pad(active + 1)}</span> / {pad(count)}
          </p>
        </div>
        <div className="sc-marrows">
          <button type="button" className="sc-pager-arrow is-prev" aria-label="Previous project" onClick={() => step(-1)}>
            <Icon name="arrow" size={16} />
          </button>
          <button type="button" className="sc-pager-arrow" aria-label="Next project" onClick={() => step(1)}>
            <Icon name="arrow" size={16} />
          </button>
        </div>
      </div>

      <ol className="sc-list" aria-label="Projects">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <button type="button" className={i === active ? "is-active" : undefined} aria-current={i === active ? "true" : undefined} onClick={() => go(i)}>
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
        className="sc-stage"
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
      >
        {/* Neighbours: faint, inert previews behind the active card. */}
        <div className="sc-preview is-prev" key={`prev-${prev.slug}`} aria-hidden="true" inert>
          <ShowcaseVisual project={prev} />
        </div>
        <div className="sc-preview is-next" key={`next-${next.slug}`} aria-hidden="true" inert>
          <ShowcaseVisual project={next} />
        </div>

        <TransitionLink
          ref={cardRef}
          key={project.slug}
          href={`/work/${project.slug}`}
          label={project.title}
          expand
          className="sc-card"
          style={{ "--dir": dir } as CSSProperties}
          data-cursor="View"
          aria-label={`${project.title} — view case study`}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          <div className="sc-copy">
            <p className="sc-meta">
              <span>{project.number}</span> / {pad(count)}
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
            <div className="tags">
              {project.stack.slice(0, 5).map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <span className="sc-cta">
              View project <Icon name="arrowUpRight" size={16} />
            </span>
          </div>
          <div className="sc-media" data-expand>
            <ShowcaseVisual project={project} frame={frame} priority={active === 0} />
          </div>
        </TransitionLink>

        <button type="button" className="sc-arrow is-prev" aria-label={`Previous project: ${prev.title}`} onClick={() => step(-1)}>
          <Icon name="arrow" size={18} />
        </button>
        <button type="button" className="sc-arrow is-next" aria-label={`Next project: ${next.title}`} onClick={() => step(1)}>
          <Icon name="arrow" size={18} />
        </button>
      </div>

      <div className="sc-pager">
        <span className="sc-count" aria-live="polite">
          {pad(active + 1)} / {pad(count)}
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

      {/* Mobile: thumbnails of every project, swipeable sideways. */}
      <div className="sc-thumbs" ref={thumbsRef} role="group" aria-label="Projects">
        {projects.map((p, i) => {
          const cover = p.shots.find((shot) => shot.device === "desktop");
          return (
            <button
              key={p.slug}
              type="button"
              className={i === active ? "is-active" : undefined}
              aria-current={i === active ? "true" : undefined}
              onClick={() => go(i)}
            >
              <span className="sc-thumb-img">
                {cover ? <Image src={cover.src} alt="" sizes="120px" /> : <ProjectVisual type={p.visual} />}
              </span>
              <span className="sc-thumb-name">{p.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
