"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { sendContact } from "@/app/actions/contact";
import { BUDGETS, CONTACT_INTENTS, PROJECT_TYPES, TIMELINES, type ContactErrorCode, type ContactIntent, type ContactState } from "@/data/contact";
import { profile } from "@/data/profile";
import { Icon } from "./Icon";
import { T, Tx, type L } from "./T";

const initial: ContactState = { status: "idle" };

const FIELD_ERRORS: Record<ContactErrorCode, L> = {
  required: { en: "Required", mn: "Заавал бөглөнө" },
  invalid: { en: "Enter a valid email", mn: "Зөв имэйл оруулна уу" },
  "too-short": { en: "At least 2 characters", mn: "Дор хаяж 2 тэмдэгт" },
  "too-long": { en: "That's too long", mn: "Хэт урт байна" },
};

const REASONS: Record<NonNullable<ContactState["reason"]>, L> = {
  validation: { en: "Please check the highlighted fields.", mn: "Тэмдэглэсэн талбаруудыг шалгана уу." },
  "rate-limit": { en: "Too many messages — please try again in a few minutes.", mn: "Хэт олон удаа илгээлээ — хэдэн минутын дараа дахин оролдоно уу." },
  "not-configured": { en: "The form isn't connected yet. Please email me directly for now.", mn: "Форм одоогоор холбогдоогүй байна. Имэйлээр шууд бичнэ үү." },
  "send-failed": { en: "Something went wrong sending your message. Please try again.", mn: "Илгээхэд алдаа гарлаа. Дахин оролдоно уу." },
};

const PLACEHOLDERS = {
  name: { en: "Your name", mn: "Нэрээ оруулна уу" },
  email: { en: "name@example.com", mn: "name@example.com" },
  message: {
    project: { en: "What are you building, who is it for, and what already exists?", mn: "Юу бүтээх гэж байна, хэнд зориулсан, одоо юу бэлэн байгаа вэ?" },
    work: { en: "The role or team, and what you'd like me to own.", mn: "Ямар баг, ямар үүрэг, юуг хариуцуулах вэ?" },
    hi: { en: "Say hello — I read everything.", mn: "Мэндээ илгээгээрэй — бүгдийг уншдаг." },
  },
} satisfies Record<string, unknown>;

// Placeholders are plain attributes, so they need the current language as a value (the rest of the UI switches via CSS).
const subscribeLang = (onChange: () => void) => {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributeFilter: ["data-lang"] });
  return () => mo.disconnect();
};
const useLang = () => useSyncExternalStore(subscribeLang, () => (document.documentElement.dataset.lang === "mn" ? "mn" : "en"), () => "en" as const);

/** A row of pill radios bound to one form field. */
function Choice({ name, legend, options, defaultValue, onChange }: { name: string; legend: ReactNode; options: Record<string, L>; defaultValue?: string; onChange?: (v: string) => void }) {
  return (
    <fieldset className="cm-choice">
      <legend>{legend}</legend>
      <div className="cm-pills">
        {Object.entries(options).map(([key, label]) => (
          <label key={key} className="cm-pill">
            <input type="radio" name={name} value={key} defaultChecked={defaultValue === key} onChange={() => onChange?.(key)} />
            <span>
              <Tx text={label} />
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** The dialog itself: rendered into <body>, scroll locked, focus trapped, Esc / backdrop close. */
function ContactDialog({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const dialogRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);
  const [closing, setClosing] = useState(false);
  const lang = useLang();
  const errors = state.fieldErrors ?? {};
  const values = state.values;
  const [intent, setIntent] = useState<ContactIntent>(values?.intent ?? "project");
  const wantsDetails = intent !== "hi";

  const close = () => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return onClose();
    setClosing(true);
    window.setTimeout(onClose, 220);
  };

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    root.classList.add("modal-open");
    // When the form was opened — the server rejects sends that come back implausibly fast.
    if (startedRef.current) startedRef.current.value = String(Date.now());
    // Only jump into the name field with a mouse/keyboard — on touch it pops the keyboard over the whole sheet.
    const nameInput = matchMedia("(pointer: fine)").matches ? dialogRef.current?.querySelector<HTMLElement>("input[name=name]") : null;
    (nameInput ?? dialogRef.current)?.focus({ preventScroll: true });
    return () => {
      root.style.overflow = "";
      root.classList.remove("modal-open");
      opener?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab") return;
      const focusables = [...(dialogRef.current?.querySelectorAll<HTMLElement>("button, input:not([type=hidden]):not([tabindex='-1']), textarea, a[href]") ?? [])].filter(
        (el) => !el.hasAttribute("disabled"),
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Move focus to the success message so screen readers announce it.
  useEffect(() => {
    if (state.status === "success") dialogRef.current?.querySelector<HTMLElement>(".cm-success")?.focus();
  }, [state.status]);

  const fieldError = (name: keyof typeof errors) =>
    errors[name] ? (
      <span className="cm-error" id={`cm-${name}-error`}>
        <Tx text={FIELD_ERRORS[errors[name]!]} />
      </span>
    ) : null;

  return createPortal(
    <div className={`cm${closing ? " is-closing" : ""}`} onPointerDown={(event) => event.target === event.currentTarget && close()}>
      <div className="cm-panel" ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1} aria-labelledby="cm-title">
        <button type="button" className="cm-close" aria-label="Close" onClick={close} />

        {/* Left: the pitch, response time and direct contacts. */}
        <aside className="cm-intro">
          <p className="eyebrow-label">
            <span className="status-dot" /> <T en="Let's talk" mn="Ярилцъя" />
          </p>
          <h2 id="cm-title">
            <T
              en={
                <>
                  Let&apos;s build your <em>next product.</em>
                </>
              }
              mn={
                <>
                  Дараагийн төслөө <em>хамтдаа бүтээе.</em>
                </>
              }
            />
          </h2>
          <p className="cm-lead">
            <T
              en="Tell me what you're building. I'll reply with honest thoughts on what it needs — and what it doesn't. Usually within 24 hours."
              mn="Юу бүтээх гэж байгаагаа хуваалцаарай. Ямар шийдэл хэрэгтэй, юу шаардлагагүйг шулуухан хэлж өгнө. Ихэвчлэн 24 цагийн дотор хариулдаг."
            />
          </p>
          <ul className="cm-facts">
            <li>
              <i className="status-dot" /> <T en="Available for new projects" mn="Шинэ төсөлд нээлттэй" />
            </li>
            <li>
              <Icon name="pin" size={14} /> <T en="Ulaanbaatar · Remote worldwide" mn="Улаанбаатар · Дэлхий даяар зайнаас" />
            </li>
          </ul>
          <p className="cm-direct-label">
            <T en="Or reach me directly" mn="Эсвэл шууд холбогдох" />
          </p>
          <ul className="cm-direct">
            <li>
              <a href={`mailto:${profile.email}`}>
                <Icon name="mail" size={15} /> {profile.email}
              </a>
            </li>
            {profile.phones.map((phone) => (
              <li key={phone}>
                <a href={`tel:+976${phone.replace(/\s/g, "")}`}>
                  <Icon name="phone" size={15} /> {phone}
                </a>
              </li>
            ))}
            <li className="cm-direct-row">
              <a href={profile.github.href} target="_blank" rel="noreferrer">
                <Icon name="github" size={15} /> GitHub
              </a>
              <a href={profile.instagram.href} target="_blank" rel="noreferrer">
                <Icon name="instagram" size={15} /> Instagram
              </a>
            </li>
          </ul>
        </aside>

        {/* Right: the form card (or the success state). */}
        <div className="cm-card">
          {state.status === "success" ? (
            <div className="cm-success" tabIndex={-1} role="status">
              <span className="cm-success-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              </span>
              <p className="eyebrow-label">
                <T en="Message sent" mn="Илгээгдлээ" />
              </p>
              <h3>
                <T en="Thanks — talk soon." mn="Баярлалаа — удахгүй холбогдоно." />
              </h3>
              <p className="cm-lead">
                <T en="I read every message and usually reply within 24 hours." mn="Ирсэн бүх захидлыг уншдаг бөгөөд ихэвчлэн 24 цагийн дотор хариулдаг." />
              </p>
              <button type="button" className="button button-primary" onClick={close}>
                <T en="Close" mn="Хаах" />
              </button>
            </div>
          ) : (
            <form action={action} noValidate>
              <h3 className="cm-card-title">
                <T en="Tell me about your project" mn="Төслийн мэдээллээ үлдээнэ үү" />
              </h3>

              <Choice
                name="intent"
                legend={<T en="I'd like to" mn="Би" />}
                options={CONTACT_INTENTS}
                defaultValue={values?.intent ?? "project"}
                onChange={(v) => setIntent(v as ContactIntent)}
              />

              <div className="cm-row">
                <label className={`cm-field${errors.name ? " has-error" : ""}`}>
                  <span className="cm-label">
                    <T en="Your name" mn="Таны нэр" />
                  </span>
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={80}
                    placeholder={PLACEHOLDERS.name[lang]}
                    defaultValue={values?.name}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "cm-name-error" : undefined}
                  />
                  {fieldError("name")}
                </label>
                <label className={`cm-field${errors.email ? " has-error" : ""}`}>
                  <span className="cm-label">
                    <T en="Email" mn="И-мэйл хаяг" />
                  </span>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    maxLength={160}
                    placeholder={PLACEHOLDERS.email[lang]}
                    defaultValue={values?.email}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "cm-email-error" : undefined}
                  />
                  {fieldError("email")}
                </label>
              </div>

              {wantsDetails && (
                <Choice
                  name="projectType"
                  legend={<T en="What are you building?" mn="Ямар бүтээгдэхүүн хөгжүүлэх вэ?" />}
                  options={PROJECT_TYPES}
                  defaultValue={values?.projectType}
                />
              )}

              <label className={`cm-field${errors.message ? " has-error" : ""}`}>
                <span className="cm-label">
                  <T en="Details" mn="Дэлгэрэнгүй мэдээлэл" />
                </span>
                <textarea
                  name="message"
                  rows={4}
                  required
                  minLength={2}
                  maxLength={4000}
                  placeholder={PLACEHOLDERS.message[intent][lang]}
                  defaultValue={values?.message}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "cm-message-error" : undefined}
                />
                {fieldError("message")}
              </label>

              {wantsDetails && (
                <div className="cm-row is-choices">
                  <Choice name="budget" legend={<T en="Planned budget" mn="Төлөвлөсөн төсөв" />} options={BUDGETS} defaultValue={values?.budget} />
                  <Choice name="timeline" legend={<T en="Timeline" mn="Төлөвлөсөн хугацаа" />} options={TIMELINES} defaultValue={values?.timeline} />
                </div>
              )}

              {/* Spam traps: invisible to people, tempting to bots. */}
              <input type="hidden" name="startedAt" ref={startedRef} />
              <label className="cm-hp" aria-hidden="true">
                Company
                <input name="company" tabIndex={-1} autoComplete="off" />
              </label>

              {state.status === "error" && state.reason && (
                <p className="cm-alert" role="alert">
                  <Tx text={REASONS[state.reason]} />
                </p>
              )}

              <button type="submit" className="button button-primary cm-submit" disabled={pending} aria-busy={pending}>
                {pending ? (
                  <>
                    <span className="cm-spinner" aria-hidden="true" /> <T en="Sending…" mn="Илгээж байна…" />
                  </>
                ) : (
                  <>
                    <T en="Send message" mn="Илгээх" /> <Icon name="arrow" />
                  </>
                )}
              </button>
              <p className="cm-note">
                <T en="Goes straight to my inbox · I reply within 24 hours" mn="Шууд миний имэйл рүү очно · 24 цагийн дотор хариулна" />
              </p>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** A button that opens the contact modal. Renders its children as the label. */
export function ContactButton({ children, className, ...rest }: { children: ReactNode; className?: string; "data-magnetic"?: boolean; "data-cursor"?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" onClick={() => setOpen(true)} {...rest}>
        {children}
      </button>
      {open && <ContactDialog onClose={() => setOpen(false)} />}
    </>
  );
}
