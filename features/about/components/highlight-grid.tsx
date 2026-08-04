"use client";

import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { TiltCard } from "@/components/animation/tilt-card";
import { GlassCard } from "@/components/ui/glass-card";
import { highlights } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface HighlightGridProps {
  className?: string;
}

/**
 * Capability tiles beneath the About split.
 *
 * `TiltCard` supplies the 3D lean and the pointer highlight, and degrades to a
 * plain wrapper on touch and under reduced motion — so this grid needs no
 * capability checks of its own.
 *
 * The icon animation is CSS on hover rather than a Framer variant. It is a
 * two-property transition on a leaf node; a motion component per tile would add
 * runtime for something the compositor already does for free.
 */
export function HighlightGrid({ className }: HighlightGridProps) {
  return (
    <Stagger
      as="ul"
      gap={0.06}
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {highlights.map((highlight) => {
        const Icon = highlight.icon;

        return (
          <StaggerItem as="li" key={highlight.id} className="h-full">
            <TiltCard maxRotation={5} className="h-full">
              <GlassCard
                interactive
                padding="md"
                radius="2xl"
                // `TiltCard` already runs a pointer-tracked highlight on this
                // node's parent; a second one here would mean two listeners
                // sampling the same pointer for one visual effect.
                glow={false}
                className="group/tile flex h-full flex-col gap-3.5"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    "border border-border bg-elevated text-muted",
                    "transition-[color,border-color,transform] duration-[var(--duration-slow)]",
                    "ease-[var(--ease-out-back)]",
                    "group-hover/tile:scale-105 group-hover/tile:border-accent/40",
                    "group-hover/tile:text-accent",
                  )}
                >
                  <Icon className="size-4" />
                </span>

                <h3 className="text-sm font-semibold tracking-tight text-foreground">
                  {highlight.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{highlight.body}</p>
              </GlassCard>
            </TiltCard>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
