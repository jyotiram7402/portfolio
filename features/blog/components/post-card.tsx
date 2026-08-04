import { ArrowUpRight, Clock } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { blogPostPath } from "@/constants/routes";
import { getCategory } from "@/data/blog";
import { cn } from "@/lib/utils";
import type { PostMeta } from "@/types/blog";
import { formatShortDate, toIsoDate } from "@/utils/format";

export interface PostCardProps {
  post: PostMeta;
  /** Larger treatment with the full description, for the lead article. */
  featured?: boolean;
  className?: string;
}

/**
 * One article.
 *
 * A Server Component — it has no interactivity beyond the link, so it should cost the
 * client bundle nothing. Used by the home preview, the blog index and the related-posts
 * strip, which is why every variation is a prop rather than a copy.
 *
 * The whole card is one link rather than a card containing a link. That gives a much
 * larger target on touch, and keeps it to a single tab stop instead of three.
 *
 * `<time dateTime>` carries the machine-readable date, so the visible short format can be
 * whatever reads best without losing the semantics.
 */
export function PostCard({ post, featured = false, className }: PostCardProps) {
  const category = getCategory(post.category);

  return (
    <article className={cn("h-full", className)}>
      <Link
        href={blogPostPath(post.slug)}
        className={cn(
          "group/post flex h-full flex-col gap-4 rounded-3xl border border-border",
          "bg-card/60 p-6 transition-colors duration-[var(--duration-normal)]",
          "hover:border-primary/40 focus-ring",
          featured && "sm:p-8",
        )}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          {category ? (
            <Badge tone="primary" size="sm">
              {category.label}
            </Badge>
          ) : null}

          <time
            dateTime={toIsoDate(post.date)}
            className="font-mono text-2xs tracking-wider text-subtle uppercase"
          >
            {formatShortDate(post.date)}
          </time>

          <span className="ml-auto flex items-center gap-1.5 font-mono text-2xs text-subtle">
            <Clock aria-hidden="true" className="size-3" />
            {post.readingMinutes} min
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <h3
            className={cn(
              "font-semibold tracking-tight text-balance text-foreground",
              featured ? "text-2xl" : "text-lg",
            )}
          >
            {post.title}
          </h3>

          <p
            className={cn(
              "leading-relaxed text-muted",
              featured ? "text-base" : "line-clamp-3 text-sm",
            )}
          >
            {post.description}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4">
          <ul className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, featured ? 4 : 3).map((tag) => (
              <li key={tag}>
                <span className="font-mono text-2xs text-subtle">#{tag}</span>
              </li>
            ))}
          </ul>

          <span
            aria-hidden="true"
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full border border-border",
              "text-subtle transition-[color,border-color,transform]",
              "duration-[var(--duration-normal)] ease-[var(--ease-out-back)]",
              "group-hover/post:-translate-y-0.5 group-hover/post:border-primary/40",
              "group-hover/post:text-primary",
            )}
          >
            <ArrowUpRight className="size-3.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}
