import { type VariantProps, cva } from "class-variance-authority";
import type { ReactNode } from "react";

import { Container } from "@/components/layout/container";
import type { ContainerSize } from "@/components/layout/container";
import { cn } from "@/lib/utils";

const sectionVariants = cva("relative", {
  variants: {
    spacing: {
      none: "",
      sm: "py-16 sm:py-20",
      md: "py-24 sm:py-28 lg:py-32",
      lg: "py-32 sm:py-40 lg:py-48",
    },
  },
  defaultVariants: { spacing: "md" },
});

export interface SectionProps extends VariantProps<typeof sectionVariants> {
  children: ReactNode;
  /** Anchor target. Required when the section appears in navigation. */
  id?: string;
  /** Element to render. `section` needs a label; use `div` for pure layout. */
  as?: "section" | "div" | "article" | "header" | "footer";
  /** Accessible name for the landmark, when the visible heading is not enough. */
  ariaLabel?: string;
  /** Points at the id of the heading that names this section. */
  ariaLabelledBy?: string;
  containerSize?: ContainerSize;
  /** Skips the container so the child can bleed to the viewport edge. */
  bleed?: boolean;
  className?: string;
  innerClassName?: string;
}

/**
 * Vertical rhythm wrapper.
 *
 * Pairs the spacing scale with a `Container`, so a page is a list of sections
 * rather than a pile of ad-hoc padding. The `py-*` steps are the only vertical
 * section rhythm in the site.
 *
 * A `<section>` element only forms a landmark when it has an accessible name, so
 * `ariaLabel` / `ariaLabelledBy` exist to make that explicit rather than leaving
 * anonymous regions in the accessibility tree.
 */
export function Section({
  children,
  id,
  as = "section",
  spacing,
  ariaLabel,
  ariaLabelledBy,
  containerSize = "content",
  bleed = false,
  className,
  innerClassName,
}: SectionProps) {
  const Component = as;

  return (
    <Component
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={cn(sectionVariants({ spacing }), className)}
    >
      {bleed ? (
        children
      ) : (
        <Container size={containerSize} className={innerClassName}>
          {children}
        </Container>
      )}
    </Component>
  );
}

export { sectionVariants };
