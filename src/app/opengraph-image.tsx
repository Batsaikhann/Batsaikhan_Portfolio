import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Batsaikhan — Full-stack Engineer. I build systems that move.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const wordmark = `data:image/png;base64,${await readFile(join(process.cwd(), "public/images/logo/logo-wordmark.png"), "base64")}`;

/** The link-preview card (Messenger, Slack, X…): wordmark, headline and where to find me. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 80px",
          color: "#f2eeee",
          background: "radial-gradient(circle at 88% 12%, rgba(229, 36, 59, .32), rgba(10, 10, 10, 0) 48%), #0a0a0a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 20, letterSpacing: 5, color: "#9a9393" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#ff3b4f", boxShadow: "0 0 16px #ff3b4f" }} />
          FULL-STACK ENGINEER · PRODUCT BUILDER
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <img src={wordmark} width={576} height={139} alt="" />
          <div style={{ display: "flex", marginTop: 44, fontSize: 64, fontWeight: 700, letterSpacing: -2, lineHeight: 1 }}>
            I build systems that&nbsp;<span style={{ color: "#ff3b4f" }}>move.</span>
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 26, color: "#b8b1b1" }}>
            Web, mobile and backend products — from architecture to deployment.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 26, borderTop: "1px solid rgba(255, 255, 255, .1)", fontSize: 20, color: "#8a8383" }}>
          <span>batsaikhandev.vercel.app</span>
          <span>Ulaanbaatar, Mongolia</span>
        </div>
      </div>
    ),
    size,
  );
}
