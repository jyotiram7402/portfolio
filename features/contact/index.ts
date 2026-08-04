export { ChannelCards } from "./components/channel-cards";
export type { ChannelCardsProps } from "./components/channel-cards";
export { ContactExperience } from "./components/contact-experience";
export { ContactForm } from "./components/contact-form";
export type { ContactFormProps } from "./components/contact-form";
export { ContactSection } from "./components/contact-section";
export { SocialGrid } from "./components/social-grid";
export type { SocialGridProps } from "./components/social-grid";

/**
 * `ChannelCards`, `ContactForm` and `SocialGrid` are public because each has more than one caller
 * inside this slice's two entry points — the full `/contact` experience and the compact home
 * section. `MapPanel` stays internal; it only makes sense beside the form.
 *
 * `BookingPanel` deliberately lives in `components/common/` instead: the recruiter dashboard needs
 * it too, and features are not allowed to import each other.
 */
