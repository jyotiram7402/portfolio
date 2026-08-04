export { BlogBrowser } from "./components/blog-browser";
export type { BlogBrowserProps } from "./components/blog-browser";
export { PostCard } from "./components/post-card";
export type { PostCardProps } from "./components/post-card";
export { PostFooter } from "./components/post-footer";
export type { PostFooterProps } from "./components/post-footer";
export { PostLayout } from "./components/post-layout";
export type { PostLayoutProps } from "./components/post-layout";
export { WritingSection } from "./components/writing-section";

/**
 * The blog slice has more public surface than most, because it serves three callers: the
 * home preview (`WritingSection`), the index route (`BlogBrowser`) and the article route
 * (`PostLayout` + `PostFooter`). `PostToc` and `ShareRow` stay internal — they only make
 * sense inside an article.
 */
