"use client";

import { useState, type CSSProperties } from "react";
import { capabilities } from "@/data/profile";
import { Logo } from "./Logo";
import { T, Tx } from "./T";

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
              key={node.label.en}
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
            <Logo height={46} />
          </span>
          <small>Full-stack</small>
        </div>
        {nodes.map((node, i) => (
          <button
            key={node.label.en}
            type="button"
            className={i === active ? "orbit-node is-active" : "orbit-node"}
            style={{ left: `${node.x}%`, top: `${node.y}%` } as CSSProperties}
            onPointerEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            <span className="orbit-num">0{i + 1}</span>
            <Tx text={node.label} />
          </button>
        ))}
      </div>

      <div className="orbit-panel" aria-live="polite">
        <p className="eyebrow-label">
          0{active + 1} / 0{nodes.length} · {current.items.length} <T en="tools" mn="хэрэгсэл" />
        </p>
        <h3 key={current.label.en}>
          <Tx text={current.label} />
        </h3>
        <ul key={`${current.label.en}-items`}>
          {current.items.map((item, i) => (
            <li key={item} style={{ "--i": i } as CSSProperties}>
              {item}
            </li>
          ))}
        </ul>
        <p className="orbit-hint">
          <T en="Hover or tap a node to explore the stack." mn="Технологиудыг үзэхийн тулд цэг дээр очих эсвэл дарна уу." />
        </p>
      </div>
    </div>
  );
}
