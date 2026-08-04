import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

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

/**
 * Tags this may render as.
 *
 * A closed union rather than `ElementType`. React 19's types mark void elements' `children` as
 * `never`, so a prop spanning every intrinsic tag resolves `children` to `never` and any component
 * that nests content fails to compile. Every tag listed here accepts phrasing or flow content, so
 * the union's `children` type resolves cleanly.
 */
export type GradientTextTag =
  | "span"
  | "p"
  | "strong"
  | "em"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

export interface GradientTextProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof gradientTextVariants> {
  as?: GradientTextTag;
}

/**
 * Gradient-filled text.
 *
 * `background-clip: text` removes the text from the accessibility tree's colour contrast
 * calculation but not from the tree itself, so the content stays selectable and readable by screen
 * readers. The `subtle` variant keeps a legible contrast ratio at both ends of the ramp; `brand` is
 * decorative and belongs on large display type only.
 */
export function GradientText({
  as: Tag = "span",
  variant,
  className,
  children,
  ...props
}: GradientTextProps) {
  return (
    <Tag className={cn(gradientTextVariants({ variant }), className)} {...props}>
      {children}
    </Tag>
  );
}

export { gradientTextVariants };
