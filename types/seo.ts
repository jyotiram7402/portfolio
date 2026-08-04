export interface OgImageDescriptor {
  url: string;
  width: number;
  height: number;
  alt: string;
}

/** Input for `buildMetadata()` — everything is optional and falls back to site defaults. */
export interface PageSeo {
  title?: string;
  description?: string;
  /** Path relative to the site root, e.g. `/blog/post-slug`. */
  path?: string;
  keywords?: readonly string[];
  image?: string;
  /** `article` unlocks published/modified time and author in OpenGraph. */
  type?: "website" | "article" | "profile";
  publishedTime?: string;
  modifiedTime?: string;
  /** Excludes the page from search indexes. */
  noIndex?: boolean;
}

export interface StructuredDataPerson {
  name: string;
  jobTitle: string;
  url: string;
  image: string;
  email?: string;
  sameAs: readonly string[];
  knowsAbout?: readonly string[];
}
