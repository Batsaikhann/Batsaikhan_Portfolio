import Image from "next/image";
import type { Shot } from "@/data/projects";

type Props = {
  shot: Shot;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Extra screens of the same product, cross-faded as a lightweight walkthrough. */
  frames?: Shot[];
  /** Index into [shot, ...frames] that is currently shown. */
  frame?: number;
};

/** A real product screenshot inside a minimal browser (or phone) frame. */
export function BrowserFrame({ shot, sizes, priority, className = "", frames = [], frame = 0 }: Props) {
  if (shot.device === "mobile") {
    return (
      <div className={`device-phone ${className}`}>
        <Image src={shot.src} alt={shot.label.en} sizes={sizes} preload={priority} placeholder="blur" />
      </div>
    );
  }

  const all = [shot, ...frames];
  const shown = frame % all.length;

  return (
    <div className={`browser ${all.length > 1 ? "is-cycling" : ""} ${className}`}>
      <div className="browser-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span className="browser-url">
          {all.map((s, i) => (
            <em key={s.url + i} className={i === shown ? "is-shown" : undefined}>
              {s.url}
            </em>
          ))}
        </span>
      </div>
      <div className="browser-view">
        {all.map((s, i) => (
          <Image
            key={s.url + i}
            src={s.src}
            alt={i === 0 ? s.label.en : ""}
            sizes={sizes}
            preload={i === 0 && priority}
            placeholder={i === 0 ? "blur" : "empty"}
            className={i === shown ? "is-shown" : undefined}
          />
        ))}
      </div>
    </div>
  );
}
