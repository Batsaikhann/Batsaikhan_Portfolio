import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrowserFrame } from "@/components/BrowserFrame";
import { CaseGallery } from "@/components/CaseGallery";
import { CaseToc } from "@/components/CaseToc";
import { Icon } from "@/components/Icon";
import { ProjectVisual } from "@/components/ProjectVisual";
import { TransitionLink } from "@/components/RouteTransition";
import { T, Tx, type L } from "@/components/T";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return project ? { title: project.title, description: project.description.en } : {};
}

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

function SectionHead({ index, title }: { index: number; title: L }) {
  return (
    <header className="case-section-head" data-reveal>
      <span data-scramble>0{index}</span>
      <h2>
        <span className="reveal-line">
          <span>
            <Tx text={title} />
          </span>
        </span>
      </h2>
    </header>
  );
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  const total = String(projects.length).padStart(2, "0");

  const desktops = project.shots.filter((shot) => shot.device === "desktop");
  const stage = {
    center: desktops[0],
    left: desktops[1],
    right: project.shots.find((shot) => shot.device === "mobile") ?? desktops[2],
  };

  const sections: Array<{ id: string; label: L }> = [
    { id: "overview", label: { en: "Overview", mn: "Тойм" } },
    { id: "role", label: { en: "Role & responsibilities", mn: "Үүрэг ба хариуцлага" } },
    { id: "system", label: { en: "The system", mn: "Системийн бүтэц" } },
    ...(project.shots.length ? [{ id: "screens", label: { en: "Screens", mn: "Дэлгэцийн зургууд" } }] : []),
    { id: "highlights", label: { en: "Engineering highlights", mn: "Инженерчлэлийн шийдлүүд" } },
  ];
  const sectionIndex = (id: string) => sections.findIndex((s) => s.id === id) + 1;

  return (
    <main className="case">
      <section className="case-hero">
        <div className="hero-grid" aria-hidden="true" />
        <TransitionLink href="/#work" label="Work" className="back-link">
          <Icon name="arrow" size={16} /> <T en="All work" mn="Бүх ажил" />
        </TransitionLink>
        <p className="eyebrow intro-1">
          <span className="pulse-dot" /> {project.number} / {total} · <Tx text={project.category} /> ·{" "}
          {project.year}
        </p>
        <h1 className="case-title">
          <span className="reveal-line" style={{ "--l": 0 } as CSSProperties}>
            <span>{project.title}</span>
          </span>
        </h1>
        <div className="case-intro intro-2">
          <p className="case-lead">
            <Tx text={project.description} />
          </p>
          <div className="case-actions">
            {project.links.live && (
              <a className="button button-primary" href={project.links.live} target="_blank" rel="noreferrer" data-magnetic data-cursor="Go">
                {project.links.liveLabel ? <Tx text={project.links.liveLabel} /> : "Visit"} <Icon name="arrowUpRight" size={18} />
              </a>
            )}
            {project.links.source && (
              <a className="button button-ghost" href={project.links.source} target="_blank" rel="noreferrer" data-magnetic>
                <Icon name="github" size={18} /> <T en="View source" mn="Эх код үзэх" />
              </a>
            )}
          </div>
        </div>
        <dl className="case-meta intro-3">
          <div>
            <dt>
              <T en="Role" mn="Үүрэг" />
            </dt>
            <dd>
              <Tx text={project.role} />
            </dd>
          </div>
          <div>
            <dt>
              <T en="Team" mn="Баг" />
            </dt>
            <dd>
              <Tx text={project.team} />
            </dd>
          </div>
          <div>
            <dt>
              <T en="Status" mn="Төлөв" />
            </dt>
            <dd>
              <span className={`status-badge is-${project.status.kind}`}>
                <Tx text={project.status.label} />
              </span>
            </dd>
          </div>
        </dl>
        <div className="tags case-stack intro-3">
          {project.stack.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </section>

      {stage.center ? (
        <section className="case-stage" data-tilt="2" aria-label="Screens">
          <div className="stage-inner">
            {stage.left && (
              <div className="stage-frame stage-left" data-parallax="0.05">
                <BrowserFrame shot={stage.left} sizes="40vw" />
              </div>
            )}
            <div className="stage-frame stage-center">
              <BrowserFrame shot={stage.center} sizes="(max-width: 760px) 92vw, 64vw" priority />
            </div>
            {stage.right && (
              <div className={`stage-frame stage-right is-${stage.right.device}`} data-parallax="-0.05">
                <BrowserFrame shot={stage.right} sizes="30vw" />
              </div>
            )}
          </div>
          <ul className="stage-labels" aria-hidden="true">
            {project.shots.map((shot) => (
              <li key={shot.url + shot.label.en}>
                <Tx text={shot.label} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="case-visual" data-reveal>
          <ProjectVisual type={project.visual} />
        </section>
      )}

      <section className="case-metrics">
        {project.metrics.map((metric, i) => (
          <div key={metric.label.en} data-reveal style={delay(i * 80)}>
            <strong>
              <i data-count={metric.value}>{metric.value.toLocaleString("en-US")}</i>
              {metric.suffix && <span>{metric.suffix}</span>}
            </strong>
            <p>
              <Tx text={metric.label} />
            </p>
          </div>
        ))}
      </section>

      <div className="case-body">
        <aside className="case-aside">
          <CaseToc items={sections} />
        </aside>

        <div className="case-content">
          <section id="overview" className="case-section">
            <SectionHead index={sectionIndex("overview")} title={{ en: "Overview", mn: "Тойм" }} />
            <p className="case-summary" data-reveal>
              <Tx text={project.overview.summary} />
            </p>
            <div className="case-pss">
              {(
                [
                  [{ en: "The problem", mn: "Асуудал" }, project.overview.problem],
                  [{ en: "Architecture & solution", mn: "Архитектур ба шийдэл" }, project.overview.solution],
                  [{ en: "The result", mn: "Үр дүн" }, project.overview.result],
                ] as Array<[L, L]>
              ).map(([title, text], i) => (
                <article key={title.en} data-reveal style={delay(i * 90)}>
                  <span className="num">0{i + 1}</span>
                  <h3>
                    <Tx text={title} />
                  </h3>
                  <p>
                    <Tx text={text} />
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="role" className="case-section">
            <SectionHead index={sectionIndex("role")} title={{ en: "Role & responsibilities", mn: "Үүрэг ба хариуцлага" }} />
            <div className="case-role" data-reveal>
              <div>
                <small>
                  <T en="Role" mn="Үүрэг" />
                </small>
                <b>
                  <Tx text={project.role} />
                </b>
              </div>
              <div>
                <small>
                  <T en="Team" mn="Баг" />
                </small>
                <p>
                  <Tx text={project.team} />
                </p>
              </div>
            </div>
            <ul className="case-list">
              {project.responsibilities.map((item, i) => (
                <li key={item.en} data-reveal style={delay(i * 60)}>
                  <Tx text={item} />
                </li>
              ))}
            </ul>
          </section>

          <section id="system" className="case-section">
            <SectionHead index={sectionIndex("system")} title={{ en: "The system", mn: "Системийн бүтэц" }} />
            <div className="case-modules-grid">
              {project.modules.map((module, i) => (
                <article key={module.title.en} data-reveal data-tilt="3" style={delay(i * 80)}>
                  <span className="num">0{i + 1}</span>
                  <h3>
                    <Tx text={module.title} />
                  </h3>
                  <p>
                    <Tx text={module.text} />
                  </p>
                </article>
              ))}
            </div>
          </section>

          {project.shots.length > 0 && (
            <section id="screens" className="case-section">
              <SectionHead index={sectionIndex("screens")} title={{ en: "Screens", mn: "Дэлгэцийн зургууд" }} />
              <p className="case-note" data-reveal>
                {project.shotsNote ? (
                  <Tx text={project.shotsNote} />
                ) : (
                  <T
                    en="Captured from the live product. Click a screen to enlarge it."
                    mn="Ажиллаж буй бүтээгдэхүүнээс авсан зургууд. Зураг дээр дарж томруулж харна уу."
                  />
                )}
              </p>
              <CaseGallery shots={project.shots} />
            </section>
          )}

          <section id="highlights" className="case-section">
            <SectionHead index={sectionIndex("highlights")} title={{ en: "Engineering highlights", mn: "Инженерчлэлийн шийдлүүд" }} />
            <ol className="case-highlights">
              {project.highlights.map((item, i) => (
                <li key={item.title.en} data-reveal style={delay(i * 70)}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>
                      <Tx text={item.title} />
                    </h3>
                    <p>
                      <Tx text={item.text} />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      <section className="case-next">
        <p className="eyebrow-label">
          <T en="Next project" mn="Дараагийн төсөл" />
        </p>
        <TransitionLink href={`/work/${next.slug}`} label={next.title} className="case-next-link" data-cursor="View">
          {next.title}
          <Icon name="arrowUpRight" size={48} />
        </TransitionLink>
        <a className="link-arrow" href={`mailto:${profile.email}`}>
          <T en="Want something like this? Let's talk" mn="Үүн шиг зүйл хэрэгтэй юу? Ярилцъя" /> <Icon name="arrow" size={16} />
        </a>
      </section>
    </main>
  );
}
