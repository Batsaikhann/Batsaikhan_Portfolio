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

type Navigate = (href: string, label?: string) => void;

const TransitionContext = createContext<Navigate | null>(null);

const COVER_MS = 420;
const REVEAL_MS = 560;

// Red + black curtain that wipes over the page, holds the destination title,
// then wipes away once the new route has rendered.
export function RouteTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const timers = useRef<number[]>([]);

  const navigate = useCallback<Navigate>(
    (href, label = "") => {
      const curtain = curtainRef.current;
      const target = new URL(href, location.href);
      const samePage = target.pathname === location.pathname;
      if (!curtain || samePage || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }
      if (labelRef.current) labelRef.current.textContent = label;
      curtain.dataset.phase = "cover";
      timers.current.push(window.setTimeout(() => router.push(href), COVER_MS));
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
      <div className="route-curtain" data-phase="idle" ref={curtainRef} aria-hidden="true">
        <i className="curtain-red" />
        <i className="curtain-black" />
        <p ref={labelRef} />
      </div>
    </TransitionContext.Provider>
  );
}

type TransitionLinkProps = ComponentProps<typeof Link> & { href: string; label?: string };

export function TransitionLink({ href, label, onClick, ...props }: TransitionLinkProps) {
  const navigate = useContext(TransitionContext);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (!navigate || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    navigate(href, label);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
}
