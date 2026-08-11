export { ProjectDetail } from "./components/project-detail";
export type { ProjectDetailProps } from "./components/project-detail";
export { ProjectGrid } from "./components/project-grid";
export type { ProjectGridProps } from "./components/project-grid";
export { ProjectShowcaseCard } from "./components/project-showcase-card";
export type { ProjectShowcaseCardProps } from "./components/project-showcase-card";
export { ProjectsSection } from "./components/projects-section";

/**
 * The slice's public surface, one export per rendering surface:
 *
 * • `ProjectsSection` — the homepage showcase, three cards behind a link out.
 * • `ProjectGrid` — the `/projects` library, with search and per-area filters.
 * • `ProjectDetail` — the `/projects/[slug]` case study.
 * • `ProjectShowcaseCard` — the card all three use.
 *
 * `ProjectGrid` is exported now because `/projects` renders it directly; it was internal
 * while the homepage was its only caller.
 *
 * `ProjectCover` stays internal. It is an implementation detail of the card and the detail
 * hero, and nothing outside this slice should be deciding how a cover is drawn.
 *
 * The dense `ProjectCard` that used to live here is gone. The showcase card replaced it on
 * every surface, and keeping a second card would have meant maintaining two hover
 * treatments and two sets of pill styles for one job.
 */
