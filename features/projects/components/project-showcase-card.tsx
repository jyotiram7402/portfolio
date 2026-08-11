import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { ProjectCover } from "@/features/projects/components/project-cover";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";

export interface ProjectShowcaseCardProps {
  project: Project;
  /** Loads the cover eagerly. Only true for cards above the fold. */
  priority?: boolean;
  /** Forwarded to the cover so `next/image` can pick the right file size. */
  sizes?: string;
  className?: string;
}

/** At most five. A card listing ten technologies has told the reader nothing. */
const MAX_PILLS = 5;

/**
 * The project card: one cover image, a few pills, a title, a line, a link.
 *
 * Used by the homepage showcase, the `/projects` library and the related strip on a detail
 * page. One card in three places rather than three cards, which is what keeps a change to
 * the hover treatment from having to be made three times.
 *
 * **A Server Component with no JavaScript.** The whole hover treatment — the cover scale,
 * the lift, the border brightening, the arrow travel — is CSS driven from `group-hover` on
 * the link. That was the tilt-and-pointer-tracking card before; the tilt cost a hook and a
 * pointer listener per card, and the brief asked for Linear and Stripe rather than a
 * gaming site. `motion-safe:` gates every transform, so `prefers-reduced-motion` gets the
 * colour change and nothing that moves.
 *
 * **The whole card is one link.** Not a card with a link inside it: that pattern gives a
 * keyboard user a focus target the size of the words "View project" and leaves the other
 * 400px of card inert. The consequence is that the repository and live URLs cannot live on
 * this card — a link inside a link is invalid HTML — so they live on the detail page, which
 * is where the brief wants them anyway.
 */
export function ProjectShowcaseCard({
  project,
  priority = false,
  sizes,
  className,
}: ProjectShowcaseCardProps) {
  const pills = project.stack.slice(0, MAX_PILLS);
  const hasLive = project.links.some((link) => link.kind === "live");

  return (
    <Link
      href={`${ROUTES.projects}/${project.slug}`}
      aria-label={`${project.name} — view project`}
      className={cn(
        "group/card relative flex h-full flex-col overflow-hidden rounded-3xl",
        "border border-border bg-card",
        "transition-[transform,border-color,box-shadow]",
        "duration-[var(--duration-normal)] ease-[var(--ease-out-quint)]",
        "hover:border-border-strong hover:shadow-xl",
        "motion-safe:hover:-translate-y-1",
        "focus-ring",
        className,
      )}
    >
      {/* ------------------------------------------------------- window bar -- */}
      {/* Deliberately understated: three dots and a label, on the card's own surface.
          A full chrome treatment would claim the cover below it is a screenshot. */}
      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <span aria-hidden="true" className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </span>

        <span className="truncate font-mono text-2xs tracking-wider text-subtle">
          {project.slug}
        </span>

        <span className="ml-auto flex shrink-0 items-center gap-2">
          {hasLive ? (
            <Badge tone="success" size="sm" dot>
              Live
            </Badge>
          ) : null}
          {project.featured === true ? (
            <Badge tone="outline" size="sm">
              Featured
            </Badge>
          ) : null}
        </span>
      </div>

      {/* ------------------------------------------------------------ cover -- */}
      {/* Arbitrary-value ratio rather than the `aspect-16/10` shorthand: the shorthand is
          Tailwind v4 only, and this form is unambiguous. A fixed ratio is what keeps three
          cards in a row the same height regardless of cover source. */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <div
          className={cn(
            "absolute inset-0",
            "transition-transform duration-[var(--duration-slow)]",
            "ease-[var(--ease-out-quint)]",
            "motion-safe:group-hover/card:scale-[1.03]",
          )}
        >
          <ProjectCover project={project} priority={priority} sizes={sizes} />
        </div>

        {/* Bottom scrim, so the pills below never sit against a bright cover edge. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-card to-transparent"
        />
      </div>

      {/* ------------------------------------------------------------- body -- */}
      <div className="flex flex-1 flex-col gap-4 p-5 sm:p-6">
        <ul className="flex flex-wrap gap-1.5">
          {pills.map((technology) => (
            <li key={technology}>
              <span
                className={cn(
                  "inline-flex h-6 items-center rounded-full border border-border",
                  "bg-input px-2.5 font-mono text-2xs text-muted",
                  "transition-colors duration-[var(--duration-normal)]",
                  "group-hover/card:border-border-strong group-hover/card:text-foreground",
                )}
              >
                {technology}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">
            {project.name}
          </h3>
          {/* The tagline, never the summary. The summary is the detail page's job — this is
              the one line that has to earn the click. `line-clamp-2` guarantees three cards
              in a row stay the same height however long a GitHub description turns out to
              be. */}
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {project.tagline}
          </p>
        </div>

        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-foreground">
          View project
          <ArrowUpRight
            aria-hidden="true"
            className={cn(
              "size-4 text-primary",
              "transition-transform duration-[var(--duration-normal)]",
              "ease-[var(--ease-out-quint)]",
              "motion-safe:group-hover/card:translate-x-0.5",
              "motion-safe:group-hover/card:-translate-y-0.5",
            )}
          />
        </span>
      </div>
    </Link>
  );
}
