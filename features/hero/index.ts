export { HeroSection } from "./components/hero-section";
export { StatementBand } from "./components/statement-band";

/**
 * The slice's two public exports — the first screen and the statement directly beneath
 * it, which are one argument split across two bands for layout reasons.
 *
 * `AnimatedRoles`, `TechOrbit` and `ScrollCue` are internal: they exist to serve this
 * hero, and keeping them private leaves them free to be reshaped without checking for
 * outside callers.
 */
