import { ArrowUpRight, Mic, Play } from "lucide-react";

import { Reveal } from "@/components/animation/reveal";
import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassCard } from "@/components/ui/glass-card";
import { siteConfig } from "@/config/site";
import { SECTIONS } from "@/constants/sections";
import { TALK_KIND_META, speakingTopics, talks } from "@/data/speaking";
import { cn } from "@/lib/utils";

/**
 * Speaking.
 *
 * The honest version of this section. There is one internal session and one prepared
 * workshop, and inventing a conference circuit would be the single most checkable lie on
 * the site — so the section leads with the topics on offer and treats the history as
 * secondary.
 *
 * That inversion is the design: what a reader wants from a short speaking list is "would
 * you come and talk to my team about this", and the topics answer that. Adding entries to
 * `data/speaking.ts` fills the grid without any change here.
 *
 * A Server Component — nothing on it is interactive beyond links.
 */
export function SpeakingSection() {
  return (
    <Section
      id={SECTIONS.speaking}
      spacing="lg"
      ariaLabelledBy="speaking-heading"
      containerSize="content"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <SectionHeader
        badge="Speaking"
        headingId="speaking-heading"
        title="Happy to explain any of this properly."
        description="A short list, honestly labelled. Most of what I know is easier to explain in forty minutes with a whiteboard than in a blog post, so the topics matter more here than the history."
        size="lg"
      />

      <div className="grid gap-10 lg:grid-cols-[5fr_7fr] lg:gap-12">
        {/* ------------------------------------------------------------ topics -- */}
        <Reveal effect="up" distance={16} className="flex flex-col gap-5">
          <h3 className="eyebrow">Topics I can cover</h3>

          <ul className="flex flex-col gap-3">
            {speakingTopics.map((topic) => (
              <li
                key={topic}
                className="flex gap-3 text-sm leading-relaxed text-muted"
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md",
                    "border border-border bg-elevated text-subtle",
                  )}
                >
                  <Mic className="size-2.5" />
                </span>
                {topic}
              </li>
            ))}
          </ul>

          <Button asChild variant="secondary" className="w-fit">
            <a href={`mailto:${siteConfig.email}?subject=Speaking%20enquiry`}>
              Invite me to speak
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
        </Reveal>

        {/* ------------------------------------------------------------- talks -- */}
        <div className="flex flex-col gap-5">
          <h3 className="eyebrow">On the record</h3>

          {talks.length === 0 ? (
            <EmptyState
              icon={Mic}
              title="Nothing recorded yet"
              description="The section is wired and waiting. Sessions appear here the moment there is one worth linking to."
            />
          ) : (
            <Stagger as="ul" gap={0.08} className="flex flex-col gap-4">
              {talks.map((talk) => {
                const kindMeta = TALK_KIND_META[talk.kind];

                return (
                  <StaggerItem as="li" key={talk.id}>
                    <GlassCard
                      interactive
                      padding="md"
                      radius="2xl"
                      className="flex flex-col gap-3.5"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="outline" size="sm">
                          {kindMeta.label.replace(/s$/, "")}
                        </Badge>
                        {talk.upcoming ? (
                          <Badge tone="primary" size="sm" dot pulse>
                            Available
                          </Badge>
                        ) : null}
                        <span className="ml-auto font-mono text-2xs tracking-wider text-subtle uppercase">
                          {talk.date}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <h4 className="text-base leading-snug font-semibold tracking-tight text-foreground">
                          {talk.title}
                        </h4>
                        <p className="text-xs text-subtle">{talk.venue}</p>
                      </div>

                      <p className="text-sm leading-relaxed text-muted">
                        {talk.abstract}
                      </p>

                      {talk.href ? (
                        <a
                          href={talk.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            "inline-flex w-fit items-center gap-1.5 rounded-full",
                            "text-xs font-medium text-foreground underline-offset-4",
                            "transition-colors hover:underline focus-ring",
                          )}
                        >
                          <Play aria-hidden="true" className="size-3" />
                          Watch
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : null}
                    </GlassCard>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </div>
      </div>
    </Section>
  );
}
