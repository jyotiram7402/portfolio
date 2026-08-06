import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { heroStatement } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface StatementBandProps {
  className?: string;
}

/**
 * The positioning statement, directly under the hero.
 *
 * Placed here rather than inside the hero on purpose. The hero is already a full
 * `100dvh` — badge, headline, subtitle, rotating role and three buttons — and adding
 * three paragraphs to it would push the calls to action below the fold on a phone,
 * which is the one thing that layout exists to prevent. As its own band it is still the
 * first thing read after the hero, and it gets the width and the type size to land.
 *
 * The lead is the only oversized type on the page outside a heading, and that is the
 * point: it reframes every section below it. It is a `<p>`, not a heading — it makes a
 * claim, it does not label a region, and promoting it would put a rootless level into
 * the document outline between the `h1` and the section headings.
 *
 * A Server Component. `Reveal` is the only client leaf.
 */
export function StatementBand({ className }: StatementBandProps) {
  return (
    <Section
      // `sm`, not the default `md`: this is a band between two sections, and section
      // spacing here would read as a chapter break rather than as an aside.
      spacing="sm"
      containerSize="content"
      className={cn("border-y border-border bg-surface", className)}
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-14">
        {/* The accent rule carries the emphasis on desktop; on a phone it would just
            eat horizontal space, so it becomes a short bar above the text instead. */}
        <span
          aria-hidden="true"
          className="h-0.5 w-12 shrink-0 rounded-full bg-primary lg:h-auto lg:w-0.5"
        />

        <div className="flex flex-col gap-6">
          <Reveal effect="up" distance={16} as="p" className="max-w-3xl">
            <strong className="text-2xl leading-tight font-semibold tracking-tight text-balance text-foreground sm:text-3xl">
              {heroStatement.lead}
            </strong>
          </Reveal>

          <div className="flex max-w-2xl flex-col gap-4">
            {heroStatement.body.map((paragraph, index) => (
              <Reveal
                key={paragraph.slice(0, 24)}
                effect="up"
                distance={12}
                delay={0.08 * (index + 1)}
                as="p"
                className="text-base leading-relaxed text-muted"
              >
                {paragraph}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
