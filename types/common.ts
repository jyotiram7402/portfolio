import type { ReactNode } from "react";

export type Maybe<T> = T | null | undefined;

export type ValueOf<T> = T[keyof T];

/** Every visual primitive accepts a className so callers can compose layout. */
export type WithClassName<T = unknown> = T & { className?: string };

export type WithChildren<T = unknown> = T & { children?: ReactNode };

/*
 * A generic `PolymorphicProps<TElement extends ElementType>` helper lived here through Sprint 3
 * and was removed in Sprint 4. React 19's types mark void elements' `children` as `never`, so any
 * component using it and rendering children resolved `children` to `never` and failed to compile.
 *
 * Components that genuinely need to vary their tag now declare a closed union of tags instead —
 * see `GradientTextTag` in components/ui/gradient-text.tsx, or the `as` prop on `Section`. That is
 * both type-safe and more honest about the handful of elements each component is designed for.
 */

/* -------------------------------------------------------------------------- */
/*  Shared design-system scales                                               */
/* -------------------------------------------------------------------------- */

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type Tone =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "danger";

export type Alignment = "start" | "center" | "end";

export type Axis = "x" | "y";

export type Direction = "up" | "down" | "left" | "right";

export type ScrollDirection = "up" | "down";

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}
