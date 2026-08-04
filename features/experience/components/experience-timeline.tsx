"use client";

import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { experience } from "@/data/experience";
import { ExperienceCard } from "@/features/experience/components/experience-card";
import { cn } from "@/lib/utils";

export interface ExperienceTimelineProps {
  className?: string;
}

/**
 * The professional timeline.
 *
 * Newest first, which is the CV convention and what a reader scanning for the
 * current role expects. The rail is drawn by `Timeline` as the section scrolls,
 * and each node holds a full `ExperienceCard`.
 *
 * Only the current position is `featured`, so the timeline has a clear focal point
 * instead of two equally weighted blocks competing for attention.
 */
export function ExperienceTimeline({ className }: ExperienceTimelineProps) {
  return (
    <Timeline label="Work history" className={cn(className)}>
      {experience.map((entry, index) => {
        const Icon = entry.icon;

        return (
          <TimelineItem
            key={entry.id}
            period={entry.period}
            current={entry.current}
            last={index === experience.length - 1}
            marker={<Icon aria-hidden="true" />}
          >
            <ExperienceCard entry={entry} featured={entry.current ?? false} />
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}
