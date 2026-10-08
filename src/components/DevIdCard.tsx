"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import photo from "../../public/images/id-photo.png";
import mark from "../../public/images/logo/logo-mark.png";
import { Icon } from "./Icon";
import { T, Tx } from "./T";

// Deterministic barcode bar widths.
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];
const MAX_TILT = 11;

/**
 * Lanyard ID badge. Drops in and swings when scrolled into view (parent gets .is-visible),
 * tilts toward the cursor on a spring with a moving glare, and flips to a contact side.
 */
export function DevIdCard() {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // The face that was focused becomes inert on flip — hand focus to the face now showing.
  // The side button keeps its own focus, so it skips that.
  const flip = (next: boolean, moveFocus = true) => {
    setFlipped(next);
    if (!moveFocus) return;
    requestAnimationFrame(() =>
      cardRef.current?.querySelector<HTMLElement>(`${next ? ".devid-back" : ".devid-front"} .devid-flip`)?.focus({ preventScroll: true }),
    );
  };

  // Spring-driven tilt: writes CSS variables only, never React state.
  useEffect(() => {
    const card = cardRef.current;
    // Variables go on the lanyard so the floor shadow can react too.
    const host = card?.parentElement;
    if (!card || !host) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const state = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0, gx: 50, gy: 30 };
    let frame = 0;

    const tick = () => {
      state.vx = (state.vx + (state.tx - state.x) * 0.09) * 0.78;
      state.vy = (state.vy + (state.ty - state.y) * 0.09) * 0.78;
      state.x += state.vx;
      state.y += state.vy;
      host.style.setProperty("--rx", `${(-state.y * MAX_TILT).toFixed(2)}deg`);
      host.style.setProperty("--ry", `${(state.x * MAX_TILT).toFixed(2)}deg`);
      host.style.setProperty("--px", state.x.toFixed(3));
      host.style.setProperty("--py", state.y.toFixed(3));
      host.style.setProperty("--gx", `${state.gx.toFixed(1)}%`);
      host.style.setProperty("--gy", `${state.gy.toFixed(1)}%`);
      const settled = Math.abs(state.tx - state.x) + Math.abs(state.ty - state.y) + Math.abs(state.vx) + Math.abs(state.vy) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      state.tx = Math.max(-0.5, Math.min(0.5, px - 0.5)) * 2;
      state.ty = Math.max(-0.5, Math.min(0.5, py - 0.5)) * 2;
      state.gx = px * 100;
      state.gy = py * 100;
      kick();
    };
    const onLeave = () => {
      state.tx = 0;
      state.ty = 0;
      kick();
    };
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div className="devid-hang">
        <div className="devid-strap" aria-hidden="true">
          <span>BATSAIKHAN · PRODUCT BUILDER · BATSAIKHAN · PRODUCT BUILDER ·</span>
          <b className="devid-strap-logo">
            <Image src={mark} alt="" height={18} width={Math.round((18 * mark.width) / mark.height)} />
          </b>
        </div>
        <div className="devid-clip" aria-hidden="true" />
        {/* Two blank cards fanned out behind the badge — decoration only. */}
        <div className="devid-ghosts" aria-hidden="true">
          <span className="devid-ghost is-far">
            <Image src={mark} alt="" height={26} width={Math.round((26 * mark.width) / mark.height)} />
            <small>
              Batsaikhan
              <br />
              Product builder
            </small>
          </span>
          <span className="devid-ghost is-near" />
        </div>
        <div className={`devid-card${flipped ? " is-flipped" : ""}`} ref={cardRef}>
          <div className="devid-inner">
            <div className="devid-face devid-front" inert={flipped}>
              <button
                type="button"
                className="devid-flip"
                data-cursor="Flip"
                aria-label="Developer ID card — flip to see contact details"
                onClick={() => flip(true)}
              />
              <span className="devid-head">
                <span className="devid-logo">
                  <Image src={mark} alt="" height={30} width={Math.round((30 * mark.width) / mark.height)} />
                </span>
                <span>
                  <b>Developer ID</b>
                  <small>Portfolio · 2026</small>
                </span>
                <span className="devid-globe" aria-hidden="true">
                  <Icon name="globe" size={26} />
                  <small>
                    Full-stack
                    <br />
                    Product builder
                  </small>
                </span>
              </span>
              <span className="devid-photo">
                <Image src={photo} alt="Erdenesukh Batsaikhan" sizes="400px" placeholder="blur" />
              </span>
              <span className="devid-name">Erdenesukh Batsaikhan</span>
              <span className="devid-role">
                <T en="Full-stack Developer" mn="Full-stack хөгжүүлэгч" />
              </span>
              <span className="devid-fields">
                <span>
                  <small>ID No</small>
                  <b>EB-0001</b>
                </span>
                <span>
                  <small>Dept</small>
                  <b>Software Eng.</b>
                </span>
                <span>
                  <small>Batch</small>
                  <b>2026</b>
                </span>
              </span>
              <span className="devid-foot">
                <span className="devid-barcode" aria-hidden="true">
                  {BARS.map((w, i) => (
                    <i key={i} style={{ width: w }} />
                  ))}
                </span>
                <span className="devid-seal" aria-hidden="true">
                  <Image src={mark} alt="" height={20} width={Math.round((20 * mark.width) / mark.height)} />
                </span>
              </span>
              <span className="devid-strip">
                <span>
                  <i className="status-dot" /> Build · Learn · Ship
                </span>
                <span>
                  Access
                  <br />
                  All areas
                </span>
              </span>
              <span className="devid-glare" aria-hidden="true" />
            </div>

            <div className="devid-face devid-back" inert={!flipped}>
              <button
                type="button"
                className="devid-flip"
                data-cursor="Back"
                aria-label="Flip the card back to the front"
                onClick={() => flip(false)}
              />
              <span className="devid-back-top">
                <Image src={mark} alt="" height={30} width={Math.round((30 * mark.width) / mark.height)} />
                <span className="devid-available">
                  <i className="status-dot" /> <T en="Available for work" mn="Ажилд нээлттэй" />
                </span>
              </span>
              <span className="devid-back-title">
                <T en="Stack · access level" mn="Стек · хандах эрх" />
              </span>
              <span className="devid-back-list">
                <span>
                  <small>Web</small> React / Next.js
                </span>
                <span>
                  <small>API</small> NestJS / PostgreSQL
                </span>
                <span>
                  <small>Mobile</small> Flutter / React Native
                </span>
                <span>
                  <small>Cloud</small> Vercel / Railway / Docker
                </span>
              </span>
              <span className="devid-back-title">
                <T en="Contact" mn="Холбоо барих" />
              </span>
              <span className="devid-links">
                <a href={profile.github.href} target="_blank" rel="noreferrer">
                  <Icon name="github" size={14} /> GitHub
                </a>
                <a href={profile.instagram.href} target="_blank" rel="noreferrer">
                  <Icon name="instagram" size={14} /> Instagram
                </a>
                <a href={`mailto:${profile.email}`}>
                  <Icon name="mail" size={14} /> Email
                </a>
              </span>
              <span className="devid-back-note">
                <Icon name="pin" size={12} /> <T en="Based in" mn="Байршил" /> <Tx text={profile.city} />
              </span>
              <span className="devid-glare" aria-hidden="true" />
            </div>
          </div>
        </div>
        <div className="devid-shadow" aria-hidden="true" />
      </div>
      {/* A second way to flip, beside the badge (it swings, this doesn't). */}
      <button
        type="button"
        className={`devid-turn${flipped ? " is-flipped" : ""}`}
        aria-label={flipped ? "Flip the card back to the front" : "Flip the card to see contact details"}
        onClick={() => flip(!flipped, false)}
        data-cursor="Flip"
      >
        <span className="devid-turn-dial" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path d="M5.2 10.2a7 7 0 0 1 12.6-2.4" />
            <path d="m18.4 4.6-.6 3.2-3.2-.5" />
            <path d="M18.8 13.8a7 7 0 0 1-12.6 2.4" />
            <path d="m5.6 19.4.6-3.2 3.2.5" />
          </svg>
        </span>
        <span className="devid-turn-label">
          <T
            en={
              <>
                Click{" "}
                <br />
                the card{" "}
                <br />
                to flip
              </>
            }
            mn={
              <>
                Дарж{" "}
                <br />
                эргүүлнэ{" "}
                <br />
                үү
              </>
            }
          />
        </span>
      </button>
    </>
  );
}
