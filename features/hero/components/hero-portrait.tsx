import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export interface HeroPortraitProps {
  className?: string;
}

/**
 * The hero's right-hand visual: a portrait inside a layered geometric frame.
 *
 * Replaces the orbiting technology rings. The rings were abstract and said nothing a
 * visitor could not read in the skills section; a face is the one thing on a portfolio
 * that cannot be copied from a template, and it is what makes a recruiter's scan stop.
 *
 * The composition is three layers of geometry behind one photograph:
 *
 * 1. **A rotated outline frame** — the largest element, a hairline rectangle tilted a
 *    few degrees. It sets the whole piece off-axis, which is what makes the arrangement
 *    read as designed rather than as a photo someone forgot to crop.
 * 2. **A soft tinted panel**, counter-rotated, so the two tilts read as depth instead of
 *    as one crooked box.
 * 3. **The portrait**, upright. Everything leans except the subject, which is what keeps
 *    the eye on the face.
 *
 * Then three `</>` badges pinned to the corners of the frame.
 *
 * **On the source image.** It already carries a circular colour field rather than being a
 * cut-out, so it cannot be composited onto a panel the way a masked subject could. That
 * is why the layers sit *behind* it: the circle becomes the subject and the geometry
 * frames it, which means the composition does not depend on anyone re-cutting the
 * photograph.
 *
 * A Server Component. Nothing here is interactive — the parallax and reveal are applied
 * by the hero, and the tilt is static CSS, so this ships no JavaScript at all.
 *
 * `priority` is set because on a phone this is either the largest contentful paint or
 * immediately below it, and lazy-loading the hero image is how a good LCP becomes a bad
 * one. `sizes` is explicit so a 375px viewport fetches a 420px-wide file rather than the
 * 1256px original.
 */
export function HeroPortrait({ className }: HeroPortraitProps) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[26rem] lg:max-w-[30rem]",
        className,
      )}
    >
      {/* Layer 1 — the tilted outline, the largest element. `inset` keeps the rotated
          corners inside the square so they cannot overflow the column and introduce a
          horizontal scrollbar. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-[3%] rounded-[2.25rem] border border-primary/40",
          "rotate-[7deg]",
        )}
      />

      {/* Layer 2 — the counter-rotated panel. Only its corners are visible past the
          portrait, which is the point: two opposing tilts read as depth, where one
          would just read as a crooked box. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-[11%] rounded-[2rem] border border-border",
          "-rotate-[6deg] bg-elevated",
        )}
      />

      {/* Layer 3 — the portrait, upright and on top.

          Masked to a circle rather than left square. The subject is already composed
          inside a circular colour field, so the mask costs nothing visually, and it
          means the layout does not depend on the file's corners being transparent —
          they are, but a future re-export on a white background would otherwise drop a
          white card into the middle of the composition. */}
      <div className="absolute inset-[8%] overflow-hidden rounded-full">
        <Image
          src="/images/portrait.png"
          alt={`${siteConfig.name} — ${siteConfig.role}`}
          fill
          priority
          sizes="(min-width: 1024px) 30rem, (min-width: 640px) 26rem, 90vw"
          className="object-cover object-center"
        />
      </div>

      <CodeBadge className="top-[1%] left-[3%]" />
      <CodeBadge className="top-[20%] right-[-2%]" />
      <CodeBadge className="bottom-[10%] left-[-2%]" />
    </div>
  );
}

/**
 * One floating `</>` marker.
 *
 * Positioned by the caller rather than by an index, because the three placements are a
 * composition decision — they sit on the outline frame's corners, and a loop over evenly
 * spaced positions would put one of them across the subject's face.
 */
function CodeBadge({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute grid size-11 place-items-center rounded-2xl sm:size-14",
        "border border-border bg-card shadow-lg",
        "font-mono text-sm font-semibold text-primary sm:text-base",
        className,
      )}
    >
      &lt;/&gt;
    </span>
  );
}
