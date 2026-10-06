import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Icon } from "@/components/Icon";
import { ProjectVisual } from "@/components/ProjectVisual";
import { TransitionLink } from "@/components/RouteTransition";
import { profile, projects } from "@/data/profile";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const total = String(projects.length).padStart(2, "0");

  return (
    <main className="case">
      <section className="case-hero">
        <div className="hero-grid" aria-hidden="true" />
        <TransitionLink href="/#work" label="Work" className="back-link">
          <Icon name="arrow" size={16} /> All work
        </TransitionLink>
        <p className="eyebrow intro-1">
          <span className="pulse-dot" /> {project.number} / {total} · {project.category}
        </p>
        <h1 className="case-title">
          <span className="reveal-line" style={{ "--l": 0 } as CSSProperties}>
            <span>{project.title}</span>
          </span>
        </h1>
        <p className="case-lead intro-2">{project.description}</p>
        <dl className="case-meta intro-3">
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.join(" · ")}</dd>
          </div>
          <div>
            <dt>Activity</dt>
            <dd>{project.stats}</dd>
          </div>
          {project.live && (
            <div>
              <dt>Status</dt>
              <dd>
                <a href={project.live} target="_blank" rel="noreferrer" className="live-badge">
                  Live
                </a>
              </dd>
            </div>
          )}
        </dl>
      </section>

      <section className="case-visual" data-reveal>
        <ProjectVisual type={project.visual} />
      </section>

      <section className="case-modules section">
        <header data-reveal>
          <p className="eyebrow-label" data-scramble>
            What I built
          </p>
          <h2>
            <span className="reveal-line">
              <span>The system,</span>
            </span>
            <span className="reveal-line">
              <em>piece by piece.</em>
            </span>
          </h2>
        </header>
        <ol>
          {project.modules.map((module, i) => (
            <li key={module} data-reveal style={{ "--delay": `${i * 80}ms` } as CSSProperties}>
              <span>0{i + 1}</span>
              <b>{module}</b>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-next">
        <p className="eyebrow-label">Next project</p>
        <TransitionLink
          href={`/work/${next.slug}`}
          label={next.title}
          className="case-next-link"
          data-cursor="View"
        >
          {next.title}
          <Icon name="arrowUpRight" size={48} />
        </TransitionLink>
        <a className="link-arrow" href={`mailto:${profile.email}`}>
          Want something like this? Let&apos;s talk <Icon name="arrow" size={16} />
        </a>
      </section>
    </main>
  );
}
