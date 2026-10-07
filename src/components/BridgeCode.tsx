// Decorative code panel for the About bridge: a numbered, syntax-tinted snippet that flows slowly
// downward forever. The listing is rendered twice and the track moves from -50% to 0, so the loop is seamless.
type Kind = "kw" | "ty" | "str" | "cm" | "num" | "fn";
type Line = [text: string, kind?: Kind][];

const CODE: Line[] = [
  [["// Product architecture", "cm"]],
  [["type ", "kw"], ["Product", "ty"], [" = {"]],
  [["  idea: "], ["string", "ty"]],
  [["  users: "], ["number", "ty"]],
  [["  systems: "], ["string[]", "ty"]],
  [["  shipped: "], ["boolean", "ty"]],
  [["}"]],
  [],
  [["const ", "kw"], ["build", "fn"], [" = "], ["async ", "kw"], ["(idea: "], ["Product", "ty"], [") => {"]],
  [["  const ", "kw"], ["architecture = "], ["await", "kw"]],
  [["    designSystem", "fn"], ["(idea)"]],
  [],
  [["  return ", "kw"], ["ship", "fn"], ["({"]],
  [["    frontend: "], ['"Next.js"', "str"], [","]],
  [["    backend: "], ['"NestJS"', "str"], [","]],
  [["    database: "], ['"PostgreSQL"', "str"], [","]],
  [["    mobile: "], ['"Flutter"', "str"], [","]],
  [["    cloud: "], ['"Vercel"', "str"]],
  [["  })"]],
  [["}"]],
  [],
  [["if ", "kw"], ["(idea."], ["isReal", "ty"], [") {"]],
  [["  await ", "kw"], ["build", "fn"], ["()"]],
  [["  await ", "kw"], ["test", "fn"], ["()"]],
  [["  await ", "kw"], ["scale", "fn"], ["()"]],
  [["  await ", "kw"], ["ship", "fn"], ["()"]],
  [["}"]],
  [],
  [["// Core principles", "cm"]],
  [["01 ", "num"], ["BUILD   "], ["→ from ideas", "cm"]],
  [["02 ", "num"], ["SHIP    "], ["→ to users", "cm"]],
  [["03 ", "num"], ["SCALE   "], ["→ with systems", "cm"]],
  [],
];

function Listing() {
  return (
    <span className="bc-listing">
      {CODE.map((line, i) => (
        <span key={i} className="bc-line">
          <b>{String(i + 1).padStart(2, "0")}</b>
          {line.map(([text, kind], j) => (
            <span key={j} className={kind ? `bc-${kind}` : undefined}>
              {text}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export function BridgeCode() {
  return (
    <div className="bridge-code" aria-hidden="true">
      <pre className="bc-track">
        <Listing />
        <Listing />
      </pre>
    </div>
  );
}
