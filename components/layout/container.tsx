import { type VariantProps, cva } from "class-variance-authority";
import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      narrow: "max-w-narrow",
      /* `reading`, not `prose`: Tailwind already owns `max-w-prose`. */
      prose: "max-w-reading",
      content: "max-w-content",
      page: "max-w-page",
      wide: "max-w-wide",
      full: "max-w-none",
    },
    gutter: {
      /** Standard horizontal inset. Widens once there is room for it. */
      true: "px-6 sm:px-8 lg:px-10",
      false: "",
    },
  },
  defaultVariants: { size: "content", gutter: true },
});

export interface ContainerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

/**
 * The measure options, as a standalone type.
 *
 * Exported so consumers that forward a size — `Section`, mainly — can type the prop without
 * importing `containerVariants` as a value purely to read its type off it.
 */
export type ContainerSize = NonNullable<
  VariantProps<typeof containerVariants>["size"]
>;

/**
 * Horizontal measure and gutter.
 *
 * The only component allowed to set a max-width or a horizontal page inset. Everything else
 * composes it, which is what keeps the left edge of the site aligned from the navbar to the
 * footer without any of them knowing the number.
 *
 * Widths come from the `--container-*` tokens, so an ultra-wide display gets more measure without
 * every component being touched.
 *
 * Always a `<div>`, deliberately. It carried a polymorphic `as` prop through Sprint 3 and no
 * caller ever used it — semantics belong on `Section`, which owns the landmark, while this owns
 * only the measure. Removing it also removes a real typing hazard: React 19's types mark void
 * elements' `children` as `never`, so a prop typed as the full `ElementType` union resolves
 * `children` to `never` and fails to compile the moment anything is nested inside.
 */
export function Container({ size, gutter, className, ...props }: ContainerProps) {
  return (
    <div className={cn(containerVariants({ size, gutter }), className)} {...props} />
  );
}

export { containerVariants };
