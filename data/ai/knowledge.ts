import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { achievements } from "@/data/achievements";
import { publishedPosts } from "@/data/blog";
import { currentExperience, experience } from "@/data/experience";
import { aboutIntro, storyCards } from "@/data/profile";
import { projects } from "@/data/projects";
import { roadmapTotals, roadmapTracks } from "@/data/roadmap";
import { allTechnologies, skillCategories } from "@/data/skills";

/**
 * The assistant's factual base.
 *
 * Composed from the data the rest of the site already renders rather than restated.
 * That is the whole point: the assistant cannot contradict the page, because it is
 * reading the same source. If the Experience section says 2024, the assistant says
 * 2024, and neither can drift.
 *
 * The only original content here is narrative — short passages that answer a
 * conversational question, which no card on the page needs.
 *
 * `serialise()` at the bottom is the LLM seam: it flattens everything into the
 * context block a model would receive. Today nothing calls it in production; it
 * exists so that switching engines is a configuration change.
 */

export const identity = {
  name: siteConfig.name,
  firstName: siteConfig.firstName,
  role: siteConfig.role,
  location: siteConfig.location,
  email: siteConfig.email,
  availability: siteConfig.availability,
  tagline: siteConfig.tagline,
} as const;

/* -------------------------------------------------------------------------- */
/*  Narrative                                                                 */
/* -------------------------------------------------------------------------- */

export const narrative = {
  /** Answer to "who is he?" — two sentences, third person, no marketing. */
  introduction: `${identity.firstName} is a ${identity.role.toLowerCase()} based in ${identity.location}. He builds Spring Boot services, payment and search integrations, and AI features that have to hold up in production rather than in a demo.`,

  /** Answer to "tell me about his experience". */
  experienceSummary: currentExperience
    ? `He works as ${currentExperience.role} at ${currentExperience.company} (${currentExperience.period}), across a live commerce stack — Magento storefront work, Salesforce Marketing Cloud, payment gateway integrations, OpenSearch relevance and Azure delivery. Alongside that he has moved the team's newer work towards Java services and AI-assisted internal tooling.`
    : "Experience details are not configured yet.",

  /** Answer to "what is he working on / focused on now?". */
  currentFocus:
    storyCards.find((card) => card.id === "focus")?.body ??
    "Deepening Spring Boot and JPA on the backend while shipping AI features that earn their place.",

  /** Answer to "how does he work?" — the thing a CV cannot say. */
  approach: aboutIntro,

  /** Used when a question is understood but out of scope. */
  scope:
    "I only know what is on this site — his background, experience, projects, skills, roadmap, achievements and writing. For anything else, email is the fastest route.",
} as const;

/* -------------------------------------------------------------------------- */
/*  Structured views                                                          */
/* -------------------------------------------------------------------------- */

export const knowledge = {
  identity,
  narrative,

  experience,
  currentExperience,

  projects,
  projectCount: projects.length,

  skillCategories,
  technologyNames: allTechnologies.map((technology) => technology.name),
  technologyCount: allTechnologies.length,

  achievements,
  achievementCount: achievements.length,

  roadmapTracks,
  roadmapTotals,

  posts: publishedPosts,

  links: {
    github: socialConfig.links.find((link) => link.id === "github")?.href ?? "",
    linkedin: socialConfig.links.find((link) => link.id === "linkedin")?.href ?? "",
    x: socialConfig.links.find((link) => link.id === "x")?.href ?? "",
    email: `mailto:${identity.email}`,
    /** Ships in a later sprint; the assistant says so rather than linking to a 404. */
    resume: "/resume.pdf",
    resumeAvailable: false,
  },
} as const;

export type Knowledge = typeof knowledge;

/**
 * Flattens the knowledge base into a plain-text context block.
 *
 * This is what would be sent to a model as grounding context. Kept here rather than
 * in the service so that the knowledge and its serialisation stay in one file —
 * adding a fact and forgetting to expose it to the model is the failure this
 * prevents.
 */
export function serialiseKnowledge(): string {
  const lines: string[] = [
    `# ${identity.name}`,
    `Role: ${identity.role}`,
    `Location: ${identity.location}`,
    `Availability: ${identity.availability.open ? identity.availability.label : "Not currently open to new work"}`,
    "",
    "## Introduction",
    narrative.introduction,
    "",
    "## Approach",
    narrative.approach,
    "",
    "## Experience",
    narrative.experienceSummary,
  ];

  for (const entry of experience) {
    lines.push(
      "",
      `### ${entry.role} — ${entry.company} (${entry.period})`,
      entry.summary,
      "Responsibilities:",
      ...entry.responsibilities.map((item) => `- ${item}`),
      "Achievements:",
      ...entry.achievements.map((item) => `- ${item}`),
      `Technologies: ${entry.technologies.join(", ")}`,
    );
  }

  lines.push("", "## Projects");
  for (const project of projects) {
    lines.push(
      "",
      `### ${project.name} (${project.period}, ${project.status})`,
      project.summary,
      `Domains: ${project.domains.join(", ")}`,
      `Stack: ${project.stack.join(", ")}`,
      "Highlights:",
      ...project.highlights.map((item) => `- ${item}`),
    );
  }

  lines.push("", "## Skills");
  for (const category of skillCategories) {
    lines.push(
      "",
      `### ${category.label}`,
      category.summary,
      ...category.technologies.map(
        (technology) =>
          `- ${technology.name} (${technology.proficiency}): ${technology.description}`,
      ),
    );
  }

  lines.push("", "## Learning roadmap");
  for (const track of roadmapTracks) {
    lines.push(
      "",
      `### ${track.label}`,
      ...track.nodes.map((node) => `- ${node.label} [${node.status}]: ${node.detail}`),
    );
  }

  lines.push(
    "",
    "## Achievements",
    ...achievements.map(
      (entry) => `- ${entry.title} (${entry.issuer}, ${entry.period}): ${entry.description}`,
    ),
  );

  lines.push(
    "",
    "## Writing",
    ...publishedPosts.map((post) => `- ${post.title}: ${post.description}`),
  );

  lines.push(
    "",
    "## Links",
    `GitHub: ${knowledge.links.github}`,
    `LinkedIn: ${knowledge.links.linkedin}`,
    `Email: ${identity.email}`,
    `Résumé available: ${knowledge.links.resumeAvailable ? "yes" : "not yet published"}`,
  );

  return lines.join("\n");
}
