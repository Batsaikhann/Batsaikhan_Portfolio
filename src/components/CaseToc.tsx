"use client";

import { useEffect, useState } from "react";
import { Tx, type L } from "./T";

/** Sticky table of contents that highlights the section currently in view. */
export function CaseToc({ items }: { items: Array<{ id: string; label: L }> }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="case-toc" aria-label="Case study sections">
      {items.map((item, i) => (
        <a key={item.id} href={`#${item.id}`} className={item.id === active ? "is-active" : undefined}>
          <span className="num">0{i + 1}</span>
          <Tx text={item.label} />
        </a>
      ))}
    </nav>
  );
}
