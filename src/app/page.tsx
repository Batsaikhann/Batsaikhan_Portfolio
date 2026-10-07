import type { CSSProperties } from "react";
import Image from "next/image";
import { AboutBridge } from "@/components/AboutBridge";
import { DevIdCard } from "@/components/DevIdCard";
import { HeroPlanet, HeroProducts } from "@/components/HeroOrbit";
import { HeroRain } from "@/components/HeroRain";
import { ContactButton } from "@/components/ContactModal";
import { HeroScene } from "@/components/HeroScene";
import { Icon } from "@/components/Icon";
import { ProjectShowcase } from "@/components/ProjectShowcase";
import { TransitionLink } from "@/components/RouteTransition";
import { StackOrbit } from "@/components/StackOrbit";
import { T, Tx } from "@/components/T";
import { journey, profile, stats, ticker } from "@/data/profile";
import { projects } from "@/data/projects";
import portraitPhoto from "../../public/images/hero/portrait-cutout.png";
import silhouettePhoto from "../../public/images/hero/silhouette.webp";
import graduationPhoto from "../../public/images/batsaikhan-graduation.png";

const sporthubShot = projects.find((p) => p.slug === "sporthub")?.shots[0];
const heroProducts = ["barilgahub", "gymhub", "sparkxp"].flatMap((slug) => projects.filter((p) => p.slug === slug));

const line = (index: number) => ({ "--l": index }) as CSSProperties;

export default function Home() {
  return (
    <main>
      <section className="hero" id="top">
        <HeroRain />
        <div className="hero-grid" data-depth="-3" data-lag aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow intro-1">
            <span className="pulse-dot" /> <Tx text={profile.location} /> ·{" "}
            <T en="Available for work" mn="Ажилд нээлттэй" />
          </p>
          <h1>
            <span className="reveal-line" style={line(0)}>
              <span>
                <T en="I build" mn="Би амьд" />
              </span>
            </span>
            <span className="reveal-line" style={line(1)}>
              <span>
                <T en="systems" mn="систем" />
              </span>
            </span>
            <span className="reveal-line" style={line(2)}>
              <span>
                <T
                  en={
                    <>
                      that <em>move</em>
                    </>
                  }
                  mn={<em>бүтээдэг</em>}
                />
                <i className="caret" />
              </span>
            </span>
          </h1>
          <p className="hero-description intro-2">
            <T
              en="Full-stack engineer turning ambitious ideas into products — from backend architecture to web, mobile and deployment."
              mn="Амбицтай санааг бүтээгдэхүүн болгодог full-stack инженер — backend архитектураас эхлээд веб, мобайл, deployment хүртэл."
            />
          </p>
          <div className="hero-actions intro-3">
            <a className="button button-primary" href="#work" data-magnetic data-cursor="Go">
              <T en="Explore my work" mn="Ажлуудыг үзэх" /> <Icon name="arrow" />
            </a>
            <a className="hero-github" href={profile.github.href} target="_blank" rel="noreferrer" data-magnetic>
              <span className="hero-github-icon">
                <Icon name="github" size={18} />
              </span>
              <span className="hero-github-text">
                <small>GitHub</small>
                {profile.github.label}
              </span>
              <Icon name="arrowUpRight" size={15} />
            </a>
          </div>
        </div>

        <div className="hero-visual">
          {/* Depth stack, back to front: grid (-3) · glow · rock planes (-7) · planet (-6) · portrait (10) · cards (12–24). */}
          <div className="hero-glow" data-depth="-5" aria-hidden="true" />
          <HeroPlanet projects={projects} />
          <div className="hero-scene-wrap" data-depth="-7">
            <HeroScene />
          </div>
          <div className="hero-light" data-follow aria-hidden="true" />
          <div className="hero-portrait" data-depth="10">
            <Image
              src={portraitPhoto}
              alt="Batsaikhan working on a laptop"
              fill
              preload
              placeholder="blur"
              sizes="(max-width: 760px) 92vw, 460px"
            />
            <span className="portrait-rim" aria-hidden="true" />
          </div>
          <div className="hero-cards">
          <TransitionLink className="float-card card-building" href="/work/sporthub" label="SportHub" data-depth="16" data-lag data-cursor="View">
            <small>
              <i className="status-dot" /> <T en="Now building" mn="Одоо бүтээж буй" />
            </small>
            <b>SportHub</b>
            <span className="building-sub">
              <T en="Multi-sport platform" mn="Олон спортын платформ" />
            </span>
            <span className="building-bar" aria-hidden="true">
              <i />
            </span>
            <span className="building-stack">NestJS · React · Flutter</span>
            {sporthubShot && (
              <span className="building-shot">
                <Image src={sporthubShot.src} alt="" sizes="240px" />
              </span>
            )}
          </TransitionLink>
          <HeroProducts projects={heroProducts} />
          </div>
          {/* Outside .hero-cards so it can sit above the smoke while the project cards stay behind the portrait. */}
          <div className="float-card card-scope" data-depth="14" data-lag>
            <span>Full-stack</span>
            <span>
              <T en="Web / Mobile" mn="Веб / Мобайл" />
            </span>
            <span>Cloud · DevOps</span>
            <i className="card-scope-icon">
              <Icon name="arrowUpRight" size={14} />
            </i>
          </div>
        </div>

        <a className="scroll-cue intro-4" href="#work" aria-label="Scroll to work">
          <span className="scroll-circle">
            <Icon name="arrowDown" size={16} />
          </span>
          <T en="Scroll to explore" mn="Доош гүйлгэх" />
        </a>
      </section>

      <AboutBridge silhouette={silhouettePhoto} />

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[0, 1].map((loop) => (
            <div className="ticker-group" key={loop}>
              {ticker.map((word) => [<span key={word}>{word}</span>, <i key={`${word}-sep`} aria-hidden="true" />])}
            </div>
          ))}
        </div>
      </div>

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
          <span className="frame-run" aria-hidden="true" />
          <span className="frame-run is-bloom" aria-hidden="true" />
          <div className="image-caption">
            <span data-scramble>
              <T en="01 / The person" mn="01 / Хүн" />
            </span>
            <b>
              <T
                en={
                  <>
                    Engineer by craft.
                    <br />
                    Builder by nature.
                  </>
                }
                mn={
                  <>
                    Мэргэжлээрээ инженер.
                    <br />
                    Мөн чанараараа бүтээгч.
                  </>
                }
              />
            </b>
          </div>
        </div>

        <div className="about-copy" data-reveal>
          <p className="eyebrow-label" data-scramble>
            <T en="About me" mn="Миний тухай" />
          </p>
          <h2>
            <span className="reveal-line">
              <span>
                <T en="More than code." mn="Кодоос илүү." />
              </span>
            </span>
            <span className="reveal-line">
              <em>
                <T en="I own the outcome." mn="Үр дүнг хариуцна." />
              </em>
            </span>
          </h2>
          <p className="about-lead">
            <T
              en="I'm Batsaikhan — a full-stack developer who can take a product from the first database schema all the way to production."
              mn="Би Батсайхан — өгөгдлийн сангийн анхны схемээс эхлээд production хүртэл бүтээгдэхүүнийг авч явж чаддаг full-stack хөгжүүлэгч."
            />
          </p>
          <p>
            <T
              en="I care about clean architecture, thoughtful interfaces and systems that stay reliable as they grow. Whether working independently or through a team PR workflow, I focus on shipping real value."
              mn="Цэвэр архитектур, бодож боловсруулсан интерфейс, өсөх тусам найдвартай хэвээр үлдэх системийг би чухалчилдаг. Бие даан ч, багийн PR урсгалаар ч жинхэнэ үнэ цэнийг хүргэхэд анхаардаг."
            />
          </p>
          <div className="about-stats">
            {stats.map((stat) => (
              <div key={stat.label.en}>
                <strong>
                  <i data-count={stat.value}>{stat.value}</i>
                  {stat.suffix && <span>{stat.suffix}</span>}
                </strong>
                <p>
                  <Tx text={stat.label} />
                </p>
              </div>
            ))}
          </div>

          <ol className="journey" data-progress>
            {journey.map((item, i) => (
              <li
                key={item.title}
                className={`journey-item is-${item.kind}${item.current ? " is-current" : ""}`}
                data-reveal
                data-step
                style={{ "--delay": `${i * 90}ms` } as CSSProperties}
              >
                <span className="journey-period">
                  {item.current && <i className="status-dot" />}
                  <Tx text={item.period} />
                </span>
                <div>
                  <b>{item.title}</b>
                  <p>
                    <Tx text={item.role} />
                  </p>
                  {item.note && (
                    <small>
                      <Tx text={item.note} />
                    </small>
                  )}
                </div>
                <span className="journey-kind">
                  {item.kind === "work" ? <T en="Work" mn="Ажил" /> : <T en="Education" mn="Боловсрол" />}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="about-orbit" data-parallax="-0.08" aria-hidden="true">
          <div className="planet" />
          <svg viewBox="0 0 400 400">
            <ellipse cx="200" cy="200" rx="190" ry="120" />
          </svg>
          <i className="orbit-dot" />
          <p>
            <T en="Open to opportunities · Let's build" mn="Боломжид нээлттэй · Хамтдаа бүтээе" />
          </p>
        </div>

        <div className="location-card" data-reveal>
          <p>
            <Icon name="pin" size={16} />
            <span>
              <T en="Based in" mn="Байршил" /> <b>
                <Tx text={profile.location} />
              </b>
            </span>
          </p>
          <p>
            <i className="status-dot" />
            <span>
              <T en="Available for work" mn="Ажилд нээлттэй" />{" "}
              <b>
                <T en="Worldwide" mn="Дэлхий даяар" />
              </b>
            </span>
          </p>
        </div>
      </section>

      <section className="work section" id="work">
        <header className="work-heading" data-reveal>
          <div>
            <p className="eyebrow-label work-eyebrow">
              <b>02</b> / <T en="Selected work" mn="Сонгосон ажлууд" />
            </p>
            <h2>
              <span className="reveal-line">
                <span>
                  <T en="Built with purpose." mn="Зорилготой бүтээсэн." />
                </span>
              </span>
              <span className="reveal-line">
                <em>
                  <T en="Engineered to scale." mn="Өсөлтөд бэлэн." />
                </em>
              </span>
            </h2>
          </div>
          <div className="work-intro">
            <p>
              <T
                en="A collection of products and systems from idea to production. Real problems, real users, real impact."
                mn="Санаанаас production хүртэл хүргэсэн бүтээгдэхүүн, системүүд. Бодит асуудал, бодит хэрэглэгч, бодит үр нөлөө."
              />
            </p>
            <a className="link-arrow" href={profile.github.href} target="_blank" rel="noreferrer">
              <T en="More on GitHub" mn="GitHub дээр дэлгэрэнгүй" /> <Icon name="arrow" size={16} />
            </a>
          </div>
        </header>

        <ProjectShowcase projects={projects} />
      </section>

      <section className="devid section" aria-label="Developer ID">
        <div className="devid-intro" data-reveal>
          <p className="eyebrow-label">
            <T en="Hi, I'm" mn="Сайн уу, би" />
          </p>
          <h2>
            <span className="reveal-line">
              <span>Batsaikhan</span>
            </span>
            <span className="reveal-line">
              <em>
                <T en="Product builder." mn="Бүтээгдэхүүн бүтээгч." />
              </em>
            </span>
          </h2>
          <p className="devid-quote">
            <T
              en="“From the first database schema all the way to production.”"
              mn="“Өгөгдлийн сангийн анхны схемээс production хүртэл.”"
            />
          </p>
        </div>

        <div className="devid-stage" data-reveal>
          <DevIdCard />
        </div>

        <dl className="devid-facts" data-reveal>
          <p className="eyebrow-label">
            <T en="Quick facts" mn="Товч мэдээлэл" />
          </p>
          {(
            [
              [{ en: "Based in", mn: "Байршил" }, profile.location],
              [{ en: "Studying", mn: "Сургууль" }, { en: "MUST · Software Engineering", mn: "ШУТИС · Програм хангамж" }],
              [{ en: "Batch", mn: "Он" }, { en: "2022 – 2026", mn: "2022 – 2026" }],
              [{ en: "Working at", mn: "Ажил" }, { en: "Aether Tech Core LLC", mn: "Aether Tech Core LLC" }],
              [{ en: "Focus", mn: "Чиглэл" }, { en: "Full-stack · Web · Mobile · AI", mn: "Full-stack · Веб · Мобайл · AI" }],
            ] as const
          ).map(([label, value]) => (
            <div key={label.en}>
              <dt>
                <Tx text={label} />
              </dt>
              <dd>
                <Tx text={value} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="stack section" id="stack">
        <header className="stack-heading" data-reveal>
          <p className="eyebrow-label" data-scramble>
            <T en="03 / Capabilities" mn="03 / Чадварууд" />
          </p>
          <h2>
            <span className="reveal-line">
              <span>
                <T en="One developer." mn="Нэг хөгжүүлэгч." />
              </span>
            </span>
            <span className="reveal-line">
              <em>
                <T en="Full product scope." mn="Бүтээгдэхүүний бүх шат." />
              </em>
            </span>
          </h2>
        </header>
        <StackOrbit />
      </section>

      <section className="contact section" id="contact">
        <div className="contact-words" aria-hidden="true">
          <span data-parallax-x="0.12">Build</span>
          <span data-parallax-x="-0.12">Create</span>
          <span data-parallax-x="0.12">Ship</span>
        </div>
        <div className="contact-planet" aria-hidden="true" />
        <svg className="contact-orbits" viewBox="0 0 1000 600" aria-hidden="true">
          <ellipse cx="500" cy="300" rx="470" ry="150" />
          <ellipse cx="500" cy="300" rx="380" ry="230" transform="rotate(-14 500 300)" />
          <ellipse cx="500" cy="300" rx="300" ry="96" transform="rotate(9 500 300)" />
          <ellipse className="orbit-runner" cx="500" cy="300" rx="380" ry="230" transform="rotate(-14 500 300)" pathLength={1} />
        </svg>
        <div className="contact-rings" aria-hidden="true">
          <i />
          <i />
          <i className="ring-orbit">
            <b />
          </i>
        </div>
        <ul className="contact-topics" aria-hidden="true">
          <li>
            <T en="Ideas" mn="Санаа" />
          </li>
          <li>
            <T en="Products" mn="Бүтээгдэхүүн" />
          </li>
          <li>
            <T en="Partnerships" mn="Түншлэл" />
          </li>
          <li>
            <T en="Opportunities" mn="Боломж" />
          </li>
        </ul>

        <div className="contact-content" data-reveal>
          <p className="eyebrow-label">
            <span className="pulse-dot" /> <T en="Let's talk" mn="Ярилцъя" />
          </p>
          <h2>
            <span className="reveal-line">
              <span>
                <T en="Let's build" mn="Хамтдаа" />
              </span>
            </span>
            <span className="reveal-line">
              <em>
                <T en="something real." mn="бодитыг бүтээе." />
              </em>
            </span>
          </h2>
          <p className="contact-sub">
            <T
              en="Have an idea, a project or just want to say hi? I'm always open to new opportunities."
              mn="Санаа, төсөл байна уу, эсвэл зүгээр л мэндлэх үү? Би шинэ боломжид үргэлж нээлттэй."
            />
          </p>
          <ContactButton className="button button-primary contact-button button-glow" data-magnetic data-cursor="Go">
            <T en="Start a conversation" mn="Яриа эхлүүлэх" /> <Icon name="arrow" />
          </ContactButton>
        </div>

        <div className="contact-links" data-reveal>
          <a href={profile.github.href} target="_blank" rel="noreferrer">
            <Icon name="github" size={18} /> {profile.github.label}
          </a>
          <a href={profile.instagram.href} target="_blank" rel="noreferrer">
            <Icon name="instagram" size={18} /> {profile.instagram.label}
          </a>
          <a href={`mailto:${profile.email}`}>
            <Icon name="mail" size={18} /> {profile.email}
          </a>
          {profile.phones.map((phone) => (
            <a key={phone} href={`tel:+976${phone.replace(/\s/g, "")}`}>
              <Icon name="phone" size={18} /> {phone}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
