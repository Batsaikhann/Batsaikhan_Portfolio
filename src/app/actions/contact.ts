"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { CONTACT_INTENTS, isContactIntent, type ContactState } from "@/data/contact";
import { profile } from "@/data/profile";

/**
 * Sender address. Until your domain is verified in Resend, onboarding@resend.dev is the only
 * sender that works — and it only delivers to the email your Resend account is registered with.
 * After verifying a domain, set CONTACT_FROM_EMAIL (e.g. "Batsaikhan <hello@yourdomain.com>")
 * in Vercel / .env.local, or change DEFAULT_SENDER here.
 */
const DEFAULT_SENDER = "Portfolio <onboarding@resend.dev>";
const SENDER = process.env.CONTACT_FROM_EMAIL || DEFAULT_SENDER;
/** Where submissions land. Defaults to the email in src/data/profile.ts. */
const INBOX = process.env.CONTACT_TO_EMAIL || profile.email;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MIN_FILL_MS = 2500;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX_PER_IP = 5;
const RATE_MAX_PER_EMAIL = 3;
// Best effort per server instance (serverless instances don't share memory) — slows down a single noisy client.
const recent = new Map<string, number[]>();

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ");
const text = (data: FormData, key: string) => String(data.get(key) ?? "").trim();

/** Records a hit for each key; returns true if any key is over its limit. */
function rateLimited(entries: Array<[key: string, max: number]>) {
  const now = Date.now();
  // Drop stale keys so the map can't grow without bound.
  if (recent.size > 500) for (const [key, hits] of recent) if (!hits.some((t) => now - t < RATE_WINDOW_MS)) recent.delete(key);
  const limited = entries.some(([key, max]) => (recent.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS).length >= max);
  if (!limited) for (const [key] of entries) recent.set(key, [...(recent.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS), now]);
  return limited;
}

export async function sendContact(_prev: ContactState, data: FormData): Promise<ContactState> {
  const rawIntent = text(data, "intent");
  const values = {
    name: oneLine(text(data, "name")).slice(0, 120),
    email: text(data, "email").slice(0, 200),
    message: text(data, "message").slice(0, 5000),
    intent: isContactIntent(rawIntent) ? rawIntent : ("project" as const),
  };

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!values.name) fieldErrors.name = "required";
  else if (values.name.length < 2) fieldErrors.name = "too-short";
  else if (values.name.length > 80) fieldErrors.name = "too-long";
  if (!values.email) fieldErrors.email = "required";
  else if (!EMAIL_RE.test(values.email) || values.email.length > 160) fieldErrors.email = "invalid";
  if (!values.message) fieldErrors.message = "required";
  else if (values.message.length < 2) fieldErrors.message = "too-short";
  else if (values.message.length > 4000) fieldErrors.message = "too-long";
  if (!isContactIntent(rawIntent)) fieldErrors.intent = "required";
  if (Object.keys(fieldErrors).length) return { status: "error", reason: "validation", fieldErrors, values };

  // Spam (checked after validation so a real person never gets a false "sent"): a hidden field
  // people never see, and a minimum time between opening the form and sending it.
  // Bots get a quiet "success" so they don't learn what tripped them.
  const startedAt = Number(text(data, "startedAt"));
  if (text(data, "company") || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    const why = text(data, "company") ? "honeypot" : !startedAt ? "no start time" : `sent ${Date.now() - startedAt}ms after opening`;
    console.warn(`[contact] Dropped as spam (${why}).`);
    return { status: "success" };
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (rateLimited([[`ip:${ip}`, RATE_MAX_PER_IP], [`email:${values.email.toLowerCase()}`, RATE_MAX_PER_EMAIL]])) {
    return { status: "error", reason: "rate-limit", values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set — message not sent.");
    return { status: "error", reason: "not-configured", values };
  }

  const intent = CONTACT_INTENTS[values.intent].en;
  const html = `
    <div style="font-family:system-ui,sans-serif;color:#111;line-height:1.5">
      <p style="margin:0 0 4px;color:#e5243b;font-size:12px;letter-spacing:.12em;text-transform:uppercase">${escapeHtml(intent)}</p>
      <h2 style="margin:0 0 16px">${escapeHtml(values.name)}</h2>
      <p style="margin:0 0 16px"><a href="mailto:${escapeHtml(values.email)}">${escapeHtml(values.email)}</a></p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(values.message)}</p>
    </div>`;
  // Same visitor + same form session + same text ⇒ same key, so Resend drops an accidental double send.
  const idempotencyKey = createHash("sha256").update(`${values.email}\n${startedAt}\n${values.message}`).digest("hex");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
      body: JSON.stringify({
        from: SENDER,
        to: [INBOX],
        reply_to: values.email, // "Reply" in your inbox answers the visitor directly
        subject: `[Portfolio] ${intent} — ${values.name}`,
        text: `${intent}\n\nFrom: ${values.name} <${values.email}>\n\n${values.message}`,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = (await res.text().catch(() => "")).slice(0, 300);
    if (res.ok) {
      // Resend's message id — look it up under Emails in the Resend dashboard.
      console.info(`[contact] Sent to Resend: ${body} (from ${SENDER} to ${INBOX})`);
    } else {
      // Log Resend's status and short error text only — never request headers (they carry the key).
      console.error(`[contact] Resend rejected the message (${res.status}): ${body}`);
      if (res.status === 429) return { status: "error", reason: "rate-limit", values };
      if (res.status === 401 || res.status === 403) return { status: "error", reason: "not-configured", values };
      return { status: "error", reason: "send-failed", values };
    }
  } catch (error) {
    console.error("[contact] Could not reach Resend:", error instanceof Error ? error.name : "unknown error");
    return { status: "error", reason: "send-failed", values };
  }

  return { status: "success" };
}
