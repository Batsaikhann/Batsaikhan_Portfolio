"use client";

import Image from "next/image";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import type { Shot } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { Icon } from "./Icon";
import { T, Tx } from "./T";

/** Filterable screenshot grid with a keyboard-friendly lightbox. */
export function CaseGallery({ shots }: { shots: Shot[] }) {
  const groups = [...new Map(shots.map((s) => [s.group.en, s.group])).values()];
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const visible = shots.filter((s) => !filter || s.group.en === filter);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) => setOpen((i) => (i === null ? i : (i + dir + visible.length) % visible.length)),
    [visible.length],
  );

  useEffect(() => {
    if (open === null) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, step]);

  const current = open === null ? null : visible[open];

  return (
    <div className="case-gallery">
      <div className="gallery-filters" role="tablist">
        <button type="button" className={filter === null ? "is-active" : undefined} onClick={() => setFilter(null)}>
          <T en="All" mn="Бүгд" /> <span className="count">{shots.length}</span>
        </button>
        {groups.map((group) => (
          <button
            key={group.en}
            type="button"
            className={filter === group.en ? "is-active" : undefined}
            onClick={() => setFilter(group.en)}
          >
            <Tx text={group} /> <span className="count">{shots.filter((s) => s.group.en === group.en).length}</span>
          </button>
        ))}
      </div>

      <div className="gallery-grid">
        {visible.map((shot, i) => (
          <button
            key={shot.url + shot.label.en}
            type="button"
            className={`gallery-item is-${shot.device}`}
            onClick={() => setOpen(i)}
            data-cursor="Zoom"
            style={{ "--i": i } as CSSProperties}
          >
            <BrowserFrame shot={shot} sizes="(max-width: 760px) 90vw, 45vw" />
            <span className="gallery-caption">
              <small>
                <Tx text={shot.group} />
              </small>
              <Tx text={shot.label} />
              <Icon name="arrowUpRight" size={16} />
            </span>
          </button>
        ))}
      </div>

      {current && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={close} data-lenis-prevent>
          <figure onClick={(event) => event.stopPropagation()} className={`is-${current.device}`}>
            <Image src={current.src} alt={current.label.en} sizes="90vw" placeholder="blur" />
            <figcaption>
              <Tx text={current.label} />
              <span className="count">
                {(open ?? 0) + 1} / {visible.length}
              </span>
            </figcaption>
          </figure>
          {visible.length > 1 && (
            <>
              <button type="button" className="lightbox-nav prev" aria-label="Previous" onClick={(e) => (e.stopPropagation(), step(-1))}>
                <Icon name="arrow" size={20} />
              </button>
              <button type="button" className="lightbox-nav next" aria-label="Next" onClick={(e) => (e.stopPropagation(), step(1))}>
                <Icon name="arrow" size={20} />
              </button>
            </>
          )}
          <button type="button" className="lightbox-close" aria-label="Close" onClick={close}>
            ×
          </button>
        </div>
      )}
    </div>
  );
}
