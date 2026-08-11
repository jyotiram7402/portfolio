import {
  ArrowUpRight,
  Building2,
  ExternalLink,
  GitFork,
  Github,
  Star,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/animation/reveal";
import { Breadcrumbs } from "@/components/common/breadcrumbs";
import { Section } from "@/components/layout/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { GlassCard } from "@/components/ui/glass-card";
import { ROUTES } from "@/constants/routes";
import { projectDomains } from "@/data/projects";
import { ProjectCover } from "@/features/projects/components/project-cover";
import { ProjectShowcaseCard } from "@/features/projects/components/project-showcase-card";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";
import { formatCompactNumber, formatRelativeTime } from "@/utils/format";
import { externalLinkAttributes } from "@/utils/url";

export interface ProjectDetailProps {
  project: Project;
  related: readonly Project[];
}

const STATUS_TONE = {
  shipped: "success",
  active: "primary",
  prototype: "warning",
} as const;

const DOMAIN_LABELS = new Map(
  projectDomains.map((domain) => [domain.id, domain.label]),
);

/**
 * A project case study.
 *
 * This is where technical depth belongs — the homepage showcase deliberately carries none of
 * it. Everything the old dense homepage card used to show (summary, highlights, live GitHub
 * figures, both outbound links) is here, with room to be read.
 *
 * **Every long-form block is conditional.** `caseStudy` is optional on `Project` and most
 * entries have none, so the page composes itself from whatever exists: the overview,
 * highlights, stack and figures always render because they always exist; problem, solution,
 * architecture, challenges, lessons and future render only when written. A "Challenges"
 * heading above an empty container is worse than no heading, and a discovered repository
 * that nobody has written up yet still gets a complete, honest page.
 *
 * A Server Component throughout. The reveals and the cards are the only client leaves, and
 * the cards' hover treatment is pure CSS.
 */
export function ProjectDetail({ project, related }: ProjectDetailProps) {
  const repo = project.links.find((link) => link.kind === "repo");
  const live = project.links.find((link) => link.kind === "live");
  const study = project.caseStudy;
  const isDiscovered = project.source !== "curated";

  return (
    <>
      {/* ============================================================ hero == */}
      <Section
        spacing="sm"
        ariaLabelledBy="project-heading"
        containerSize="content"
        innerClassName="flex flex-col gap-8"
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: ROUTES.home },
            { label: "Projects", href: ROUTES.projects },
            { label: project.name, href: `${ROUTES.projects}/${project.slug}` },
          ]}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={STATUS_TONE[project.status]} size="sm">
            {project.status}
          </Badge>
          <Badge tone="default" size="sm" className="font-mono">
            {project.period}
          </Badge>
          {project.domains.map((domain) => (
            <Badge key={domain} tone="outline" size="sm">
              {DOMAIN_LABELS.get(domain) ?? domain}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-5">
          <h1
            id="project-heading"
            className="text-4xl font-semibold tracking-tighter text-balance text-foreground sm:text-5xl"
          >
            {project.name}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted">
            {project.tagline}
          </p>
        </div>

        {/* Both outbound links, which the card could not carry — a link inside a link is
            invalid HTML, and the whole card is one link. */}
        {repo !== undefined || live !== undefined ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {live !== undefined ? (
              <Button asChild size="lg" className="w-full sm:w-auto">
                <a href={live.href} {...externalLinkAttributes()}>
                  <ExternalLink aria-hidden="true" className="size-4" />
                  View live
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            ) : null}

            {repo !== undefined ? (
              <Button
                asChild
                size="lg"
                variant={live === undefined ? "primary" : "outline"}
                className="w-full sm:w-auto"
              >
                <a href={repo.href} {...externalLinkAttributes()}>
                  <Github aria-hidden="true" className="size-4" />
                  Repository
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Button>
            ) : null}
          </div>
        ) : (
          <GlassCard padding="md" radius="2xl" className="flex items-start gap-3">
            <Building2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted" />
            <p className="text-sm leading-relaxed text-muted">
              Client work — the code is not public. Happy to walk through the design and the
              decisions behind it.
            </p>
          </GlassCard>
        )}
      </Section>

      {/* =========================================================== cover == */}
      <Section spacing="none" containerSize="page">
        <Reveal effect="up" distance={20}>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border">
            <ProjectCover
              project={project}
              priority
              sizes="(min-width: 1440px) 90rem, 100vw"
            />
          </div>
        </Reveal>
      </Section>

      {/* ============================================================ body == */}
      <Section
        spacing="md"
        containerSize="content"
        innerClassName="flex flex-col gap-14"
      >
        {/* Live figures. Only for discovered entries, and only the ones that are non-zero —
            a "0 stars" row is worse than no row. */}
        {isDiscovered ? (
          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Figure label="Language" value={project.language ?? "—"} />
            <Figure
              label="Stars"
              value={formatCompactNumber(project.stars ?? 0)}
              icon={Star}
            />
            <Figure
              label="Forks"
              value={formatCompactNumber(project.forks ?? 0)}
              icon={GitFork}
            />
            <Figure
              label="Last push"
              value={
                project.updatedAt !== undefined
                  ? formatRelativeTime(project.updatedAt)
                  : "—"
              }
            />
          </dl>
        ) : null}

        <Block title="Overview">
          <p className="text-base leading-relaxed text-muted">{project.summary}</p>
        </Block>

        {study?.problem !== undefined ? (
          <Block title="The problem">
            <p className="text-base leading-relaxed text-muted">{study.problem}</p>
          </Block>
        ) : null}

        {study?.solution !== undefined ? (
          <Block title="The approach">
            <p className="text-base leading-relaxed text-muted">{study.solution}</p>
          </Block>
        ) : null}

        {/* Highlights are the engineering decisions worth asking about. They exist on every
            curated entry and on any discovered repo with an override, which is why this
            block is not gated behind `caseStudy`. */}
        {project.highlights.length > 0 ? (
          <Block title="What was actually hard">
            <ul className="flex flex-col gap-3.5">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex gap-3 text-base leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {study?.features !== undefined && study.features.length > 0 ? (
          <Block title="Features">
            <ul className="grid gap-3 sm:grid-cols-2">
              {study.features.map((feature) => (
                <li
                  key={feature}
                  className={cn(
                    "rounded-2xl border border-border bg-card px-4 py-3",
                    "text-sm leading-relaxed text-muted",
                  )}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </Block>
        ) : null}

        {study?.architecture !== undefined ? (
          <Block title="Architecture">
            <p className="text-base leading-relaxed text-muted">{study.architecture}</p>
          </Block>
        ) : null}

        <Block title="Technology">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((technology) => (
              <li key={technology}>
                <span
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border border-border",
                    "bg-input px-3.5 font-mono text-xs text-muted",
                  )}
                >
                  {technology}
                </span>
              </li>
            ))}
          </ul>
        </Block>

        {study?.challenges !== undefined && study.challenges.length > 0 ? (
          <Block title="Challenges">
            <NumberedList items={study.challenges} />
          </Block>
        ) : null}

        {study?.lessons !== undefined && study.lessons.length > 0 ? (
          <Block title="What I'd do differently">
            <NumberedList items={study.lessons} />
          </Block>
        ) : null}

        {study?.future !== undefined && study.future.length > 0 ? (
          <Block title="Where it goes next">
            <NumberedList items={study.future} />
          </Block>
        ) : null}
      </Section>

      {/* ========================================================= related == */}
      {related.length > 0 ? (
        <Section
          spacing="md"
          ariaLabelledBy="related-heading"
          containerSize="page"
          innerClassName="flex flex-col gap-10"
        >
          <Divider fade />

          <div className="flex flex-col gap-3">
            <p className="eyebrow">Related work</p>
            <h2
              id="related-heading"
              className="text-2xl font-semibold tracking-tight text-foreground"
            >
              Other projects in the same territory
            </h2>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {related.map((entry) => (
              <li key={entry.id} className="h-full">
                <ProjectShowcaseCard
                  project={entry}
                  sizes="(min-width: 1280px) 30vw, (min-width: 640px) 46vw, 92vw"
                />
              </li>
            ))}
          </ul>

          <Link
            href={ROUTES.projects}
            className={cn(
              "inline-flex items-center gap-1.5 self-center text-sm font-medium",
              "text-foreground underline-offset-4 transition-colors",
              "hover:text-primary hover:underline focus-ring",
            )}
          >
            Back to all projects
            <ArrowUpRight aria-hidden="true" className="size-4 text-primary" />
          </Link>
        </Section>
      ) : null}
    </>
  );
}

/**
 * One titled section of the case study.
 *
 * Local, because these headings are only ever `h2` under this page's `h1` and the wrapper
 * exists purely so the twelve blocks cannot drift apart on spacing.
 */
function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Reveal effect="up" distance={16} as="section" className="flex flex-col gap-5">
      <h2 className="text-sm font-semibold tracking-widest text-subtle uppercase">
        {title}
      </h2>
      {children}
    </Reveal>
  );
}

function NumberedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="flex flex-col gap-5">
      {items.map((item, index) => (
        <li key={item} className="flex gap-4">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full",
              "border border-border bg-elevated font-mono text-2xs text-muted",
            )}
          >
            {index + 1}
          </span>
          <p className="text-base leading-relaxed text-muted">{item}</p>
        </li>
      ))}
    </ol>
  );
}

function Figure({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: typeof Star;
}) {
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-4">
      <dt className="flex items-center gap-1.5 font-mono text-2xs tracking-wider text-subtle uppercase">
        {Icon !== undefined ? <Icon aria-hidden="true" className="size-3" /> : null}
        {label}
      </dt>
      <dd className="text-lg font-semibold tracking-tight text-foreground">{value}</dd>
    </div>
  );
}
