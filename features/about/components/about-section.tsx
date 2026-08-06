import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Divider } from "@/components/ui/divider";
import { SECTIONS } from "@/constants/sections";
import { aboutIntro } from "@/data/profile";
import { HighlightGrid } from "@/features/about/components/highlight-grid";
import { JourneyTimeline } from "@/features/about/components/journey-timeline";
import { StoryCards } from "@/features/about/components/story-cards";
import { SystemDiagram } from "@/features/about/components/system-diagram";

/**
 * About.
 *
 * A Server Component composing its leaves. The split is 5/7 rather than 50/50: the
 * timeline is a narrow rail of short entries, while the story cards need room to hold
 * two-sentence bodies without becoming three lines of one word.
 *
 * The timeline is `sticky` above `lg` so it stays in view while the reader moves
 * through the story column beside it — the two halves are meant to be read
 * together, not one after the other. Below `lg` it unsticks and simply stacks.
 *
 * The right column carries the story cards *and* the system diagram, which is what
 * gives the sticky rail something to sit beside for its full height. That pairing is
 * also the argument the section is making: the cards say how I work, the diagram shows
 * the thing it produced.
 */
export function AboutSection() {
  return (
    <Section
      id={SECTIONS.about}
      spacing="lg"
      ariaLabelledBy="about-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-16 lg:gap-20"
    >
      <SectionHeader
        badge="About"
        headingId="about-heading"
        title="I build the parts of a product that have to be right."
        description={aboutIntro}
        size="lg"
      />

      <div className="grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:self-start">
          {/* A label, not a heading — promoting it to `h3` would put the journey
              entries a level below the story cards they sit beside. */}
          <p className="eyebrow mb-8">The route here</p>
          <JourneyTimeline />
        </div>

        <div className="flex flex-col gap-8">
          <StoryCards />

          {/* The diagram is what makes the sticky rail work. The four story cards are
              shorter than the nine-entry timeline, so this column used to run out
              halfway down and leave the reader scrolling past an empty half-page. */}
          <Reveal effect="up" distance={20}>
            <SystemDiagram />
          </Reveal>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <Reveal effect="fade">
          <Divider label="What that looks like in practice" fade />
        </Reveal>

        <HighlightGrid />
      </div>
    </Section>
  );
}
