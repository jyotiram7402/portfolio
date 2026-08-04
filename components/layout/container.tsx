import { type VariantProps, cva } from "class-variance-authority";
import type { ElementType } from "react";

import { cn } from "@/lib/utils";
import type { PolymorphicProps } from "@/types/common";

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

export type ContainerProps<TElement extends ElementType = "div"> =
  PolymorphicProps<TElement, VariantProps<typeof containerVariants>>;

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
 * The only component allowed to set a max-width or a horizontal page inset.
 * Everything else composes it, which is what keeps the left edge of the site
 * aligned from the navbar to the footer without any of them knowing the number.
 *
 * Widths come from the `--container-*` tokens, so an ultra-wide display gets more
 * measure without every component being touched.
 */
export function Container<TElement extends ElementType = "div">({
  as,
  size,
  gutter,
  className,
  children,
  ...props
}: ContainerProps<TElement>) {
  const Component = (as ?? "div") as ElementType;

  return (
    <Component
      className={cn(containerVariants({ size, gutter }), className)}
      {...props}
    >
      {children}
    </Component>
  );
}

export { containerVariants };
