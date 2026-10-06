// Edit this file to update the content shown on the site.
// Every visible string has an English (en) and Mongolian (mn) version.
import type { L } from "@/components/T";

export const profile = {
  name: "Batsaikhan",
  location: { en: "Ulaanbaatar, Mongolia", mn: "Улаанбаатар, Монгол" } satisfies L,
  city: { en: "Ulaanbaatar", mn: "Улаанбаатар" } satisfies L,
  email: "erdenesukh.batsaikhan@gmail.com",
  github: { label: "github.com/Batsaikhann", href: "https://github.com/Batsaikhann" },
  // Replace with your real LinkedIn URL.
  linkedin: { label: "LinkedIn", href: "#contact" },
};

// Project case studies live in ./projects.ts.

export const capabilities: Array<{ label: L; items: string[] }> = [
  { label: { en: "Frontend", mn: "Frontend" }, items: ["React", "Next.js", "Vite", "Tailwind CSS", "React Query", "i18next"] },
  { label: { en: "Backend", mn: "Backend" }, items: ["NestJS", "BullMQ", "S3", "REST APIs", "Claude API"] },
  { label: { en: "Database", mn: "Өгөгдлийн сан" }, items: ["PostgreSQL", "Prisma", "Kysely", "Redis", "Supabase"] },
  { label: { en: "Mobile", mn: "Мобайл" }, items: ["Flutter", "React Native", "Expo"] },
  { label: { en: "DevOps", mn: "DevOps" }, items: ["Railway", "Vercel", "Docker", "GitHub Actions"] },
  { label: { en: "Design", mn: "Дизайн" }, items: ["Design systems", "SVG", "Leaflet", "GPX"] },
];

export const stats = [
  { value: 25, suffix: "+", label: { en: "technologies in my stack", mn: "эзэмшсэн технологи" } },
  { value: 7, suffix: "+", label: { en: "products shipped", mn: "хүргэсэн бүтээгдэхүүн" } },
  { value: 4, suffix: "", label: { en: "platforms mastered", mn: "эзэмшсэн платформ" } },
];

export const ticker = ["NEXT.JS", "NESTJS", "REACT", "FLUTTER", "POSTGRESQL", "TYPESCRIPT", "DOCKER", "VERCEL"];

export const journey: Array<{ period: L; title: string; role: L; note?: L; current?: boolean; kind: "work" | "education" }> = [
  {
    period: { en: "Now", mn: "Одоо" },
    title: "Aether Tech Core LLC",
    role: { en: "Full-Stack Developer & Team Lead", mn: "Full-Stack хөгжүүлэгч ба багийн ахлагч" },
    current: true,
    kind: "work",
  },
  {
    period: { en: "2025", mn: "2025" },
    title: "Tapatrip LLC",
    role: { en: "Software Developer Intern", mn: "Програм хөгжүүлэгч, дадлагажигч" },
    note: { en: "First professional role", mn: "Анхны мэргэжлийн ажил" },
    kind: "work",
  },
  {
    period: { en: "2025", mn: "2025" },
    title: "Skytel",
    role: { en: "Intern", mn: "Дадлагажигч" },
    kind: "work",
  },
  {
    period: { en: "2022 – 2026", mn: "2022 – 2026" },
    title: "MUST · ШУТИС",
    role: {
      en: "School of ICT · Computer Science · Software Engineering",
      mn: "МХТС · Компьютерийн ухаан · Програм хангамжийн инженер",
    },
    note: {
      en: "Mongolian University of Science and Technology",
      mn: "Шинжлэх Ухаан, Технологийн Их Сургууль",
    },
    kind: "education",
  },
];
