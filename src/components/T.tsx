import { Fragment, type ReactNode } from "react";
import { Icon } from "./Icon";

export type Lang = "en" | "mn";
export type L = { en: string; mn: string };

// Runs before first paint (inlined in <head>) so the saved language never flashes.
export const langInitScript = `try{var l=localStorage.getItem("lang")||((navigator.language||"").slice(0,2)==="mn"?"mn":"en");document.documentElement.dataset.lang=l;document.documentElement.lang=l}catch(e){}`;

/**
 * Renders both languages; CSS shows the one matching <html data-lang>.
 * Keeps every page static and makes switching instant (no re-render or reload).
 */
export function T({ en, mn }: { en: ReactNode; mn: ReactNode }) {
  return (
    <span className="t">
      <span className="t-en" lang="en">
        {en}
      </span>
      <span className="t-mn" lang="mn">
        {mn}
      </span>
    </span>
  );
}

/** "→" isn't in the UI fonts' subsets, so data strings draw it as the site's SVG arrow instead of a fallback glyph. */
function withArrows(text: string): ReactNode {
  if (!text.includes("→")) return text;
  return text.split("→").map((part, i) => (
    <Fragment key={i}>
      {i > 0 && (
        <span className="text-arrow">
          <Icon name="arrow" size={14} />
        </span>
      )}
      {part}
    </Fragment>
  ));
}

/** Shorthand for a bilingual data string. */
export function Tx({ text }: { text: L }) {
  return <T en={withArrows(text.en)} mn={withArrows(text.mn)} />;
}
