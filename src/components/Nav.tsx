"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { TransitionLink } from "./RouteTransition";

const links = [
  { label: "Work", hash: "#work" },
  { label: "About", hash: "#about" },
  { label: "Stack", hash: "#stack" },
  { label: "Contact", hash: "#contact" },
];

type LinkOptions = { className?: string; magnetic?: boolean; ariaLabel?: string };

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const onHome = usePathname() === "/";
  const closeMenu = () => setMenuOpen(false);

  // On the home page hashes scroll in place; elsewhere they route home first.
  const navLink = (hash: string, children: ReactNode, { className, magnetic, ariaLabel }: LinkOptions = {}) => {
    const shared = {
      className,
      onClick: closeMenu,
      "aria-label": ariaLabel,
      "data-magnetic": magnetic || undefined,
    };
    return onHome ? (
      <a href={hash} {...shared}>
        {children}
      </a>
    ) : (
      <TransitionLink href={`/${hash}`} label={ariaLabel} {...shared}>
        {children}
      </TransitionLink>
    );
  };

  return (
    <nav className="nav">
      {navLink(
        "#top",
        <>
          B<span>/</span>
        </>,
        { className: "logo", ariaLabel: "Home" },
      )}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <span key={link.hash}>{navLink(link.hash, link.label)}</span>
        ))}
      </div>
      {navLink(
        "#contact",
        <>
          Let&apos;s talk <Icon name="arrowUpRight" size={15} />
        </>,
        { className: "nav-cta", magnetic: true },
      )}
      <button
        className={`menu-button ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
      </button>
    </nav>
  );
}
