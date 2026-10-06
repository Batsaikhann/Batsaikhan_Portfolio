"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon } from "./Icon";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";
import { TransitionLink } from "./RouteTransition";
import { T } from "./T";

const links = [
  { label: "Work", mn: "Ажлууд", hash: "#work" },
  { label: "About", mn: "Тухай", hash: "#about" },
  { label: "Stack", mn: "Стек", hash: "#stack" },
  { label: "Contact", mn: "Холбоо барих", hash: "#contact" },
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
      {navLink("#top", <Logo variant="wordmark" height={42} priority />, { className: "logo", ariaLabel: "Home" })}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <span key={link.hash}>{navLink(link.hash, <T en={link.label} mn={link.mn} />)}</span>
        ))}
      </div>
      {navLink(
        "#contact",
        <>
          <T en="Let's talk" mn="Ярилцъя" /> <Icon name="arrowUpRight" size={15} />
        </>,
        { className: "nav-cta", magnetic: true },
      )}
      <LangSwitch />
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
