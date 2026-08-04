import type { ComponentType } from "react";

import type { PostSlug } from "./index";

/**
 * Slug → MDX module map.
 *
 * Static keys with static import paths, deliberately. A dynamic
 * `import(`./${slug}.mdx`)` would make webpack bundle every article into one context module;
 * this form gives a separate chunk per article, so opening one post does not download the
 * others.
 *
 * This module is only reached through a dynamic `import()` inside
 * `contentService.loadPostBody`. Nothing in the client graph imports it, which is what keeps
 * the compiled articles and their syntax highlighting server-side.
 *
 * Typing the record against `PostSlug` means a slug listed in `content/blog/index.ts` with no
 * loader here — or the reverse — is a compile error rather than a runtime 404.
 */
type MdxModule = { default: ComponentType };

export const postModules: Readonly<Record<PostSlug, () => Promise<MdxModule>>> = {
  "idempotency-is-a-design-decision": () =>
    import("./idempotency-is-a-design-decision.mdx"),
  "reading-the-query-plan-first": () => import("./reading-the-query-plan-first.mdx"),
  "rag-that-refuses-to-guess": () => import("./rag-that-refuses-to-guess.mdx"),
};
