import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
