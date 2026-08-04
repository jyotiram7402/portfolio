export interface StructuredDataProps {
  /** A single schema object, or a graph of them. */
  data: object | readonly object[];
}

/**
 * Emits JSON-LD.
 *
 * `<` is escaped to its unicode form before injection. The data is ours today,
 * but a schema builder that ever interpolates user input — a comment, a project
 * title from an API — would otherwise be able to close the script tag. Escaping
 * here means that can never become a vulnerability elsewhere.
 *
 * A Server Component, so the payload ships in the HTML where crawlers read it,
 * and costs the client bundle nothing.
 */
export function StructuredData({ data }: StructuredDataProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // Required: JSON-LD must be raw text, not React-escaped children.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
