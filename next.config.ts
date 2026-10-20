import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Always defined so it is inlined as a constant: "1" builds the temporary perf lab (src/lib/perf-lab.ts)
  // into production, anything else compiles it out.
  env: { NEXT_PUBLIC_PERF_LAB: process.env.NEXT_PUBLIC_PERF_LAB === "1" ? "1" : "0" },
  // Old shared links on the Vercel subdomain land on the real domain (preview URLs are untouched).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "batsaikhandev.vercel.app" }],
        destination: "https://batsaikhan.dev/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
