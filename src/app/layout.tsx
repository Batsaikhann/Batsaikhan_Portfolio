import type { Metadata, Viewport } from "next";
import { DM_Mono, Manrope, Syne } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Interactions } from "@/components/Interactions";
import { Nav } from "@/components/Nav";
import { RouteTransition } from "@/components/RouteTransition";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
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
    <html lang="en" className={`${syne.variable} ${manrope.variable} ${dmMono.variable}`}>
      <body>
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
