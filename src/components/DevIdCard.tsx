"use client";

import Image from "next/image";
import { useState } from "react";
import photo from "../../public/images/id-photo.png";
import mark from "../../public/images/logo/logo-mark.png";
import { T } from "./T";

// Deterministic barcode bar widths.
const BARS = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];

/**
 * Lanyard ID badge. Drops in and settles into a slow swing when scrolled into view
 * (parent gets .is-visible from Interactions), tilts toward the cursor, and flips on click.
 */
export function DevIdCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="devid-hang">
      <div className="devid-strap" aria-hidden="true">
        <span>BATSAIKHAN · PRODUCT BUILDER · BATSAIKHAN · PRODUCT BUILDER ·</span>
      </div>
      <div className="devid-clip" aria-hidden="true" />
      <button
        type="button"
        className={`devid-card${flipped ? " is-flipped" : ""}`}
        data-tilt="9"
        data-cursor={flipped ? "Back" : "Flip"}
        aria-pressed={flipped}
        aria-label="Developer ID card — click to flip"
        onClick={() => setFlipped((f) => !f)}
      >
        <span className="devid-inner">
          <span className="devid-face devid-front">
            <span className="devid-head">
              <span className="devid-logo">
                <Image src={mark} alt="" height={22} width={Math.round((22 * mark.width) / mark.height)} />
              </span>
              <span>
                <b>Developer ID</b>
                <small>Portfolio · 2026</small>
              </span>
            </span>
            <span className="devid-photo">
              <Image src={photo} alt="Erdenesukh Batsaikhan" sizes="220px" placeholder="blur" />
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
              <span className="devid-holo" aria-hidden="true" />
            </span>
            <span className="devid-shine" aria-hidden="true" />
          </span>

          <span className="devid-face devid-back">
            <span className="devid-back-logo">
              <Image src={mark} alt="" height={64} width={Math.round((64 * mark.width) / mark.height)} />
            </span>
            <span className="devid-back-title">
              <T en="Access level" mn="Хандах эрх" />
            </span>
            <b>Full stack</b>
            <span className="devid-back-list">
              <span>Web · React / Next.js</span>
              <span>API · NestJS / PostgreSQL</span>
              <span>Mobile · Flutter / React Native</span>
              <span>Cloud · Vercel / Railway / Docker</span>
            </span>
            <span className="devid-back-note">
              <T en="If found, please return to Ulaanbaatar." mn="Олсон бол Улаанбаатар руу буцаана уу." />
            </span>
            <span className="devid-shine" aria-hidden="true" />
          </span>
        </span>
      </button>
      <p className="devid-hint" aria-hidden="true">
        <T en="Click the card to flip" mn="Картыг эргүүлэхийн тулд дарна уу" />
      </p>
    </div>
  );
}
