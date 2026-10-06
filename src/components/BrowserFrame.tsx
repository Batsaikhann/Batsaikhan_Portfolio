import Image from "next/image";
import type { Shot } from "@/data/projects";

type Props = { shot: Shot; sizes: string; priority?: boolean; className?: string };

/** A real product screenshot inside a minimal browser (or phone) frame. */
export function BrowserFrame({ shot, sizes, priority, className = "" }: Props) {
  const image = (
    <Image src={shot.src} alt={shot.label.en} sizes={sizes} preload={priority} placeholder="blur" />
  );

  if (shot.device === "mobile") {
    return <div className={`device-phone ${className}`}>{image}</div>;
  }

  return (
    <div className={`browser ${className}`}>
      <div className="browser-bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <span>{shot.url}</span>
      </div>
      <div className="browser-view">{image}</div>
    </div>
  );
}
