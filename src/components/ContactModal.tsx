"use client";

import { useActionState, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { sendContact } from "@/app/actions/contact";
import { CONTACT_INTENTS, type ContactErrorCode, type ContactState } from "@/data/contact";
import { Icon } from "./Icon";
import { T, Tx } from "./T";

const initial: ContactState = { status: "idle" };

const FIELD_ERRORS: Record<ContactErrorCode, { en: string; mn: string }> = {
  required: { en: "Required", mn: "Заавал бөглөнө" },
  invalid: { en: "Enter a valid email", mn: "Зөв имэйл оруулна уу" },
  "too-short": { en: "At least 2 characters", mn: "Дор хаяж 2 тэмдэгт" },
  "too-long": { en: "That's too long", mn: "Хэт урт байна" },
};

const REASONS: Record<NonNullable<ContactState["reason"]>, { en: string; mn: string }> = {
  validation: { en: "Please check the highlighted fields.", mn: "Тэмдэглэсэн талбаруудыг шалгана уу." },
  "rate-limit": { en: "Too many messages — please try again in a few minutes.", mn: "Хэт олон удаа илгээлээ — хэдэн минутын дараа дахин оролдоно уу." },
  "not-configured": { en: "The form isn't connected yet. Please email me directly for now.", mn: "Форм одоогоор холбогдоогүй байна. Имэйлээр шууд бичнэ үү." },
  "send-failed": { en: "Something went wrong sending your message. Please try again.", mn: "Илгээхэд алдаа гарлаа. Дахин оролдоно уу." },
};

/** The dialog itself: rendered into <body>, scroll locked, focus trapped, Esc / backdrop close. */
function ContactDialog({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(sendContact, initial);
  const dialogRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);
  const [closing, setClosing] = useState(false);
  const errors = state.fieldErrors ?? {};
  const values = state.values;

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
    dialogRef.current?.querySelector<HTMLElement>("input[name=name]")?.focus({ preventScroll: true });
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
      <div className="cm-panel" ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="cm-title">
        <button type="button" className="cm-close" aria-label="Close" onClick={close} />

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
            <h2 id="cm-title">
              <T en="Thanks — talk soon." mn="Баярлалаа — удахгүй холбогдоно." />
            </h2>
            <p className="cm-lead">
              <T en="I read every message and usually reply within a day or two." mn="Ирсэн бүх захидлыг уншдаг бөгөөд ихэвчлэн нэг хоёр хоногт хариулдаг." />
            </p>
            <button type="button" className="button button-primary" onClick={close}>
              <T en="Close" mn="Хаах" />
            </button>
          </div>
        ) : (
          <form action={action} noValidate>
            <p className="eyebrow-label">
              <span className="status-dot" /> <T en="Let's talk" mn="Ярилцъя" />
            </p>
            <h2 id="cm-title">
              <T en="Start a conversation" mn="Яриа эхлүүлэх" />
            </h2>
            <p className="cm-lead">
              <T en="Tell me a little about it — I'll get back to you by email." mn="Товчхон бичээрэй — би имэйлээр хариу өгнө." />
            </p>

            <fieldset className="cm-intents">
              <legend>
                <T en="I'd like to" mn="Би" />
              </legend>
              {Object.entries(CONTACT_INTENTS).map(([key, label]) => (
                <label key={key} className="cm-intent">
                  <input type="radio" name="intent" value={key} defaultChecked={(values?.intent ?? "project") === key} />
                  <span>
                    <Tx text={label} />
                  </span>
                </label>
              ))}
            </fieldset>

            <div className="cm-row">
              <label className={`cm-field${errors.name ? " has-error" : ""}`}>
                <span className="cm-label">
                  <T en="Name" mn="Нэр" />
                </span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  defaultValue={values?.name}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "cm-name-error" : undefined}
                />
                {fieldError("name")}
              </label>
              <label className={`cm-field${errors.email ? " has-error" : ""}`}>
                <span className="cm-label">
                  <T en="Email" mn="Имэйл" />
                </span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  required
                  maxLength={160}
                  defaultValue={values?.email}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "cm-email-error" : undefined}
                />
                {fieldError("email")}
              </label>
            </div>
            <label className={`cm-field${errors.message ? " has-error" : ""}`}>
              <span className="cm-label">
                <T en="Message" mn="Мессеж" />
              </span>
              <textarea
                name="message"
                rows={5}
                required
                minLength={2}
                maxLength={4000}
                defaultValue={values?.message}
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={errors.message ? "cm-message-error" : undefined}
              />
              {fieldError("message")}
            </label>

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

            <div className="cm-actions">
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
                <T en="Sent straight to my inbox — no email app needed." mn="Шууд миний имэйл рүү очно — имэйл апп нээх шаардлагагүй." />
              </p>
            </div>
          </form>
        )}
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
