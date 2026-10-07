// Contact form options, shared by the modal (labels) and the server action (validation).
import type { L } from "@/components/T";

export const CONTACT_INTENTS = {
  project: { en: "Start a project", mn: "Төсөл эхлүүлэх" },
  work: { en: "Work together", mn: "Хамтран ажиллах" },
  hi: { en: "Just say hi", mn: "Зүгээр л мэндлэх" },
} satisfies Record<string, L>;

export type ContactIntent = keyof typeof CONTACT_INTENTS;

export const isContactIntent = (value: string): value is ContactIntent => Object.hasOwn(CONTACT_INTENTS, value);

type Field = "name" | "email" | "message" | "intent";
/** Error codes, translated in the modal (EN/MN). */
export type ContactErrorCode = "required" | "invalid" | "too-short" | "too-long";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Why the whole submission failed (not a single field). */
  reason?: "validation" | "rate-limit" | "not-configured" | "send-failed";
  fieldErrors?: Partial<Record<Field, ContactErrorCode>>;
  /** Echoed back so the form keeps what was typed when something goes wrong. */
  values?: { name: string; email: string; message: string; intent: ContactIntent };
};
