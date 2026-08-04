import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, resolving Tailwind conflicts in favour of the last one.
 *
 * This is what makes every primitive overridable: a caller can pass
 * `className="px-8"` to a button whose base is `px-4` and get `px-8`, not both.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
