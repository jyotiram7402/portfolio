"use client";

import { type CSSProperties, useId } from "react";

import { TiltCard } from "@/components/animation/tilt-card";
import { PROFICIENCY_META } from "@/data/skills";
import { getTechBrand } from "@/lib/tech-brand";
import { cn } from "@/lib/utils";
import type { Technology } from "@/types/skills";

export interface TechCardProps {
  technology: Technology;
  /** Keeps the description open after a click — the path for touch and keyboard. */
  pinned: boolean;
  onTogglePin: (id: string) => void;
}

/**
 * One technology in the explorer.
 *
 * A real `<button>` with `aria-expanded`, not a hover-only card. That single
 * decision solves the accessibility problem this pattern usually has: hover
 * reveals the description for a mouse, focus reveals it for a keyboard, and a tap
 * pins it open on touch, where there is no hover to rely on.
 *
 * The card height is fixed and the description is an absolutely positioned overlay,
 * so revealing it can never reflow the grid.
 *
 * The visual layers are `aria-hidden` and the real text is exposed once through
 * `aria-describedby`, on an element outside the button. Putting it inside would
 * fold the whole description into the button's accessible name; a sibling keeps
 * the name as "Java, Core" and offers the detail as a description.
 *
 * `TiltCard` supplies the lean and the pointer highlight and no-ops on touch and
 * under reduced motion, so there are no capability checks here.
 *
 * The chip carries a brand mark where one exists and a semantic glyph where the entry
 * is a concept rather than a product — `lib/tech-brand.ts` owns that decision, and its
 * header records why the brand colour tints the chip instead of painting the glyph.
 */
export function TechCard({ technology, pinned, onTogglePin }: TechCardProps) {
  const meta = PROFICIENCY_META[technology.proficiency];
  const descriptionId = useId();
  const { Glyph, color } = getTechBrand(technology);

  const dots = [0, 1, 2];

  return (
    <TiltCard maxRotation={7} className="h-full">
      <button
        type="button"
        onClick={() => onTogglePin(technology.id)}
        aria-expanded={pinned}
        aria-describedby={descriptionId}
        data-pinned={pinned || undefined}
        className={cn(
          "group/tech relative flex h-40 w-full flex-col justify-between overflow-hidden",
          "rounded-2xl border border-border bg-card p-4 text-left",
          "transition-[border-color,box-shadow] duration-[var(--duration-normal)]",
          "ease-[var(--ease-out-quint)]",
          "hover:border-primary/40 hover:shadow-glow",
          "data-[pinned]:border-primary/50 data-[pinned]:shadow-glow",
          "focus-ring",
        )}
      >
        {/* Resting layer. Fades out as the description takes over. */}
        <span
          className={cn(
            "flex flex-col gap-3 transition-opacity duration-[var(--duration-normal)]",
            "group-hover/tech:opacity-0",
            "group-focus-visible/tech:opacity-0",
            "group-data-[pinned]/tech:opacity-0",
          )}
        >
          {/* The brand chip. `--brand` is data, not styling — it varies per
              technology, which no static class can express. Same justification as
              the orbit angle in `tech-orbit.tsx`. */}
          <span
            aria-hidden="true"
            style={color ? ({ "--brand": color } as CSSProperties) : undefined}
            className={cn(
              "brand-chip grid size-9 shrink-0 place-items-center rounded-lg border",
              "text-foreground",
            )}
          >
            <Glyph className="size-4.5" />
          </span>

          <span className="text-sm leading-snug font-semibold tracking-tight text-foreground">
            {technology.name}
          </span>
        </span>

        {/* Reveal layer. Hidden from assistive tech — it repeats what
            `aria-describedby` already provides. */}
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-4 top-4 bottom-11",
            "opacity-0 transition-opacity duration-[var(--duration-normal)]",
            "group-hover/tech:opacity-100",
            "group-focus-visible/tech:opacity-100",
            "group-data-[pinned]/tech:opacity-100",
          )}
        >
          {/* `leading-snug` rather than `relaxed`: the reveal has a fixed box, and
              the longest descriptions need six lines to fit inside it. */}
          <span className="block text-xs leading-snug text-muted">
            {technology.description}
          </span>
        </span>

        {/* Depth indicator, visible in both states — the one thing worth reading
            at a glance across the whole grid. */}
        <span className="relative flex items-center justify-between gap-2">
          <span aria-hidden="true" className="flex items-center gap-1">
            {dots.map((dot) => (
              <span
                key={dot}
                className={cn(
                  "size-1 rounded-full",
                  dot < meta.dots ? "bg-primary" : "bg-border-strong opacity-40",
                )}
              />
            ))}
          </span>

          <span className="font-mono text-2xs tracking-wider text-subtle uppercase">
            {meta.label}
          </span>
        </span>
      </button>

      <span id={descriptionId} className="sr-only">
        {meta.label} — {meta.description}. {technology.description}
      </span>
    </TiltCard>
  );
}
