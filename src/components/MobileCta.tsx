"use client";

import { useEffect, useState } from "react";
import { ContactButton } from "./ContactModal";
import { Icon } from "./Icon";
import { T } from "./T";

/**
 * Phone-only "Start a project" bar pinned to the bottom of the screen. Shows once the first screen
 * is passed and steps aside when the contact section or footer comes into view. Opens the contact modal.
 */
export function MobileCta() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    let frame = 0;
    const root = document.documentElement;
    const update = () => {
      frame = 0;
      const end = document.getElementById("contact") ?? document.querySelector("footer");
      const reachedEnd = end ? end.getBoundingClientRect().top < innerHeight : false;
      const next = scrollY > innerHeight * 0.6 && !reachedEnd;
      setShown(next);
      root.classList.toggle("has-mobile-cta", next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      root.classList.remove("has-mobile-cta");
    };
  }, []);

  return (
    <div className={`mobile-cta${shown ? " is-shown" : ""}`} inert={!shown}>
      <ContactButton className="button button-primary mobile-cta-button">
        <T en="Start a project" mn="Төсөл эхлүүлэх" /> <Icon name="arrowUpRight" />
      </ContactButton>
    </div>
  );
}
