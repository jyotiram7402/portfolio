"use client";

import { Check, MapPin, Sparkles } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Divider } from "@/components/ui/divider";
import { cn } from "@/lib/utils";
import type { ExperienceEntry } from "@/types/profile";

export interface ExperienceCardProps {
  entry: ExperienceEntry;
  /** The featured position gets the fuller treatment. */
  featured?: boolean;
  className?: string;
}

/**
 * One position.
 *
 * Props-driven rather than data-bound, so the same card renders the current role,
 * a past role and the education entry. The `featured` flag is the only branch: it
 * controls whether achievements and the full responsibility list are shown, which
 * is what keeps a two-entry timeline from reading as two identical blocks.
 *
 * Responsibilities and achievements are real lists, not styled divs — a screen
 * reader announces "list, six items", which is exactly the structure a reader
 * scanning a CV wants.
 */
export function ExperienceCard({
  entry,
  featured = false,
  className,
}: ExperienceCardProps) {
  const responsibilities = featured
    ? entry.responsibilities
    : entry.responsibilities.slice(0, 2);

  return (
    <GlassCard
      interactive
      padding="none"
      radius="3xl"
      surface={featured ? "elevated" : "glass"}
      className={cn("flex flex-col", className)}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header                                                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className={cn(
                "grid size-12 shrink-0 place-items-center rounded-2xl",
                "border border-border bg-card",
                "font-mono text-sm font-medium tracking-wide",
                featured ? "text-primary" : "text-muted",
              )}
            >
              {entry.monogram}
            </span>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {entry.role}
              </h3>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                <span className="font-medium text-foreground/90">{entry.company}</span>
                <span aria-hidden="true" className="text-border-strong">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="size-3" />
                  {entry.location}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {entry.current ? (
              <Badge tone="success" size="sm" dot pulse>
                Current
              </Badge>
            ) : null}
            <Badge tone="default" size="sm" className="font-mono">
              {entry.period}
            </Badge>
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-muted">{entry.summary}</p>

        <ul className="flex flex-wrap gap-1.5">
          {entry.technologies.map((technology) => (
            <li key={technology}>
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-full border border-border",
                  "bg-input px-2.5 font-mono text-2xs text-muted",
                )}
              >
                {technology}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Divider />

      {/* ------------------------------------------------------------------ */}
      {/* Body                                                               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className={cn(
          "grid gap-8 p-6 sm:p-8",
          featured && entry.achievements.length > 0 && "lg:grid-cols-2 lg:gap-10",
        )}
      >
        <section aria-label={`Responsibilities at ${entry.company}`}>
          <h4 className="eyebrow mb-4">What I do</h4>
          <ul className="flex flex-col gap-3">
            {responsibilities.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span
                  aria-hidden="true"
                  className="mt-2 size-1 shrink-0 rounded-full bg-border-strong"
                />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {featured && entry.achievements.length > 0 ? (
          <section aria-label={`Achievements at ${entry.company}`}>
            <h4 className="eyebrow mb-4 flex items-center gap-2">
              <Sparkles aria-hidden="true" className="size-3" />
              Shipped
            </h4>
            <ul className="flex flex-col gap-3">
              {entry.achievements.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 text-sm leading-relaxed text-foreground/85"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 grid size-4 shrink-0 place-items-center rounded-full",
                      "bg-success/15 text-success",
                    )}
                  >
                    <Check className="size-2.5" strokeWidth={3} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </GlassCard>
  );
}
