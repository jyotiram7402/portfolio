/**
 * Home-page section ids.
 *
 * The single definition shared by four consumers that must agree exactly: the `id`
 * on each `<Section>`, the hash in `config/navigation.ts`, the scroll-spy observer
 * in `useActiveSection`, and the search index in `lib/search-index.ts`. A typo in
 * any one of them would silently break an anchor, so none of them writes the
 * string itself.
 */
export const SECTIONS = {
  hero: "hero",
  about: "about",
  experience: "experience",
  skills: "skills",
  projects: "projects",
  assistant: "assistant",
  writing: "writing",
  roadmap: "roadmap",
  achievements: "achievements",
  github: "github",
  resources: "resources",
  speaking: "speaking",
  newsletter: "newsletter",
  contact: "contact",
} as const;

export type SectionId = (typeof SECTIONS)[keyof typeof SECTIONS];

/**
 * Sections that appear in the primary navigation, in nav order.
 *
 * Deliberately a subset. Thirteen sections in a navbar is a directory, not a
 * navigation — the rest are reachable by scrolling, by the command palette, and
 * from the footer.
 */
export const NAV_SECTIONS: readonly SectionId[] = [
  SECTIONS.about,
  SECTIONS.projects,
  SECTIONS.assistant,
  SECTIONS.skills,
  SECTIONS.writing,
];

/**
 * Every section, in document order, with a human label.
 *
 * Feeds the command palette's "jump to" group and the global search index, so a
 * new section becomes navigable everywhere by being added here once.
 */
export const SECTION_INDEX: readonly { id: SectionId; label: string; hint: string }[] = [
  { id: SECTIONS.hero, label: "Top", hint: "Back to the start" },
  { id: SECTIONS.about, label: "About", hint: "Background and journey" },
  { id: SECTIONS.experience, label: "Experience", hint: "Where I have worked" },
  { id: SECTIONS.projects, label: "Projects", hint: "Selected build work" },
  { id: SECTIONS.assistant, label: "AI Assistant", hint: "Ask about my work" },
  { id: SECTIONS.skills, label: "Skills", hint: "Technology explorer" },
  { id: SECTIONS.writing, label: "Writing", hint: "Latest articles" },
  { id: SECTIONS.roadmap, label: "Roadmap", hint: "What I am learning next" },
  { id: SECTIONS.achievements, label: "Achievements", hint: "Certificates and wins" },
  { id: SECTIONS.github, label: "GitHub", hint: "Live repository activity" },
  { id: SECTIONS.resources, label: "Resources", hint: "Books, courses and tools" },
  { id: SECTIONS.speaking, label: "Speaking", hint: "Talks and workshops" },
  { id: SECTIONS.newsletter, label: "Newsletter", hint: "Subscribe for new writing" },
  { id: SECTIONS.contact, label: "Contact", hint: "Ways to start a conversation" },
];
