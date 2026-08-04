export { AtsPanel } from "./components/ats-panel";
export type { AtsPanelProps } from "./components/ats-panel";
export { ResumeCenter } from "./components/resume-center";
export type { ResumeCenterProps } from "./components/resume-center";
export { ResumePreview } from "./components/resume-preview";
export type { ResumePreviewProps } from "./components/resume-preview";

/**
 * `ResumePreview` and `AtsPanel` are public so a future `/resume/[variant]` route can render a
 * single version without the switcher. Both are Server Components with no state, so exporting them
 * costs nothing.
 *
 * Note that nothing outside this slice imports them today — features do not import each other, and
 * the recruiter dashboard links to `/resume` rather than embedding it.
 */
