"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Send } from "lucide-react";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { ease } from "@/animations/easings";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DURATION } from "@/config/animations";
import { siteConfig } from "@/config/site";
import { budgetLabels, contactCopy, projectTypeLabels } from "@/data/contact";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import {
  BUDGET_RANGES,
  CONTACT_LIMITS,
  type ContactErrors,
  type ContactField,
  type ContactInput,
  PROJECT_TYPES,
  contactSchema,
  toFieldErrors,
} from "@/services/contact.schema";
import { sendContactMessage } from "@/services/contact.service";
import type { ContactSubmitState } from "@/types/contact";

export interface ContactFormProps {
  className?: string;
}

const EMPTY = {
  name: "",
  email: "",
  company: "",
  role: "",
  projectType: "",
  budget: "",
  message: "",
} as const;

type FormValues = { -readonly [K in keyof typeof EMPTY]: string };

/**
 * The contact form.
 *
 * Seven fields, three of them optional, and every one of them wired through `Field` so the label,
 * hint, error and `aria-describedby` cannot come apart.
 *
 * The behaviour worth recording:
 *
 * **Validation is on submit, then live per field.** Validating while someone is still typing their
 * email tells them it is invalid before they have finished writing it. Once a field has errored,
 * it clears as soon as it becomes valid — so correcting a mistake gives immediate confirmation.
 *
 * **Errors move focus.** On a failed submit, focus goes to the first invalid control. Without
 * that, a keyboard or screen reader user is left at the submit button with an announcement and no
 * idea which of seven fields is wrong.
 *
 * **Two spam defences, both invisible.** A honeypot field that is hidden from sight, from
 * assistive tech and from the tab order; and a timing check on how long the form was open. Both
 * are enforced server-side as well, and both fail quietly — a caught submission gets the same
 * response a real one does.
 *
 * **The unconfigured path is honest.** With no transport wired up, the form does not pretend to
 * send. It renders the composed message with a copy button and the direct address, so the
 * visitor's effort is never lost.
 */
export function ContactForm({ className }: ContactFormProps) {
  const [values, setValues] = useState<FormValues>({ ...EMPTY });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [state, setState] = useState<ContactSubmitState>("idle");
  const [notice, setNotice] = useState<string | null>(null);
  const [fallbackBody, setFallbackBody] = useState<string | null>(null);

  const mountedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const projectTypeOptions = useMemo(
    () => PROJECT_TYPES.map((id) => ({ value: id, label: projectTypeLabels[id] })),
    [],
  );

  const budgetOptions = useMemo(
    () => BUDGET_RANGES.map((id) => ({ value: id, label: budgetLabels[id] })),
    [],
  );

  const update = useCallback(
    (field: keyof FormValues) =>
      (
        event: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const next = event.target.value;

        setValues((previous) => {
          const updated: FormValues = { ...previous };
          updated[field] = next;
          return updated;
        });

        // Only re-check a field that is already showing an error. Validating a pristine
        // field on every keystroke reports "invalid email" halfway through typing one.
        setErrors((previous) => {
          if (!(field in previous)) return previous;

          const candidate: FormValues = { ...values };
          candidate[field] = next;

          const parsed = contactSchema.safeParse(buildPayload(candidate, 0, ""));
          if (parsed.success) return {};

          const fresh = toFieldErrors(parsed.error);
          const key = field as ContactField;
          if (fresh[key]) return previous;

          const cleared: ContactErrors = { ...previous };
          delete cleared[key];
          return cleared;
        });
      },
    [values],
  );

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (state === "submitting") return;

      setNotice(null);
      setFallbackBody(null);

      const payload = buildPayload(
        values,
        Date.now() - mountedAt.current,
        honeypotRef.current?.value ?? "",
      );

      const parsed = contactSchema.safeParse(payload);

      if (!parsed.success) {
        const fieldErrors = toFieldErrors(parsed.error);
        setErrors(fieldErrors);
        setState("error");

        // Move focus to the first invalid control rather than leaving the reader at
        // the submit button wondering which field is wrong.
        const firstField = Object.keys(fieldErrors)[0];
        if (firstField) {
          formRef.current
            ?.querySelector<HTMLElement>(`[name="${firstField}"]`)
            ?.focus();
        }
        return;
      }

      setErrors({});
      setState("submitting");

      const result = await sendContactMessage(parsed.data);

      if (result.ok) {
        setState("success");
        trackEvent("contact_submit", {
          via: result.data.via,
          projectType: parsed.data.projectType,
        });
        return;
      }

      setState("error");
      trackEvent("contact_submit_error", { code: result.error.code ?? "unknown" });

      if (result.error.code === "not_configured") {
        setNotice(contactCopy.fallbackBody);
        setFallbackBody(composeFallback(parsed.data));
        return;
      }

      setNotice(result.error.message);
    },
    [state, values],
  );

  const reset = useCallback(() => {
    setValues({ ...EMPTY });
    setErrors({});
    setState("idle");
    setNotice(null);
    setFallbackBody(null);
    mountedAt.current = Date.now();
  }, []);

  /* ------------------------------------------------------------- success -- */
  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: ease.outBack }}
        className={cn(
          "flex flex-col items-start gap-5 rounded-3xl border border-success/30",
          "bg-success/8 p-8",
          className,
        )}
      >
        <motion.span
          aria-hidden="true"
          initial={{ scale: 0.4, rotate: -18 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: DURATION.slow, ease: ease.outBack, delay: 0.08 }}
          className={cn(
            "grid size-12 place-items-center rounded-full",
            "bg-success/18 text-success",
          )}
        >
          <Check className="size-6" strokeWidth={3} />
        </motion.span>

        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {contactCopy.successTitle}
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            {contactCopy.successBody}
          </p>
        </div>

        <Button variant="secondary" size="sm" onClick={reset}>
          {contactCopy.successAgain}
        </Button>
      </motion.div>
    );
  }

  /* ---------------------------------------------------------------- form -- */
  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      className={cn("flex flex-col gap-6", className)}
    >
      {/* Honeypot. Hidden from sight, from assistive tech and from the tab order —
          the only thing that can fill it is a script. */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute size-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required error={errors.name}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="name"
              value={values.name}
              onChange={update("name")}
              autoComplete="name"
              placeholder="Ada Lovelace"
              describedBy={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field
          label="Email"
          required
          error={errors.email}
          hint="Where the reply goes."
        >
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="email"
              type="email"
              inputMode="email"
              value={values.email}
              onChange={update("email")}
              autoComplete="email"
              placeholder="you@company.com"
              describedBy={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="Company" error={errors.company}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="company"
              value={values.company}
              onChange={update("company")}
              autoComplete="organization"
              placeholder="Acme"
              describedBy={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="Your role" error={errors.role}>
          {({ id, describedBy, invalid }) => (
            <Input
              id={id}
              name="role"
              value={values.role}
              onChange={update("role")}
              autoComplete="organization-title"
              placeholder="Engineering Manager"
              describedBy={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field label="What is this about" required error={errors.projectType}>
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              name="projectType"
              value={values.projectType}
              onChange={update("projectType")}
              options={projectTypeOptions}
              placeholder="Pick the closest match"
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </Field>

        <Field
          label="Budget"
          error={errors.budget}
          hint="A range is enough. It changes the shape of the reply, not the price."
        >
          {({ id, describedBy, invalid }) => (
            <Select
              id={id}
              name="budget"
              value={values.budget}
              onChange={update("budget")}
              options={budgetOptions}
              placeholder="Prefer not to say"
              aria-describedby={describedBy}
              invalid={invalid}
            />
          )}
        </Field>
      </div>

      <Field
        label="Message"
        required
        error={errors.message}
        counter={{ value: values.message.length, max: CONTACT_LIMITS.messageMax }}
        hint="What you are building, what is in the way, and what a good outcome looks like."
      >
        {({ id, describedBy, invalid }) => (
          <Textarea
            id={id}
            name="message"
            value={values.message}
            onChange={update("message")}
            maxLength={CONTACT_LIMITS.messageMax}
            placeholder="We are moving a monolith towards services and the payment flow is the part nobody wants to touch…"
            aria-describedby={describedBy}
            invalid={invalid}
          />
        )}
      </Field>

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" loading={state === "submitting"}>
            {state === "submitting" ? null : (
              <Send aria-hidden="true" className="size-4" />
            )}
            {state === "submitting" ? contactCopy.submitting : contactCopy.submit}
          </Button>

          <p className="max-w-xs text-2xs leading-relaxed text-subtle">
            {contactCopy.consentNote}
          </p>
        </div>

        {/* One live region for every outcome, so a result is announced exactly once. */}
        <AnimatePresence>
          {notice ? (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: DURATION.fast }}
              className={cn(
                "flex flex-col gap-3 rounded-xl border border-warning/35",
                "bg-warning/8 p-4",
              )}
            >
              <p className="text-sm leading-relaxed text-foreground">
                {fallbackBody ? contactCopy.fallbackTitle : "That did not send"}
              </p>
              <p className="text-xs leading-relaxed text-muted">{notice}</p>

              {fallbackBody ? (
                <div className="flex flex-col gap-3">
                  <pre
                    className={cn(
                      "max-h-40 overflow-y-auto rounded-lg border border-border",
                      "bg-surface p-3 font-mono text-2xs leading-relaxed",
                      "whitespace-pre-wrap text-muted",
                    )}
                  >
                    {fallbackBody}
                  </pre>

                  <div className="flex flex-wrap items-center gap-2">
                    <CopyButton value={fallbackBody} label="Copy message" size="sm" />
                    <Button asChild variant="secondary" size="sm">
                      <a href={`mailto:${siteConfig.email}`}>
                        Open {siteConfig.email}
                      </a>
                    </Button>
                  </div>
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Shapes the form's string state into the schema's payload.
 *
 * Empty optional strings become `undefined` rather than `""`, so an untouched budget select is
 * absent from the submission instead of arriving as an empty enum value.
 */
function buildPayload(values: FormValues, elapsedMs: number, honeypot: string) {
  return {
    name: values.name,
    email: values.email,
    company: values.company || undefined,
    role: values.role || undefined,
    projectType: values.projectType,
    budget: values.budget || undefined,
    message: values.message,
    website: honeypot,
    elapsedMs,
  };
}

/**
 * The copyable body shown when no transport is configured.
 *
 * Takes the parsed payload rather than the raw form values, so `projectType` is already narrowed
 * to the enum and the label lookup needs no cast.
 */
function composeFallback(payload: ContactInput): string {
  const lines = [payload.message.trim(), "", "—", `${payload.name} <${payload.email}>`];
  if (payload.company) lines.push(payload.company);
  if (payload.role) lines.push(payload.role);
  lines.push(`Enquiry: ${projectTypeLabels[payload.projectType]}`);
  if (payload.budget && payload.budget !== "not-applicable") {
    lines.push(`Budget: ${budgetLabels[payload.budget]}`);
  }
  return lines.join("\n");
}
