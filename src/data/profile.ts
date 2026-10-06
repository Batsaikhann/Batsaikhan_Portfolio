// Edit this file to update the content shown on the site.

export const profile = {
  name: "Batsaikhan",
  location: "Ulaanbaatar, Mongolia",
  email: "erdenesukh.batsaikhan@gmail.com",
  github: { label: "github.com/Batsaikhann", href: "https://github.com/Batsaikhann" },
  // Replace with your real LinkedIn URL.
  linkedin: { label: "LinkedIn", href: "#contact" },
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  stats: string;
  visual: "terminal" | "blueprint" | "map";
  /** What the system is made of — shown in the case study. */
  modules: string[];
  /** Set to the live URL to show a LIVE badge and link. */
  live?: string;
};

export const projects: Project[] = [
  {
    slug: "sporthub",
    number: "01",
    title: "SportHub",
    category: "Sports ecosystem",
    description:
      "A complete sports platform built from the ground up — memberships, wallets, entitlements, payments and club discovery across web and mobile.",
    stack: ["NestJS", "PostgreSQL", "React", "Flutter"],
    stats: "≈85 commits",
    visual: "terminal",
    modules: ["Auth / RBAC", "Wallet / ledger", "Orders / catalog", "Web / mobile / admin"],
  },
  {
    slug: "barilgahub",
    number: "02",
    title: "BarilgaHUB",
    category: "E-commerce platform",
    description:
      "Construction materials marketplace connecting stores, suppliers and customers with optimized media, queues and reliable cloud infrastructure.",
    stack: ["NestJS", "Prisma", "BullMQ", "S3"],
    stats: "48 commits",
    visual: "blueprint",
    modules: ["Storefront", "Admin", "Supplier portal", "Media + queues"],
  },
  {
    slug: "bikemap",
    number: "03",
    title: "BikeMap UB",
    category: "Urban mobility",
    description:
      "A safety-first cycling route system for Ulaanbaatar with GPX editing, road snapping and heatmap visualization.",
    stack: ["Leaflet", "GPX", "Heatmap", "CI/CD"],
    stats: "≈12 commits",
    visual: "map",
    modules: ["GPX editing", "Road snapping", "Heatmap", "CI/CD"],
  },
];

export const teamProjects = [
  { title: "SparkXP", description: "AI learning platform", stats: "23 merged PRs" },
  { title: "GymHub", description: "Fitness ecosystem", stats: "≈18 merged PRs" },
];

export const capabilities = [
  { label: "Frontend", items: ["React", "Next.js", "Vite", "Tailwind CSS", "React Query", "i18next"] },
  { label: "Backend", items: ["NestJS", "BullMQ", "S3", "REST APIs", "Claude API"] },
  { label: "Database", items: ["PostgreSQL", "Prisma", "Kysely", "Redis", "Supabase"] },
  { label: "Mobile", items: ["Flutter", "React Native", "Expo"] },
  { label: "DevOps", items: ["Railway", "Vercel", "Docker", "GitHub Actions"] },
  { label: "Design", items: ["Design systems", "SVG", "Leaflet", "GPX"] },
];

export const stats = [
  { value: 250, suffix: "+", label: "commits & PRs" },
  { value: 7, suffix: "+", label: "products shipped" },
  { value: 4, suffix: "", label: "platforms mastered" },
];

export const ticker = ["NEXT.JS", "NESTJS", "REACT", "FLUTTER", "POSTGRESQL", "TYPESCRIPT", "DOCKER", "VERCEL"];
