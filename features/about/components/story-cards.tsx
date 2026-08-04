"use client";

import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { GlassCard } from "@/components/ui/glass-card";
import { storyCards } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface StoryCardsProps {
  className?: string;
}

/**
 * Mission, passion, current focus and what comes next — as cards rather than prose.
 *
 * Four short cards are read; four paragraphs are skipped. Each one is capped at
 * roughly two sentences by the copy in `data/profile.ts`, which is the actual
 * constraint that keeps this section readable.
 *
 * `GlassCard` supplies the surface and the pointer-tracked spotlight; this
 * component adds only the icon treatment and the stagger.
 */
export function StoryCards({ className }: StoryCardsProps) {
  return (
    <Stagger as="ul" gap={0.09} className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {storyCards.map((card) => {
        const Icon = card.icon;

        return (
          <StaggerItem as="li" key={card.id} className="h-full">
            <GlassCard
              interactive
              padding="md"
              radius="2xl"
              className="group/story flex h-full flex-col gap-4"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-10 shrink-0 place-items-center rounded-xl",
                  "border border-border bg-elevated text-muted",
                  "transition-[color,transform,border-color] duration-[var(--duration-slow)]",
                  "ease-[var(--ease-out-back)]",
                  "group-hover/story:-translate-y-0.5 group-hover/story:border-primary/40",
                  "group-hover/story:text-primary",
                )}
              >
                <Icon className="size-4.5" />
              </span>

              <div className="flex flex-col gap-2">
                <p className="eyebrow">{card.kicker}</p>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">{card.body}</p>
              </div>
            </GlassCard>
          </StaggerItem>
        );
      })}
    </Stagger>
  );
}
