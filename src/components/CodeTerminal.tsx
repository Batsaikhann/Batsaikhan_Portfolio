"use client";

import { useEffect, useRef, useState } from "react";

// Token kinds map to colours in CSS (.tk-*). Each snippet is typed out, held, then replaced by the next.
type Token = [text: string, kind?: "kw" | "str" | "fn" | "num" | "dim" | "tag"];
const SNIPPETS: Token[][][] = [
  [
    [["const ", "kw"], ["builder", undefined], [" = ", "dim"], ['"Batsaikhan"', "str"], [";", "dim"]],
    [["stack", undefined], [" = ", "dim"], ['["Next.js", "React", "NestJS"]', "str"], [";", "dim"]],
    [["build", "fn"], ["(); ", "dim"], ["deploy", "fn"], ["();", "dim"]],
  ],
  [
    [['<section id="about">', "tag"]],
    [["  ideas / systems / people", undefined]],
    [["</section>", "tag"]],
  ],
  [
    [["01 ", "num"], ["BUILD", undefined], ["  02 ", "num"], ["SHIP", undefined], ["  03 ", "num"], ["SCALE", undefined]],
    [["// from schema to production", "dim"]],
    [["systems_that_move", "fn"], ["();", "dim"]],
  ],
];

const TYPE_MS = 34;
const HOLD_MS = 2600;
const length = (snippet: Token[][]) => snippet.reduce((sum, line) => sum + line.reduce((n, [t]) => n + t.length, 0), 0);

// The snippet's tokens cut down to the first `count` characters (empty lines stay empty).
function sliceSnippet(snippet: Token[][], count: number): Token[][] {
  let left = count;
  return snippet.map((line) =>
    line.flatMap(([text, kind]): Token[] => {
      if (left <= 0) return [];
      const shown = text.slice(0, left);
      left -= text.length;
      return [[shown, kind]];
    }),
  );
}

/**
 * Small decorative terminal card that types through a few short code snippets.
 * Only runs while on screen; with reduced motion it shows the first snippet complete and never animates.
 * Fixed line count and height, so typing never shifts layout.
 */
export function CodeTerminal() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState(Infinity);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    let visible = false;
    let snippet = 0;
    let count = 0;
    const tick = () => {
      if (!visible) return;
      const total = length(SNIPPETS[snippet]);
      if (count < total) {
        count++;
        setTyped(count);
        timer = window.setTimeout(tick, TYPE_MS);
      } else {
        timer = window.setTimeout(() => {
          snippet = (snippet + 1) % SNIPPETS.length;
          count = 0;
          setIndex(snippet);
          setTyped(0);
          tick();
        }, HOLD_MS);
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      clearTimeout(timer);
      if (visible) tick();
    });
    io.observe(host);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, []);

  const lines = sliceSnippet(SNIPPETS[index], typed).map((line) =>
    line.map(([text, kind], i) => (
      <span key={i} className={kind ? `tk-${kind}` : undefined}>
        {text}
      </span>
    )),
  );
  const caretLine = Math.max(0, lines.findLastIndex((line) => line.length > 0));

  return (
    <div className="code-terminal" ref={hostRef} aria-hidden="true">
      <div className="ct-bar">
        <i />
        <i />
        <i />
        <span>about.ts</span>
      </div>
      <pre className="ct-body">
        {lines.map((line, i) => (
          <span key={i} className="ct-line">
            <b>{String(i + 1).padStart(2, "0")}</b>
            {line}
            {i === caretLine && <span className="ct-caret" />}
          </span>
        ))}
      </pre>
    </div>
  );
}
