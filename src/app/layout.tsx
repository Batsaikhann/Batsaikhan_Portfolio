import type { Metadata, Viewport } from "next";
import { DM_Mono, JetBrains_Mono, Manrope, Syne, Unbounded } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Interactions } from "@/components/Interactions";
import { Nav } from "@/components/Nav";
import { RouteTransition } from "@/components/RouteTransition";
import { langInitScript } from "@/components/T";
import "./globals.css";

// Syne and DM Mono have no Cyrillic; globals.css stacks them with Unbounded / JetBrains Mono
// (cyrillic subset only, downloaded only when Mongolian text is on screen).
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["cyrillic"],
  weight: ["500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["cyrillic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Batsaikhan — Full-stack Engineer",
    template: "%s — Batsaikhan",
  },
  description: "Batsaikhan — full-stack engineer building scalable web, mobile and backend products.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-lang="en"
      className={`${syne.variable} ${unbounded.variable} ${manrope.variable} ${dmMono.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="lang-init" strategy="beforeInteractive">
          {langInitScript}
        </Script>
        <RouteTransition>
          <div className="site-shell">
            <Interactions />
            <Nav />
            {children}
            <Footer />
          </div>
        </RouteTransition>
      </body>
    </html>
  );
}
