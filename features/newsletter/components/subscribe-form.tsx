"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { ease } from "@/animations/easings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DURATION } from "@/config/animations";
import { STORAGE_KEYS } from "@/constants/storage-keys";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
// Imported from the schema module, not the service: the service reads a server-only
// environment variable and has no business in the client bundle.
import { subscribeSchema } from "@/services/newsletter.schema";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

export interface SubscribeFormProps {
  className?: string;
}

/**
 * Newsletter subscribe form.
 *
 * Validation uses the same Zod schema as the API route, imported rather than
 * reimplemented — client-side checks are a courtesy, and the route re-validates because
 * anything arriving at an endpoint is untrusted regardless of what sent it.
 *
 * Two bot defences, both invisible to a person:
 *
 * • **A honeypot field**, hidden from sight *and* from assistive tech, with
 *   `tabIndex={-1}` so it is unreachable by keyboard. Bots fill every field they parse.
 * • **A time check.** The mount timestamp travels with the submission; a form completed in
 *   under a second was not read.
 *
 * Both fail quietly — a submission that trips either is acknowledged normally, because a
 * bot that learns which signal caught it is a bot that adapts.
 *
 * The success state persists in `localStorage`, so a returning subscriber is not asked
 * again. That is the one thing here worth remembering across sessions.
 */
export function SubscribeForm({ className }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const mountedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEYS.newsletterSubscribed) === "1") {
        setState("success");
        setMessage("You are already on the list.");
      }
    } catch {
      // Storage blocked. The form simply behaves as if this is a first visit.
    }
  }, []);

  const onSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (state === "submitting" || state === "success") return;

      const parsed = subscribeSchema.safeParse({
        email,
        company: honeypotRef.current?.value ?? "",
        elapsedMs: Date.now() - mountedAt.current,
      });

      if (!parsed.success) {
        setState("error");
        setMessage(parsed.error.issues[0]?.message ?? "Check the address and try again.");
        return;
      }

      setState("submitting");
      setMessage(null);

      try {
        const response = await fetch("/api/newsletter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });

        const body = (await response.json()) as { error?: string; pending?: boolean };

        if (!response.ok) {
          setState("error");
          setMessage(body.error ?? "That did not go through. Try again shortly.");
          return;
        }

        setState("success");
        setMessage(
          body.pending
            ? "Saved. The mailing provider is not connected yet, so nothing will arrive until it is — this is honest rather than convenient."
            : "You are on the list. New writing only, no other email.",
        );

        try {
          localStorage.setItem(STORAGE_KEYS.newsletterSubscribed, "1");
        } catch {
          // Non-fatal; the success state still shows for this session.
        }
      } catch {
        setState("error");
        setMessage("Network request failed. Check the connection and try again.");
      }
    },
    [email, state],
  );

  const isSuccess = state === "success";

  return (
    <div className={cn("flex w-full max-w-md flex-col gap-3", className)}>
      <AnimatePresence mode="wait" initial={false}>
        {isSuccess ? (
          <motion.div
            key="success"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.slow, ease: ease.outBack }}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-success/35",
              "bg-success/10 px-4 py-3.5",
            )}
          >
            <motion.span
              aria-hidden="true"
              initial={reduceMotion ? false : { scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                duration: reduceMotion ? 0.01 : DURATION.slow,
                ease: ease.outBack,
                delay: reduceMotion ? 0 : 0.08,
              }}
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-full",
                "bg-success/20 text-success",
              )}
            >
              <Check className="size-4" strokeWidth={3} />
            </motion.span>

            <p className="text-sm leading-relaxed text-foreground">{message}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            {/* Honeypot. Hidden from sight, from assistive tech and from the tab
                order — the only thing that can fill it is a script. */}
            <input
              ref={honeypotRef}
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="pointer-events-none absolute size-0 opacity-0"
            />

            <Input
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (state === "error") setState("idle");
              }}
              placeholder="you@company.com"
              autoComplete="email"
              inputMode="email"
              required
              aria-label="Email address"
              invalid={state === "error"}
              describedBy={message ? "newsletter-message" : undefined}
              leading={<Mail />}
              className="flex-1"
            />

            <Button
              type="submit"
              size="lg"
              loading={state === "submitting"}
              className="shrink-0"
            >
              Subscribe
              {state === "submitting" ? null : (
                <ArrowRight aria-hidden="true" className="size-4" />
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* One live region for both outcomes, so a result is announced exactly once. */}
      <p
        id="newsletter-message"
        role="status"
        aria-live="polite"
        className={cn(
          "min-h-5 text-xs leading-relaxed",
          state === "error" ? "text-danger" : "text-subtle",
        )}
      >
        {isSuccess ? null : (message ?? "No spam, no tracking pixels. Unsubscribe in one click.")}
      </p>
    </div>
  );
}
