"use client";

import { Counter } from "@/components/animation/counter";
import { Stagger, StaggerItem } from "@/components/animation/stagger";
import { Container } from "@/components/layout/container";
import { stats } from "@/data/profile";
import { cn } from "@/lib/utils";

export interface StatsBandProps {
  className?: string;
}

/**
 * The figures immediately below the hero.
 *
 * A client component only because it consumes Lucide icon components from
 * `data/`, which cannot cross a server-to-client boundary as props. The counting
 * itself lives in `Counter`, which keeps the animation out of React's render path.
 *
 * Each cell is a `<dl>`: the number is genuinely the description of a term, and
 * that pairing is what makes "20+" mean something to a screen reader without the
 * label having to be read separately. Visual order (number, label, detail) differs
 * from the required source order (`dt` then `dd`), so it is set with `order-*`
 * rather than by writing invalid markup.
 *
 * Column rules are only drawn at `lg`, where the band is a single row of four. At
 * narrower widths it wraps to two rows, and a `divide-x` there would put a stray
 * hairline at the start of the second row.
 */
export function StatsBand({ className }: StatsBandProps) {
  return (
    <section
      aria-label="By the numbers"
      className={cn("relative border-y border-border", className)}
    >
      <Container size="page">
        <Stagger
          as="div"
          gap={0.08}
          className={cn(
            "grid grid-cols-2 gap-x-6 gap-y-10 py-12",
            "lg:grid-cols-4 lg:gap-0 lg:py-14",
          )}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <StaggerItem
                key={stat.id}
                className={cn(
                  "group/stat",
                  "lg:border-l lg:border-border lg:px-8",
                  "lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0",
                )}
              >
                <dl className="flex flex-col gap-1.5">
                  <dd className="order-1 text-4xl font-semibold tracking-tighter text-foreground">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      compact={stat.compact}
                    />
                  </dd>

                  <dt className="order-2 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Icon
                      aria-hidden="true"
                      className={cn(
                        "size-4 shrink-0 text-subtle",
                        "transition-colors duration-[var(--duration-normal)]",
                        "group-hover/stat:text-primary",
                      )}
                    />
                    {stat.label}
                  </dt>

                  <dd className="order-3 mt-1 max-w-[26ch] text-xs leading-relaxed text-subtle">
                    {stat.detail}
                  </dd>
                </dl>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>
    </section>
  );
}
