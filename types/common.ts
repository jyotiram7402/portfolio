import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

export type Maybe<T> = T | null | undefined;

export type ValueOf<T> = T[keyof T];

/** Every visual primitive accepts a className so callers can compose layout. */
export type WithClassName<T = unknown> = T & { className?: string };

export type WithChildren<T = unknown> = T & { children?: ReactNode };

/**
 * Props for a component that can render as a different element via `as`.
 * Own props win over the intrinsic ones they collide with.
 */
export type PolymorphicProps<
  TElement extends ElementType,
  TOwnProps = unknown,
> = TOwnProps &
  Omit<ComponentPropsWithoutRef<TElement>, keyof TOwnProps | "as"> & {
    as?: TElement;
  };

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
