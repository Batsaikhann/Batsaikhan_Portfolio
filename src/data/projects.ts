// Case-study content. Every fact here comes from the project repositories
// (README, architecture docs, tests, commit history) — keep it that way.
import type { StaticImageData } from "next/image";
import type { L } from "@/components/T";

import sporthubLogin from "../../public/images/projects/sporthub/web-login.jpg";
import sporthubRegister from "../../public/images/projects/sporthub/web-register.jpg";
import sporthubMobile from "../../public/images/projects/sporthub/mobile.jpg";
import barilgaStorefront from "../../public/images/projects/barilgahub/storefront.jpg";
import barilgaProduct from "../../public/images/projects/barilgahub/product.jpg";
import barilgaTrack from "../../public/images/projects/barilgahub/track.jpg";
import barilgaMobile from "../../public/images/projects/barilgahub/mobile.jpg";
import appWorld from "../../public/images/projects/sparkxp/app-world.jpg";
import appLevel from "../../public/images/projects/sparkxp/app-level.jpg";
import appLesson from "../../public/images/projects/sparkxp/app-lesson.jpg";
import appProfile from "../../public/images/projects/sparkxp/app-profile.jpg";
import sparkLessons from "../../public/images/projects/sparkxp/admin-lessons.jpg";
import sparkWords from "../../public/images/projects/sparkxp/admin-words.jpg";
import sparkQuizzes from "../../public/images/projects/sparkxp/admin-quizzes.jpg";
import sparkBuddy from "../../public/images/projects/sparkxp/admin-buddy.jpg";
import gymDarkHero from "../../public/images/projects/gymhub/dark-hero.jpg";
import gymDarkCompany from "../../public/images/projects/gymhub/dark-company.jpg";
import gymDarkPartners from "../../public/images/projects/gymhub/dark-partners.jpg";
import gymDarkFaq from "../../public/images/projects/gymhub/dark-faq.jpg";
import gymDarkContact from "../../public/images/projects/gymhub/dark-contact.jpg";
import gymDarkMobile from "../../public/images/projects/gymhub/dark-mobile.jpg";
import gymLightHero from "../../public/images/projects/gymhub/light-hero.jpg";
import gymLightCompany from "../../public/images/projects/gymhub/light-company.jpg";
import gymLightPartners from "../../public/images/projects/gymhub/light-partners.jpg";
import gymLightFaq from "../../public/images/projects/gymhub/light-faq.jpg";
import gymLightContact from "../../public/images/projects/gymhub/light-contact.jpg";
import gymLightMobile from "../../public/images/projects/gymhub/light-mobile.jpg";

export type Shot = {
  src: StaticImageData;
  /** Screen name shown under the image. */
  label: L;
  /** Gallery filter group. */
  group: L;
  /** Address shown in the browser frame. */
  url: string;
  device: "desktop" | "mobile";
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  year: string;
  category: L;
  status: { kind: "live" | "preview" | "academic" | "team"; label: L };
  description: L;
  role: L;
  team: L;
  stack: string[];
  links: { live?: string; liveLabel?: L; source?: string };
  visual: "terminal" | "blueprint" | "map" | "buddy";
  metrics: Array<{ value: number; suffix?: string; label: L }>;
  overview: { summary: L; problem: L; solution: L; result: L };
  responsibilities: L[];
  modules: Array<{ title: L; text: L }>;
  highlights: Array<{ title: L; text: L }>;
  shots: Shot[];
  /** Optional note shown above the gallery (e.g. where the screens come from). */
  shotsNote?: L;
};

export const projects: Project[] = [
  {
    slug: "sporthub",
    number: "01",
    title: "SportHub",
    year: "2026",
    category: { en: "Sports platform", mn: "Спортын платформ" },
    status: { kind: "preview", label: { en: "Pre-production", mn: "Pre-production" } },
    description: {
      en: "Multi-sport membership, booking and wallet platform for Mongolia — one account across gyms, yoga and future sports, on web, mobile and an admin dashboard.",
      mn: "Монголын олон төрлийн спортын гишүүнчлэл, захиалга, хэтэвчийн платформ — фитнесс, йога болон цаашдын спортуудад нэг бүртгэл, веб, мобайл, админ самбар дээр.",
    },
    role: { en: "Lead developer · Full-stack", mn: "Ахлах хөгжүүлэгч · Full-stack" },
    team: {
      en: "2 contributors — I wrote 85 of the 87 commits and set the architecture.",
      mn: "2 оролцогч — 87 commit-оос 85-ыг нь би хийж, архитектурыг тодорхойлсон.",
    },
    stack: ["NestJS", "React", "Flutter", "Next.js", "TypeScript", "PostgreSQL", "TanStack Query", "Riverpod"],
    links: { live: "https://sporthub-eight.vercel.app", liveLabel: { en: "Open preview", mn: "Preview нээх" } },
    visual: "terminal",
    metrics: [
      { value: 4, label: { en: "apps in one workspace", mn: "апп нэг workspace-д" } },
      { value: 87, label: { en: "commits", mn: "commit" } },
      { value: 14, label: { en: "admin sections", mn: "админ хэсэг" } },
      { value: 2, label: { en: "languages (MN/EN)", mn: "хэл (MN/EN)" } },
    ],
    overview: {
      summary: {
        en: "SportHub is the successor to GymHub. It launches with Gym and Yoga and is designed so more sports — swimming, tennis, football — can be added without a platform redesign. Members use the web and Flutter apps; staff use an admin dashboard.",
        mn: "SportHub бол GymHub-ийн залгамжлагч. Фитнесс, йогоор эхэлж, усан сэлэлт, теннис, хөл бөмбөг зэрэг спортуудыг платформоо дахин зохиолгүйгээр нэмэх боломжтойгоор бүтээгдсэн. Гишүүд веб болон Flutter апп, ажилтнууд админ самбар ашиглана.",
      },
      problem: {
        en: "GymHub served a single sport. Members needed one account and one wallet across sports and facilities — while existing GymHub memberships had to keep their original rights without touching the legacy production systems.",
        mn: "GymHub ганцхан спортод зориулагдсан байсан. Гишүүдэд спорт, байгууллага бүрт нэг бүртгэл, нэг хэтэвч хэрэгтэй байсан бөгөөд одоо байгаа GymHub гишүүнчлэлүүд legacy систем рүү хүрэлгүйгээр анхны эрхээ хадгалах ёстой байв.",
      },
      solution: {
        en: "A fresh npm-workspace monorepo where the NestJS backend is the only place business logic lives. Identity uses opaque bearer sessions with deny-by-default RBAC; entitlements and the wallet are append-only ledgers whose balances are derived, never stored. Planned APIs are answered by contract mocks so web, mobile and admin move in parallel.",
        mn: "Бизнес логик зөвхөн NestJS backend-д байх шинэ npm-workspace monorepo. Нэвтрэлт нь opaque bearer session, deny-by-default RBAC-тэй; эрх болон хэтэвч нь append-only ledger бөгөөд үлдэгдлийг хадгалахгүй, тооцоолж гаргадаг. Төлөвлөсөн API-уудыг contract mock-оор хариулж веб, мобайл, админыг зэрэг хөгжүүлдэг.",
      },
      result: {
        en: "Pre-production: the backend, React web app, Flutter app and Next.js admin UI are implemented and the web preview is deployed on Vercel. Postgres persistence is verified in tests; real payments and the production rollout are next on the roadmap.",
        mn: "Pre-production шат: backend, React веб, Flutter апп, Next.js админ UI хэрэгжиж, веб preview Vercel дээр байршсан. Postgres-д хадгалалтыг тестээр баталгаажуулсан; бодит төлбөр болон production нэвтрүүлэлт дараагийн шатанд.",
      },
    },
    responsibilities: [
      { en: "Monorepo architecture, coding rules and technical documentation", mn: "Monorepo архитектур, кодын дүрэм, техникийн баримт бичиг" },
      { en: "NestJS backend: identity, RBAC, entitlement and wallet ledgers, top-ups", mn: "NestJS backend: нэвтрэлт, RBAC, эрх ба хэтэвчийн ledger, цэнэглэлт" },
      { en: "React member web app with MN/EN, search, booking and wallet flows", mn: "MN/EN-тэй React веб: хайлт, захиалга, хэтэвчийн урсгал" },
      { en: "Flutter mobile app with five tabs and secure session storage", mn: "Таван табтай, аюулгүй session хадгалалттай Flutter апп" },
      { en: "Next.js admin dashboard and the legacy GymHub migration mapping", mn: "Next.js админ самбар болон GymHub-аас шилжүүлэх mapping" },
    ],
    modules: [
      { title: { en: "Backend · NestJS", mn: "Backend · NestJS" }, text: { en: "The single writer of business data: sessions, RBAC, ledgers and server-verified top-ups.", mn: "Бизнес өгөгдлийг цорын ганц бичигч: session, RBAC, ledger, сервер талд шалгадаг цэнэглэлт." } },
      { title: { en: "Web · React", mn: "Веб · React" }, text: { en: "Persona-aware home, sport and club search, booking with cancel/refund, wallet and history.", mn: "Хэрэглэгчийн төлөвт тохирсон нүүр, спорт ба клуб хайлт, цуцлах/буцаалттай захиалга, хэтэвч." } },
      { title: { en: "Mobile · Flutter", mn: "Мобайл · Flutter" }, text: { en: "Home, Search, Schedule, Wallet and Profile tabs with Riverpod and go_router.", mn: "Riverpod, go_router-тэй Нүүр, Хайлт, Хуваарь, Хэтэвч, Профайл табууд." } },
      { title: { en: "Admin · Next.js", mn: "Админ · Next.js" }, text: { en: "Overview plus 14 section pages in MN/EN with light and dark themes.", mn: "Тойм болон 14 хэсэгтэй, MN/EN, гэрэл/харанхуй горимтой самбар." } },
    ],
    highlights: [
      { title: { en: "Append-only ledgers", mn: "Append-only ledger" }, text: { en: "Wallet and entitlements are never edited in place — every change is a new entry and the balance is derived from history.", mn: "Хэтэвч, эрхийг хэзээ ч засдаггүй — өөрчлөлт бүр шинэ бичлэг болж, үлдэгдэл түүхээс тооцоологдоно." } },
      { title: { en: "Deny-by-default RBAC", mn: "Deny-by-default RBAC" }, text: { en: "Every endpoint is closed unless a role explicitly allows it.", mn: "Үүрэг тодорхой зөвшөөрөөгүй бол endpoint бүр хаалттай." } },
      { title: { en: "Legacy-safe by design", mn: "Legacy-д аюулгүй" }, text: { en: "No shared code or database with GymHub; legacy memberships are shown read-only and never resold.", mn: "GymHub-тай код, өгөгдлийн сан хуваалцахгүй; хуучин гишүүнчлэлийг зөвхөн уншихаар харуулна." } },
      { title: { en: "Contract-first mocks", mn: "Contract-first mock" }, text: { en: "MSW and a mock server answer planned APIs so every client is built against the real contract.", mn: "MSW болон mock server төлөвлөсөн API-г хариулж, клиент бүрийг бодит contract-аар бүтээдэг." } },
    ],
    shots: [
      { src: sporthubLogin, label: { en: "Sign in", mn: "Нэвтрэх" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/login", device: "desktop" },
      { src: sporthubRegister, label: { en: "Create account", mn: "Бүртгүүлэх" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/register", device: "desktop" },
      { src: sporthubMobile, label: { en: "Mobile web", mn: "Мобайл веб" }, group: { en: "Mobile", mn: "Мобайл" }, url: "sporthub-eight.vercel.app", device: "mobile" },
    ],
  },
  {
    slug: "barilgahub",
    number: "02",
    title: "BarilgaHUB",
    year: "2026",
    category: { en: "E-commerce marketplace", mn: "Цахим худалдаа" },
    status: { kind: "live", label: { en: "Live", mn: "Ажиллаж байна" } },
    description: {
      en: "Multi-supplier construction-materials marketplace — compare price, stock and delivery from several suppliers on one product page, with separate buyer, supplier and admin apps.",
      mn: "Олон нийлүүлэгчтэй барилгын материалын marketplace — нэг барааны хуудсан дээр үнэ, үлдэгдэл, хүргэлтийг харьцуулж, худалдан авагч, нийлүүлэгч, админ гэсэн тусдаа апптай.",
    },
    role: { en: "Lead developer · Full-stack", mn: "Ахлах хөгжүүлэгч · Full-stack" },
    team: {
      en: "2 contributors — I wrote 48 of the 64 commits, including the architecture and backend.",
      mn: "2 оролцогч — 64 commit-оос 48-ыг нь, үүнд архитектур болон backend-ийг би хийсэн.",
    },
    stack: ["NestJS", "Prisma", "PostgreSQL", "Next.js", "BullMQ", "Redis", "Meilisearch", "S3", "Docker", "Railway"],
    links: {
      live: "https://100ail.vercel.app",
      liveLabel: { en: "Visit site", mn: "Вэбсайт нээх" },
      source: "https://github.com/Batsaikhann/100ail",
    },
    visual: "blueprint",
    metrics: [
      { value: 2136, label: { en: "products in the live catalog", mn: "бараа live каталогт" } },
      { value: 3, label: { en: "deployed web apps", mn: "байршсан веб апп" } },
      { value: 84, label: { en: "automated tests", mn: "автомат тест" } },
      { value: 2, suffix: "%", label: { en: "commission model", mn: "шимтгэлийн загвар" } },
    ],
    overview: {
      summary: {
        en: "BarilgaHUB puts many construction-material suppliers behind one storefront. Buyers compare offers for the same product, suppliers manage their own price lists, and an admin panel runs the marketplace.",
        mn: "BarilgaHUB олон барилгын материалын нийлүүлэгчийг нэг дэлгүүрт нэгтгэдэг. Худалдан авагч нэг барааны саналуудыг харьцуулж, нийлүүлэгч өөрийн үнийн жагсаалтыг удирдаж, админ marketplace-ийг ажиллуулна.",
      },
      problem: {
        en: "Buying materials usually means calling store after store to compare price, stock and delivery. Suppliers had no simple way to keep large price lists current in one place.",
        mn: "Материал худалдан авахад үнэ, үлдэгдэл, хүргэлтийг харьцуулахын тулд дэлгүүр нэг бүрт залгадаг. Нийлүүлэгчид том үнийн жагсаалтаа нэг дор шинэчлэх энгийн арга байгаагүй.",
      },
      solution: {
        en: "A NestJS + Prisma modular monolith where products are separated from supplier offers, so one page compares every supplier. Materials use dynamic attributes, search runs on Meilisearch, suppliers bulk-import Excel/CSV with a preview, and media goes through BullMQ queues to S3 with presigned URLs.",
        mn: "Бараа болон нийлүүлэгчийн саналыг салгасан NestJS + Prisma modular monolith — ингэснээр нэг хуудсан дээр бүх нийлүүлэгчийг харьцуулна. Материалд dynamic attribute, хайлтад Meilisearch, нийлүүлэгчид урьдчилан харах боломжтой Excel/CSV импорт, медиаг BullMQ queue-ээр S3 рүү presigned URL-аар дамжуулна.",
      },
      result: {
        en: "Live: the storefront, supplier system and admin panel run on Vercel against a Railway backend. The catalog holds 2,136 real products imported from the barilga.mn public catalog, covered by 59 unit and 25 end-to-end tests.",
        mn: "Ажиллаж байна: дэлгүүр, нийлүүлэгчийн систем, админ панел Vercel дээр, backend Railway дээр. barilga.mn-ийн нийтийн каталогаас импортолсон 2,136 бодит бараатай, 59 unit, 25 e2e тестээр хамгаалагдсан.",
      },
    },
    responsibilities: [
      { en: "Marketplace architecture and data model (product vs. offer split)", mn: "Marketplace-ийн архитектур, өгөгдлийн загвар (бараа ба санал салгасан)" },
      { en: "NestJS backend modules, auth, queues and S3 media pipeline", mn: "NestJS backend модуль, нэвтрэлт, queue, S3 медиа урсгал" },
      { en: "Catalog importer: scraper → images → database import", mn: "Каталог импорт: scraper → зураг → өгөгдлийн сан" },
      { en: "Docker, Railway backend and three Vercel frontends", mn: "Docker, Railway backend, гурван Vercel frontend" },
    ],
    modules: [
      { title: { en: "Storefront", mn: "Худалдан авагчийн веб" }, text: { en: "Search, filters, offer comparison, cart, orders and delivery tracking.", mn: "Хайлт, шүүлтүүр, санал харьцуулалт, сагс, захиалга, хүргэлт хянах." } },
      { title: { en: "Supplier system", mn: "Нийлүүлэгчийн систем" }, text: { en: "Price and stock management with Excel/CSV bulk import and payouts.", mn: "Excel/CSV бөөн импорттой үнэ, үлдэгдэл удирдлага, мөнгө татах урсгал." } },
      { title: { en: "Admin panel", mn: "Админ панел" }, text: { en: "Marketplace operations and home-page banners with CTR tracking.", mn: "Marketplace-ийн удирдлага, CTR бүртгэдэг нүүр хуудасны баннер." } },
      { title: { en: "Backend API", mn: "Backend API" }, text: { en: "NestJS + Prisma modular monolith with Redis, Meilisearch and BullMQ.", mn: "Redis, Meilisearch, BullMQ-тэй NestJS + Prisma modular monolith." } },
    ],
    highlights: [
      { title: { en: "Product vs. offer", mn: "Бараа ба санал" }, text: { en: "One canonical product, many supplier offers — price, stock and delivery compared side by side.", mn: "Нэг үндсэн бараа, олон нийлүүлэгчийн санал — үнэ, үлдэгдэл, хүргэлтийг зэрэгцүүлж харьцуулна." } },
      { title: { en: "Real catalog import", mn: "Бодит каталог импорт" }, text: { en: "A scraper → image → import pipeline loaded 2,136 products from a public catalog.", mn: "Scraper → зураг → импорт урсгалаар нийтийн каталогаас 2,136 бараа оруулсан." } },
      { title: { en: "Warehouse maps", mn: "Агуулахын газрын зураг" }, text: { en: "Supplier warehouses shown on Mapbox or a key-free OpenStreetMap fallback.", mn: "Нийлүүлэгчийн агуулахыг Mapbox эсвэл түлхүүргүй OpenStreetMap дээр харуулна." } },
      { title: { en: "Trust & notifications", mn: "Итгэл ба мэдэгдэл" }, text: { en: "Verified-purchase reviews, supplier ratings, and in-app plus optional email/SMS notifications.", mn: "Баталгаажсан худалдан авалтын сэтгэгдэл, нийлүүлэгчийн үнэлгээ, апп дотор болон имэйл/SMS мэдэгдэл." } },
    ],
    shots: [
      { src: barilgaStorefront, label: { en: "Storefront", mn: "Нүүр хуудас" }, group: { en: "Buyer", mn: "Худалдан авагч" }, url: "100ail.vercel.app", device: "desktop" },
      { src: barilgaProduct, label: { en: "Product & supplier offers", mn: "Бараа ба нийлүүлэгчийн санал" }, group: { en: "Buyer", mn: "Худалдан авагч" }, url: "100ail.vercel.app/product", device: "desktop" },
      { src: barilgaTrack, label: { en: "Delivery tracking", mn: "Хүргэлт хянах" }, group: { en: "Orders", mn: "Захиалга" }, url: "100ail.vercel.app/track", device: "desktop" },
      { src: barilgaMobile, label: { en: "Mobile storefront", mn: "Мобайл дэлгүүр" }, group: { en: "Mobile", mn: "Мобайл" }, url: "100ail.vercel.app", device: "mobile" },
    ],
  },
  {
    slug: "bikemap",
    number: "03",
    title: "BikeMap UB",
    year: "2026",
    category: { en: "Urban mobility · Diploma", mn: "Хотын хөдөлгөөн · Диплом" },
    status: { kind: "academic", label: { en: "Diploma project", mn: "Дипломын ажил" } },
    description: {
      en: "A crowdsourcing platform that makes cycling in Ulaanbaatar safer — riders tag road conditions, report hazards and vote, and routing prefers the safest path.",
      mn: "Улаанбаатарт дугуйгаар явахыг аюулгүй болгох crowdsourcing платформ — хэрэглэгчид замын нөхцөл тэмдэглэж, аюултай цэг мэдээлж, санал өгдөг бөгөөд маршрут хамгийн аюулгүй замыг сонгоно.",
    },
    role: { en: "Solo · Research, backend & frontend", mn: "Ганцаараа · Судалгаа, backend, frontend" },
    team: { en: "Individual diploma project — designed, built and tested end to end.", mn: "Хувийн дипломын ажил — эхнээс нь дуустал зохиож, бүтээж, тестэлсэн." },
    stack: ["Django", "PostgreSQL", "OSRM", "OpenStreetMap", "Leaflet", "Docker", "GitHub Actions"],
    links: { source: "https://github.com/Batsaikhann/bikemap_ub" },
    visual: "map",
    metrics: [
      { value: 65, label: { en: "automated tests", mn: "автомат тест" } },
      { value: 6, label: { en: "backend modules", mn: "backend модуль" } },
      { value: 6, label: { en: "hazard / POI types", mn: "аюул / POI төрөл" } },
      { value: 40, suffix: "%+", label: { en: "test coverage", mn: "тестийн хамрах хүрээ" } },
    ],
    overview: {
      summary: {
        en: "BikeMap UB lets cyclists build a shared, trustworthy map of Ulaanbaatar's bike routes: they tag road segments, report points of interest and hazards, and vote so the community decides what is accurate.",
        mn: "BikeMap UB нь дугуйчдад Улаанбаатарын дугуйн замын хамтын, найдвартай газрын зураг бүтээх боломж олгодог: замын хэсэг тэмдэглэж, аюул ба сонирхолтой цэг мэдээлж, санал өгснөөр нийтээрээ үнэн зөвийг шийднэ.",
      },
      problem: {
        en: "Ulaanbaatar has little reliable data on bike-lane condition and hazards, and standard routing optimises for distance — not for the rider's safety.",
        mn: "Улаанбаатарт дугуйн замын нөхцөл, аюулын талаар найдвартай мэдээлэл бага, ердийн маршрут нь аюулгүй байдлыг биш зайг л оновчлодог.",
      },
      solution: {
        en: "A Django backend split into six apps — accounts (JWT + RBAC), segments, POIs, crowd aggregation, routes and an audit log. Bike lanes are imported from OpenStreetMap, votes are aggregated by majority with SHA-256 de-duplication, and OSRM routing uses a safety-first tie-breaker.",
        mn: "Зургаан app-д хуваасан Django backend — accounts (JWT + RBAC), segments, POI, crowd aggregation, routes, audit log. Дугуйн замыг OpenStreetMap-аас импортолж, саналыг SHA-256 давхардал шалгалттай олонхийн зарчмаар нэгтгэж, OSRM маршрут safety-first tie-breaker ашиглана.",
      },
      result: {
        en: "Delivered as my diploma project with 65 automated tests (40%+ coverage) running in GitHub Actions CI, Swagger API docs, a Docker Compose setup and a Render deployment.",
        mn: "GitHub Actions CI дээр ажилладаг 65 автомат тест (40%-иас дээш хамрах хүрээ), Swagger API баримт, Docker Compose тохиргоо, Render байршуулалттайгаар дипломын ажил болгон хүлээлгэн өгсөн.",
      },
    },
    responsibilities: [
      { en: "Research, requirements and the crowd-aggregation algorithm", mn: "Судалгаа, шаардлага, crowd aggregation алгоритм" },
      { en: "Django backend: auth, RBAC, segments, POIs, voting and audit trail", mn: "Django backend: нэвтрэлт, RBAC, замын хэсэг, POI, санал, audit trail" },
      { en: "Map UI with heatmap, GPX import/export and smart routing", mn: "Heatmap, GPX импорт/экспорт, ухаалаг маршруттай газрын зургийн UI" },
      { en: "Testing, CI and deployment", mn: "Тест, CI, байршуулалт" },
    ],
    modules: [
      { title: { en: "Segments", mn: "Замын хэсэг" }, text: { en: "Road-condition tagging with bulk import of Ulaanbaatar's bike lanes from OSM.", mn: "OSM-ээс УБ-ын дугуйн замыг бөөнөөр импортолж, нөхцөлийг тэмдэглэнэ." } },
      { title: { en: "POIs & votes", mn: "POI ба санал" }, text: { en: "Six POI types with images, approval and up/down voting.", mn: "Зурагтай, батлах ба дэмжих/эсэргүүцэх санал бүхий 6 төрлийн POI." } },
      { title: { en: "Aggregation", mn: "Нэгтгэл" }, text: { en: "Majority-vote aggregation with SHA-256 hashing to keep crowd data trustworthy.", mn: "Олон нийтийн өгөгдлийг найдвартай байлгах SHA-256-тэй олонхийн нэгтгэл." } },
      { title: { en: "Routes", mn: "Маршрут" }, text: { en: "GPX import/export and OSRM smart routing with a safety-first tie-breaker.", mn: "GPX импорт/экспорт, safety-first tie-breaker-тэй OSRM ухаалаг маршрут." } },
    ],
    highlights: [
      { title: { en: "Safety-first routing", mn: "Аюулгүй байдал тэргүүнд" }, text: { en: "When routes are close in distance, the safer one wins.", mn: "Зай ойролцоо үед аюулгүй маршрут сонгогдоно." } },
      { title: { en: "Trustworthy crowd data", mn: "Найдвартай олон нийтийн өгөгдөл" }, text: { en: "Votes are de-duplicated and aggregated so one user cannot skew a segment.", mn: "Саналыг давхардалгүй нэгтгэдэг тул нэг хэрэглэгч үр дүнг гажуудуулж чадахгүй." } },
      { title: { en: "Admin audit trail", mn: "Админ audit trail" }, text: { en: "Every moderation action is recorded, with role-based access throughout.", mn: "Модерацийн үйлдэл бүрийг бүртгэж, бүх хэсэгт үүрэгт суурилсан эрхтэй." } },
      { title: { en: "Tested & automated", mn: "Тестэлсэн, автомат" }, text: { en: "65 tests across models, auth, voting, GPX import and aggregation run in CI.", mn: "Model, нэвтрэлт, санал, GPX импорт, нэгтгэлийг хамарсан 65 тест CI дээр ажиллана." } },
    ],
    shots: [],
  },
  {
    slug: "sparkxp",
    number: "04",
    title: "SparkXP",
    year: "2026",
    category: { en: "EdTech · AI", mn: "Боловсрол · AI" },
    status: { kind: "team", label: { en: "Team product", mn: "Багийн бүтээгдэхүүн" } },
    description: {
      en: "Gamified English-learning app for Mongolian students and schools. I built the AI Buddy — a 3D avatar that talks back with real-time lip-sync — and much of the mobile experience.",
      mn: "Монгол сурагч, сургуулиудад зориулсан тоглоомжуулсан англи хэл сурах апп. Бодит цагийн уруулын синктэй ярьдаг 3D аватар — AI Buddy болон мобайл туршлагын томоохон хэсгийг би бүтээсэн.",
    },
    role: { en: "Mobile & AI developer", mn: "Мобайл ба AI хөгжүүлэгч" },
    team: {
      en: "6-person team at Aether Tech Core LLC — 34 of my pull requests merged.",
      mn: "Aether Tech Core LLC-ийн 6 хүний баг — миний 34 pull request merge хийгдсэн.",
    },
    stack: ["React Native", "Expo", "TypeScript", "NestJS", "PostgreSQL", "Redis", "Gemini", "Azure Speech"],
    links: { source: "https://github.com/usukh6ayar/SparkXP" },
    visual: "buddy",
    shotsNote: {
      en: "Mobile app and admin dashboard run locally on demo data — no production data is shown.",
      mn: "Мобайл апп болон админ самбарыг демо өгөгдөлтэйгээр локал дээр ажиллуулж авсан — production өгөгдөл харуулаагүй.",
    },
    metrics: [
      { value: 58, suffix: "%", label: { en: "faster AI Buddy replies", mn: "хурдан AI Buddy хариу" } },
      { value: 34, label: { en: "merged pull requests", mn: "merge хийсэн PR" } },
      { value: 34, label: { en: "ARKit blendshapes for lip-sync", mn: "уруулын синкийн blendshape" } },
      { value: 6, label: { en: "people on the team", mn: "хүний баг" } },
    ],
    overview: {
      summary: {
        en: "SparkXP teaches English through lessons, reading, quizzes and spaced-repetition vocabulary, wrapped in XP, streaks and leaderboards. Teachers run classes and assignments; the AI Buddy gives students someone to practise speaking with.",
        mn: "SparkXP нь хичээл, унших, сорил, давталтын аргатай үгсийн сангаар англи хэл заадаг бөгөөд XP, streak, leaderboard-оор тоглоомжуулсан. Багш нар анги, даалгавар удирддаг; AI Buddy сурагчдад ярих дадлага хийх түнш болдог.",
      },
      problem: {
        en: "Speaking practice is the hardest part of learning English, and the first AI Buddy felt slow — a spoken reply took about 8.6 seconds end to end, which breaks the feeling of a conversation.",
        mn: "Ярих дадлага бол англи хэл сурахын хамгийн хэцүү хэсэг. Анхны AI Buddy удаан байсан — дуут хариу эхнээс дуустал 8.6 секунд орчим болдог тул яриа шиг санагддаггүй байв.",
      },
      solution: {
        en: "I replaced the emoji buddies with a 3D GLB avatar driven by 34 ARKit blendshapes for lip-sync and emotion, synced to Azure HD Voice visemes, and moved speech to Gemini STT/TTS with streamed audio. Then I cut the critical path in five phases — loading the avatar once, removing eight round trips and adding an STT timeout.",
        mn: "Emoji buddy-г уруулын синк, сэтгэл хөдлөлийг 34 ARKit blendshape-ээр удирддаг, Azure HD Voice viseme-тэй синк хийсэн 3D GLB аватараар сольж, яриаг урсгалт аудиотой Gemini STT/TTS руу шилжүүлсэн. Дараа нь эгзэгтэй замыг таван шатаар богиносгосон — аватарыг нэг удаа ачаалах, найман round trip хасах, STT timeout нэмэх.",
      },
      result: {
        en: "AI Buddy reply latency dropped from 8,565 ms to 3,583 ms (−58%). Alongside it I shipped speaking exercises, gamification, an island world map, the v2 mobile redesign and an app-wide light/dark theme.",
        mn: "AI Buddy-ийн хариуны хугацаа 8,565 мс-ээс 3,583 мс болж буурсан (−58%). Үүнтэй зэрэгцэн ярих дасгал, тоглоомжуулалт, арлын ертөнцийн газрын зураг, мобайлын v2 шинэчлэл, бүх аппын гэрэл/харанхуй горимыг гаргасан.",
      },
    },
    responsibilities: [
      { en: "AI Buddy: 3D avatar, lip-sync, emotions and the speech pipeline", mn: "AI Buddy: 3D аватар, уруулын синк, сэтгэл хөдлөл, ярианы урсгал" },
      { en: "Latency work that took voice replies from 8.6 s to 3.6 s", mn: "Дуут хариуг 8.6 с-ээс 3.6 с болгосон хурдны сайжруулалт" },
      { en: "Mobile redesign v2: home, profile, lessons and the island level map", mn: "Мобайлын v2 шинэчлэл: нүүр, профайл, хичээл, арлын түвшний газрын зураг" },
      { en: "Gamification, analytics, Buddy Shop and speaking exercises", mn: "Тоглоомжуулалт, аналитик, Buddy Shop, ярих дасгал" },
      { en: "Teacher features, responsive QA passes and admin tooling", mn: "Багшийн боломжууд, responsive QA, админы хэрэгслүүд" },
    ],
    modules: [
      { title: { en: "Mobile · Expo", mn: "Мобайл · Expo" }, text: { en: "Student and teacher app: lessons, quizzes, vocabulary, leaderboards and the AI Buddy.", mn: "Сурагч, багшийн апп: хичээл, сорил, үгсийн сан, leaderboard, AI Buddy." } },
      { title: { en: "AI Buddy", mn: "AI Buddy" }, text: { en: "3D avatar with viseme lip-sync, Gemini STT/TTS and streamed audio.", mn: "Viseme уруулын синк, Gemini STT/TTS, урсгалт аудиотой 3D аватар." } },
      { title: { en: "API · NestJS", mn: "API · NestJS" }, text: { en: "Auth, lessons, gamification and limits on PostgreSQL and Redis.", mn: "PostgreSQL, Redis дээрх нэвтрэлт, хичээл, тоглоомжуулалт, хязгаарлалт." } },
      { title: { en: "Admin", mn: "Админ" }, text: { en: "Content, the words AI pipeline, buddies and usage limits.", mn: "Контент, үгсийн AI pipeline, buddy, хэрэглээний хязгаар." } },
    ],
    highlights: [
      { title: { en: "−58% voice latency", mn: "Дуут хариу −58%" }, text: { en: "Measured phase by phase: 8,565 ms → 3,583 ms for a full spoken reply.", mn: "Шат бүрээр хэмжсэн: бүтэн дуут хариу 8,565 мс → 3,583 мс." } },
      { title: { en: "Real lip-sync", mn: "Бодит уруулын синк" }, text: { en: "34 ARKit blendshapes follow Azure HD Voice visemes, so the mouth matches the words.", mn: "34 ARKit blendshape нь Azure HD Voice viseme-ийг дагадаг тул ам үгтэй таарна." } },
      { title: { en: "Lighter 3D", mn: "Хөнгөн 3D" }, text: { en: "The GLB avatar is downloaded once and its render was slimmed for low-end phones.", mn: "GLB аватарыг нэг удаа татаж, сул утсанд зориулж рендэрийг хөнгөлсөн." } },
      { title: { en: "Every screen size", mn: "Бүх дэлгэцийн хэмжээ" }, text: { en: "A QA pass made every screen responsive and added a reactive language and theme setting.", mn: "QA-гаар бүх дэлгэцийг responsive болгож, хэл ба горимын тохиргоо нэмсэн." } },
    ],
    shots: [
      { src: appWorld, label: { en: "Lesson world map", mn: "Хичээлийн ертөнц" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appLevel, label: { en: "Level journey", mn: "Түвшний аялал" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appLesson, label: { en: "Lesson", mn: "Хичээл" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appProfile, label: { en: "Profile & stats", mn: "Профайл, статистик" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: sparkLessons, label: { en: "Lessons", mn: "Хичээлүүд" }, group: { en: "Content", mn: "Контент" }, url: "admin · /lessons", device: "desktop" },
      { src: sparkWords, label: { en: "Word bank", mn: "Үгийн сан" }, group: { en: "Content", mn: "Контент" }, url: "admin · /words", device: "desktop" },
      { src: sparkQuizzes, label: { en: "Quizzes", mn: "Quiz" }, group: { en: "Content", mn: "Контент" }, url: "admin · /quizzes", device: "desktop" },
      { src: sparkBuddy, label: { en: "AI Buddy", mn: "AI Buddy" }, group: { en: "AI", mn: "AI" }, url: "admin · /buddy", device: "desktop" },
    ],
  },
  {
    slug: "gymhub",
    number: "05",
    title: "GymHub",
    year: "2026",
    category: { en: "Fitness membership", mn: "Фитнессийн гишүүнчлэл" },
    status: { kind: "live", label: { en: "Live", mn: "Ажиллаж байна" } },
    description: {
      en: "Mongolia's multi-gym membership network — one membership across 30+ fitness clubs. I shipped new membership packages, upgrades, an HR portal for companies and admin tooling.",
      mn: "Монголын олон фитнессийн нэгдсэн гишүүнчлэл — 30 гаруй клубт нэг гишүүнчлэл. Шинэ багц, багц ахиулах, байгууллагын HR портал болон админы хэрэгслүүдийг би гаргасан.",
    },
    role: { en: "Full-stack developer · Team member", mn: "Full-stack хөгжүүлэгч · Багийн гишүүн" },
    team: {
      en: "3 contributors across the member site and admin dashboard — 20 of my pull requests merged.",
      mn: "Гишүүдийн сайт болон админ самбар дээр 3 оролцогч — миний 20 pull request merge хийгдсэн.",
    },
    stack: ["React", "Vite", "Next.js", "TypeScript", "Tailwind CSS", "Supabase", "QPay", "Vercel"],
    links: { live: "https://gymhub.mn", liveLabel: { en: "Visit gymhub.mn", mn: "gymhub.mn нээх" } },
    visual: "terminal",
    metrics: [
      { value: 30, suffix: "+", label: { en: "partner clubs (gymhub.mn)", mn: "хамтрагч клуб (gymhub.mn)" } },
      { value: 20, label: { en: "merged pull requests", mn: "merge хийсэн PR" } },
      { value: 2, label: { en: "apps: site + admin", mn: "апп: сайт + админ" } },
      { value: 3, label: { en: "contributors", mn: "оролцогч" } },
    ],
    overview: {
      summary: {
        en: "GymHub brings fitness clubs across Mongolia under one membership. Members buy packages on gymhub.mn and train at partner clubs; staff run plans, organizations and members from a Next.js admin dashboard on Supabase.",
        mn: "GymHub нь Монголын фитнесс клубуудыг нэг гишүүнчлэлд нэгтгэдэг. Гишүүд gymhub.mn дээр багц авч хамтрагч клубт хичээллэдэг; ажилтнууд багц, байгууллага, гишүүдийг Supabase дээрх Next.js админ самбараас удирддаг.",
      },
      problem: {
        en: "The business needed new products and sales channels — a new package tier, upgrades, company-sponsored memberships and weekly visit limits — without breaking how existing members' status was calculated.",
        mn: "Бизнест шинэ бүтээгдэхүүн, борлуулалтын суваг хэрэгтэй байсан — шинэ багцын түвшин, ахиулалт, байгууллагын санхүүжүүлсэн гишүүнчлэл, долоо хоногийн хязгаар — одоо байгаа гишүүдийн төлөвийн тооцоог эвдэлгүйгээр.",
      },
      solution: {
        en: "I added the GymGo package with its own tier, a package-upgrade flow and admin-managed promo banners; an HR portal with an admin HR catalog and invite links that lock the organization at sign-up; weekly visit limits with clear messaging; video lessons and office packages; and fixed membership status to use Ulaanbaatar time.",
        mn: "Өөрийн түвшинтэй GymGo багц, багц ахиулах урсгал, админаас удирдах промо баннер; админы HR каталогтой HR портал, бүртгүүлэхэд байгууллагыг түгжих урилгын линк; ойлгомжтой мессежтэй долоо хоногийн хязгаар; видео хичээл, оффис багц нэмж, гишүүнчлэлийн төлөвийг Улаанбаатарын цагаар зөв тооцдог болгосон.",
      },
      result: {
        en: "All 20 pull requests shipped to production on gymhub.mn and the admin dashboard between August and September 2026.",
        mn: "20 pull request бүгд 2026 оны 8–9-р сард gymhub.mn болон админ самбар дээр production-д гарсан.",
      },
    },
    responsibilities: [
      { en: "GymGo package tier and the package-upgrade flow", mn: "GymGo багцын түвшин, багц ахиулах урсгал" },
      { en: "HR portal for companies with an admin HR catalog and backend", mn: "Админ HR каталог, backend-тэй байгууллагын HR портал" },
      { en: "Organization invite links that lock the company at sign-up", mn: "Бүртгүүлэхэд байгууллагыг түгжих урилгын линк" },
      { en: "Weekly visit limits, video lessons, office packages and QPay token fixes", mn: "Долоо хоногийн хязгаар, видео хичээл, оффис багц, QPay токены засвар" },
      { en: "Admin tools: moderators, member accounts and marking gyms as full", mn: "Админ хэрэгсэл: модератор, гишүүний бүртгэл, клубыг дүүрсэн гэж тэмдэглэх" },
    ],
    modules: [
      { title: { en: "Member site", mn: "Гишүүдийн сайт" }, text: { en: "React + Vite on gymhub.mn: packages, sign-up, upgrades and the HR portal at /hr.", mn: "gymhub.mn дээрх React + Vite: багц, бүртгэл, ахиулалт, /hr HR портал." } },
      { title: { en: "Admin dashboard", mn: "Админ самбар" }, text: { en: "Next.js 16 + Tailwind on Supabase for plans, gyms, organizations and members.", mn: "Supabase дээрх Next.js 16 + Tailwind: багц, клуб, байгууллага, гишүүд." } },
      { title: { en: "HR portal", mn: "HR портал" }, text: { en: "Companies invite employees; the invite link fixes their organization.", mn: "Байгууллага ажилтнаа урина; урилгын линк байгууллагыг тогтооно." } },
      { title: { en: "Packages & payments", mn: "Багц ба төлбөр" }, text: { en: "Tiered packages, upgrades, promo banners and QPay checkout.", mn: "Түвшинтэй багц, ахиулалт, промо баннер, QPay төлбөр." } },
    ],
    highlights: [
      { title: { en: "Timezone-correct status", mn: "Цагийн бүсэд зөв төлөв" }, text: { en: "Membership status is computed in Ulaanbaatar time, so members don't expire a day early.", mn: "Гишүүнчлэлийн төлөвийг Улаанбаатарын цагаар тооцдог тул нэг өдрийн өмнө дуусахгүй." } },
      { title: { en: "Locked invite sign-up", mn: "Түгжээтэй урилга" }, text: { en: "Employees joining via an HR invite can't pick the wrong organization.", mn: "HR урилгаар нэгдсэн ажилтан буруу байгууллага сонгож чадахгүй." } },
      { title: { en: "Weekly visit limits", mn: "Долоо хоногийн хязгаар" }, text: { en: "Seven-day visit rights are enforced and explained to members in the app.", mn: "7 хоногийн зочлох эрхийг хэрэгжүүлж, гишүүдэд апп дотор тайлбарладаг." } },
      { title: { en: "Upgrades without churn", mn: "Ахиулалт" }, text: { en: "Members upgrade packages in place, including from the new GymGo tier.", mn: "Гишүүд, үүнд GymGo-гийнхон, багцаа шууд ахиулж болно." } },
    ],
    shots: [
      { src: gymDarkHero, label: { en: "Landing · Dark", mn: "Нүүр · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn", device: "desktop" },
      { src: gymDarkCompany, label: { en: "For companies · Dark", mn: "Байгууллагад · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#company", device: "desktop" },
      { src: gymDarkPartners, label: { en: "Partner gyms · Dark", mn: "Хамтрагч фитнес · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#partners", device: "desktop" },
      { src: gymDarkFaq, label: { en: "FAQ · Dark", mn: "Асуулт хариулт · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#faq", device: "desktop" },
      { src: gymDarkContact, label: { en: "Contact · Dark", mn: "Холбоо барих · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#contact", device: "desktop" },
      { src: gymDarkMobile, label: { en: "Mobile · Dark", mn: "Мобайл · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn", device: "mobile" },
      { src: gymLightHero, label: { en: "Landing · Light", mn: "Нүүр · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn", device: "desktop" },
      { src: gymLightCompany, label: { en: "For companies · Light", mn: "Байгууллагад · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#company", device: "desktop" },
      { src: gymLightPartners, label: { en: "Partner gyms · Light", mn: "Хамтрагч фитнес · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#partners", device: "desktop" },
      { src: gymLightFaq, label: { en: "FAQ · Light", mn: "Асуулт хариулт · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#faq", device: "desktop" },
      { src: gymLightContact, label: { en: "Contact · Light", mn: "Холбоо барих · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#contact", device: "desktop" },
      { src: gymLightMobile, label: { en: "Mobile · Light", mn: "Мобайл · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn", device: "mobile" },
    ],
  },
];
