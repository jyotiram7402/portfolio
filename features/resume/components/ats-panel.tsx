import { Check, CircleDashed, Minus, ShieldCheck } from "lucide-react";

import { GlassCard } from "@/components/ui/glass-card";
import { atsChecks, atsSummary } from "@/data/resume";
import { cn } from "@/lib/utils";
import type { AtsCheck } from "@/types/hiring";

export interface AtsPanelProps {
  className?: string;
}

const STATUS_STYLE: Record<
  AtsCheck["status"],
  { icon: typeof Check; tone: string; label: string }
> = {
  pass: { icon: Check, tone: "border-success/35 bg-success/12 text-success", label: "Pass" },
  partial: {
    icon: Minus,
    tone: "border-warning/35 bg-warning/12 text-warning",
    label: "Partial",
  },
  todo: {
    icon: CircleDashed,
    tone: "border-border bg-elevated text-subtle",
    label: "To do",
  },
};

/**
 * ATS readiness, as a checklist.
 *
 * Not a score out of 100, and that is the point. No applicant tracking system publishes its
 * rubric, so any single number would be invented — and a portfolio that invents a number about
 * its own résumé has undermined the résumé.
 *
 * Each row is instead a property of the document that anyone can verify by opening it: one column,
 * selectable text, standard headings, no tables. The count in the header is derived from the rows
 * rather than typed, so it cannot drift.
 *
 * The two non-passing rows are left visible on purpose. A checklist where everything passes is a
 * checklist nobody believes.
 *
 * A Server Component.
 */
export function AtsPanel({ className }: AtsPanelProps) {
  return (
    <GlassCard
      padding="lg"
      radius="3xl"
      glow={false}
      className={cn("flex flex-col gap-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-10 shrink-0 place-items-center rounded-xl",
              "border border-border bg-elevated text-muted",
            )}
          >
            <ShieldCheck className="size-4" />
          </span>

          <div className="flex flex-col gap-0.5">
            <h3 className="text-base font-semibold tracking-tight text-foreground">
              ATS readiness
            </h3>
            <p className="text-xs text-subtle">
              {atsSummary.passing} of {atsSummary.total} checks passing
            </p>
          </div>
        </div>

        {/* Derived from the rows, so the bar cannot disagree with the list beneath it. */}
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={atsSummary.total}
          aria-valuenow={atsSummary.passing}
          aria-label={`${atsSummary.passing} of ${atsSummary.total} ATS checks passing`}
          className="mt-3 h-1 w-24 shrink-0 overflow-hidden rounded-full bg-input"
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-success to-primary"
            style={{ width: `${(atsSummary.passing / atsSummary.total) * 100}%` }}
          />
        </div>
      </div>

      <p className="text-sm leading-relaxed text-muted">
        A checklist rather than a score. No tracking system publishes its rubric, so a number out
        of 100 would be invented — each of these is a property of the file you can confirm by
        opening it.
      </p>

      <ul className="flex flex-col divide-y divide-border">
        {atsChecks.map((check) => {
          const style = STATUS_STYLE[check.status];
          const Icon = style.icon;

          return (
            <li key={check.id} className="flex gap-3.5 py-3.5 first:pt-0 last:pb-0">
              <span
                aria-hidden="true"
                className={cn(
                  "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                  style.tone,
                )}
              >
                <Icon className="size-2.5" strokeWidth={3} />
              </span>

              <div className="flex min-w-0 flex-col gap-1">
                <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                  {check.label}
                  <span className="font-mono text-2xs tracking-wider text-subtle uppercase">
                    {style.label}
                  </span>
                </p>
                <p className="text-xs leading-relaxed text-muted">{check.detail}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
