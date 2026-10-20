// Case-study content. Every fact here comes from the project repositories
// (README, architecture docs, tests, commit history) — keep it that way.
import type { StaticImageData } from "next/image";
import type { L } from "@/components/T";

import sporthubWebLogin from "../../public/images/projects/sporthub/web-login.jpg";
import sporthubWebRegister from "../../public/images/projects/sporthub/web-register.jpg";
import sporthubWebHome from "../../public/images/projects/sporthub/web-home.jpg";
import sporthubWebClubs from "../../public/images/projects/sporthub/web-clubs.jpg";
import sporthubWebClub from "../../public/images/projects/sporthub/web-club.jpg";
import sporthubWebMembership from "../../public/images/projects/sporthub/web-membership.jpg";
import sporthubWebWallet from "../../public/images/projects/sporthub/web-wallet.jpg";
import sporthubAdminLogin from "../../public/images/projects/sporthub/admin-login.jpg";
import sporthubAppHome from "../../public/images/projects/sporthub/app-home.jpg";
import sporthubAppSearch from "../../public/images/projects/sporthub/app-search.jpg";
import sporthubAppMap from "../../public/images/projects/sporthub/app-map.jpg";
import sporthubAppSport from "../../public/images/projects/sporthub/app-sport.jpg";
import sporthubAppClub from "../../public/images/projects/sporthub/app-club.jpg";
import sporthubAppMembership from "../../public/images/projects/sporthub/app-membership.jpg";
import sporthubAppWallet from "../../public/images/projects/sporthub/app-wallet.jpg";
import sporthubAppLogin from "../../public/images/projects/sporthub/app-login.jpg";
import sporthubAppRegister from "../../public/images/projects/sporthub/app-register.jpg";
import barilgaStorefront from "../../public/images/projects/barilgahub/storefront.jpg";
import barilgaProduct from "../../public/images/projects/barilgahub/product.jpg";
import barilgaTrack from "../../public/images/projects/barilgahub/track.jpg";
import barilgaMobile from "../../public/images/projects/barilgahub/mobile.jpg";
import appWorld from "../../public/images/projects/sparkxp/app-world.jpg";
import appLevel from "../../public/images/projects/sparkxp/app-level.jpg";
import appLesson from "../../public/images/projects/sparkxp/app-lesson.jpg";
import appProfile from "../../public/images/projects/sparkxp/app-profile.jpg";
import appHomeLight from "../../public/images/projects/sparkxp/app-home-light.webp";
import appHomeDark from "../../public/images/projects/sparkxp/app-home-dark.webp";
import appBuddy from "../../public/images/projects/sparkxp/app-buddy.webp";
import sparkLanding from "../../public/images/projects/sparkxp/web-landing.webp";
import sparkLessons from "../../public/images/projects/sparkxp/admin-lessons.jpg";
import sparkWords from "../../public/images/projects/sparkxp/admin-words.jpg";
import sparkQuizzes from "../../public/images/projects/sparkxp/admin-quizzes.jpg";
import sparkBuddy from "../../public/images/projects/sparkxp/admin-buddy.jpg";
import gymAppHome from "../../public/images/projects/gymhub/app-home.jpg";
import gymAppSearch from "../../public/images/projects/gymhub/app-search.jpg";
import gymAppGym from "../../public/images/projects/gymhub/app-gym.jpg";
import gymAppMembership from "../../public/images/projects/gymhub/app-membership.jpg";
import gymAppOnboarding from "../../public/images/projects/gymhub/app-onboarding.jpg";
import gymAppLogin from "../../public/images/projects/gymhub/app-login.jpg";
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
import bikeMap from "../../public/images/projects/bikemap/map.jpg";
import bikeSafeRoute from "../../public/images/projects/bikemap/safe-route.jpg";
import bikeHeatmap from "../../public/images/projects/bikemap/heatmap.jpg";
import bikeGpx from "../../public/images/projects/bikemap/gpx-import.jpg";
import bikeSegmentEdit from "../../public/images/projects/bikemap/segment-edit.jpg";
import bikeStats from "../../public/images/projects/bikemap/stats.jpg";
import bikePoi from "../../public/images/projects/bikemap/poi.jpg";
import bikeProfile from "../../public/images/projects/bikemap/profile.jpg";
import bikeLogin from "../../public/images/projects/bikemap/login.jpg";
import bikeAdmin from "../../public/images/projects/bikemap/admin.jpg";
import bikeMobile from "../../public/images/projects/bikemap/mobile.jpg";

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
  /** Optional interactive 3D model shown in its own section (a rigged GLB under /public). */
  avatar?: { src: string; caption: L };
};

export const projects: Project[] = [
  {
    slug: "gymhub",
    number: "01",
    title: "GymHub",
    year: "2026",
    category: { en: "Fitness membership", mn: "Фитнесийн гишүүнчлэл" },
    status: { kind: "live", label: { en: "Live", mn: "Ажиллаж байна" } },
    description: {
      en: "Mongolia's multi-gym membership network — one membership across 30+ fitness clubs. I shipped a completely new interface for gymhub.mn, plus new membership packages, upgrades, an HR portal for companies and admin tooling.",
      mn: "Монголын олон фитнесийг нэгтгэсэн гишүүнчлэлийн сүлжээ — 30 гаруй клубт нэг гишүүнчлэлээр. Би gymhub.mn-ийн цоо шинэ интерфейс, шинэ багцууд, багц ахиулах боломж, байгууллагын HR портал болон админы хэрэгслүүдийг хөгжүүлж гаргасан.",
    },
    role: { en: "Full-stack developer · Team member", mn: "Full-stack хөгжүүлэгч · Багийн гишүүн" },
    team: {
      en: "3 contributors across the member site and admin dashboard — 20 of my pull requests merged.",
      mn: "Гишүүдийн сайт, админ самбар дээр 3 хүн ажилласан — миний 20 pull request merge хийгдсэн.",
    },
    stack: ["React", "Vite", "Next.js", "Flutter", "TypeScript", "Tailwind CSS", "Supabase", "QPay", "Vercel"],
    links: { live: "https://gymhub.mn", liveLabel: { en: "Visit gymhub.mn", mn: "gymhub.mn нээх" } },
    visual: "terminal",
    metrics: [
      { value: 30, suffix: "+", label: { en: "partner clubs (gymhub.mn)", mn: "хамтрагч клуб (gymhub.mn)" } },
      { value: 20, label: { en: "merged pull requests", mn: "merge хийгдсэн PR" } },
      { value: 2, label: { en: "apps: site + admin", mn: "апп: сайт + админ" } },
      { value: 3, label: { en: "contributors", mn: "оролцогч" } },
    ],
    overview: {
      summary: {
        en: "GymHub brings fitness clubs across Mongolia under one membership. Members buy packages on gymhub.mn and train at partner clubs; staff run plans, organizations and members from a Next.js admin dashboard on Supabase.",
        mn: "GymHub нь Монголын фитнес клубуудыг нэг гишүүнчлэлд нэгтгэдэг. Гишүүд gymhub.mn дээр багц авч, хамтрагч клубуудад хичээллэдэг; ажилтнууд багц, байгууллага, гишүүдийг Supabase дээрх Next.js админ самбараас удирддаг.",
      },
      problem: {
        en: "The business needed new products and sales channels — a new package tier, upgrades, company-sponsored memberships and weekly visit limits — without breaking how existing members' status was calculated.",
        mn: "Бизнест шинэ бүтээгдэхүүн, борлуулалтын суваг хэрэгтэй байлаа: шинэ түвшний багц, багц ахиулалт, байгууллагаас төлдөг гишүүнчлэл, долоо хоногийн зочлолтын хязгаар. Гэхдээ одоо байгаа гишүүдийн төлөвийн тооцоог алдагдуулахгүй байх ёстой байв.",
      },
      solution: {
        en: "I added the GymGo package with its own tier, a package-upgrade flow and admin-managed promo banners; an HR portal with an admin HR catalog and invite links that lock the organization at sign-up; weekly visit limits with clear messaging; video lessons and office packages; and fixed membership status to use Ulaanbaatar time.",
        mn: "Тусдаа түвшинтэй GymGo багц, багц ахиулах урсгал, админаас удирддаг промо баннер; админы HR каталогтой HR портал, бүртгүүлэх үед байгууллагыг түгжих урилгын холбоос; ойлгомжтой мэдэгдэлтэй долоо хоногийн зочлолтын хязгаар; видео хичээл, оффисын багцыг нэмсэн. Мөн гишүүнчлэлийн төлөвийг Улаанбаатарын цагаар зөв тооцдог болгосон.",
      },
      result: {
        en: "All 20 pull requests shipped to production on gymhub.mn and the admin dashboard between August and September 2026.",
        mn: "20 pull request бүгд 2026 оны 8–9-р сард gymhub.mn болон админ самбарт production-д гарсан.",
      },
    },
    responsibilities: [
      { en: "A completely new interface for gymhub.mn, designed and shipped to production", mn: "gymhub.mn-ийн цоо шинэ интерфейсийг зохиож, production-д гаргасан" },
      { en: "GymGo package tier and the package-upgrade flow", mn: "GymGo багцын түвшин, багц ахиулах урсгал" },
      { en: "HR portal for companies with an admin HR catalog and backend", mn: "Админ HR каталог, backend-тэй байгууллагын HR портал" },
      { en: "Organization invite links that lock the company at sign-up", mn: "Бүртгүүлэх үед байгууллагыг түгжих урилгын холбоос" },
      { en: "Weekly visit limits, video lessons, office packages and QPay token fixes", mn: "Долоо хоногийн зочлолтын хязгаар, видео хичээл, оффисын багц, QPay токены засвар" },
      { en: "Admin tools: moderators, member accounts and marking gyms as full", mn: "Админ хэрэгсэл: модератор, гишүүний бүртгэл, клубыг дүүрсэн гэж тэмдэглэх" },
    ],
    modules: [
      { title: { en: "Member site", mn: "Гишүүдийн сайт" }, text: { en: "React + Vite on gymhub.mn: packages, sign-up, upgrades and the HR portal at /hr.", mn: "gymhub.mn дээрх React + Vite сайт: багц, бүртгэл, ахиулалт, /hr дахь HR портал." } },
      { title: { en: "Admin dashboard", mn: "Админ самбар" }, text: { en: "Next.js 16 + Tailwind on Supabase for plans, gyms, organizations and members.", mn: "Supabase дээрх Next.js 16 + Tailwind: багц, клуб, байгууллага, гишүүд." } },
      { title: { en: "HR portal", mn: "HR портал" }, text: { en: "Companies invite employees; the invite link fixes their organization.", mn: "Байгууллага ажилтнаа урьж, урилгын холбоос нь тухайн байгууллагыг тогтооно." } },
      { title: { en: "Packages & payments", mn: "Багц ба төлбөр" }, text: { en: "Tiered packages, upgrades, promo banners and QPay checkout.", mn: "Түвшинтэй багц, ахиулалт, промо баннер, QPay төлбөр." } },
    ],
    highlights: [
      { title: { en: "A brand-new interface", mn: "Цоо шинэ интерфейс" }, text: { en: "I rebuilt gymhub.mn with a completely new interface — in dark and light themes, on desktop and mobile — and shipped it to production.", mn: "gymhub.mn-ийг харанхуй, гэрэлтэй горимтой, desktop болон мобайлд зориулсан цоо шинэ интерфейстэйгээр дахин бүтээж, production-д гаргасан." } },
      { title: { en: "Timezone-correct status", mn: "Цагийн бүсийн зөв тооцоо" }, text: { en: "Membership status is computed in Ulaanbaatar time, so members don't expire a day early.", mn: "Гишүүнчлэлийн төлөвийг Улаанбаатарын цагаар тооцдог тул гишүүнчлэл нэг өдрөөр эрт дуусахгүй." } },
      { title: { en: "Locked invite sign-up", mn: "Түгжээтэй урилга" }, text: { en: "Employees joining via an HR invite can't pick the wrong organization.", mn: "HR урилгаар бүртгүүлж буй ажилтан буруу байгууллага сонгох боломжгүй." } },
      { title: { en: "Weekly visit limits", mn: "Долоо хоногийн хязгаар" }, text: { en: "Seven-day visit rights are enforced and explained to members in the app.", mn: "Долоо хоногийн зочлох эрхийн хязгаарыг мөрдүүлж, гишүүдэд апп дотор ойлгомжтой тайлбарладаг." } },
      { title: { en: "Upgrades without churn", mn: "Саадгүй ахиулалт" }, text: { en: "Members upgrade packages in place, including from the new GymGo tier.", mn: "Гишүүд, тэр дундаа шинэ GymGo багцтай хэрэглэгчид, багцаа шууд ахиулах боломжтой." } },
    ],
    shots: [
      { src: gymAppHome, label: { en: "Home", mn: "Нүүр" }, group: { en: "App · Flutter", mn: "Апп · Flutter" }, url: "GymHub · iOS", device: "mobile" },
      { src: gymAppSearch, label: { en: "Gym search", mn: "Фитнес хайх" }, group: { en: "App · Flutter", mn: "Апп · Flutter" }, url: "GymHub · iOS", device: "mobile" },
      { src: gymAppGym, label: { en: "Gym details", mn: "Фитнесийн дэлгэрэнгүй" }, group: { en: "App · Flutter", mn: "Апп · Flutter" }, url: "GymHub · iOS", device: "mobile" },
      { src: gymAppMembership, label: { en: "Membership plans", mn: "Гишүүнчлэлийн багц" }, group: { en: "App · Flutter", mn: "Апп · Flutter" }, url: "GymHub · iOS", device: "mobile" },
      { src: gymAppOnboarding, label: { en: "Onboarding", mn: "Танилцуулга" }, group: { en: "App · Flutter", mn: "Апп · Flutter" }, url: "GymHub · iOS", device: "mobile" },
      { src: gymAppLogin, label: { en: "Sign in", mn: "Нэвтрэх" }, group: { en: "App · Flutter", mn: "Апп · Flutter" }, url: "GymHub · iOS", device: "mobile" },
      { src: gymDarkHero, label: { en: "Landing · Dark", mn: "Нүүр · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn", device: "desktop" },
      { src: gymDarkCompany, label: { en: "For companies · Dark", mn: "Байгууллагад · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#company", device: "desktop" },
      { src: gymDarkPartners, label: { en: "Partner gyms · Dark", mn: "Хамтрагч клубууд · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#partners", device: "desktop" },
      { src: gymDarkFaq, label: { en: "FAQ · Dark", mn: "Асуулт хариулт · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#faq", device: "desktop" },
      { src: gymDarkContact, label: { en: "Contact · Dark", mn: "Холбоо барих · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn/#contact", device: "desktop" },
      { src: gymDarkMobile, label: { en: "Mobile · Dark", mn: "Мобайл · Харанхуй" }, group: { en: "Dark mode", mn: "Харанхуй горим" }, url: "gymhub.mn", device: "mobile" },
      { src: gymLightHero, label: { en: "Landing · Light", mn: "Нүүр · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn", device: "desktop" },
      { src: gymLightCompany, label: { en: "For companies · Light", mn: "Байгууллагад · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#company", device: "desktop" },
      { src: gymLightPartners, label: { en: "Partner gyms · Light", mn: "Хамтрагч клубууд · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#partners", device: "desktop" },
      { src: gymLightFaq, label: { en: "FAQ · Light", mn: "Асуулт хариулт · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#faq", device: "desktop" },
      { src: gymLightContact, label: { en: "Contact · Light", mn: "Холбоо барих · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn/#contact", device: "desktop" },
      { src: gymLightMobile, label: { en: "Mobile · Light", mn: "Мобайл · Гэрэлтэй" }, group: { en: "Light mode", mn: "Гэрэлтэй горим" }, url: "gymhub.mn", device: "mobile" },
    ],
  },
  {
    slug: "sparkxp",
    number: "02",
    title: "SparkXP",
    year: "2026",
    category: { en: "EdTech · AI", mn: "Боловсрол · AI" },
    status: { kind: "team", label: { en: "Team product", mn: "Багийн бүтээгдэхүүн" } },
    description: {
      en: "Gamified English-learning app for Mongolian students and schools. I built the AI Buddy — a 3D avatar that talks back with real-time lip-sync — and much of the mobile experience.",
      mn: "Монголын сурагч, сургуулиудад зориулсан, тоглоомжуулсан англи хэл сурах апп. Бодит цагийн уруулын синктэйгээр хариу ярьдаг 3D аватар болох AI Buddy болон мобайл аппын томоохон хэсгийг би хөгжүүлсэн.",
    },
    role: { en: "Mobile & AI developer", mn: "Мобайл ба AI хөгжүүлэгч" },
    team: {
      en: "3-person team at Aether Tech Core LLC — 34 of my pull requests merged.",
      mn: "Aether Tech Core LLC-ийн 3 хүний баг — миний 34 pull request merge хийгдсэн.",
    },
    stack: ["React Native", "Expo", "TypeScript", "NestJS", "PostgreSQL", "Redis", "Gemini", "Azure Speech"],
    links: {
      live: "https://spark-xp-web.vercel.app",
      liveLabel: { en: "Visit the landing page", mn: "Танилцуулга хуудас нээх" },
      source: "https://github.com/usukh6ayar/SparkXP",
    },
    visual: "buddy",
    avatar: {
      src: "/models/spark-fox.glb",
      caption: {
        en: "Spark — the app's own rigged 3D avatar. Move your cursor and he follows; click him and he hops.",
        mn: "Spark — аппын өөрийн rig хийсэн 3D аватар. Курсороо хөдөлгөхөд дагаж харж, дарахад үсэрнэ.",
      },
    },
    shotsNote: {
      en: "Mobile app and admin dashboard run locally on demo data — no production data is shown.",
      mn: "Мобайл апп, админ самбарын зургийг демо өгөгдөлтэйгээр локал орчинд авсан — production өгөгдөл ороогүй.",
    },
    metrics: [
      { value: 58, suffix: "%", label: { en: "faster AI Buddy replies", mn: "хурдассан AI Buddy хариу" } },
      { value: 34, label: { en: "merged pull requests", mn: "merge хийгдсэн PR" } },
      { value: 34, label: { en: "ARKit blendshapes for lip-sync", mn: "уруулын синкийн ARKit blendshape" } },
      { value: 3, label: { en: "people on the team", mn: "хүний баг" } },
    ],
    overview: {
      summary: {
        en: "SparkXP teaches English through lessons, reading, quizzes and spaced-repetition vocabulary, wrapped in XP, streaks and leaderboards. Teachers run classes and assignments; the AI Buddy gives students someone to practise speaking with.",
        mn: "SparkXP нь хичээл, уншлага, сорил, давтлагын аргаар үг цээжлүүлэх замаар англи хэл заадаг бөгөөд XP, streak, leaderboard зэрэг тоглоомын элементтэй. Багш нар анги, даалгавраа удирдаж, AI Buddy сурагчдад ярианы дадлага хийх хамтрагч болдог.",
      },
      problem: {
        en: "Speaking practice is the hardest part of learning English, and the first AI Buddy felt slow — a spoken reply took about 8.6 seconds end to end, which breaks the feeling of a conversation.",
        mn: "Ярианы дадлага бол англи хэл сурахын хамгийн хэцүү хэсэг. Анхны AI Buddy удаан байсан — нэг дуут хариу эхнээс дуустал 8.6 секунд орчим үргэлжилдэг нь жинхэнэ ярианы мэдрэмжийг алдагдуулдаг байв.",
      },
      solution: {
        en: "I replaced the emoji buddies with a 3D GLB avatar driven by 34 ARKit blendshapes for lip-sync and emotion, synced to Azure HD Voice visemes, and moved speech to Gemini STT/TTS with streamed audio. Then I cut the critical path in five phases — loading the avatar once, removing eight round trips and adding an STT timeout.",
        mn: "Emoji buddy-г 3D GLB аватараар сольсон: уруулын синк, сэтгэл хөдлөлийг 34 ARKit blendshape удирдаж, Azure HD Voice viseme-тэй тааруулдаг. Яриаг урсгалт аудиотой Gemini STT/TTS руу шилжүүлсэн. Дараа нь эгзэгтэй замыг таван шатаар богиносгосон — аватарыг нэг л удаа ачаалж, найман round trip хасаж, STT timeout нэмсэн.",
      },
      result: {
        en: "AI Buddy reply latency dropped from 8,565 ms to 3,583 ms (−58%). Alongside it I shipped speaking exercises, gamification, an island world map, the v2 mobile redesign and an app-wide light/dark theme.",
        mn: "AI Buddy-ийн хариу өгөх хугацаа 8,565 мс-ээс 3,583 мс болж буурсан (−58%). Мөн ярианы дасгал, тоглоомжуулалт, арлын ертөнцийн газрын зураг, мобайл аппын v2 шинэчлэл, апп даяарх гэрэл/харанхуй горимыг гаргасан.",
      },
    },
    responsibilities: [
      { en: "AI Buddy: 3D avatar, lip-sync, emotions and the speech pipeline", mn: "AI Buddy: 3D аватар, уруулын синк, сэтгэл хөдлөл, яриа боловсруулах урсгал" },
      { en: "Latency work that took voice replies from 8.6 s to 3.6 s", mn: "Дуут хариуг 8.6 с-ээс 3.6 с болгосон хурдны сайжруулалт" },
      { en: "Mobile redesign v2: home, profile, lessons and the island level map", mn: "Мобайл аппын v2 шинэчлэл: нүүр, профайл, хичээл, арлын түвшний газрын зураг" },
      { en: "Gamification, analytics, Buddy Shop and speaking exercises", mn: "Тоглоомжуулалт, аналитик, Buddy Shop, ярианы дасгал" },
      { en: "Teacher features, responsive QA passes and admin tooling", mn: "Багшийн боломжууд, responsive QA, админы хэрэгслүүд" },
    ],
    modules: [
      { title: { en: "Mobile · Expo", mn: "Мобайл · Expo" }, text: { en: "Student and teacher app: lessons, quizzes, vocabulary, leaderboards and the AI Buddy.", mn: "Сурагч, багшийн апп: хичээл, сорил, үгсийн сан, leaderboard, AI Buddy." } },
      { title: { en: "AI Buddy", mn: "AI Buddy" }, text: { en: "3D avatar with viseme lip-sync, Gemini STT/TTS and streamed audio.", mn: "Viseme-д суурилсан уруулын синк, Gemini STT/TTS, урсгалт аудиотой 3D аватар." } },
      { title: { en: "API · NestJS", mn: "API · NestJS" }, text: { en: "Auth, lessons, gamification and limits on PostgreSQL and Redis.", mn: "PostgreSQL, Redis дээрх нэвтрэлт, хичээл, тоглоомжуулалт, хязгаарлалт." } },
      { title: { en: "Admin", mn: "Админ" }, text: { en: "Content, the words AI pipeline, buddies and usage limits.", mn: "Контент, үгсийн AI pipeline, buddy, хэрэглээний хязгаар." } },
    ],
    highlights: [
      { title: { en: "−58% voice latency", mn: "Дуут хариу −58%" }, text: { en: "Measured phase by phase: 8,565 ms → 3,583 ms for a full spoken reply.", mn: "Шат бүрээр хэмжсэн: бүтэн дуут хариу 8,565 мс → 3,583 мс." } },
      { title: { en: "Real lip-sync", mn: "Бодит уруулын синк" }, text: { en: "34 ARKit blendshapes follow Azure HD Voice visemes, so the mouth matches the words.", mn: "34 ARKit blendshape нь Azure HD Voice viseme-ийг дагадаг тул амны хөдөлгөөн үгтэй яг таарна." } },
      { title: { en: "Lighter 3D", mn: "Хөнгөн 3D" }, text: { en: "The GLB avatar is downloaded once and its render was slimmed for low-end phones.", mn: "GLB аватарыг ганц удаа татаж, сул үзүүлэлттэй утсанд зориулж рендерийг хөнгөвчилсөн." } },
      { title: { en: "Every screen size", mn: "Бүх дэлгэцийн хэмжээ" }, text: { en: "A QA pass made every screen responsive and added a reactive language and theme setting.", mn: "QA шалгалтаар бүх дэлгэцийг responsive болгож, шууд солигддог хэл, горимын тохиргоо нэмсэн." } },
    ],
    shots: [
      { src: appHomeLight, label: { en: "Home · Light", mn: "Нүүр · Гэрэлтэй" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appHomeDark, label: { en: "Home · Dark", mn: "Нүүр · Харанхуй" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appBuddy, label: { en: "AI Buddy chat", mn: "AI хамтрагчтай ярилцах" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appWorld, label: { en: "Lesson world map", mn: "Хичээлийн ертөнц" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appLevel, label: { en: "Level journey", mn: "Түвшний аялал" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appLesson, label: { en: "Lesson", mn: "Хичээл" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: appProfile, label: { en: "Profile & stats", mn: "Профайл, статистик" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SparkXP app", device: "mobile" },
      { src: sparkLanding, label: { en: "Landing page", mn: "Танилцуулга хуудас" }, group: { en: "Landing page", mn: "Танилцуулга хуудас" }, url: "spark-xp-web.vercel.app", device: "desktop" },
      { src: sparkLessons, label: { en: "Lessons", mn: "Хичээлүүд" }, group: { en: "Admin site", mn: "Админ сайт" }, url: "admin · /lessons", device: "desktop" },
      { src: sparkWords, label: { en: "Word bank", mn: "Үгсийн сан" }, group: { en: "Admin site", mn: "Админ сайт" }, url: "admin · /words", device: "desktop" },
      { src: sparkQuizzes, label: { en: "Quizzes", mn: "Сорил" }, group: { en: "Admin site", mn: "Админ сайт" }, url: "admin · /quizzes", device: "desktop" },
      { src: sparkBuddy, label: { en: "AI Buddy", mn: "AI Buddy" }, group: { en: "Admin site", mn: "Админ сайт" }, url: "admin · /buddy", device: "desktop" },
    ],
  },
  {
    slug: "sporthub",
    number: "03",
    title: "SportHub",
    year: "2026",
    category: { en: "Sports platform", mn: "Спортын платформ" },
    status: { kind: "live", label: { en: "Live", mn: "Ажиллаж байна" } },
    description: {
      en: "Multi-sport membership, booking and wallet platform for Mongolia — GymHub, moved in full from Supabase onto SportHub's own backend on Railway, with one account across gyms, yoga and future sports.",
      mn: "Монголд зориулсан олон төрлийн спортын гишүүнчлэл, захиалга, хэтэвчийн платформ. GymHub-ийг Supabase-ээс Railway дээрх SportHub-ийн өөрийн backend руу бүрэн шилжүүлж, фитнес, йога болон цаашид нэмэгдэх спортуудыг нэг бүртгэлээр ашигладаг болгосон.",
    },
    role: { en: "Lead developer · Full-stack", mn: "Ахлах хөгжүүлэгч · Full-stack" },
    team: {
      en: "3-person team — I set the architecture and wrote 85 of the 87 commits in the SportHub repository.",
      mn: "3 хүний баг — архитектурыг би тодорхойлж, SportHub repository-ийн 87 commit-оос 85-ыг нь бичсэн.",
    },
    stack: ["NestJS", "React", "Flutter", "Next.js", "TypeScript", "PostgreSQL", "Railway", "TanStack Query", "Riverpod"],
    links: { live: "https://sporthub.mn", liveLabel: { en: "Visit sporthub.mn", mn: "sporthub.mn нээх" } },
    visual: "terminal",
    metrics: [
      { value: 4, label: { en: "apps in one workspace", mn: "апп нэг workspace-д багтсан" } },
      { value: 87, label: { en: "commits", mn: "commit" } },
      { value: 14, label: { en: "admin sections", mn: "админ хэсэг" } },
      { value: 2, label: { en: "languages (MN/EN)", mn: "хэл (MN/EN)" } },
    ],
    overview: {
      summary: {
        en: "SportHub is where GymHub now lives. I moved GymHub off Supabase and onto SportHub's NestJS backend and PostgreSQL on Railway, then built it out for more than one sport: it launches with Gym and Yoga, and swimming, tennis or football can be added without a platform redesign. Members use the web and Flutter apps; staff use an admin dashboard.",
        mn: "GymHub одоо SportHub дотор ажилладаг. Би GymHub-ийг Supabase-ээс Railway дээрх SportHub-ийн NestJS backend, PostgreSQL руу шилжүүлж, олон спортод зориулж өргөжүүлсэн: фитнес, йогоор эхэлж байгаа бөгөөд усан сэлэлт, теннис, хөл бөмбөг зэргийг платформыг дахин зохион бүтээлгүйгээр нэмж болно. Гишүүд веб болон Flutter апп, ажилтнууд админ самбар ашигладаг.",
      },
      problem: {
        en: "GymHub served a single sport and ran on Supabase. Members needed one account and one wallet across sports and facilities, and the whole of GymHub had to move onto the new platform with existing memberships keeping their rights.",
        mn: "GymHub ганцхан спортод зориулагдсан бөгөөд Supabase дээр ажилладаг байсан. Гишүүдэд бүх спорт, байгууллагад хүчинтэй нэг бүртгэл, нэг хэтэвч хэрэгтэй байв. Мөн GymHub бүхэлдээ шинэ платформ руу шилжихдээ одоо байгаа гишүүнчлэлүүдийн эрхийг хадгалах ёстой байлаа.",
      },
      solution: {
        en: "A fresh npm-workspace monorepo where the NestJS backend is the only place business logic lives. Identity uses opaque bearer sessions with deny-by-default RBAC; entitlements and the wallet are append-only ledgers whose balances are derived, never stored. Planned APIs are answered by contract mocks so web, mobile and admin move in parallel.",
        mn: "Бизнес логик зөвхөн NestJS backend-д байрладаг шинэ npm-workspace monorepo. Нэвтрэлт нь opaque bearer session, deny-by-default RBAC дээр суурилна; эрх болон хэтэвч нь append-only ledger бөгөөд үлдэгдлийг хадгалдаггүй, түүхээс тооцоолж гаргадаг. Төлөвлөсөн API-уудад contract mock хариу өгдөг тул веб, мобайл, админыг зэрэгцүүлэн хөгжүүлдэг.",
      },
      result: {
        en: "GymHub has been moved in full from Supabase to SportHub on Railway. The backend, React web app, Flutter app and Next.js admin UI are implemented, and the web preview is deployed on Vercel.",
        mn: "GymHub-ийг Supabase-ээс Railway дээрх SportHub руу бүрэн шилжүүлсэн. Backend, React веб апп, Flutter апп, Next.js админ UI бүгд хэрэгжиж, вебийн preview хувилбар Vercel дээр байршсан.",
      },
    },
    responsibilities: [
      { en: "Monorepo architecture, coding rules and technical documentation", mn: "Monorepo архитектур, кодын дүрэм, техникийн баримт бичиг" },
      { en: "NestJS backend: identity, RBAC, entitlement and wallet ledgers, top-ups", mn: "NestJS backend: нэвтрэлт, RBAC, эрх ба хэтэвчийн ledger, цэнэглэлт" },
      { en: "React member web app with MN/EN, search, booking and wallet flows", mn: "MN/EN хэлтэй React веб апп: хайлт, захиалга, хэтэвчийн урсгал" },
      { en: "Flutter mobile app with five tabs and secure session storage", mn: "Таван табтай, аюулгүй session хадгалалттай Flutter апп" },
      { en: "Moving GymHub in full from Supabase to SportHub on Railway, plus the Next.js admin dashboard", mn: "GymHub-ийг Supabase-ээс Railway дээрх SportHub руу бүрэн шилжүүлэх, Next.js админ самбар" },
    ],
    modules: [
      { title: { en: "Backend · NestJS", mn: "Backend · NestJS" }, text: { en: "The single writer of business data: sessions, RBAC, ledgers and server-verified top-ups.", mn: "Бизнес өгөгдлийг бичих цорын ганц хэсэг: session, RBAC, ledger, сервер талд баталгаажуулдаг цэнэглэлт." } },
      { title: { en: "Web · React", mn: "Веб · React" }, text: { en: "Persona-aware home, sport and club search, booking with cancel/refund, wallet and history.", mn: "Хэрэглэгчийн төрөлд тохирсон нүүр хуудас, спорт ба клуб хайлт, цуцлах/буцаалттай захиалга, хэтэвч, түүх." } },
      { title: { en: "Mobile · Flutter", mn: "Мобайл · Flutter" }, text: { en: "Home, Search, Schedule, Wallet and Profile tabs with Riverpod and go_router.", mn: "Riverpod, go_router-тэй Нүүр, Хайлт, Хуваарь, Хэтэвч, Профайл табууд." } },
      { title: { en: "Admin · Next.js", mn: "Админ · Next.js" }, text: { en: "Overview plus 14 section pages in MN/EN with light and dark themes.", mn: "Тойм ба 14 хэсгийн хуудастай, MN/EN хэлтэй, гэрэл/харанхуй горимтой самбар." } },
    ],
    highlights: [
      { title: { en: "Append-only ledgers", mn: "Append-only ledger" }, text: { en: "Wallet and entitlements are never edited in place — every change is a new entry and the balance is derived from history.", mn: "Хэтэвч, эрхийн бичлэгийг хэзээ ч засварладаггүй — өөрчлөлт бүр шинэ бичлэг болж, үлдэгдэл түүхээс тооцоологдоно." } },
      { title: { en: "Deny-by-default RBAC", mn: "Deny-by-default RBAC" }, text: { en: "Every endpoint is closed unless a role explicitly allows it.", mn: "Тухайн үүрэгт тодорхой зөвшөөрөл олгоогүй бол endpoint бүр хаалттай." } },
      { title: { en: "Supabase → Railway", mn: "Supabase → Railway" }, text: { en: "GymHub left Supabase entirely: its data and features now run on SportHub's NestJS backend and PostgreSQL on Railway.", mn: "GymHub Supabase-ээс бүрэн салсан: түүний өгөгдөл, боломжууд одоо Railway дээрх SportHub-ийн NestJS backend, PostgreSQL дээр ажилладаг." } },
      { title: { en: "Contract-first mocks", mn: "Contract-first mock" }, text: { en: "MSW and a mock server answer planned APIs so every client is built against the real contract.", mn: "MSW болон mock server төлөвлөсөн API-уудад хариу өгдөг тул клиент бүрийг бодит contract-ын дагуу хөгжүүлдэг." } },
    ],
    shots: [
      { src: sporthubWebHome, label: { en: "Home", mn: "Нүүр" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app", device: "desktop" },
      { src: sporthubWebClubs, label: { en: "Clubs & map", mn: "Клубууд ба газрын зураг" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/clubs", device: "desktop" },
      { src: sporthubAdminLogin, label: { en: "Admin sign-in", mn: "Админ нэвтрэх" }, group: { en: "Admin dashboard", mn: "Админ самбар" }, url: "SportHub Admin", device: "desktop" },
      { src: sporthubWebClub, label: { en: "Club page", mn: "Клубын хуудас" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/clubs/…", device: "desktop" },
      { src: sporthubWebMembership, label: { en: "My membership", mn: "Миний гишүүнчлэл" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/membership", device: "desktop" },
      { src: sporthubWebWallet, label: { en: "Wallet", mn: "Хэтэвч" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/wallet", device: "desktop" },
      { src: sporthubWebLogin, label: { en: "Sign in", mn: "Нэвтрэх" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/login", device: "desktop" },
      { src: sporthubWebRegister, label: { en: "Register", mn: "Бүртгүүлэх" }, group: { en: "Web", mn: "Веб" }, url: "sporthub-eight.vercel.app/register", device: "desktop" },
      { src: sporthubAppHome, label: { en: "Home", mn: "Нүүр" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppSearch, label: { en: "Sport search", mn: "Спорт хайх" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppMap, label: { en: "Clubs on the map", mn: "Газрын зураг дээрх клубууд" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppSport, label: { en: "Sport page", mn: "Спортын хуудас" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppClub, label: { en: "Club page", mn: "Клубын хуудас" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppMembership, label: { en: "My membership", mn: "Миний гишүүнчлэл" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppWallet, label: { en: "Wallet", mn: "Хэтэвч" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppLogin, label: { en: "Sign in", mn: "Нэвтрэх" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
      { src: sporthubAppRegister, label: { en: "Register", mn: "Бүртгүүлэх" }, group: { en: "Mobile app", mn: "Мобайл апп" }, url: "SportHub · iOS", device: "mobile" },
    ],
  },
  {
    slug: "barilgahub",
    number: "04",
    title: "BarilgaHUB",
    year: "2026",
    category: { en: "E-commerce marketplace", mn: "Цахим худалдаа" },
    status: { kind: "live", label: { en: "Live", mn: "Ажиллаж байна" } },
    description: {
      en: "Multi-supplier construction-materials marketplace — compare price, stock and delivery from several suppliers on one product page, with separate buyer, supplier and admin apps.",
      mn: "Олон нийлүүлэгчтэй барилгын материалын marketplace — хэд хэдэн нийлүүлэгчийн үнэ, үлдэгдэл, хүргэлтийг нэг барааны хуудсан дээр харьцуулна. Худалдан авагч, нийлүүлэгч, админд тус бүр тусдаа апптай.",
    },
    role: { en: "Lead developer · Full-stack", mn: "Ахлах хөгжүүлэгч · Full-stack" },
    team: {
      en: "2 contributors — I wrote 48 of the 64 commits, including the architecture and backend.",
      mn: "2 оролцогч — 64 commit-оос 48-ыг нь би бичсэн, үүнд архитектур болон backend багтана.",
    },
    stack: ["NestJS", "Prisma", "PostgreSQL", "Next.js", "BullMQ", "Redis", "Meilisearch", "S3", "Docker", "Railway"],
    links: {
      live: "https://100ail.vercel.app",
      liveLabel: { en: "Visit site", mn: "Вебсайт нээх" },
      source: "https://github.com/Batsaikhann/100ail",
    },
    visual: "blueprint",
    metrics: [
      { value: 2136, label: { en: "products in the live catalog", mn: "бараа ажиллаж буй каталогт" } },
      { value: 3, label: { en: "deployed web apps", mn: "байршсан веб апп" } },
      { value: 84, label: { en: "automated tests", mn: "автомат тест" } },
      { value: 2, suffix: "%", label: { en: "commission model", mn: "шимтгэлийн загвар" } },
    ],
    overview: {
      summary: {
        en: "BarilgaHUB puts many construction-material suppliers behind one storefront. Buyers compare offers for the same product, suppliers manage their own price lists, and an admin panel runs the marketplace.",
        mn: "BarilgaHUB нь барилгын материалын олон нийлүүлэгчийг нэг дэлгүүрт нэгтгэдэг. Худалдан авагч нэг барааны саналуудыг харьцуулж, нийлүүлэгч үнийн жагсаалтаа өөрөө удирдаж, marketplace-ийг админ панелаас ажиллуулна.",
      },
      problem: {
        en: "Buying materials usually means calling store after store to compare price, stock and delivery. Suppliers had no simple way to keep large price lists current in one place.",
        mn: "Материал худалдан авахдаа үнэ, үлдэгдэл, хүргэлтийг харьцуулахын тулд ихэвчлэн дэлгүүр бүр рүү нэг нэгээр залгах шаардлагатай болдог. Нийлүүлэгчдэд том үнийн жагсаалтаа нэг дор шинэчилж байх энгийн арга байгаагүй.",
      },
      solution: {
        en: "A NestJS + Prisma modular monolith where products are separated from supplier offers, so one page compares every supplier. Materials use dynamic attributes, search runs on Meilisearch, suppliers bulk-import Excel/CSV with a preview, and media goes through BullMQ queues to S3 with presigned URLs.",
        mn: "Бараа болон нийлүүлэгчийн саналыг салгасан NestJS + Prisma modular monolith — ингэснээр нэг хуудсан дээр бүх нийлүүлэгчийг харьцуулах боломжтой. Материалууд dynamic attribute ашиглаж, хайлт Meilisearch дээр ажиллана. Нийлүүлэгчид Excel/CSV файлаа урьдчилан харж бөөнөөр импортолдог бол медиа файлууд BullMQ queue-ээр дамжин presigned URL-аар S3-д хадгалагдана.",
      },
      result: {
        en: "Live: the storefront, supplier system and admin panel run on Vercel against a Railway backend. The catalog holds 2,136 real products imported from the barilga.mn public catalog, covered by 59 unit and 25 end-to-end tests.",
        mn: "Ажиллаж байна: дэлгүүр, нийлүүлэгчийн систем, админ панел Vercel дээр, backend нь Railway дээр байршсан. Каталогт barilga.mn-ийн нийтийн каталогаас импортолсон 2,136 бодит бараа бий бөгөөд 59 unit, 25 end-to-end тестээр хамгаалагдсан.",
      },
    },
    responsibilities: [
      { en: "Marketplace architecture and data model (product vs. offer split)", mn: "Marketplace-ийн архитектур, өгөгдлийн загвар (бараа, саналыг салгасан)" },
      { en: "NestJS backend modules, auth, queues and S3 media pipeline", mn: "NestJS backend модуль, нэвтрэлт, queue, S3 медиа урсгал" },
      { en: "Catalog importer: scraper → images → database import", mn: "Каталог импорт: scraper → зураг → өгөгдлийн сан" },
      { en: "Docker, Railway backend and three Vercel frontends", mn: "Docker, Railway backend, гурван Vercel frontend" },
    ],
    modules: [
      { title: { en: "Storefront", mn: "Худалдан авагчийн веб" }, text: { en: "Search, filters, offer comparison, cart, orders and delivery tracking.", mn: "Хайлт, шүүлтүүр, санал харьцуулалт, сагс, захиалга, хүргэлтийн хяналт." } },
      { title: { en: "Supplier system", mn: "Нийлүүлэгчийн систем" }, text: { en: "Price and stock management with Excel/CSV bulk import and payouts.", mn: "Excel/CSV бөөн импорттой үнэ, үлдэгдлийн удирдлага, төлбөрийн шилжүүлэг." } },
      { title: { en: "Admin panel", mn: "Админ панел" }, text: { en: "Marketplace operations and home-page banners with CTR tracking.", mn: "Marketplace-ийн удирдлага, CTR хэмждэг нүүр хуудасны баннер." } },
      { title: { en: "Backend API", mn: "Backend API" }, text: { en: "NestJS + Prisma modular monolith with Redis, Meilisearch and BullMQ.", mn: "Redis, Meilisearch, BullMQ-тэй NestJS + Prisma modular monolith." } },
    ],
    highlights: [
      { title: { en: "Product vs. offer", mn: "Бараа ба санал" }, text: { en: "One canonical product, many supplier offers — price, stock and delivery compared side by side.", mn: "Нэг үндсэн бараа, олон нийлүүлэгчийн санал — үнэ, үлдэгдэл, хүргэлтийг зэрэгцүүлж харьцуулна." } },
      { title: { en: "Real catalog import", mn: "Бодит каталог импорт" }, text: { en: "A scraper → image → import pipeline loaded 2,136 products from a public catalog.", mn: "Scraper → зураг → импорт урсгалаар нийтийн каталогаас 2,136 бараа оруулсан." } },
      { title: { en: "Warehouse maps", mn: "Агуулахын газрын зураг" }, text: { en: "Supplier warehouses shown on Mapbox or a key-free OpenStreetMap fallback.", mn: "Нийлүүлэгчийн агуулахыг Mapbox, эсвэл API түлхүүр шаардахгүй OpenStreetMap нөөц газрын зураг дээр харуулна." } },
      { title: { en: "Trust & notifications", mn: "Итгэл ба мэдэгдэл" }, text: { en: "Verified-purchase reviews, supplier ratings, and in-app plus optional email/SMS notifications.", mn: "Баталгаажсан худалдан авалтын сэтгэгдэл, нийлүүлэгчийн үнэлгээ, апп доторх болон сонголтоор имэйл/SMS мэдэгдэл." } },
    ],
    shots: [
      { src: barilgaStorefront, label: { en: "Storefront", mn: "Нүүр хуудас" }, group: { en: "Buyer", mn: "Худалдан авагч" }, url: "100ail.vercel.app", device: "desktop" },
      { src: barilgaProduct, label: { en: "Product & supplier offers", mn: "Бараа ба нийлүүлэгчийн санал" }, group: { en: "Buyer", mn: "Худалдан авагч" }, url: "100ail.vercel.app/product/barilga-8102", device: "desktop" },
      { src: barilgaTrack, label: { en: "Delivery tracking", mn: "Хүргэлт хянах" }, group: { en: "Orders", mn: "Захиалга" }, url: "100ail.vercel.app/track", device: "desktop" },
      { src: barilgaMobile, label: { en: "Mobile storefront", mn: "Мобайл дэлгүүр" }, group: { en: "Mobile", mn: "Мобайл" }, url: "100ail.vercel.app", device: "mobile" },
    ],
  },
  {
    slug: "bikemap",
    number: "05",
    title: "BikeMap UB",
    year: "2026",
    category: { en: "Urban mobility · Diploma", mn: "Хотын хөдөлгөөн · Диплом" },
    status: { kind: "academic", label: { en: "Diploma project", mn: "Дипломын ажил" } },
    description: {
      en: "A crowdsourcing platform that makes cycling in Ulaanbaatar safer — riders tag road conditions, report hazards and vote, and routing prefers the safest path.",
      mn: "Улаанбаатарт унадаг дугуйгаар зорчихыг илүү аюулгүй болгох crowdsourcing платформ — дугуйчид замын нөхцөлийг тэмдэглэж, аюултай цэгийг мэдээлж, санал өгдөг бөгөөд маршрут хамгийн аюулгүй замыг илүүд үзнэ.",
    },
    role: { en: "Solo · Research, backend & frontend", mn: "Бие даан · Судалгаа, backend, frontend" },
    team: { en: "Individual diploma project — designed, built and tested end to end.", mn: "Бие даасан дипломын ажил — эхнээс нь дуустал зохиож, хөгжүүлж, тестэлсэн." },
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
        mn: "BikeMap UB нь дугуйчдад Улаанбаатарын дугуйн замын нийтийн, найдвартай газрын зургийг хамтдаа бүтээх боломж олгодог: тэд замын хэсгийг тэмдэглэж, сонирхолтой цэг болон аюулыг мэдээлж, санал өгснөөр аль мэдээлэл үнэн зөвийг олон нийт шийднэ.",
      },
      problem: {
        en: "Ulaanbaatar has little reliable data on bike-lane condition and hazards, and standard routing optimises for distance — not for the rider's safety.",
        mn: "Улаанбаатарт дугуйн замын нөхцөл, аюулын талаарх найдвартай мэдээлэл ховор бөгөөд ердийн маршрутчилал дугуйчны аюулгүй байдлыг биш, зөвхөн зайг оновчлодог.",
      },
      solution: {
        en: "A Django backend split into six apps — accounts (JWT + RBAC), segments, POIs, crowd aggregation, routes and an audit log. Bike lanes are imported from OpenStreetMap, votes are aggregated by majority with SHA-256 de-duplication, and OSRM routing uses a safety-first tie-breaker.",
        mn: "Зургаан app-д хуваасан Django backend — accounts (JWT + RBAC), segments, POI, crowd aggregation, routes, audit log. Дугуйн замыг OpenStreetMap-аас импортолдог; саналуудыг олонхийн зарчмаар нэгтгэж, SHA-256-аар давхардлыг арилгадаг; OSRM маршрутчилал safety-first tie-breaker ашигладаг.",
      },
      result: {
        en: "Delivered as my diploma project with 65 automated tests (40%+ coverage) running in GitHub Actions CI, Swagger API docs, a Docker Compose setup and a Render deployment.",
        mn: "Дипломын ажил болгон хүлээлгэн өгсөн: GitHub Actions CI дээр ажилладаг 65 автомат тест (40%-иас дээш хамрах хүрээ), Swagger API баримт бичиг, Docker Compose тохиргоо, Render дээрх байршуулалттай.",
      },
    },
    responsibilities: [
      { en: "Research, requirements and the crowd-aggregation algorithm", mn: "Судалгаа, шаардлага, crowd aggregation алгоритм" },
      { en: "Django backend: auth, RBAC, segments, POIs, voting and audit trail", mn: "Django backend: нэвтрэлт, RBAC, замын хэсэг, POI, санал, audit trail" },
      { en: "Map UI with heatmap, GPX import/export and smart routing", mn: "Heatmap, GPX импорт/экспорт, ухаалаг маршруттай газрын зургийн UI" },
      { en: "Testing, CI and deployment", mn: "Тест, CI, байршуулалт" },
    ],
    modules: [
      { title: { en: "Segments", mn: "Замын хэсэг" }, text: { en: "Road-condition tagging with bulk import of Ulaanbaatar's bike lanes from OSM.", mn: "Замын нөхцөлийг тэмдэглэх; УБ-ын дугуйн замуудыг OSM-ээс бөөнөөр импортолдог." } },
      { title: { en: "POIs & votes", mn: "POI ба санал" }, text: { en: "Six POI types with images, approval and up/down voting.", mn: "Зурагтай, баталгаажуулалттай, дэмжих/эсэргүүцэх санал өгөх боломжтой 6 төрлийн POI." } },
      { title: { en: "Aggregation", mn: "Нэгтгэл" }, text: { en: "Majority-vote aggregation with SHA-256 hashing to keep crowd data trustworthy.", mn: "Олон нийтийн өгөгдлийг найдвартай байлгах SHA-256-тэй олонхийн нэгтгэл." } },
      { title: { en: "Routes", mn: "Маршрут" }, text: { en: "GPX import/export and OSRM smart routing with a safety-first tie-breaker.", mn: "GPX импорт/экспорт, safety-first tie-breaker-тэй OSRM ухаалаг маршрут." } },
    ],
    highlights: [
      { title: { en: "Safety-first routing", mn: "Аюулгүй байдал тэргүүнд" }, text: { en: "When routes are close in distance, the safer one wins.", mn: "Маршрутуудын зай ойролцоо бол илүү аюулгүйг нь сонгоно." } },
      { title: { en: "Trustworthy crowd data", mn: "Найдвартай олон нийтийн өгөгдөл" }, text: { en: "Votes are de-duplicated and aggregated so one user cannot skew a segment.", mn: "Саналыг давхардалгүй нэгтгэдэг тул нэг хэрэглэгч үр дүнг гажуудуулж чадахгүй." } },
      { title: { en: "Admin audit trail", mn: "Админ audit trail" }, text: { en: "Every moderation action is recorded, with role-based access throughout.", mn: "Модерацийн үйлдэл бүр бүртгэгдэж, бүх хэсэгт үүрэгт суурилсан эрхийн хяналт үйлчилнэ." } },
      { title: { en: "Tested & automated", mn: "Тест ба автоматжуулалт" }, text: { en: "65 tests across models, auth, voting, GPX import and aggregation run in CI.", mn: "Model, нэвтрэлт, санал, GPX импорт, нэгтгэлийг хамарсан 65 тест CI дээр ажиллана." } },
    ],
    shots: [
      { src: bikeMap, label: { en: "Bike-lane map", mn: "Дугуйн замын газрын зураг" }, group: { en: "Map", mn: "Газрын зураг" }, url: "bikemap-ub.onrender.com", device: "desktop" },
      { src: bikeMobile, label: { en: "Mobile map", mn: "Мобайл газрын зураг" }, group: { en: "Mobile", mn: "Мобайл" }, url: "bikemap-ub.onrender.com", device: "mobile" },
      { src: bikeSafeRoute, label: { en: "Safest route", mn: "Аюулгүй маршрут" }, group: { en: "Map", mn: "Газрын зураг" }, url: "bikemap-ub.onrender.com", device: "desktop" },
      { src: bikeHeatmap, label: { en: "Road-condition heatmap", mn: "Замын нөхцөлийн heatmap" }, group: { en: "Data", mn: "Өгөгдөл" }, url: "bikemap-ub.onrender.com/heatmap/", device: "desktop" },
      { src: bikeGpx, label: { en: "GPX import & tagging", mn: "GPX оруулж тэмдэглэх" }, group: { en: "Data", mn: "Өгөгдөл" }, url: "bikemap-ub.onrender.com/gpx-import/", device: "desktop" },
      { src: bikeSegmentEdit, label: { en: "Tag a segment", mn: "Замын хэсэг тэмдэглэх" }, group: { en: "Map", mn: "Газрын зураг" }, url: "bikemap-ub.onrender.com", device: "desktop" },
      { src: bikeStats, label: { en: "System statistics", mn: "Системийн статистик" }, group: { en: "Data", mn: "Өгөгдөл" }, url: "bikemap-ub.onrender.com/stats/", device: "desktop" },
      { src: bikePoi, label: { en: "Report a hazard", mn: "Аюулын цэг мэдээлэх" }, group: { en: "Map", mn: "Газрын зураг" }, url: "bikemap-ub.onrender.com", device: "desktop" },
      { src: bikeProfile, label: { en: "Rider profile", mn: "Дугуйчны профайл" }, group: { en: "Account", mn: "Бүртгэл" }, url: "bikemap-ub.onrender.com/profile/", device: "desktop" },
      { src: bikeLogin, label: { en: "Sign in", mn: "Нэвтрэх" }, group: { en: "Account", mn: "Бүртгэл" }, url: "bikemap-ub.onrender.com/login/", device: "desktop" },
      { src: bikeAdmin, label: { en: "Django admin", mn: "Django админ" }, group: { en: "Admin", mn: "Админ" }, url: "bikemap-ub.onrender.com/admin/", device: "desktop" },
    ],
  },
];
