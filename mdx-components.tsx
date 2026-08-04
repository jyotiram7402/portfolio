import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";

import { isExternalUrl, isProtocolLink } from "@/utils/url";

/**
 * MDX element overrides.
 *
 * Required at the project root by `@next/mdx` — it is how MDX content picks up
 * the site's components instead of bare HTML.
 *
 * Only two elements are overridden, and both for a functional reason rather than
 * a stylistic one: anchors need to route through `next/link` (and get the correct
 * `rel` when they leave the site), and images need `next/image` so MDX content
 * gets the same optimisation and layout reservation as the rest of the site.
 *
 * Typography is not handled here. It comes from `.prose-content` in
 * `styles/prose.css`, so the markup stays semantic and the rules stay in CSS.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    a: ({ href, children, ...props }) => {
      const target = href ?? "#";

      if (isProtocolLink(target) || isExternalUrl(target)) {
        return (
          <a
            href={target}
            target={isProtocolLink(target) ? undefined : "_blank"}
            rel={isProtocolLink(target) ? undefined : "noopener noreferrer"}
            {...props}
          >
            {children}
          </a>
        );
      }

      return (
        <Link href={target} {...props}>
          {children}
        </Link>
      );
    },

    img: (props) => (
      <Image
        // MDX cannot express `sizes`, so assume a prose-width column.
        sizes="(min-width: 768px) 45rem, 100vw"
        {...(props as ImageProps)}
      />
    ),

    ...components,
  };
}
