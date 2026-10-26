"use client";

import { useId, useState } from "react";
import type { Dictionary } from "@/i18n";
import { type ContactErrors, type ContactInput, isLikelySpam, validateContact } from "@/lib/contact";

type Labels = Dictionary["contact"]["form"];
type Status = "idle" | "sending" | "success" | "error";

const empty: ContactInput = { name: "", email: "", subject: "", message: "", website: "" };

/**
 * Only rendered when a delivery endpoint is configured. Posts JSON to that endpoint
 * (e.g. Formspree). Success is shown only after the service confirms delivery.
 */
export function ContactForm({ endpoint, labels }: { endpoint: string; labels: Labels }) {
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const uid = useId();

  const set = (key: keyof ContactInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateContact(values);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = e.currentTarget.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }
    if (isLikelySpam(values)) {
      // Pretend nothing happened for bots, but never claim delivery to a human.
      setStatus("idle");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, subject: values.subject, message: values.message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
      setValues(empty);
    } catch {
      setStatus("error");
    }
  }

  const field = (key: "name" | "email" | "subject", type = "text", autoComplete?: string) => {
    const id = `${uid}-${key}`;
    const err = errors[key];
    return (
      <div>
        <label htmlFor={id} className="text-sm text-fg-muted">
          {labels[key]}
          {key !== "subject" && <span aria-hidden className="text-accent"> *</span>}
        </label>
        <input
          id={id}
          name={key}
          type={type}
          autoComplete={autoComplete}
          value={values[key]}
          onChange={set(key)}
          required={key !== "subject"}
          aria-invalid={err ? "true" : undefined}
          aria-describedby={err ? `${id}-err` : undefined}
          className="mt-1.5 block w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-fg outline-none focus:border-accent aria-[invalid=true]:border-crit"
        />
        {err && (
          <p id={`${id}-err`} className="mt-1 text-xs text-crit">
            {labels.errors[err]}
          </p>
        )}
      </div>
    );
  };

  return (
    <form noValidate onSubmit={onSubmit} className="panel space-y-4 p-6" aria-labelledby={`${uid}-title`}>
      <h2 id={`${uid}-title`} className="text-lg font-semibold">
        {labels.title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "text", "name")}
        {field("email", "email", "email")}
      </div>
      {field("subject")}
      <div>
        <label htmlFor={`${uid}-message`} className="text-sm text-fg-muted">
          {labels.message}
          <span aria-hidden className="text-accent"> *</span>
        </label>
        <textarea
          id={`${uid}-message`}
          name="message"
          rows={6}
          value={values.message}
          onChange={set("message")}
          required
          aria-invalid={errors.message ? "true" : undefined}
          aria-describedby={errors.message ? `${uid}-message-err` : undefined}
          className="mt-1.5 block w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-fg outline-none focus:border-accent aria-[invalid=true]:border-crit"
        />
        {errors.message && (
          <p id={`${uid}-message-err`} className="mt-1 text-xs text-crit">
            {labels.errors[errors.message]}
          </p>
        )}
      </div>
      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
        </label>
      </div>
      <p className="text-xs leading-relaxed text-fg-subtle">{labels.privacy}</p>
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex min-h-11 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-ink transition-colors hover:bg-accent-strong disabled:opacity-60"
      >
        {status === "sending" ? labels.sending : labels.submit}
      </button>
      <p role="status" aria-live="polite" className="text-sm">
        {status === "success" && <span className="text-teal">{labels.success}</span>}
        {status === "error" && <span className="text-crit">{labels.failure}</span>}
      </p>
    </form>
  );
}
