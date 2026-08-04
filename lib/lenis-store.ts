import type Lenis from "lenis";

/**
 * The active Lenis instance, held in module scope.
 *
 * `utils/scroll.ts` needs the instance from outside React — it is called from event handlers, from
 * the command palette and from MDX anchor clicks — so something has to hold it where a non-React
 * caller can reach it.
 *
 * This was a `window.lenis` global augmentation through Sprint 3. Two reasons it is not any more:
 *
 * • **It could not be typed reliably.** A `declare global { interface Window { lenis?: Lenis } }` in
 *   a `.d.ts` resolved `Lenis` to a different declaration than the value import did, so assigning
 *   the instance failed to typecheck. A module-scoped variable is typed at exactly one point.
 * • **Nothing else can collide with it.** Any dependency is free to augment `Window`, and a name as
 *   generic as `lenis` is a plausible collision. A module binding is private by construction.
 *
 * `null` is a valid, expected value: Lenis is not instantiated on touch devices or under reduced
 * motion, and every consumer already handles that.
 */
let instance: Lenis | null = null;

/** Called by `LenisProvider` on create, and with `null` on teardown. */
export function setLenisInstance(next: Lenis | null): void {
  instance = next;
}

export function getLenisInstance(): Lenis | null {
  return instance;
}
