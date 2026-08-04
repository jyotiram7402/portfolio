"use client";

import { CalendarClock, ExternalLink, Video } from "lucide-react";
import { useCallback, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";
import { RESPONSE_TIME } from "@/data/contact";
import { hiringProfile } from "@/data/recruiter";
import { trackEvent } from "@/lib/analytics";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";

export interface BookingPanelProps {
  className?: string;
}

/**
 * Book a meeting.
 *
 * Lives in `components/common/` rather than in the contact slice because it has two callers — the
 * contact page and the recruiter dashboard — and features are not allowed to import each other.
 * Anything two slices need moves down a layer; that rule is what keeps the dependency graph
 * readable.
 *
 * Calendly-ready rather than Calendly-dependent. With `NEXT_PUBLIC_CALENDLY_URL` set, the embed is
 * loaded on demand behind a button; without it, the panel offers a pre-filled mailto with a
 * subject line, which is a working booking flow rather than a disabled button.
 *
 * Two decisions about the embed:
 *
 * **It is click-to-load, not auto-load.** A Calendly iframe pulls roughly 400 kB of third-party
 * JavaScript and sets cookies. Loading that on every page view — for the small fraction of
 * visitors who book — would cost the Lighthouse score and require a consent banner. Behind a
 * click it costs nothing until it is wanted, and the click is the consent.
 *
 * **`loading="lazy"` with an explicit height.** The height is reserved before the iframe exists,
 * so revealing it cannot shift the page.
 *
 * The agenda is stated up front because the most common reason a call is unproductive is that
 * nobody said what it was for.
 */
const AGENDA = [
  "What you are building, and where it is stuck",
  "Whether the work is actually a fit — including when it is not",
  "Scope, sequencing and what a first milestone looks like",
] as const;

export function BookingPanel({ className }: BookingPanelProps) {
  const [embedVisible, setEmbedVisible] = useState(false);
  const calendly = env.calendlyUrl;

  const onBook = useCallback(() => {
    trackEvent("meeting_intent", { route: calendly ? "calendly" : "email" });
    if (calendly) setEmbedVisible(true);
  }, [calendly]);

  const mailto = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    "Intro call",
  )}&body=${encodeURIComponent(
    "A couple of times that work for you, and roughly what you would like to cover.\n\n",
  )}`;

  return (
    <GlassCard
      padding="lg"
      radius="3xl"
      surface="elevated"
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-xl",
            "border border-primary/30 bg-primary/12 text-primary",
          )}
        >
          <Video className="size-5" />
        </span>

        <Badge tone="default" size="sm" dot pulse>
          {hiringProfile.availabilityLabel}
        </Badge>
      </div>

      <div className="flex flex-col gap-2.5">
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Book a 30-minute call
        </h3>
        <p className="text-sm leading-relaxed text-muted">
          Faster than three rounds of email. Bring the problem rather than a brief — the useful
          version of this call is the one where we work out whether there is a fit.
        </p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {AGENDA.map((item) => (
          <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
            <span
              aria-hidden="true"
              className="mt-1.5 size-1 shrink-0 rounded-full bg-primary/70"
            />
            {item}
          </li>
        ))}
      </ul>

      {calendly && embedVisible ? (
        <div className="flex flex-col gap-3">
          {/* Height reserved before the iframe exists, so revealing it shifts nothing. */}
          <div className="h-[38rem] overflow-hidden rounded-2xl border border-border bg-surface">
            <iframe
              src={`${calendly}?hide_gdpr_banner=1&background_color=0f172a&text_color=ffffff&primary_color=3b82f6`}
              title="Scheduling calendar"
              loading="lazy"
              className="size-full border-0"
            />
          </div>

          <a
            href={calendly}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex w-fit items-center gap-1.5 rounded text-xs text-subtle",
              "transition-colors hover:text-foreground focus-ring",
            )}
          >
            Open in a new tab instead
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {calendly ? (
            <Button size="lg" onClick={onBook}>
              <CalendarClock aria-hidden="true" className="size-4" />
              Show available times
            </Button>
          ) : (
            <Button asChild size="lg" onClick={onBook}>
              <a href={mailto}>
                <CalendarClock aria-hidden="true" className="size-4" />
                Propose a time by email
              </a>
            </Button>
          )}

          <p className="text-2xs leading-relaxed text-subtle">
            {calendly
              ? "The calendar loads only when you ask for it — no third-party scripts before then."
              : `Scheduling is not wired to a calendar yet, so email is the route. Replies ${RESPONSE_TIME.toLowerCase()}.`}
          </p>
        </div>
      )}
    </GlassCard>
  );
}
