// Ambient code strips for the edges of a section: decorative, low-opacity, behind the content.
// Each column repeats its text four times (two per half) so the slow translateY loop (−50%) wraps
// seamlessly and still fills tall sections.
const COLUMNS = [
  { side: "left", text: 'const builder = "Batsaikhan"; · build(); · deploy(); · 01 BUILD · 02 SHIP · 03 SCALE ·' },
  { side: "left", text: 'stack = ["Next.js", "React", "NestJS", "Flutter"]; · systems_that_move(); ·' },
  { side: "right", text: '<section id="about"> · ideas / systems / people · </section> · ship(); ·' },
  { side: "right", text: "await scale(); · 01 BUILD · 02 SHIP · 03 SCALE · return impact; ·" },
] as const;

export function CodeColumns() {
  return (
    <div className="code-columns" aria-hidden="true">
      {COLUMNS.map((column, i) => (
        <span key={i} className={`code-col is-${column.side} is-${i + 1}`}>
          <span className="code-col-track">
            {[0, 1, 2, 3].map((copy) => (
              <span key={copy}>{column.text}</span>
            ))}
          </span>
        </span>
      ))}
    </div>
  );
}
