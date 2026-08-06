export {
  ACHIEVEMENT_KIND_META,
  achievementKinds,
  achievements,
} from "./achievements";
export {
  activeCategories,
  blogCategories,
  featuredPosts,
  getCategory,
  getPost,
  posts,
  publishedPosts,
} from "./blog";
export {
  RESPONSE_TIME,
  budgetLabels,
  contactChannels,
  contactCopy,
  projectTypeLabels,
} from "./contact";
export { currentExperience, experience } from "./experience";
export { journey } from "./journey";
export { hiringProfile, recruiterCopy, recruiterFacts } from "./recruiter";
export {
  DEFAULT_RESUME_VARIANT,
  atsChecks,
  atsSummary,
  getResumeVariant,
  resumeRevisions,
  resumeSummary,
  resumeVariants,
} from "./resume";
export {
  HERO_ACCENT_LINE,
  aboutIntro,
  heroLines,
  heroSubtitle,
  highlights,
  roles,
  stats,
  storyCards,
} from "./profile";
export {
  featuredProjects,
  getProject,
  getProjectsByDomain,
  projectDomains,
  projects,
} from "./projects";
export { resourceCount, resourceGroups } from "./resources";
export {
  ROADMAP_STATUS_META,
  getTrackProgress,
  roadmapTotals,
  roadmapTracks,
} from "./roadmap";
export {
  DEFAULT_SKILL_CATEGORY,
  PROFICIENCY_META,
  allTechnologies,
  getSkillCategory,
  skillCategories,
} from "./skills";
export { TALK_KIND_META, speakingTopics, talkKinds, talks } from "./speaking";

/**
 * `data/` holds typed, hand-authored content that the UI renders — the kind of thing
 * that would be a CMS record on a larger project.
 *
 * The boundaries:
 *   config/  — behaviour and identity the app reads (routes, theme, SEO)
 *   data/    — content the app displays (projects, skills, roadmap, blog registry)
 *   data/ai/ — the assistant's knowledge layer, imported from "@/data/ai"
 *   content/ — long-form MDX bodies
 *
 * Entries here carry Lucide icon *components*, which cannot cross a server-to-client
 * boundary as props. Client components therefore import the data directly rather than
 * receiving it from a Server Component.
 */
