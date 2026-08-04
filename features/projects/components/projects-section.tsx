import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTIONS } from "@/constants/sections";
import { ProjectGrid } from "@/features/projects/components/project-grid";

/**
 * Projects.
 *
 * Backfilled from Sprint 2, which is not in this repository — the assistant, the command
 * palette and global search all index projects, so the slice had to exist for Sprint 3 to
 * be coherent. The shape is final; the entries in `data/projects.ts` are content to expand.
 *
 * A Server Component wrapping one client leaf.
 */
export function ProjectsSection() {
  return (
    <Section
      id={SECTIONS.projects}
      spacing="lg"
      ariaLabelledBy="projects-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-14 lg:gap-16"
    >
      <SectionHeader
        badge="Projects"
        headingId="projects-heading"
        title="Work where the hard part was correctness."
        description="Payment flows that must settle exactly once, search that has to match intent, retrieval that refuses to guess. Filter by area, or ask the assistant to pull a set for you."
        size="lg"
      />

      <ProjectGrid />
    </Section>
  );
}
