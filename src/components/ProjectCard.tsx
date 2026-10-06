import type { CSSProperties } from "react";
import type { Project } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";
import { TransitionLink } from "./RouteTransition";
import { Tx } from "./T";

type Props = { project: Project; total: number; featured?: boolean; side?: "left" | "right"; index: number };

export function ProjectCard({ project, total, featured, side, index }: Props) {
  const cover = project.shots.find((shot) => shot.device === "desktop");

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      label={project.title}
      className={`project-card ${featured ? "is-featured" : ""} ${side ? `side-${side}` : ""}`}
      data-reveal
      data-tilt="3"
      data-cursor="View"
      style={{ "--delay": `${index * 110}ms` } as CSSProperties}
    >
      <div className="card-inner">
        <div className="card-visual">
          {cover ? (
            <div className="card-shot">
              <BrowserFrame shot={cover} sizes="(max-width: 760px) 90vw, 560px" />
            </div>
          ) : (
            <ProjectVisual type={project.visual} />
          )}
          <span className={`status-badge is-${project.status.kind}`}>
            <Tx text={project.status.label} />
          </span>
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span className="card-index">
              {project.number} / {String(total).padStart(2, "0")}
            </span>
            <Tx text={project.category} />
            <b>{project.year}</b>
          </div>
          <h3>{project.title}</h3>
          <p>
            <Tx text={project.description} />
          </p>
          <div className="tags">
            {project.stack.slice(0, 4).map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
        <span className="card-arrow">
          <Icon name="arrowUpRight" size={20} />
        </span>
      </div>
    </TransitionLink>
  );
}
