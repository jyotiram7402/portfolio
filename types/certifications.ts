/**
 * Certifications.
 *
 * A dedicated model rather than another `AchievementKind`. `Achievement` describes a claim
 * in one sentence with an optional link; a certificate has a scanned document, a credential
 * id, an issuer with its own visual identity and a verification URL. Squeezing those into
 * the achievements shape would have meant five optional fields that only ever apply to one
 * kind — which is the point at which a shared type has stopped being shared.
 */

/**
 * Known issuers.
 *
 * A closed union rather than a free string. It costs one line to add an issuer and buys a
 * typed filter, a stable accent colour and a compile error the moment a certificate is
 * filed under a name that does not exist. `other` is the honest escape hatch, not a
 * dumping ground — prefer adding the issuer.
 */
export type CertificationIssuer =
  | "proazure"
  | "udemy"
  | "anthropic"
  | "geeksforgeeks"
  | "coursera"
  | "linkedin"
  | "simplilearn"
  | "forage"
  | "barclays"
  | "aws"
  | "microsoft"
  | "google"
  | "oracle"
  | "hackerrank"
  | "zensar"
  | "other";

/** Broad subject buckets, for the library filter. Mirrors the project domains in spirit. */
export type CertificationTrack =
  /** Professional, not a course: an internship or employer credential. Ranks first. */
  | "professional"
  | "java"
  | "spring"
  | "backend"
  | "ai"
  | "cloud-devops"
  | "frontend"
  | "data"
  | "fundamentals";

export interface Certification {
  id: string;
  /** URL-safe, stable. Used as the image filename and the anchor target. */
  slug: string;
  /** Exactly as printed on the certificate. Not paraphrased. */
  title: string;
  issuer: CertificationIssuer;
  /**
   * Human-readable award date, e.g. "Mar 2025".
   *
   * Stored alongside `issuedAt` rather than formatted from it, because certificates
   * routinely show only a month and year and inventing a day would be a fabricated detail
   * on the one artefact whose whole value is being checkable.
   */
  issued: string;
  /** ISO-8601, for sorting only. Day precision may be approximate; `issued` is what renders. */
  issuedAt: string;
  /** Credential id printed on the document. Rendered in mono, selectable. */
  credentialId?: string;
  /** Public verification URL, when the issuer provides one. */
  verifyUrl?: string;
  /**
   * Displayable image under `/public/certificates/`.
   *
   * Leave undefined unless the file exists — `CertificateCover` renders a generated visual
   * in that case, whereas a path to a missing file renders a broken image. Undefined is the
   * safe default.
   */
  image?: string;
  /**
   * The original document, when it is a PDF. Opened in a new tab rather than embedded:
   * in-page PDF viewers are inconsistent across engines and `object-src 'none'` in the CSP
   * blocks the `<embed>` route anyway.
   */
  file?: string;
  /** What it actually covered, in one or two sentences. Never the marketing blurb. */
  summary: string;
  /** Subject buckets this belongs to. At least one. */
  tracks: readonly CertificationTrack[];
  /** Skills as printed or as genuinely covered. Matched against `data/skills.ts` by name. */
  skills: readonly string[];
  /** Course length in hours, where the issuer states it. Udemy does. */
  hours?: number;
  /** Promotes it to the homepage strip. */
  featured?: boolean;
  /** Homepage ordering. Lower first; entries without one sort after those with one. */
  order?: number;
}

export interface IssuerMeta {
  label: string;
  /**
   * Brand colour, used only to tint the chip and the generated cover — never to paint text.
   * Chosen at mid luminance so it reads on both `#000` and `#fff`, the same rule as
   * `lib/tech-brand.ts`.
   */
  accent: string;
}
