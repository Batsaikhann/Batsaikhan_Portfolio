import { experience, profile, projects, skills } from "@/data/profile";

const nav = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-20">
      <h2 className="mb-10 flex items-center gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
        {title}
        <span className="h-px flex-1 bg-border" />
      </h2>
      {children}
    </section>
  );
}

export default function Home() {
  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a href="#top" className="font-mono text-lg font-bold text-accent">
            {initials}
          </a>
          <ul className="hidden gap-8 text-sm text-muted sm:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="top" className="mx-auto w-full max-w-5xl flex-1 px-6">
        <section className="flex min-h-[80vh] flex-col justify-center py-20">
          <p className="mb-4 font-mono text-accent">Hi, my name is</p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">{profile.name}</h1>
          <p className="mt-3 text-3xl font-semibold text-muted sm:text-5xl">{profile.role}</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{profile.intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="rounded-md bg-accent px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              View my work
            </a>
            <a
              href="#contact"
              className="rounded-md border border-accent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent/10"
            >
              Get in touch
            </a>
          </div>
        </section>

        <Section id="about" title="About">
          <div className="grid gap-10 md:grid-cols-[2fr_1fr]">
            <div className="space-y-4 text-lg leading-relaxed text-muted">
              {profile.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <dl className="space-y-4 rounded-xl border border-border bg-card p-6 text-sm">
              <div>
                <dt className="text-muted">Location</dt>
                <dd className="mt-1 font-medium">{profile.location}</dd>
              </div>
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 break-all font-medium">{profile.email}</dd>
              </div>
            </dl>
          </div>
        </Section>

        <Section id="skills" title="Skills">
          <div className="grid gap-6 sm:grid-cols-3">
            {skills.map((group) => (
              <div key={group.group} className="rounded-xl border border-border bg-card p-6">
                <h3 className="mb-4 font-semibold">{group.group}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full bg-accent/10 px-3 py-1 font-mono text-xs text-accent"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <Section id="projects" title="Projects">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <a
                key={project.title}
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-accent"
              >
                <h3 className="text-lg font-semibold transition-colors group-hover:text-accent">
                  {project.title} <span aria-hidden>↗</span>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {project.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-3 font-mono text-xs text-muted">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </Section>

        <Section id="experience" title="Experience">
          <ol className="space-y-10 border-l border-border pl-8">
            {experience.map((job) => (
              <li key={`${job.title}-${job.period}`} className="relative">
                <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
                <p className="font-mono text-xs text-muted">{job.period}</p>
                <h3 className="mt-1 text-lg font-semibold">
                  {job.title} <span className="text-accent">@ {job.company}</span>
                </h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-muted">{job.description}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="contact" title="Contact">
          <div className="mx-auto max-w-xl text-center">
            <h3 className="text-4xl font-bold">Let&apos;s work together</h3>
            <p className="mt-4 text-lg text-muted">
              I&apos;m open to new opportunities and collaborations. Whether you have a question or
              just want to say hi, my inbox is always open.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-block rounded-md bg-accent px-8 py-4 font-medium text-background transition-opacity hover:opacity-90"
            >
              Say hello
            </a>
            <ul className="mt-10 flex justify-center gap-6 text-sm text-muted">
              {profile.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} {profile.name}
      </footer>
    </>
  );
}
