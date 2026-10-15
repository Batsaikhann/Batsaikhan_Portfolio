"use client";

import { useState, type CSSProperties } from "react";
import type { Shot } from "@/data/projects";
import type { L } from "./T";
import { BrowserFrame } from "./BrowserFrame";
import { Icon } from "./Icon";
import { Lightbox } from "./Lightbox";
import { T, Tx } from "./T";

/**
 * Screens for a case study, laid out as a tidy grid: one block per group, phones in a row
 * and desktop screens two to a row beneath them. Any screen opens the fullscreen viewer.
 */
export function CaseGallery({ shots }: { shots: Shot[] }) {
  const groups = [...new Map(shots.map((s) => [s.group.en, s.group])).values()];
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const blocks = groups
    .filter((group) => !filter || group.en === filter)
    .map((group) => {
      const inGroup = shots.filter((s) => s.group.en === group.en);
      return {
        group,
        phones: inGroup.filter((s) => s.device === "mobile"),
        desktops: inGroup.filter((s) => s.device === "desktop"),
      };
    });
  // The viewer steps through screens in the same order the grid shows them.
  const ordered = blocks.flatMap((b) => [...b.phones, ...b.desktops]);
  const showHeads = filter === null && blocks.length > 1;

  const tile = (shot: Shot) => {
    const i = ordered.indexOf(shot);
    return (
      <button
        key={shot.device + shot.url + shot.label.en}
        type="button"
        className={`gallery-item is-${shot.device}`}
        onClick={() => setOpen(i)}
        data-cursor="Zoom"
        aria-label={`${shot.label.en} — open fullscreen`}
        style={{ "--i": i } as CSSProperties}
      >
        <BrowserFrame
          shot={shot}
          sizes={shot.device === "mobile" ? "(max-width: 760px) 45vw, 200px" : "(max-width: 760px) 92vw, 34vw"}
        />
        <span className="gallery-caption">
          <Tx text={shot.label} />
          <Icon name="arrowUpRight" size={14} />
        </span>
      </button>
    );
  };

  const filterButton = (group: L | null) => {
    const active = filter === (group?.en ?? null);
    const count = group ? shots.filter((s) => s.group.en === group.en).length : shots.length;
    return (
      <button
        key={group?.en ?? "all"}
        type="button"
        className={active ? "is-active" : undefined}
        aria-pressed={active}
        onClick={() => setFilter(group?.en ?? null)}
      >
        {group ? <Tx text={group} /> : <T en="All" mn="Бүгд" />} <span className="count">{count}</span>
      </button>
    );
  };

  return (
    <div className="case-gallery">
      {groups.length > 1 && (
        <div className="gallery-filters" role="group" aria-label="Filter screens">
          {filterButton(null)}
          {groups.map(filterButton)}
        </div>
      )}

      <div className="gallery-grid" key={filter ?? "all"}>
        {blocks.map(({ group, phones, desktops }) => (
          <section key={group.en} className="gallery-group">
            {showHeads && (
              <h3 className="gallery-group-head">
                <Tx text={group} /> <span className="count">{String(phones.length + desktops.length).padStart(2, "0")}</span>
              </h3>
            )}
            {phones.length > 0 && <div className="gallery-phones">{phones.map(tile)}</div>}
            {desktops.length > 0 && <div className="gallery-desktops">{desktops.map(tile)}</div>}
          </section>
        ))}
      </div>

      {open !== null && <Lightbox shots={ordered} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </div>
  );
}
