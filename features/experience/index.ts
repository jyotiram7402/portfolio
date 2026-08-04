export { ExperienceSection } from "./components/experience-section";
export { ExperienceCard } from "./components/experience-card";
export type { ExperienceCardProps } from "./components/experience-card";

/**
 * `ExperienceCard` is exported alongside the section because it is genuinely
 * reusable — a future `/work` case-study page will render the same card for the
 * position a project belongs to.
 */
