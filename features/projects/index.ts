export { ProjectCard } from "./components/project-card";
export type { ProjectCardProps } from "./components/project-card";
export { ProjectsSection } from "./components/projects-section";

/**
 * `ProjectCard` is exported because it has a second caller coming: the `/work` index and
 * per-project case studies will render the same card. `ProjectGrid` stays internal — its
 * filter state belongs to this section.
 */
