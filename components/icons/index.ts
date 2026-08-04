export { LogoMark } from "./logo-mark";
export type { LogoMarkProps } from "./logo-mark";
export { Spinner } from "./spinner";
export type { SpinnerProps } from "./spinner";

/**
 * Everything else comes from `lucide-react`, imported at the point of use.
 *
 * Re-exporting icons through this barrel would defeat
 * `optimizePackageImports`: the whole set would be pulled into one module and
 * the tree-shake would no longer be per-icon.
 */
