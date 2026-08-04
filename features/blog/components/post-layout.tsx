"use client";

import { Clock } from "lucide-react";
import { type ReactNode, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { blogPostPath, ROUTES } from "@/constants/routes";
import { getCategory } from "@/data/blog";
import { PostToc } from "@/features/blog/components/post-toc";
import { ShareRow } from "@/features/blog/components/share-row";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/types/blog";
import { formatDate, toIsoDate } from "@/utils/format";

export interface PostLayoutProps {
  post: PostMeta;
  /** The compiled MDX body, passed down from the server page. */
  children: ReactNode;
  /** Rendered below the article — author, prev/next, related, subscribe. */
  footer: ReactNode;
}

/**
 * Article shell.
 *
 * A Client Component for one reason: the table of contents and the reading-progress rail
 * both need a ref to the rendered body, and a ref cannot be created on the server. The MDX
 * body itself is still server-rendered — it arrives here as `children`, already compiled,
 * so none of the article content or its syntax highlighting reaches the client bundle.
 *
 * That split is the important part of this file. Everything expensive stays on the server;
 * only the two things that genuinely need a DOM measurement are client-side.
 *
 * The sidebar is `sticky` above `lg` and moves inline above the article below it, where a
 * sticky rail would eat a third of a phone screen.
 */
export function PostLayout({ post, children, footer }: PostLayoutProps) {
  const articleRef = useRef<HTMLDivElement>(null);
  const category = getCategory(post.category);

  return (
    <div className="flex flex-col gap-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: ROUTES.home },
          { label: "Writing", href: ROUTES.blog },
          { label: post.title, href: blogPostPath(post.slug) },
        ]}
      />

      {/* ------------------------------------------------------------- header -- */}
      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          {category ? (
            <Badge tone="primary" size="sm">
              {category.label}
            </Badge>
          ) : null}

          <time
            dateTime={toIsoDate(post.date)}
            className="font-mono text-2xs tracking-wider text-subtle uppercase"
          >
            {formatDate(post.date)}
          </time>

          <span className="flex items-center gap-1.5 font-mono text-2xs text-subtle">
            <Clock aria-hidden="true" className="size-3" />
            {post.readingMinutes} min read
          </span>

          {post.updated ? (
            <span className="font-mono text-2xs text-subtle">
              Updated {formatDate(post.updated)}
            </span>
          ) : null}
        </div>

        <h1 className="text-5xl font-semibold tracking-tighter text-balance text-foreground">
          {post.title}
        </h1>

        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          {post.description}
        </p>

        <ul className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <li key={tag}>
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-full border border-border",
                  "bg-input px-2.5 font-mono text-2xs text-muted",
                )}
              >
                #{tag}
              </span>
            </li>
          ))}
        </ul>
      </header>

      {/* --------------------------------------------------------------- body -- */}
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-12">
          {/* `prose-content` comes from styles/prose.css — semantic markup, styling
              in CSS rather than a plugin fighting the design tokens. */}
          <div ref={articleRef} className="prose-content">
            {children}
          </div>

          <ShareRow title={post.title} path={blogPostPath(post.slug)} />

          {footer}
        </div>

        <aside className="lg:sticky lg:top-[calc(var(--header-height)+3rem)] lg:self-start">
          <PostToc articleRef={articleRef} />
        </aside>
      </div>
    </div>
  );
}
