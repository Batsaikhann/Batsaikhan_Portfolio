import Image from "next/image";
import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { Icon } from "./Icon";
import { TransitionLink } from "./RouteTransition";
import { Tx } from "./T";

const cover = (project: Project) =>
  project.shots.find((shot) => shot.device === "desktop") ?? project.shots[0];

/**
 * Backdrop behind the portrait: textured red planet with a glowing rim and orbit, drifting red
 * smoke, light streaks and blurred product screens in the distance.
 */
export function HeroPlanet({ projects }: { projects: Project[] }) {
  const screens = projects.flatMap((p) => p.shots.filter((shot) => shot.device === "desktop").slice(1, 3)).slice(0, 5);
  return (
    <>
      <div className="hero-screens" data-depth="-4" data-lag aria-hidden="true">
        {screens.map((shot, i) => (
          <span key={i} className={`hero-screen is-${i + 1}`}>
            <Image src={shot.src} alt="" sizes="280px" />
          </span>
        ))}
      </div>
      <div className="hero-streaks" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div className="hero-planet" data-depth="-6" data-lag aria-hidden="true">
        <span className="planet-halo" />
        <span className="planet-body" />
        <span className="planet-rim" />
        <span className="planet-orbit" />
      </div>
      <div className="hero-smoke" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
    </>
  );
}

/** Real projects floating around the portrait as tilted glass cards. */
export function HeroProducts({ projects }: { projects: Project[] }) {
  return (
    <>
      {projects.map((project, i) => {
        const shot = cover(project);
        return (
          <TransitionLink
            key={project.slug}
            className={`hero-product is-${i + 1}`}
            href={`/work/${project.slug}`}
            label={project.title}
            data-depth={String(18 + i * 3)}
            data-lag
            data-cursor="View"
            style={{ "--i": i } as CSSProperties}
          >
            {shot && (
              <span className="hero-product-shot">
                <Image src={shot.src} alt="" sizes="110px" />
              </span>
            )}
            <span className="hero-product-text">
              <b>{project.title}</b>
              <small>
                <Tx text={project.category} />
              </small>
              <span className="hero-product-tags">
                {project.stack.slice(0, 3).map((tag) => (
                  <i key={tag}>{tag}</i>
                ))}
              </span>
            </span>
            <span className="hero-product-go" aria-hidden="true">
              <Icon name="arrowUpRight" size={13} />
            </span>
          </TransitionLink>
        );
      })}
    </>
  );
}
