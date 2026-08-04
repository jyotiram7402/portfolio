import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Divider } from "@/components/ui/divider";
import { SECTIONS } from "@/constants/sections";
import { aboutIntro } from "@/data/profile";
import { HighlightGrid } from "@/features/about/components/highlight-grid";
import { JourneyTimeline } from "@/features/about/components/journey-timeline";
import { StoryCards } from "@/features/about/components/story-cards";

/**
 * About.
 *
 * A Server Component composing three client leaves. The split is 5/7 rather than
 * 50/50: the timeline is a narrow rail of short entries, while the story cards need
 * room to hold two-sentence bodies without becoming three lines of one word.
 *
 * The timeline is `sticky` above `lg` so it stays in view while the reader moves
 * through the story column beside it — the two halves are meant to be read
 * together, not one after the other. Below `lg` it unsticks and simply stacks.
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
