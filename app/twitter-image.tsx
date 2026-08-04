/**
 * Twitter/X card.
 *
 * `summary_large_image` wants the same 1.91:1 crop as OpenGraph, so this route
 * re-exports the OG generator rather than maintaining a second design that would
 * inevitably drift.
 */
export { default, size, contentType, alt } from "./opengraph-image";
