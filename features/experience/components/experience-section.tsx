import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTIONS } from "@/constants/sections";
import { ExperienceTimeline } from "@/features/experience/components/experience-timeline";

/**
 * Experience.
 *
 * A Server Component wrapping one client leaf. Deliberately full-width rather than
 * split: each entry is a dense card with two columns of its own, and squeezing that
 * into half a page would force the responsibility lists into one word per line.
 */
export function ExperienceSection() {
  return (
    <Section
      id={SECTIONS.experience}
      spacing="lg"
      ariaLabelledBy="experience-heading"
      containerSize="content"
      innerClassName="flex flex-col gap-14 lg:gap-16"
    >
      <SectionHeader
        badge="Experience"
        headingId="experience-heading"
        title="Shipping on systems that were already live."
        description="Payment gateways, enterprise integrations and AI-powered search — with real traffic behind them and no maintenance window to hide in. Plus a seat on the AI board, leading how the team adopts agentic tooling."
        size="lg"
      />

      <ExperienceTimeline />
    </Section>
  );
}
