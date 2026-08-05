/**
 * The stacking contract. Mirrors the `--z-*` tokens in `styles/themes.css`.
 *
 * Layers are declared once, here, so no component ever invents a `z-[9999]`.
 */
export const Z_INDEX = {
  behind: -1,
  base: 0,
  decoration: 10,
  content: 20,
  sticky: 30,
  header: 40,
  drawer: 50,
  overlay: 60,
  modal: 70,
  popover: 80,
  toast: 90,
  loader: 100,
} as const;

export type ZLayer = keyof typeof Z_INDEX;

/**
 * Tailwind class for a layer. Written as arbitrary values so the token stays
 * the only definition of the number.
 */
export const Z_CLASS = {
  behind: "z-[var(--z-behind)]",
  base: "z-[var(--z-base)]",
  decoration: "z-[var(--z-decoration)]",
  content: "z-[var(--z-content)]",
  sticky: "z-[var(--z-sticky)]",
  header: "z-[var(--z-header)]",
  drawer: "z-[var(--z-drawer)]",
  overlay: "z-[var(--z-overlay)]",
  modal: "z-[var(--z-modal)]",
  popover: "z-[var(--z-popover)]",
  toast: "z-[var(--z-toast)]",
  loader: "z-[var(--z-loader)]",
} as const satisfies Record<ZLayer, string>;
