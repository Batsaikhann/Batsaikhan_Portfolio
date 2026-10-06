import { profile } from "@/data/profile";
import { Icon } from "./Icon";

export function Footer() {
  return (
    <footer className="footer">
      <span className="logo">
        B<span>/</span>
      </span>
      <p>
        © {new Date().getFullYear()} {profile.name} · Designed & built in {profile.location.split(",")[0]}
      </p>
      <div className="socials">
        <a href={profile.github.href} target="_blank" rel="noreferrer" aria-label="GitHub" data-magnetic>
          <Icon name="github" size={18} />
        </a>
        <a href={profile.linkedin.href} aria-label="LinkedIn" data-magnetic>
          <Icon name="linkedin" size={18} />
        </a>
        <a href={`mailto:${profile.email}`} aria-label="Email" data-magnetic>
          <Icon name="mail" size={18} />
        </a>
      </div>
    </footer>
  );
}
