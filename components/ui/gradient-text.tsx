import { type VariantProps, cva } from "class-variance-authority";
import type { ElementType } from "react";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@/types/common";

const gradientTextVariants = cva("", {
  variants: {
    variant: {
      /** Foreground fading to muted — for headlines that should stay readable. */
      subtle: "text-gradient",
      /** Full brand sweep — reserve for one element per view. */
      brand: "text-gradient-brand",
      /** Brand sweep in motion. */
      animated: "text-gradient-animated animate-gradient",
    },
  },
  defaultVariants: { variant: "subtle" },
});

export type GradientTextProps<TElement extends ElementType = "span"> =
  PolymorphicProps<TElement, VariantProps<typeof gradientTextVariants>>;

/**
 * Gradient-filled text.
 *
 * `background-clip: text` removes the text from the accessibility tree's colour
 * contrast calculation but not from the tree itself, so the content stays
 * selectable and readable by screen readers. The `subtle` variant keeps a
 * legible contrast ratio at both ends of the ramp; `brand` is decorative and
 * belongs on large display type only.
 */
export function GradientText<TElement extends ElementType = "span">({
  as,
  variant,
  className,
  children,
  ...props
}: GradientTextProps<TElement>) {
  const Component = (as ?? "span") as ElementType;

  return (
    <Component
      className={cn(gradientTextVariants({ variant }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export { gradientTextVariants };
