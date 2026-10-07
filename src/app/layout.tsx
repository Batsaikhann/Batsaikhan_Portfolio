import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import Script from "next/script";
import { BackToTop } from "@/components/BackToTop";
import { Footer } from "@/components/Footer";
import { Interactions } from "@/components/Interactions";
import { Nav } from "@/components/Nav";
import { Preloader } from "@/components/Preloader";
import { RouteTransition } from "@/components/RouteTransition";
import { langInitScript } from "@/components/T";
import "./globals.css";

// Two families cover the whole UI in both languages. Mongolian needs "cyrillic-ext" as well
// as "cyrillic": Ө ө Ү ү (U+04E8–04E9, U+04AE–04AF) are outside the basic Cyrillic subset.
const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600"],
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
      data-scroll-behavior="smooth"
      data-loading=""
      className={`${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Script id="lang-init" strategy="beforeInteractive">
          {langInitScript}
        </Script>
        <noscript>
          <style>{`.preloader { display: none !important; } html[data-loading] { overflow: auto !important; }`}</style>
        </noscript>
        <Preloader />
        <RouteTransition>
          <div className="site-shell">
            <Interactions />
            <Nav />
            {children}
            <Footer />
            <BackToTop />
          </div>
        </RouteTransition>
      </body>
    </html>
  );
}
