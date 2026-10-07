"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";

type Navigate = (href: string, label?: string, source?: HTMLElement) => void;

const TransitionContext = createContext<Navigate | null>(null);

// Plain route change: red line sweeps the top edge while the page fades to black.
const COVER_MS = 380;
// Project card: its visual expands to fill the screen (fake shared element) first.
const EXPAND_MS = 560;
const REVEAL_MS = 520;

/**
 * Route overlay. Holds the destination title while the next route renders, then fades away.
 * When navigation starts from a project card, the card's screenshot is cloned into the
 * overlay and clipped from the card's rect out to the full viewport.
 */
export function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const mediaRef = useRef<HTMLImageElement>(null);
  const timers = useRef<number[]>([]);

  const navigate = useCallback<Navigate>(
    (href, label = "", source) => {
      const curtain = curtainRef.current;
      const target = new URL(href, location.href);
      const samePage = target.pathname === location.pathname;
      if (!curtain || samePage || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      if (labelRef.current) labelRef.current.textContent = label;

      const visual = source?.querySelector<HTMLElement>("[data-expand]");
      const image = visual?.querySelector<HTMLImageElement>("img.is-shown") ?? visual?.querySelector("img");
      let mode = "line";
      if (visual) {
        const rect = visual.getBoundingClientRect();
        curtain.style.setProperty("--t", `${rect.top}px`);
        curtain.style.setProperty("--l", `${rect.left}px`);
        curtain.style.setProperty("--r", `${innerWidth - rect.right}px`);
        curtain.style.setProperty("--b", `${innerHeight - rect.bottom}px`);
        if (mediaRef.current) {
          mediaRef.current.src = image?.currentSrc || "";
          mediaRef.current.hidden = !image;
        }
        mode = "expand";
      }
      curtain.dataset.mode = mode;
      curtain.dataset.phase = "prep";
      // Two frames so the start clip is painted before transitioning to full screen.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          curtain.dataset.phase = "cover";
        }),
      );
      timers.current.push(window.setTimeout(() => router.push(href), mode === "expand" ? EXPAND_MS : COVER_MS));
    },
    [router],
  );

  useEffect(() => {
    const curtain = curtainRef.current;
    if (curtain?.dataset.phase !== "cover") return;
    curtain.dataset.phase = "reveal";
    timers.current.push(
      window.setTimeout(() => {
        curtain.dataset.phase = "idle";
        if (mediaRef.current) mediaRef.current.removeAttribute("src");
      }, REVEAL_MS),
    );
  }, [pathname]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div className="route-curtain" data-phase="idle" data-mode="line" ref={curtainRef} aria-hidden="true">
        <i className="curtain-backdrop" />
        <div className="curtain-media">
          {/* eslint-disable-next-line @next/next/no-img-element -- reuses the card's already-loaded optimized src */}
          <img ref={mediaRef} alt="" hidden />
        </div>
        <i className="curtain-line" />
        <p ref={labelRef} />
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link> & { href: string; label?: string; expand?: boolean };

export function TransitionLink({ href, label, expand, onClick, ...props }: TransitionLinkProps) {
  const navigate = useContext(TransitionContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!navigate || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(href, label, expand ? event.currentTarget : undefined);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
