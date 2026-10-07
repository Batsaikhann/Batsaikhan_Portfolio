// Contact form options, shared by the modal (labels) and the server action (validation).
import type { L } from "@/components/T";

export const CONTACT_INTENTS = {
  project: { en: "Start a project", mn: "Төсөл эхлүүлэх" },
  work: { en: "Work together", mn: "Хамтран ажиллах" },
  hi: { en: "Just say hi", mn: "Зүгээр л мэндлэх" },
} satisfies Record<string, L>;

export type ContactIntent = keyof typeof CONTACT_INTENTS;

export const isContactIntent = (value: string): value is ContactIntent => Object.hasOwn(CONTACT_INTENTS, value);

// Project details — only asked for "Start a project" / "Work together". Edit freely; keys are what get submitted.
export const PROJECT_TYPES = {
  web: { en: "Web app", mn: "Веб апп" },
  mobile: { en: "Mobile app", mn: "Мобайл апп" },
  platform: { en: "Web + mobile", mn: "Веб + мобайл" },
  backend: { en: "Backend / API", mn: "Backend / API" },
  mvp: { en: "MVP / prototype", mn: "MVP / прототип" },
  other: { en: "Something else", mn: "Бусад" },
} satisfies Record<string, L>;

export const BUDGETS = {
  under2: { en: "Under ₮2M", mn: "₮2 саяас доош" },
  "2to5": { en: "₮2–5M", mn: "₮2–5 сая" },
  "5to15": { en: "₮5–15M", mn: "₮5–15 сая" },
  over15: { en: "₮15M+", mn: "₮15 саяас дээш" },
  tbd: { en: "Not sure yet", mn: "Шийдээгүй" },
} satisfies Record<string, L>;

export const TIMELINES = {
  asap: { en: "ASAP", mn: "Аль болох хурдан" },
  month: { en: "Within a month", mn: "1 сарын дотор" },
  quarter: { en: "1–3 months", mn: "1–3 сар" },
  flexible: { en: "Flexible", mn: "Уян хатан" },
} satisfies Record<string, L>;

/** Returns the key if it belongs to the option set, otherwise undefined (field is optional). */
export const pick = <T extends Record<string, L>>(options: T, value: string) => (Object.hasOwn(options, value) ? (value as keyof T & string) : undefined);

type Field = "name" | "email" | "message" | "intent";
/** Error codes, translated in the modal (EN/MN). */
export type ContactErrorCode = "required" | "invalid" | "too-short" | "too-long";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Why the whole submission failed (not a single field). */
  reason?: "validation" | "rate-limit" | "not-configured" | "send-failed";
  fieldErrors?: Partial<Record<Field, ContactErrorCode>>;
  /** Echoed back so the form keeps what was typed when something goes wrong. */
  values?: { name: string; email: string; message: string; intent: ContactIntent; projectType?: string; budget?: string; timeline?: string };
};
