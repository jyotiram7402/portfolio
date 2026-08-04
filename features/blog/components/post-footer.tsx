import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

import { LogoMark } from "@/components/icons/logo-mark";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { siteConfig } from "@/config/site";
import { socialConfig } from "@/config/social";
import { blogPostPath } from "@/constants/routes";
import { PostCard } from "@/features/blog/components/post-card";
import { SubscribeForm } from "@/features/newsletter";
import { cn } from "@/lib/utils";
import type { PostMeta, PostNeighbours } from "@/types/blog";
import { externalLinkAttributes } from "@/utils/url";

export interface PostFooterProps {
  neighbours: PostNeighbours;
  related: readonly PostMeta[];
}

/**
 * Everything after the article: author, previous/next, related, subscribe.
 *
 * A Server Component apart from the subscribe form. The order is deliberate — it moves from
 * "who wrote this" through "what next" to "stay in touch", which is increasing commitment.
 * Putting the newsletter first would ask for an email before establishing why.
 *
 * Previous/next means older/newer in reading order, not array position. The labels say so
 * explicitly, because "previous" alone is ambiguous in an archive.
 */
export function PostFooter({ neighbours, related }: PostFooterProps) {
  const github = socialConfig.links.find((link) => link.id === "github");

  return (
    <footer className="flex flex-col gap-14">
      {/* ------------------------------------------------------------- author -- */}
      <section aria-labelledby="author-heading" className="flex flex-col gap-5">
        <h2 id="author-heading" className="eyebrow">
          Written by
        </h2>

        <div
          className={cn(
            "flex flex-col gap-5 rounded-3xl border border-border bg-card/60 p-6",
            "sm:flex-row sm:items-center sm:gap-6 sm:p-8",
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "grid size-14 shrink-0 place-items-center rounded-2xl",
              "border border-border bg-elevated",
            )}
          >
            <LogoMark className="size-7" />
          </span>

          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="text-base font-semibold tracking-tight text-foreground">
              {siteConfig.name}
            </p>
            <p className="text-sm leading-relaxed text-muted">
              {siteConfig.role} in {siteConfig.location}. {siteConfig.description}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 sm:ml-auto">
            <Button asChild variant="secondary" size="sm">
              <a href={`mailto:${siteConfig.email}`}>
                <Mail aria-hidden="true" className="size-3.5" />
                Email
              </a>
            </Button>

            {github ? (
              <Button asChild variant="outline" size="sm">
                <a href={github.href} {...externalLinkAttributes()}>
                  GitHub
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- prev / next -- */}
      {neighbours.previous || neighbours.next ? (
        <nav aria-label="More articles" className="grid gap-4 sm:grid-cols-2">
          {neighbours.previous ? (
            <Link
              href={blogPostPath(neighbours.previous.slug)}
              className={cn(
                "group/nav flex flex-col gap-2 rounded-2xl border border-border",
                "bg-card/60 p-5 transition-colors hover:border-primary/40 focus-ring",
              )}
            >
              <span className="flex items-center gap-1.5 font-mono text-2xs tracking-widest text-subtle uppercase">
                <ArrowLeft
                  aria-hidden="true"
                  className="size-3 transition-transform group-hover/nav:-translate-x-0.5"
                />
                Older
              </span>
              <span className="text-sm leading-snug font-medium text-foreground">
                {neighbours.previous.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}

          {neighbours.next ? (
            <Link
              href={blogPostPath(neighbours.next.slug)}
              className={cn(
                "group/nav flex flex-col items-end gap-2 rounded-2xl border border-border",
                "bg-card/60 p-5 text-right transition-colors hover:border-primary/40 focus-ring",
              )}
            >
              <span className="flex items-center gap-1.5 font-mono text-2xs tracking-widest text-subtle uppercase">
                Newer
                <ArrowRight
                  aria-hidden="true"
                  className="size-3 transition-transform group-hover/nav:translate-x-0.5"
                />
              </span>
              <span className="text-sm leading-snug font-medium text-foreground">
                {neighbours.next.title}
              </span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      {/* ------------------------------------------------------------ related -- */}
      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="flex flex-col gap-5">
          <h2 id="related-heading" className="eyebrow">
            Related reading
          </h2>
          <ul className="grid gap-5 sm:grid-cols-2">
            {related.map((post) => (
              <li key={post.slug} className="h-full">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Divider fade />

      {/* --------------------------------------------------------- subscribe -- */}
      <section
        aria-labelledby="post-subscribe-heading"
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <h2
            id="post-subscribe-heading"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Get the next one
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            No cadence promised — only long-form notes on things that actually shipped.
          </p>
        </div>

        <SubscribeForm />
      </section>
    </footer>
  );
}
