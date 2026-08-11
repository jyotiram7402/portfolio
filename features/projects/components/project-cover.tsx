import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Project } from "@/types/projects";

export interface ProjectCoverProps {
  project: Project;
  /**
   * Above-the-fold covers load eagerly. Everything on `/projects` and everything below the
   * first row on the homepage should leave this false.
   */
  priority?: boolean;
  /** Forwarded to `next/image`. Must describe the real rendered width. */
  sizes?: string;
  className?: string;
}

/**
 * A project's cover visual: the real screenshot when one exists, a generated one otherwise.
 *
 * **Why the generated path is the default.** No project currently ships a screenshot, and
 * the alternative to generating something was a stock photograph — which says nothing
 * about the work and reads as a template. So the fallback is not a placeholder to be
 * replaced; it is the design, and it has to hold up on its own. Dropping a real file into
 * `public/projects/` and setting `image` on the project switches it over with no other
 * change.
 *
 * **Why it is deterministic.** The hue comes from a hash of the slug, so a project's cover
 * is stable across renders, across deploys and between the server and the client. A random
 * hue would flicker on hydration and would make two adjacent cards occasionally identical.
 *
 * Four layers, in order: a two-stop gradient wash, a hairline grid, a large ghosted
 * monogram, and the dominant technology set in mono. That last pair is what stops it
 * reading as abstract decoration — the cover tells you which project it belongs to even
 * with the title scrolled out of view.
 *
 * A Server Component. There is nothing interactive here; the hover treatment belongs to
 * the card that contains it.
 */
export function ProjectCover({
  project,
  priority = false,
  sizes = "(min-width: 1024px) 45vw, (min-width: 640px) 90vw, 100vw",
  className,
}: ProjectCoverProps) {
  if (project.image !== undefined) {
    return (
      <Image
        src={project.image}
        alt={`${project.name} — project cover`}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-cover object-center", className)}
      />
    );
  }

  return <GeneratedCover project={project} className={className} />;
}

/**
 * Stable 0–359 hue from a string.
 *
 * A plain FNV-style rolling hash. It does not need to be a good hash — it needs to be the
 * *same* hash everywhere, which is why it is written out rather than pulled from a library
 * whose implementation could change under a version bump.
 */
function hueFromSlug(slug: string): number {
  let hash = 2166136261;
  for (let index = 0; index < slug.length; index += 1) {
    hash ^= slug.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % 360;
}

/** The chip that names the project's primary technology on the cover. */
function primaryTechnology(project: Project): string {
  return project.language ?? project.stack[0] ?? "Engineering";
}

/**
 * The monogram.
 *
 * Initials from the project's words, capped at two. Capped because three or more letters
 * at this size stop reading as a mark and start reading as an acronym nobody knows.
 */
function monogram(name: string): string {
  const letters = name
    .split(/[\s—–\-_]+/)
    .filter((word) => /[a-z0-9]/i.test(word))
    .map((word) => word[0])
    .filter((letter): letter is string => letter !== undefined);

  return letters.slice(0, 2).join("").toUpperCase() || "JK";
}

function GeneratedCover({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const hue = hueFromSlug(project.slug);
  const technology = primaryTechnology(project);
  const mark = monogram(project.name);

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden bg-surface", className)}
    >
      {/* The generated cover is decorative — `ProjectCover`'s caller supplies the
          accessible name through the card's link text, so there is nothing here for a
          screen reader to read. The `hsl()` values are computed per project, which no
          static class can express; the same justification as the brand chips in the
          skills grid. */}
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`pc-wash-${project.slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={`hsl(${hue} 72% 52% / 0.28)`} />
            <stop offset="55%" stopColor={`hsl(${(hue + 38) % 360} 68% 46% / 0.12)`} />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <pattern
            id={`pc-grid-${project.slug}`}
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="var(--grid-line)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="800" height="500" fill={`url(#pc-grid-${project.slug})`} />
        <rect width="800" height="500" fill={`url(#pc-wash-${project.slug})`} />

        {/* A soft off-centre light source, so the field is not flat. */}
        <circle
          cx="640"
          cy="90"
          r="230"
          fill={`hsl(${hue} 80% 58% / 0.16)`}
          className="blur-2xl"
        />

        {/* The monogram, oversized and low-contrast — the cover's subject. */}
        <text
          x="56"
          y="392"
          fontSize="248"
          fontWeight="700"
          letterSpacing="-12"
          fill="var(--foreground)"
          fillOpacity="0.07"
          className="font-sans"
        >
          {mark}
        </text>

        {/* Three code-ish rules, decreasing in width. Suggests a file without pretending
            to be a screenshot of one. */}
        <g stroke="var(--foreground)" strokeOpacity="0.1" strokeWidth="7" strokeLinecap="round">
          <path d="M56 118h250" />
          <path d="M56 152h160" />
          <path d="M56 186h205" />
        </g>
      </svg>

      {/* The technology label. Real DOM text rather than SVG so it inherits the type scale
          and stays legible when the card scales on hover. */}
      <p className="absolute right-5 bottom-4 font-mono text-2xs tracking-widest text-subtle uppercase">
        {technology}
      </p>
    </div>
  );
}
