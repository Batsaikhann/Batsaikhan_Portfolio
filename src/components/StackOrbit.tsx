"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { capabilities } from "@/data/profile";
import { Logo } from "./Logo";
import { T, Tx } from "./T";

const RADIUS = 40; // % of the diagram size
const INWARD = 0.14; // how far the active node slides toward the core

const nodes = capabilities.map((group, i) => {
  const angle = (-90 + (360 / capabilities.length) * i) * (Math.PI / 180);
  const x = +(50 + Math.cos(angle) * RADIUS).toFixed(3);
  const y = +(50 + Math.sin(angle) * RADIUS).toFixed(3);
  return { ...group, x, y, dx: +((50 - x) * INWARD).toFixed(3), dy: +((50 - y) * INWARD).toFixed(3) };
});

export function StackOrbit() {
  const [active, setActive] = useState(0);
  const [leaving, setLeaving] = useState<{ key: number; items: string[] } | null>(null);
  const current = nodes[active];

  const select = (i: number) => {
    if (i === active) return;
    setLeaving({ key: active, items: nodes[active].items });
    setActive(i);
  };

  // The outgoing tool list fades away underneath the incoming one.
  useEffect(() => {
    if (!leaving) return;
    const id = window.setTimeout(() => setLeaving(null), 320);
    return () => window.clearTimeout(id);
  }, [leaving]);

  return (
    <>
      <div className="stack-orbit" data-reveal>
        <div className="orbit-diagram">
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle className="orbit-ring" cx="50" cy="50" r={RADIUS} />
            <circle className="orbit-ring inner" cx="50" cy="50" r={RADIUS * 0.55} />
            {nodes.map((node) => (
              <line key={node.label.en} className="orbit-spoke" x1="50" y1="50" x2={node.x} y2={node.y} />
            ))}
            {/* Re-keyed on change so the connection draws from the core out to the node. */}
            <line
              key={`active-${active}`}
              className="orbit-spoke-active"
              x1="50"
              y1="50"
              x2={current.x + current.dx}
              y2={current.y + current.dy}
              pathLength={1}
            />
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
              style={{ left: `${node.x}%`, top: `${node.y}%`, "--dx": node.dx, "--dy": node.dy } as CSSProperties}
              onPointerEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
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
          <div className="orbit-tools">
            {leaving && (
              <ul key={leaving.key} className="is-leaving" aria-hidden="true">
                {leaving.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            <ul key={`${current.label.en}-items`}>
              {current.items.map((item, i) => (
                <li key={item} style={{ "--i": i } as CSSProperties}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="orbit-hint">
            <T en="Hover or tap a node to explore the stack." mn="Технологиудыг үзэхийн тулд цэг дээр очих эсвэл дарна уу." />
          </p>
        </div>
      </div>

      {/* Mobile: the radial diagram becomes an accordion. */}
      <div className="stack-accordion" data-reveal>
        {nodes.map((node, i) => (
          <details key={node.label.en} name="stack" open={i === 0}>
            <summary>
              <span className="orbit-num">0{i + 1}</span>
              <Tx text={node.label} />
              <small>
                {node.items.length} <T en="tools" mn="хэрэгсэл" />
              </small>
            </summary>
            <ul>
              {node.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </>
  );
}
