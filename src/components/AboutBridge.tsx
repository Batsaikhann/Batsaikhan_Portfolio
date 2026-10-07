import Image, { type StaticImageData } from "next/image";
import { BridgeCode } from "./BridgeCode";
import { CodeColumns } from "./CodeColumns";
import { Icon } from "./Icon";
import { T } from "./T";

/**
 * "Next: About" bridge between the hero and the About section — giant type, the portrait as a dark
 * silhouette, a low horizon. A normal section (no pinning, no scroll scrubbing): it plays a one-shot
 * fade/rise when it scrolls into view (data-reveal → .is-visible, from Interactions).
 */
export function AboutBridge({ silhouette }: { silhouette: StaticImageData }) {
  return (
    <section className="bridge" data-reveal aria-label="About">
      <span className="next-grid" aria-hidden="true" />
      <CodeColumns />
      <BridgeCode />
      {/* A loose red code fragment in the empty top-right corner. */}
      <span className="next-code is-b" aria-hidden="true">
        stack = [<em>&quot;Next.js&quot;</em>, <em>&quot;React&quot;</em>, <em>&quot;NestJS&quot;</em>, <em>&quot;Flutter&quot;</em>];
      </span>
      <span className="next-marks" aria-hidden="true">
        <i /> <i /> <i /> <i />
      </span>
      <div className="next-side is-left" aria-hidden="true">
        <p>
          <i /> <T en="Ulaanbaatar, Mongolia" mn="Улаанбаатар, Монгол" />
        </p>
        <ol>
          <li>Build <b>01</b></li>
          <li>Ship <b>02</b></li>
          <li>Scale <b>03</b></li>
        </ol>
      </div>
      <ul className="next-side is-right" aria-hidden="true">
        <li>Ideas</li>
        <li>Systems</li>
        <li>People</li>
      </ul>
      <small className="next-label">
        <T en="Next" mn="Дараагийнх" /> /
      </small>
      <p className="next-title" aria-hidden="true">
        <T en="About" mn="Тухай" />
      </p>
      <span className="next-figure" aria-hidden="true">
        <Image src={silhouette} alt="" sizes="(max-width: 760px) 60vw, 380px" />
      </span>
      <span className="next-horizon" aria-hidden="true" />
      <div className="next-copy">
        <p className="next-lead">
          <T en="More than code." mn="Кодоос илүү." />
        </p>
        <p className="next-sub">
          <T en="I build products, systems and teams that scale." mn="Би өсөн тэлэх бүтээгдэхүүн, систем, баг бүтээдэг." />
        </p>
        <a className="next-link" href="#about">
          <T en="Scroll to continue" mn="Үргэлжлүүлэх" />
          <Icon name="arrowDown" size={14} />
        </a>
      </div>
      <span className="next-vignette" aria-hidden="true" />
    </section>
  );
}
