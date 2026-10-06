import type { CSSProperties } from "react";
import Image from "next/image";
import { HeroScene } from "@/components/HeroScene";
import { Icon } from "@/components/Icon";
import { ProjectCard } from "@/components/ProjectCard";
import { StackOrbit } from "@/components/StackOrbit";
import { profile, projects, stats, teamProjects, ticker } from "@/data/profile";
import portraitPhoto from "../../public/images/mee1.png";
import graduationPhoto from "../../public/images/batsaikhan-graduation.png";

// Showcase order: featured SportHub in the middle, flanked by the others.
const [featured, ...others] = projects;
const showcase = [
  { project: others[0], side: "left" as const, featured: false },
  { project: featured, side: undefined, featured: true },
  { project: others[1], side: "right" as const, featured: false },
];

const line = (index: number) => ({ "--l": index }) as CSSProperties;

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow intro-1">
            <span className="pulse-dot" /> {profile.location} · Available for work
          </p>
          <h1 aria-label="I build systems that move.">
            <span className="reveal-line" style={line(0)}>
              <span>I build</span>
            </span>
            <span className="reveal-line" style={line(1)}>
              <span>systems</span>
            </span>
            <span className="reveal-line" style={line(2)}>
              <span>
                that <em>move</em>
                <i className="caret" />
              </span>
            </span>
          </h1>
          <p className="hero-description intro-2">
            Full-stack engineer turning ambitious ideas into products — from backend architecture
            to web, mobile and deployment.
          </p>
          <div className="hero-actions intro-3">
            <a className="button button-primary" href="#work" data-magnetic data-cursor="Go">
              Explore my work <Icon name="arrow" />
            </a>
            <a className="text-link" href={profile.github.href} target="_blank" rel="noreferrer">
              <Icon name="github" /> {profile.github.label}
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-glow" data-depth="-14" aria-hidden="true" />
          <div className="hero-scene-wrap" data-depth="-6">
            <HeroScene />
          </div>
          <div className="hero-portrait" data-depth="6">
            <Image
              src={portraitPhoto}
              alt="Batsaikhan working on a laptop"
              fill
              priority
              placeholder="blur"
              sizes="(max-width: 760px) 92vw, 460px"
            />
          </div>
          <div className="float-card card-commits" data-depth="18" data-lag>
            <b>
              250<span>+</span>
            </b>
            <small>commits & PRs</small>
            <div className="mini-bars" aria-hidden="true">
              {[30, 52, 40, 70, 58, 92].map((h, i) => (
                <i key={i} style={{ "--h": `${h}%`, "--i": i } as CSSProperties} />
              ))}
            </div>
          </div>
          <div className="float-card card-scope" data-depth="26" data-lag>
            <span>Full-stack</span>
            <span>Web / Mobile</span>
            <span>Cloud · DevOps</span>
            <i className="card-scope-icon">
              <Icon name="arrowUpRight" size={14} />
            </i>
          </div>
          <div className="float-pill" data-depth="12" data-lag>
            <i /> shipping since 2023
          </div>
        </div>

        <a className="scroll-cue intro-4" href="#work" aria-label="Scroll to work">
          <span className="scroll-circle">
            <Icon name="arrowDown" size={16} />
          </span>
          Scroll to explore
        </a>
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((loop) => (
            <div className="ticker-group" key={loop}>
              {ticker.map((word) => [<span key={word}>{word}</span>, <i key={`${word}-sep`}>◆</i>])}
            </div>
          ))}
        </div>
      </div>

      <section className="work section" id="work">
        <header className="work-heading" data-reveal>
          <div>
            <p className="eyebrow-label" data-scramble>
              01 / Selected work
            </p>
            <h2>
              <span className="reveal-line">
                <span>Built with purpose.</span>
              </span>
              <span className="reveal-line">
                <em>Engineered to scale.</em>
              </span>
            </h2>
          </div>
          <div className="work-intro">
            <p>A collection of products and systems I&apos;ve built — from idea to production.</p>
            <a className="link-arrow" href={profile.github.href} target="_blank" rel="noreferrer">
              More on GitHub <Icon name="arrow" size={16} />
            </a>
          </div>
        </header>

        <div className="showcase">
          {showcase.map((item, i) => (
            <ProjectCard
              key={item.project.slug}
              project={item.project}
              total={projects.length}
              featured={item.featured}
              side={item.side}
              index={i}
            />
          ))}
        </div>

        <article className="team-work" data-reveal>
          <div>
            <p className="eyebrow-label">04 / Team projects</p>
            <p className="team-note">Shipped through a team PR workflow.</p>
          </div>
          {teamProjects.map((item) => (
            <div className="team-item" key={item.title}>
              <b>{item.title}</b>
              <span>{item.description}</span>
              <strong>{item.stats}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="about section" id="about">
        <div className="about-ambient" aria-hidden="true" />
        <div className="about-image" data-reveal>
          <div className="about-image-inner" data-parallax="0.06">
            <Image
              src={graduationPhoto}
              alt="Batsaikhan on graduation day"
              fill
              placeholder="blur"
              sizes="(max-width: 760px) 92vw, 42vw"
            />
          </div>
          <span className="curtain" aria-hidden="true" />
          <div className="image-caption">
            <span data-scramble>02 / The person</span>
            <b>
              Engineer by craft.
              <br />
              Builder by nature.
            </b>
          </div>
        </div>

        <div className="about-copy" data-reveal>
          <p className="eyebrow-label" data-scramble>
            About me
          </p>
          <h2>
            <span className="reveal-line">
              <span>More than code.</span>
            </span>
            <span className="reveal-line">
              <em>I own the outcome.</em>
            </span>
          </h2>
          <p className="about-lead">
            I&apos;m Batsaikhan — a full-stack developer who can take a product from the first
            database schema all the way to production.
          </p>
          <p>
            I care about clean architecture, thoughtful interfaces and systems that stay reliable as
            they grow. Whether working independently or through a team PR workflow, I focus on
            shipping real value.
          </p>
          <div className="about-stats">
            {stats.map((stat) => (
              <div key={stat.label}>
                <strong>
                  <i data-count={stat.value}>{stat.value}</i>
                  {stat.suffix && <span>{stat.suffix}</span>}
                </strong>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-orbit" data-parallax="-0.08" aria-hidden="true">
          <div className="planet" />
          <svg viewBox="0 0 400 400">
            <ellipse cx="200" cy="200" rx="190" ry="120" />
          </svg>
          <i className="orbit-dot" />
          <p>Open to opportunities · Let&apos;s build</p>
        </div>

        <div className="location-card" data-reveal>
          <p>
            <Icon name="pin" size={16} />
            <span>
              Based in <b>{profile.location}</b>
            </span>
          </p>
          <p>
            <i className="status-dot" />
            <span>
              Available for work <b>Worldwide</b>
            </span>
          </p>
        </div>
      </section>

      <section className="stack section" id="stack">
        <header className="stack-heading" data-reveal>
          <p className="eyebrow-label" data-scramble>
            03 / Capabilities
          </p>
          <h2>
            <span className="reveal-line">
              <span>One developer.</span>
            </span>
            <span className="reveal-line">
              <em>Full product scope.</em>
            </span>
          </h2>
        </header>
        <StackOrbit />
      </section>

      <section className="contact section" id="contact">
        <div className="contact-words" data-parallax="0.1" aria-hidden="true">
          <span>Build</span>
          <span>Create</span>
          <span>Ship</span>
        </div>
        <div className="contact-planet" aria-hidden="true" />
        <div className="contact-rings" aria-hidden="true">
          <i />
          <i />
          <i className="ring-orbit">
            <b />
          </i>
        </div>
        <ul className="contact-topics" aria-hidden="true">
          <li>Ideas</li>
          <li>Products</li>
          <li>Partnerships</li>
          <li>Opportunities</li>
        </ul>

        <div className="contact-content" data-reveal>
          <p className="eyebrow-label">
            <span className="pulse-dot" /> Let&apos;s talk
          </p>
          <h2>
            <span className="reveal-line">
              <span>Let&apos;s build</span>
            </span>
            <span className="reveal-line">
              <em>something real.</em>
            </span>
          </h2>
          <p className="contact-sub">
            Have an idea, a project or just want to say hi? I&apos;m always open to new
            opportunities.
          </p>
          <a
            className="button button-primary contact-button"
            href={`mailto:${profile.email}`}
            data-magnetic
            data-cursor="Go"
          >
            Start a conversation <Icon name="arrow" />
          </a>
        </div>

        <div className="contact-links" data-reveal>
          <a href={profile.github.href} target="_blank" rel="noreferrer">
            <Icon name="github" size={18} /> {profile.github.label}
          </a>
          <a href={profile.linkedin.href}>
            <Icon name="linkedin" size={18} /> {profile.linkedin.label}
          </a>
          <a href={`mailto:${profile.email}`}>
            <Icon name="mail" size={18} /> {profile.email}
          </a>
        </div>
      </section>
    </main>
  );
}
