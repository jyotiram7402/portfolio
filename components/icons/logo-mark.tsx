import { cn } from "@/lib/utils";

export interface LogoMarkProps {
  className?: string;
}

/**
 * The brand mark: a diamond aperture with a solid core.
 *
 * Painted in `currentColor`, with no gradient and no `<defs>`. It used to carry a
 * blue → violet → cyan sweep; the palette now has a single accent, so a
 * three-stop gradient had nowhere to travel. Inheriting text colour is also the
 * better behaviour: the same mark reads correctly in the navbar, inside a
 * coloured chat avatar, and on the preloader without a variant prop.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn("size-8", className)}
    >
      <path
        d="M16 2.5 29.5 16 16 29.5 2.5 16Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <path d="M16 9.25 22.75 16 16 22.75 9.25 16Z" fill="currentColor" />
    </svg>
  );
}
