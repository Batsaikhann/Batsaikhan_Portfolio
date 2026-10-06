"use client";

import { useState, type CSSProperties } from "react";
import { capabilities } from "@/data/profile";

const RADIUS = 40; // % of the diagram size

const nodes = capabilities.map((group, i) => {
  const angle = (-90 + (360 / capabilities.length) * i) * (Math.PI / 180);
  return { ...group, x: +(50 + Math.cos(angle) * RADIUS).toFixed(3), y: +(50 + Math.sin(angle) * RADIUS).toFixed(3) };
});

export function StackOrbit() {
  const [active, setActive] = useState(0);
  const current = nodes[active];

  return (
    <div className="stack-orbit" data-reveal>
      <div className="orbit-diagram">
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle className="orbit-ring" cx="50" cy="50" r={RADIUS} />
          <circle className="orbit-ring inner" cx="50" cy="50" r={RADIUS * 0.55} />
          {nodes.map((node, i) => (
            <line
              key={node.label}
              className={i === active ? "orbit-spoke is-active" : "orbit-spoke"}
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
            />
          ))}
        </svg>
        <div className="orbit-spin" aria-hidden="true">
          <i />
        </div>
        <div className="orbit-core">
          <span className="logo">
            B<span>/</span>
          </span>
          <small>Full-stack</small>
        </div>
        {nodes.map((node, i) => (
          <button
            key={node.label}
            type="button"
            className={i === active ? "orbit-node is-active" : "orbit-node"}
            style={{ left: `${node.x}%`, top: `${node.y}%` } as CSSProperties}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            <span>0{i + 1}</span>
            {node.label}
          </button>
        ))}
      </div>

      <div className="orbit-panel" aria-live="polite">
        <p className="eyebrow-label">
          0{active + 1} / 0{nodes.length} · {current.items.length} tools
        </p>
        <h3 key={current.label}>{current.label}</h3>
        <ul key={`${current.label}-items`}>
          {current.items.map((item, i) => (
            <li key={item} style={{ "--i": i } as CSSProperties}>
              {item}
            </li>
          ))}
        </ul>
        <p className="orbit-hint">Hover or tap a node to explore the stack.</p>
      </div>
    </div>
  );
}
