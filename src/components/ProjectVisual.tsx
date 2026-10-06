import type { CSSProperties } from "react";
import type { Project } from "@/data/profile";

// Animated product motifs used on project cards and case-study pages.
// Replace with real screenshots later by rendering an <Image> instead.
export function ProjectVisual({ type }: { type: Project["visual"] }) {
  if (type === "terminal") {
    return (
      <div className="viz viz-terminal">
        <div className="terminal-bar">
          <i />
          <i />
          <i />
          <span>sporthub — architecture</span>
        </div>
        <div className="terminal-body">
          <div className="terminal-lines">
            <span><b>→</b> auth / RBAC</span>
            <span><b>→</b> wallet / ledger</span>
            <span><b>→</b> orders / catalog</span>
            <span><b>→</b> web / mobile / admin</span>
            <em>system.status: healthy</em>
          </div>
          <div className="terminal-chart" aria-hidden="true">
            {[38, 62, 48, 80, 56, 92, 70].map((h, i) => (
              <i key={i} style={{ "--h": `${h}%`, "--i": i } as CSSProperties} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "blueprint") {
    return (
      <div className="viz viz-blueprint">
        {/* Stretched to the card so path ends line up with the % positioned nodes. */}
        <svg viewBox="0 0 400 240" preserveAspectRatio="none" aria-hidden="true">
          <path className="flow" d="M80 60 C150 60 150 120 200 120" />
          <path className="flow" d="M320 60 C250 60 250 120 200 120" />
          <path className="flow" d="M90 190 C150 190 150 120 200 120" />
        </svg>
        <span className="node" style={{ left: "20%", top: "25%" }}>STOREFRONT</span>
        <span className="node" style={{ left: "80%", top: "25%" }}>ADMIN</span>
        <span className="node" style={{ left: "22.5%", top: "79%" }}>SUPPLIER</span>
        <div className="hub">
          HUB
          <small>queues · S3</small>
        </div>
      </div>
    );
  }

  return (
    <div className="viz viz-map">
      <svg viewBox="0 0 420 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path className="road" d="M-20 210C40 170 70 70 140 92s50 96 124 72 70-104 176-140" />
        <path className="road thin" d="M30 -10C80 60 160 70 220 40s110-30 210 30" />
        <path className="route" d="M-20 210C40 170 70 70 140 92s50 96 124 72 70-104 176-140" />
        <circle className="stop" cx="140" cy="92" r="6" />
        <circle className="stop end" cx="264" cy="164" r="6" />
      </svg>
      <div className="map-label">
        SAFEST ROUTE <b>92%</b>
      </div>
    </div>
  );
}
