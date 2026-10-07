"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import type { Shot } from "@/data/projects";
import { Icon } from "./Icon";
import { Tx } from "./T";

type Props = { shots: Shot[]; index: number; onIndex: (i: number) => void; onClose: () => void };

/**
 * Fullscreen screenshot viewer: keyboard (← → Esc, Tab trapped), swipe on touch,
 * click-to-zoom with pointer panning on desktop. Rendered into <body> so no
 * ancestor transform or stacking context can clip it.
 */
export function Lightbox({ shots, index, onIndex, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [closing, setClosing] = useState(false);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const shot = shots[index];
  const many = shots.length > 1;

  const step = (dir: number) => {
    setZoom(false);
    onIndex((index + dir + shots.length) % shots.length);
  };

  const close = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    setClosing(true);
    window.setTimeout(onClose, 220);
  };

  // Lock scroll, trap focus and restore it to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    root.classList.add("lightbox-open");
    dialogRef.current?.querySelector<HTMLElement>(".lightbox-close")?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = "";
      root.classList.remove("lightbox-open");
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowRight" && many) step(1);
      else if (event.key === "ArrowLeft" && many) step(-1);
      else if (event.key === "Tab") {
        const focusables = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button") ?? [])];
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pan = (event: PointerEvent<HTMLButtonElement>) => {
    if (!zoom || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin(`${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return createPortal(
    <div
      ref={dialogRef}
      className={`lightbox${closing ? " is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${shot.label.en} — ${index + 1} of ${shots.length}`}
      onClick={close}
      onPointerDown={(event) => (swipe.current = { x: event.clientX, y: event.clientY })}
      onPointerUp={(event) => {
        const start = swipe.current;
        swipe.current = null;
        if (!start || event.pointerType === "mouse" || !many) return;
        const dx = event.clientX - start.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(event.clientY - start.y)) step(dx < 0 ? 1 : -1);
      }}
    >
      <figure key={index} className={`is-${shot.device}`} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={`lightbox-stage${zoom ? " is-zoomed" : ""}`}
          aria-label={zoom ? "Zoom out" : "Zoom in"}
          onClick={(event) => {
            if (!zoom) {
              const rect = event.currentTarget.getBoundingClientRect();
              setOrigin(`${((event.clientX - rect.left) / rect.width) * 100}% ${((event.clientY - rect.top) / rect.height) * 100}%`);
            }
            setZoom((z) => !z);
          }}
          onPointerMove={pan}
          style={{ transformOrigin: origin }}
        >
          <Image src={shot.src} alt={shot.label.en} sizes="(max-width: 760px) 100vw, 90vw" quality={90} placeholder="blur" />
        </button>
        <figcaption>
          <span>
            <small>
              <Tx text={shot.group} />
            </small>
            <Tx text={shot.label} />
          </span>
          <span className="count">
            {String(index + 1).padStart(2, "0")} / {String(shots.length).padStart(2, "0")}
          </span>
        </figcaption>
      </figure>
      {many && (
        <>
          <button type="button" className="lightbox-nav prev" aria-label="Previous screen" onClick={(e) => (e.stopPropagation(), step(-1))}>
            <Icon name="arrow" size={20} />
          </button>
          <button type="button" className="lightbox-nav next" aria-label="Next screen" onClick={(e) => (e.stopPropagation(), step(1))}>
            <Icon name="arrow" size={20} />
          </button>
        </>
      )}
      <button type="button" className="lightbox-close" aria-label="Close viewer" onClick={(e) => (e.stopPropagation(), close())}>
        <span aria-hidden="true">×</span>
      </button>
      <p className="lightbox-hint" aria-hidden="true">
        <span className="lightbox-hint-arrows">
          <Icon name="arrow" size={12} />
          <Icon name="arrow" size={12} />
        </span>
        · Esc · Click to zoom
      </p>
    </div>,
    document.body,
  );
}
