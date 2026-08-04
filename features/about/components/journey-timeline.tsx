"use client";

import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { journey } from "@/data/journey";
import { cn } from "@/lib/utils";

export interface JourneyTimelineProps {
  className?: string;
}

/**
 * The About journey.
 *
 * A client component because it renders Lucide icon components held in `data/`,
 * and because the rail is drawn from scroll progress. The scroll work lives in
 * `Timeline`, so this file is only the binding between the data and the primitive.
 *
 * Ordered oldest first, which is the direction the reader scrolls — the rail then
 * fills forward through time rather than backwards through it.
 */
export function JourneyTimeline({ className }: JourneyTimelineProps) {
  return (
    <Timeline label="Career journey" className={cn(className)}>
      {journey.map((entry, index) => {
        const Icon = entry.icon;

        return (
          <TimelineItem
            key={entry.id}
            period={entry.period}
            current={entry.current}
            last={index === journey.length - 1}
            marker={<Icon aria-hidden="true" />}
          >
            <h3
              className={cn(
                "text-base font-semibold tracking-tight",
                entry.current ? "text-foreground" : "text-foreground/90",
              )}
            >
              {entry.title}
            </h3>
            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">
              {entry.body}
            </p>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
