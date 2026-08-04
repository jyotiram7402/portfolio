import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTIONS } from "@/constants/sections";
import { PROFICIENCY_META } from "@/data/skills";
import { SkillExplorer } from "@/features/skills/components/skill-explorer";
import { cn } from "@/lib/utils";

/**
 * Skills.
 *
 * A Server Component wrapping the explorer. The legend is rendered here, on the
 * server, because it is static — and it exists because the cards use a three-dot
 * depth indicator instead of a percentage. A scale with no key is decoration; a
 * scale with a key is information.
 */
export function SkillsSection() {
  return (
    <Section
      id={SECTIONS.skills}
      spacing="lg"
      ariaLabelledBy="skills-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          badge="Skills"
          headingId="skills-heading"
          title="The stack, and what I actually do with it."
          description="No percentages — they cannot be verified and they say nothing. Each entry names the work instead, and the depth marker is honest about what is daily and what is new."
          size="lg"
        />

        <ul className="flex shrink-0 flex-col gap-2.5 lg:pb-1">
          {Object.entries(PROFICIENCY_META).map(([key, meta]) => (
            <li key={key} className="flex items-center gap-3 text-xs text-subtle">
              <span aria-hidden="true" className="flex items-center gap-1">
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className={cn(
                      "size-1 rounded-full",
                      dot < meta.dots ? "bg-primary" : "bg-border-strong opacity-40",
                    )}
                  />
                ))}
              </span>
              <span className="font-mono text-2xs tracking-wider text-muted uppercase">
                {meta.label}
              </span>
              <span>{meta.description}</span>
            </li>
          ))}
        </ul>
      </div>

      <SkillExplorer />
    </Section>
  );
}
