"use client";

import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTIONS } from "@/constants/sections";
import {
  ROADMAP_STATUS_META,
  getTrackProgress,
  roadmapTotals,
  roadmapTracks,
} from "@/data/roadmap";
import { RoadmapNode } from "@/features/roadmap/components/roadmap-node";
import { cn } from "@/lib/utils";
import type { RoadmapStatus } from "@/types/explore";

/**
 * The learning roadmap.
 *
 * A client component because it renders Lucide icons held in `data/` and because each node
 * is an interactive disclosure.
 *
 * The layout is three tracks rather than one long list, because the tracks progress
 * independently — being three nodes into Applied AI says nothing about Core Backend, and a
 * single timeline would imply an order that does not exist.
 *
 * Only the first `learning` node in each track opens by default. That is the one a reader
 * actually wants: it is the edge of competence, which is the whole point of publishing a
 * roadmap.
 */
const STATUS_DOT: Record<RoadmapStatus, string> = {
  completed: "bg-success",
  learning: "bg-primary",
  planned: "bg-border-strong",
};

export function RoadmapSection() {
  return (
    <Section
      id={SECTIONS.roadmap}
      spacing="lg"
      ariaLabelledBy="roadmap-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          badge="Roadmap"
          headingId="roadmap-heading"
          title="Where the edge of competence actually is."
          description="Published honestly, including the parts that are not done. A roadmap where everything is complete is a CV; this one shows what is in progress and what is queued, with a reason for the ordering."
          size="lg"
        />

        <dl className="flex shrink-0 gap-6 lg:pb-1">
          {(Object.keys(ROADMAP_STATUS_META) as RoadmapStatus[]).map((status) => (
            <div key={status} className="flex flex-col gap-1.5">
              <dd className="text-3xl font-semibold tracking-tighter text-foreground tabular-nums">
                {roadmapTotals[status]}
              </dd>
              <dt className="flex items-center gap-2 font-mono text-2xs tracking-widest text-subtle uppercase">
                <span
                  aria-hidden="true"
                  className={cn("size-1.5 rounded-full", STATUS_DOT[status])}
                />
                {ROADMAP_STATUS_META[status].label}
              </dt>
            </div>
          ))}
        </dl>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
        {roadmapTracks.map((track, trackIndex) => {
          const TrackIcon = track.icon;
          const progress = getTrackProgress(track.id);
          // The first in-progress node is the interesting one, so it opens by default.
          const defaultOpenId = track.nodes.find((node) => node.status === "learning")?.id;

          return (
            <Reveal
              key={track.id}
              effect="up"
              distance={18}
              delay={0.08 * trackIndex}
              as="section"
              className="flex flex-col gap-5"
            >
              <header className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-xl",
                      "border border-border bg-elevated text-muted",
                      "[&_svg]:size-4",
                    )}
                  >
                    <TrackIcon />
                  </span>

                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {track.label}
                  </h3>

                  <span className="ml-auto font-mono text-2xs text-subtle">
                    {progress.completed}/{progress.total}
                  </span>
                </div>

                <p className="text-sm leading-relaxed text-muted">{track.summary}</p>

                {/* Progress is derived from the node statuses, so the bar cannot
                    disagree with the list beneath it. */}
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={progress.total}
                  aria-valuenow={progress.completed}
                  aria-label={`${track.label}: ${progress.completed} of ${progress.total} complete`}
                  className="h-px w-full overflow-hidden bg-border"
                >
                  <div
                    className="h-full bg-linear-to-r from-success to-primary transition-[width] duration-[var(--duration-slower)]"
                    style={{
                      // Derived percentage; no static class can express it.
                      width: `${progress.total === 0 ? 0 : (progress.completed / progress.total) * 100}%`,
                    }}
                  />
                </div>
              </header>

              <ul className="flex flex-col gap-3">
                {track.nodes.map((node) => (
                  <RoadmapNode
                    key={node.id}
                    node={node}
                    defaultOpen={node.id === defaultOpenId}
                  />
                ))}
              </ul>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
