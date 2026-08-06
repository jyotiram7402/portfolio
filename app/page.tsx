import type { Metadata } from "next";
import dynamic from "next/dynamic";

import { StructuredData } from "@/components/common/structured-data";
import { faqEntries } from "@/data/ai";
import { projects } from "@/data/projects";
import { AboutSection } from "@/features/about";
import { AssistantSection } from "@/features/ai-assistant";
import { WritingSection } from "@/features/blog";
import { ContactSection } from "@/features/contact";
import { ExperienceSection } from "@/features/experience";
import { GithubSection } from "@/features/github";
import { HeroSection, StatementBand } from "@/features/hero";
import { NewsletterSection } from "@/features/newsletter";
import { ProjectsSection } from "@/features/projects";
import { SkillsSection } from "@/features/skills";
import { SpeakingSection } from "@/features/speaking";
import { StatsBand } from "@/features/stats";
import { buildMetadata } from "@/lib/metadata";
import { faqSchema, projectListSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildMetadata({ path: "/" });

/**
 * Below-the-fold sections that are heavy and interactive.
 *
 * Each is its own chunk, fetched as the visitor scrolls towards it rather than on first
 * paint. All three carry per-node state and pointer handlers, and none of them is visible
 * until well past the hero — which makes them exactly the wrong thing to put in the initial
 * bundle.
 *
 * `ssr: true` is intentional (it is the default). These are code-split, not client-only:
 * the markup is still server-rendered, so the content is in the HTML for crawlers and for
 * anyone reading without JavaScript.
 */
const RoadmapSection = dynamic(() =>
  import("@/features/roadmap").then((module) => module.RoadmapSection),
);

const AchievementsSection = dynamic(() =>
  import("@/features/achievements").then((module) => module.AchievementsSection),
);

const ResourcesSection = dynamic(() =>
  import("@/features/resources").then((module) => module.ResourcesSection),
);

/**
 * Home.
 *
 * A composition, nothing more. Every section is a feature slice with its own data, client
 * boundaries and accessible landmark — the page's only job is to declare reading order.
 *
 * That order is intentional: state the claim (hero, statement), back it with figures (stats),
 * establish who and what (about, experience), show the work (projects), offer a shortcut
 * through all of it (assistant), then reward exploration (skills, writing, roadmap,
 * achievements, GitHub, resources, speaking) before asking for anything (newsletter).
 *
 * `StatementBand` sits second because it reframes everything after it: the projects below are
 * not a gallery, they are evidence. It is deliberately not part of the hero — see the note in
 * that component about keeping the hero's calls to action above the fold.
 *
 * Section ids come from `constants/sections.ts` and are set inside each feature, so the
 * navigation anchors, the scroll spy and the search index cannot drift from what renders here.
 *
 * `FAQPage` markup is emitted here rather than in the root layout because the assistant —
 * whose visible answers it mirrors — only exists on this page. The project `ItemList` is here for
 * the same reason: this is where the projects are rendered.
 */
export default function HomePage() {
  return (
    <>
      <StructuredData
        data={[
          faqSchema(faqEntries),
          projectListSchema(
            projects.map((project) => ({
              name: project.name,
              description: project.tagline,
              stack: project.stack,
              url: project.links.find((link) => link.kind === "repo")?.href,
              period: project.period,
            })),
          ),
        ]}
      />

      <HeroSection />
      <StatementBand />
      <StatsBand />
      <AboutSection />
      <ExperienceSection />
      <ProjectsSection />
      <AssistantSection />
      <SkillsSection />
      <WritingSection />
      <RoadmapSection />
      <AchievementsSection />
      <GithubSection />
      <ResourcesSection />
      <SpeakingSection />
      <NewsletterSection />
      <ContactSection />
    </>
  );
}
