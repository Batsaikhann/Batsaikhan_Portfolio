"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Shot } from "@/data/projects";
import { BrowserFrame } from "./BrowserFrame";
import { Icon } from "./Icon";
import { Lightbox } from "./Lightbox";
import { T, Tx } from "./T";

/**
 * Screens for a case study. Desktop: a snapping horizontal track where the centred
 * screen is full size and its neighbours recede. Mobile: a plain vertical grid.
 * Any screen opens the fullscreen viewer.
 */
export function CaseGallery({ shots }: { shots: Shot[] }) {
  const groups = [...new Map(shots.map((s) => [s.group.en, s.group])).values()];
  const [filter, setFilter] = useState<string | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const visible = shots.filter((s) => !filter || s.group.en === filter);

  // Centre-most item of the track is "current".
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const box = track.getBoundingClientRect();
      const mid = box.left + box.width / 2;
      let best = 0;
      let bestDist = Infinity;
      [...track.children].forEach((child, i) => {
        const r = child.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setCurrent(best);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    track.scrollTo({ left: 0 });
    measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [filter]);

  const scrollToItem = useCallback((i: number) => {
    const track = trackRef.current;
    const item = track?.children[i] as HTMLElement | undefined;
    if (!track || !item) return;
    const smooth = !matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: item.offsetLeft - (track.clientWidth - item.offsetWidth) / 2,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const close = useCallback(() => {
    // Keep the track in step with whatever the viewer ended on.
    if (open !== null) scrollToItem(open);
    setOpen(null);
  }, [open, scrollToItem]);

  return (
    <div className="case-gallery">
      <div className="gallery-toolbar">
        <div className="gallery-filters" role="group" aria-label="Filter screens">
          <button type="button" className={filter === null ? "is-active" : undefined} aria-pressed={filter === null} onClick={() => setFilter(null)}>
            <T en="All" mn="Бүгд" /> <span className="count">{shots.length}</span>
          </button>
          {groups.map((group) => (
            <button
              key={group.en}
              type="button"
              className={filter === group.en ? "is-active" : undefined}
              aria-pressed={filter === group.en}
              onClick={() => setFilter(group.en)}
            >
              <Tx text={group} /> <span className="count">{shots.filter((s) => s.group.en === group.en).length}</span>
            </button>
          ))}
        </div>
        {visible.length > 1 && (
          <div className="gallery-steps">
            <span className="count">
              {String(current + 1).padStart(2, "0")} / {String(visible.length).padStart(2, "0")}
            </span>
            <button type="button" aria-label="Previous screen" disabled={current === 0} onClick={() => scrollToItem(current - 1)}>
              <Icon name="arrow" size={16} />
            </button>
            <button
              type="button"
              aria-label="Next screen"
              disabled={current === visible.length - 1}
              onClick={() => scrollToItem(current + 1)}
            >
              <Icon name="arrow" size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="gallery-track" ref={trackRef} key={filter ?? "all"}>
        {visible.map((shot, i) => (
          <button
            key={shot.url + shot.label.en}
            type="button"
            className={`gallery-item is-${shot.device}${i === current ? " is-current" : ""}`}
            onClick={() => setOpen(i)}
            onFocus={() => scrollToItem(i)}
            data-cursor="Zoom"
            aria-label={`${shot.label.en} — open fullscreen`}
            style={{ "--i": i, "--ar": shot.src.width / shot.src.height } as CSSProperties}
          >
            <BrowserFrame shot={shot} sizes="(max-width: 760px) 90vw, 50vw" />
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

      {open !== null && <Lightbox shots={visible} index={open} onIndex={setOpen} onClose={close} />}
    </div>
  );
}
