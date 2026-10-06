import { profile } from "@/data/profile";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { T } from "./T";

export function Footer() {
  return (
    <footer className="footer">
      <span className="logo">
        <Logo variant="wordmark" height={34} />
      </span>
      <p>
        © {new Date().getFullYear()} {profile.name} ·{" "}
        <T en={`Designed & built in ${profile.city.en}`} mn={`${profile.city.mn}-д зохиож бүтээв`} />
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
