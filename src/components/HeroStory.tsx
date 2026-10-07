"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import type { Project } from "@/data/projects";
import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";
import { TransitionLink } from "./RouteTransition";
import { T, Tx } from "./T";

// Scroll windows (fractions of the pinned distance) for each chapter of the story.
const PHASES = [
  ["--orbit", 0, 0.3],
  ["--portal", 0.3, 0.55],
  ["--work", 0.52, 0.74],
  ["--next", 0.78, 0.98],
] as const;

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Pins the hero and plays a scroll-driven story on top of it:
 * orbit (cards circle the portrait) → red portal → WORK grid assembles → "Next: About" teaser.
 * Progress is written as CSS variables (--orbit, --portal, --work, --next, each 0 → 1); the
 * styles do the rest. With reduced motion the hero renders normally and the layers stay hidden.
 */
export function HeroStory({ children, projects, silhouette }: { children: ReactNode; projects: Project[]; silhouette: StaticImageData }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    // Phones and short windows can't pin the full hero, so they get the regular page.
    const fits = matchMedia("(min-width: 761px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let last = -1;
    const tick = () => {
      const rect = host.getBoundingClientRect();
      const distance = rect.height - innerHeight;
      const p = distance > 0 ? clamp(-rect.top / distance) : 0;
      if (Math.abs(p - last) > 0.0005) {
        last = p;
        host.style.setProperty("--p", p.toFixed(4));
        for (const [name, from, to] of PHASES) host.style.setProperty(name, clamp((p - from) / (to - from)).toFixed(4));
        const phase = p < 0.02 ? "hero" : p < 0.33 ? "orbit" : p < 0.56 ? "portal" : p < 0.78 ? "work" : "next";
        if (host.dataset.phase !== phase) host.dataset.phase = phase;
      }
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      last = -1;
      if (fits.matches) {
        host.dataset.story = "on";
        frame = requestAnimationFrame(tick);
      } else {
        delete host.dataset.story;
      }
    };
    sync();
    fits.addEventListener("change", sync);
    return () => {
      fits.removeEventListener("change", sync);
      cancelAnimationFrame(frame);
      delete host.dataset.story;
    };
  }, []);

  return (
    <div className="story" ref={ref} data-phase="hero">
      <div className="story-pin">
        {children}

        {/* 1 · Orbit: a glowing ring circles the portrait. */}
        <div className="story-orbit" aria-hidden="true">
          <div className="story-ring">
            <span className="story-ring-line" />
            <span className="story-ring-spin">
              <i />
            </span>
          </div>
        </div>

        {/* 2 · Portal: the planet erupts into a swirling red gateway. */}
        <div className="story-portal" aria-hidden="true">
          <span className="portal-fire" />
          <span className="portal-fire is-2" />
          <span className="portal-ring" />
          <span className="portal-flash" />
        </div>

        {/* 3 · Work: the projects assemble into a grid behind a giant WORK title. */}
        <div className="story-work">
          <p className="story-work-title" aria-hidden="true">
            <T en="Work" mn="Ажил" />
          </p>
          <div className="story-grid">
            {projects.map((project, i) => {
              const shot = project.shots.find((s) => s.device === "desktop") ?? project.shots[0];
              return (
                <TransitionLink
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  label={project.title}
                  className={`story-card is-${i + 1}`}
                  style={{ "--i": i } as CSSProperties}
                  data-cursor="View"
                >
                  <span className="story-card-media">
                    {shot ? <Image src={shot.src} alt="" sizes="(max-width: 760px) 50vw, 360px" /> : <ProjectVisual type={project.visual} />}
                  </span>
                  <span className="story-card-text">
                    <b>{project.title}</b>
                    <small>
                      <Tx text={project.category} />
                    </small>
                  </span>
                  <span className="story-card-go" aria-hidden="true">
                    <Icon name="arrowUpRight" size={14} />
                  </span>
                </TransitionLink>
              );
            })}
          </div>
        </div>

        {/* 4 · Next: a silhouette against the planet's horizon hands over to About. */}
        <div className="story-next">
          <span className="next-arc" aria-hidden="true" />
          <span className="next-figure" aria-hidden="true">
            <Image src={silhouette} alt="" sizes="(max-width: 760px) 80vw, 520px" />
          </span>
          <div className="next-copy">
            <small>
              <T en="Next" mn="Дараагийнх" />
            </small>
            <p className="next-title">
              <T en="About" mn="Тухай" />
            </p>
            <a className="next-link" href="#about">
              <T en="More about my journey, skills and vision." mn="Миний аялал, ур чадвар, алсын харааны тухай." />
              <Icon name="arrowDown" size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
