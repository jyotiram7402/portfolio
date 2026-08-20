export { CertificateCard } from "./components/certificate-card";
export type { CertificateCardProps } from "./components/certificate-card";
export { CertificationsLibrary } from "./components/certifications-library";
export type { CertificationsLibraryProps } from "./components/certifications-library";
export { CertificationsSection } from "./components/certifications-section";

/**
 * Two surfaces and the card they share:
 *
 * • `CertificationsSection` — the homepage strip, three entries behind a link out.
 * • `CertificationsLibrary` — the `/certifications` page, with search and subject filters.
 * • `CertificateCard` — the card both use, which owns its own viewer dialog.
 *
 * `CertificateCover` stays internal. It is an implementation detail of the card and the
 * viewer, and nothing outside this slice should be deciding how a certificate is drawn.
 */
