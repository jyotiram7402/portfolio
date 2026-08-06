/**
 * Brand marks for the technology explorer.
 *
 * Hand-authored rather than pulled from an icon package, for one reason that matters
 * here: a dependency cannot be installed or verified locally in this project, and a
 * package whose export names are guessed is a build failure waiting to happen. These
 * are plain SVG, so they cost nothing at runtime and cannot break a build.
 *
 * Two rules held throughout:
 *
 * 1. **Single colour, `currentColor`.** Every mark is a silhouette that inherits the
 *    text colour of its container. That is what lets one chip style serve all of them,
 *    and it is why none of these can fail contrast in either theme — the brand colour
 *    is carried by the chip's tint, not by the glyph. See `lib/tech-brand.ts`.
 * 2. **Only marks whose geometry is genuinely constructible.** React really is three
 *    ellipses and a dot; Redis really is stacked lozenges; Git really is a rotated
 *    square with three nodes. Brands whose logos are illustrations — the Postgres
 *    elephant, the MySQL dolphin, the Jenkins butler — are deliberately absent. A
 *    bad trace of a famous logo reads as a mistake, so those fall back to a semantic
 *    Lucide glyph instead.
 *
 * `viewBox` is 24×24 on every mark so they are interchangeable with Lucide's set and
 * size from the same `size-*` class.
 */

import type { ReactNode } from "react";

export interface TechMarkProps {
  className?: string;
}

/** Shared frame. Keeps the sizing and a11y contract in one place. */
function Frame({ className, children }: TechMarkProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {children}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Languages                                                                  */
/* -------------------------------------------------------------------------- */

/** Java — the cup and steam. */
export function JavaMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9.6 2.4c-1.2 1-1.2 2 0 3s1.2 2 0 3" />
        <path d="M13.2 4c-1 .8-1 1.6 0 2.4s1 1.6 0 2.4" />
        <path d="M5 11.4h11v3.4a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4z" />
        <path d="M16 12.2h1.3a2 2 0 0 1 0 4H16" />
        <path d="M4.2 21.4h12.6" />
      </g>
    </Frame>
  );
}

/** TypeScript — the square wordmark. */
export function TypeScriptMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <rect
        x="1.4"
        y="1.4"
        width="21.2"
        height="21.2"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <text
        x="12"
        y="16.4"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="-0.5"
        fill="currentColor"
        className="font-sans"
      >
        TS
      </text>
    </Frame>
  );
}

/** JavaScript — the square wordmark. */
export function JavaScriptMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <rect
        x="1.4"
        y="1.4"
        width="21.2"
        height="21.2"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <text
        x="12"
        y="16.4"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="700"
        letterSpacing="-0.5"
        fill="currentColor"
        className="font-sans"
      >
        JS
      </text>
    </Frame>
  );
}

/** Python — two interlocking hooks. */
export function PythonMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <path
        fill="currentColor"
        d="M11.9 2c-2.2 0-3.9.5-3.9 2.5V7h6.1v1.2H6.7C4.5 8.2 3 9.8 3 12.1s1.4 3.9 3.6 3.9h1.3v-2.5c0-2.2 1.8-3.5 3.9-3.5h4.1c1.7 0 3-1.2 3-2.9V4.5C18.9 2.6 17.2 2 15 2zm-1.7 1.5a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9"
      />
      <path
        fill="currentColor"
        opacity="0.55"
        d="M12.1 22c2.2 0 3.9-.5 3.9-2.5V17H9.9v-1.2h7.4c2.2 0 3.7-1.6 3.7-3.9s-1.4-3.9-3.6-3.9h-1.3v2.5c0 2.2-1.8 3.5-3.9 3.5H8.1c-1.7 0-3 1.2-3 2.9v2.6C5.1 21.4 6.8 22 9 22zm1.7-1.5a.95.95 0 1 1 0-1.9.95.95 0 0 1 0 1.9"
      />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Backend                                                                    */
/* -------------------------------------------------------------------------- */

/** Spring — the leaf. */
export function SpringMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.6 3.2c.3 1.9.4 4 .4 6.3 0 6-4 10.6-9.2 10.6a4.3 4.3 0 0 1-4.4-4.2c0-2.3 1.6-3.8 4.2-4.6 4-1.2 7.5-3.2 9-8.1Z" />
        <path d="M3.4 20.8c1.4-3.4 3.9-5.9 7.4-7.4" />
      </g>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data & messaging                                                           */
/* -------------------------------------------------------------------------- */

/** Redis — stacked lozenges. */
export function RedisMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M2 7.2 12 3.6l10 3.6-10 3.6z" />
        <path d="M2 12 12 8.4l10 3.6-10 3.6z" />
        <path d="M2 16.8 12 13.2l10 3.6-10 3.6z" />
      </g>
    </Frame>
  );
}

/** Apache Kafka — the node graph. */
export function KafkaMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M7.2 6.6v10.8" />
        <path d="M9 5.6 15 10" />
        <path d="M9 18.4 15 14" />
      </g>
      <g fill="currentColor">
        <circle cx="7.2" cy="4.2" r="2.2" />
        <circle cx="7.2" cy="19.8" r="2.2" />
        <circle cx="16.8" cy="12" r="2.4" />
      </g>
    </Frame>
  );
}

/** MongoDB — the leaf. */
export function MongoMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2.2c2.6 3.2 5 6.3 5 10.3 0 3.4-1.9 6.2-4.1 7.4L12 22l-.9-2.1C8.9 18.7 7 15.9 7 12.5c0-4 2.4-7.1 5-10.3Z" />
        <path d="M12 6.4v13" />
      </g>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Cloud & DevOps                                                             */
/* -------------------------------------------------------------------------- */

/** Docker — the container stack over water. */
export function DockerMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g fill="currentColor">
        <rect x="2.6" y="10.4" width="3" height="3" rx="0.4" />
        <rect x="6.2" y="10.4" width="3" height="3" rx="0.4" />
        <rect x="9.8" y="10.4" width="3" height="3" rx="0.4" />
        <rect x="13.4" y="10.4" width="3" height="3" rx="0.4" />
        <rect x="6.2" y="6.8" width="3" height="3" rx="0.4" />
        <rect x="9.8" y="6.8" width="3" height="3" rx="0.4" />
        <rect x="9.8" y="3.2" width="3" height="3" rx="0.4" />
      </g>
      <path
        d="M1.5 15.4h16.1c1.6 0 3-.7 3.9-2-1.4-.6-2.5-.5-3.4.1-.4-1.3-1.2-2.3-2.4-3l-.6.9c.6.6 1 1.4 1 2.3H1.5c0 .6.1 1.2.4 1.7Z"
        fill="currentColor"
      />
      <path
        d="M2.6 17.6c1.3 1.8 3.4 2.8 6.2 2.8 5 0 8.9-2.3 10.6-6.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </Frame>
  );
}

/** Kubernetes — the seven-spoke helm. */
export function KubernetesMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <path
        d="M12 2l8.6 4.3 1.1 9.4L12 22l-9.7-6.3 1.1-9.4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <path d="M12 8.4V4.6" />
        <path d="M14.4 9.7l2.8-2.3" />
        <path d="M15.3 12.6l3.6 1.2" />
        <path d="M13.6 15.1l1.9 3.2" />
        <path d="M10.4 15.1l-1.9 3.2" />
        <path d="M8.7 12.6l-3.6 1.2" />
        <path d="M9.6 9.7L6.8 7.4" />
      </g>
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Frontend                                                                   */
/* -------------------------------------------------------------------------- */

/** React — three orbits and a nucleus. */
export function ReactMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g stroke="currentColor" strokeWidth="1.1">
        <ellipse cx="12" cy="12" rx="10.6" ry="4.1" />
        <ellipse
          cx="12"
          cy="12"
          rx="10.6"
          ry="4.1"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10.6"
          ry="4.1"
          transform="rotate(120 12 12)"
        />
      </g>
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </Frame>
  );
}

/** Next.js — the circled N. */
export function NextMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <circle cx="12" cy="12" r="10.6" stroke="currentColor" strokeWidth="1.5" />
      <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
        <path d="M8.4 16.6V7.6l8 10.4" />
        <path d="M15.4 7.6v6.2" />
      </g>
    </Frame>
  );
}

/** Tailwind CSS — the two waves. */
export function TailwindMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <path
        fill="currentColor"
        d="M12 4.3c-2.9 0-4.7 1.4-5.5 4.3 1.1-1.4 2.4-2 3.8-1.6 2.1.5 2.7 3.7 7 3.7 2.9 0 4.7-1.4 5.5-4.3-1.1 1.4-2.4 2-3.8 1.6C16.9 7.5 16.3 4.3 12 4.3"
      />
      <path
        fill="currentColor"
        opacity="0.6"
        d="M6.7 11.1c-2.9 0-4.7 1.4-5.5 4.2 1.1-1.4 2.4-1.9 3.8-1.5 2.1.5 2.7 3.7 7 3.7 2.9 0 4.7-1.4 5.5-4.3-1.1 1.4-2.4 2-3.8 1.6-2.1-.5-2.7-3.7-7-3.7"
      />
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tools                                                                      */
/* -------------------------------------------------------------------------- */

/** Git — the rotated square and its branch. */
export function GitMark({ className }: TechMarkProps) {
  return (
    <Frame className={className}>
      <g transform="rotate(45 12 12)">
        <rect
          x="3.4"
          y="3.4"
          width="17.2"
          height="17.2"
          rx="2.6"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 17.4V8.2" />
          <path d="M12 12.6l3.4-3.4" />
        </g>
        <g fill="currentColor">
          <circle cx="12" cy="7.2" r="1.7" />
          <circle cx="12" cy="17.8" r="1.7" />
          <circle cx="16.2" cy="8.4" r="1.7" />
        </g>
      </g>
    </Frame>
  );
}
