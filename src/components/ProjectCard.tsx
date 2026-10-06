import type { CSSProperties } from "react";
import type { Project } from "@/data/profile";
import { Icon } from "./Icon";
import { ProjectVisual } from "./ProjectVisual";
import { TransitionLink } from "./RouteTransition";

type Props = { project: Project; total: number; featured?: boolean; side?: "left" | "right"; index: number };

export function ProjectCard({ project, total, featured, side, index }: Props) {
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
          <ProjectVisual type={project.visual} />
          {project.live && <span className="live-badge">Live</span>}
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span>
              {project.number} / {String(total).padStart(2, "0")}
            </span>
            {project.category}
            <b>{project.stats}</b>
          </div>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="tags">
            {project.stack.map((tag) => (
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
