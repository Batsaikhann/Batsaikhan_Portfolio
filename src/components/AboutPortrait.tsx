import Image from "next/image";
import graduationPhoto from "../../public/images/batsaikhan-graduation.png";
import { T } from "./T";

/*
 * "Digital twin" portrait. The real photo stays the hero on the left ~70%; right of one red seam the
 * same photo becomes a technical scan — red blueprint of the building, the subject's outline with a rim
 * light, grid and ticks. A second copy of the building lines floats a little off the photo for depth.
 * CSS + inline SVG only. Everything plays once from .is-visible (set by Interactions on scroll-in).
 *
 * Every SVG shares the photo's 1064×1720 coordinate space and is fitted the same way as the <img>
 * (cover, anchored bottom-centre), so the lines sit on the real columns and the real silhouette.
 */

const STACK = ["Next.js", "React", "NestJS", "PostgreSQL", "Flutter", "Vercel"];

// Right edge of the subject, head to shoe, traced from the cut-out of this photo.
const SILHOUETTE =
  "M486 720L528 740L538 780L542 800L540 840L564 860L606 880L632 900L640 920L646 940L650 980L652 1040L654 1120L646 1160L642 1200L612 1220L614 1260L620 1300L626 1360L630 1420L636 1480L636 1540L632 1600L632 1640L612 1680";

/** One column: shaft outline, flutes, banded capital, and an axis line with a dot on top. */
function Column({ x1, x2, cap, shaft, base }: { x1: number; x2: number; cap: number; shaft: number; base: number }) {
  const w = x2 - x1;
  const cx = (x1 + x2) / 2;
  const bands = [1, 2, 3, 4].map((i) => cap + ((shaft - cap) * i) / 5);
  const flutes = [1, 2, 3].map((i) => x1 + (w * i) / 4);
  return (
    <g>
      <rect x={x1} y={cap} width={w} height={shaft - cap} />
      {bands.map((y) => (
        <path key={y} d={`M${x1} ${y}H${x2}`} />
      ))}
      <rect x={x1 + 2} y={shaft} width={w - 4} height={base - shaft} />
      {flutes.map((x) => (
        <path key={x} className="pd-faint" d={`M${x} ${shaft + 8}V${base - 14}`} />
      ))}
      <rect x={x1 - 6} y={base - 14} width={w + 12} height={14} />
      <path className="pd-axis" d={`M${cx} ${cap - 46}V${base + 34}`} />
      <circle cx={cx} cy={cap - 46} r={4} />
    </g>
  );
}

/** The building: roof slabs, four columns, plinth. Shared by the scan layer and the floating projection. */
function Building() {
  return (
    <>
      <path d="M560 172L640 130L1064 168" />
      <path d="M560 196L640 150L1064 198" />
      <path className="pd-faint" d="M612 64L700 10" />
      <path className="pd-faint" d="M640 258H1064" />
      <Column x1={638} x2={698} cap={265} shaft={335} base={750} />
      <Column x1={703} x2={765} cap={200} shaft={280} base={752} />
      <Column x1={836} x2={900} cap={225} shaft={300} base={760} />
      <Column x1={955} x2={1000} cap={420} shaft={470} base={760} />
      <path d="M560 748H1064" />
      <path className="pd-faint" d="M560 758H1064M560 800H1064" />
    </>
  );
}

/** A small crosshair: ring, centre dot, four ticks. */
function Crosshair({ x, y, r = 18 }: { x: number; y: number; r?: number }) {
  return (
    <g className="pd-cross">
      <circle cx={x} cy={y} r={r} />
      <circle className="pd-fill" cx={x} cy={y} r={2.5} />
      <path d={`M${x} ${y - r - 10}V${y - r + 4}M${x} ${y + r - 4}V${y + r + 10}M${x - r - 10} ${y}H${x - r + 4}M${x + r - 4} ${y}H${x + r + 10}`} />
    </g>
  );
}

/** Scan side: grid, building blueprint (faded out above the crowd), the subject outline with a rim light. */
function ScanLayer() {
  return (
    <svg className="pd-wire" viewBox="0 0 1064 1720" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <pattern id="pd-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" />
        </pattern>
        <linearGradient id="pd-grid-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".9" />
          <stop offset=".6" stopColor="#fff" stopOpacity=".5" />
          <stop offset="1" stopColor="#fff" stopOpacity=".15" />
        </linearGradient>
        <linearGradient id="pd-building-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset=".4" stopColor="#fff" />
          <stop offset=".52" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="pd-grid-mask">
          <rect width="1064" height="1720" fill="url(#pd-grid-fade)" />
        </mask>
        <mask id="pd-building-mask">
          <rect width="1064" height="1720" fill="url(#pd-building-fade)" />
        </mask>
        <filter id="pd-rim" x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      <rect className="pd-grid" width="1064" height="1720" fill="url(#pd-grid)" mask="url(#pd-grid-mask)" />

      <g className="pd-building" mask="url(#pd-building-mask)">
        <Building />
        <path className="pd-dim" d="M734 112V128M868 112V128M734 120H868" />
        <Crosshair x={734} y={240} r={14} />
        <Crosshair x={868} y={262} />
      </g>

      {/* Rim light + crisp outline along the subject's edge — only the part right of the seam shows. */}
      <path className="pd-rim" d={SILHOUETTE} filter="url(#pd-rim)" transform="translate(-4 0)" />
      <path className="pd-outline" d={SILHOUETTE} />
    </svg>
  );
}

// Labels start just right of the seam (70% of the card ≈ x 736 in photo space).
const LABEL_X = 790;

/** Tracking points on the subject with leaders out to small labels on the scan side. */
function TrackingHud() {
  const points = [
    { x: 494, y: 744, ty: 660, k: "Subject 01", v: "E. Batsaikhan" },
    { x: 618, y: 960, ty: 900, k: "Role", v: "Product builder" },
    { x: 560, y: 1080, ty: 1060, k: "Status", v: "Active" },
  ];
  return (
    <svg className="pd-hud" viewBox="0 0 1064 1720" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      {points.map((p) => (
        <g key={p.k}>
          <path className="pd-leader" d={`M${p.x + 9} ${p.y}L${p.x + 40} ${p.ty + 14}H${LABEL_X - 10}`} />
          <circle className="pd-pt-ring" cx={p.x} cy={p.y} r={9} />
          <circle className="pd-pt" cx={p.x} cy={p.y} r={3} />
          <text x={LABEL_X} y={p.ty}>
            {p.k}
          </text>
          <text className="pd-hud-v" x={LABEL_X} y={p.ty + 22}>
            {p.v}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function AboutPortrait() {
  return (
    <div className="about-image pd" data-reveal>
      {/* The photo and everything printed on it, clipped to the card. */}
      <div className="pd-photo">
        <div className="about-image-inner" data-parallax="0.06">
          <Image src={graduationPhoto} alt="Batsaikhan on graduation day" fill placeholder="blur" sizes="(max-width: 760px) 92vw, 42vw" />
          <div className="pd-tech" aria-hidden="true">
            <div className="pd-tint" />
            <ScanLayer />
          </div>
          <TrackingHud />
        </div>
        <span className="pd-grade" aria-hidden="true" />
      </div>

      {/* Projection: the building lines again, lifted off the photo and allowed past its edge. */}
      <div className="pd-proj" aria-hidden="true">
        <svg viewBox="0 0 1064 1720" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="pd-proj-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset=".3" stopColor="#fff" />
              <stop offset=".48" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="pd-proj-mask">
              <rect x="-200" y="-200" width="1464" height="2120" fill="url(#pd-proj-fade)" />
            </mask>
          </defs>
          <g mask="url(#pd-proj-mask)">
            <Building />
          </g>
        </svg>
      </div>

      <span className="pd-split" aria-hidden="true" />
      <span className="pd-scan" aria-hidden="true" />

      <div className="pd-panel" aria-hidden="true">
        <span className="pd-kicker">Stack</span>
        <ul>
          {STACK.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <span className="pd-status">
          <span className="pd-kicker">Status</span>
          <span>
            <i className="pd-dot" /> Building
          </span>
        </span>
      </div>

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
                <em>Builder</em> by nature.
              </>
            }
            mn={
              <>
                Мэргэжлээрээ инженер.
                <br />
                Мөн чанараараа <em>бүтээгч.</em>
              </>
            }
          />
        </b>
      </div>

      <span className="pd-frame" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
    </div>
  );
}
