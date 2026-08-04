import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { isExternalUrl, isProtocolLink } from "@/utils/url";

export interface InlineMarkdownProps {
  children: string;
  className?: string;
}

/**
 * A deliberately tiny inline markdown renderer.
 *
 * Supports exactly four things: `**bold**`, `*italic*`, `` `code` `` and
 * `[label](href)`. Nothing else — no block syntax, no HTML passthrough, no images.
 *
 * Written rather than imported, and the reason is the threat model. The chat renders
 * strings from `data/ai/responses.ts` today, but the whole architecture is built so an
 * LLM can produce them tomorrow — and the moment a model is writing this text, a
 * markdown library that renders raw HTML is an injection vector. This produces React
 * elements only. There is no path from the input to `dangerouslySetInnerHTML`, so
 * markup in the input renders as literal text.
 *
 * Links are also constrained: anything that is not http(s), mailto, tel or a
 * same-origin path renders as plain text rather than as an anchor. That closes
 * `javascript:` and `data:` without needing a sanitiser.
 */

/** Ordered by precedence. Code first, so backticks win over emphasis inside them. */
const TOKEN_PATTERN =
  /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)|(\*[^*\n]+\*)|(\[[^\]\n]+\]\([^)\s]+\))/g;

const LINK_PATTERN = /^\[([^\]]+)\]\(([^)\s]+)\)$/;

function isSafeHref(href: string): boolean {
  if (href.startsWith("/") || href.startsWith("#")) return true;
  if (isProtocolLink(href)) return true;
  return /^https?:\/\//i.test(href);
}

function renderToken(token: string, key: number): ReactNode {
  if (token.startsWith("`") && token.endsWith("`")) {
    return (
      <code
        key={key}
        className="rounded border border-border bg-input px-1 py-0.5 font-mono text-[0.85em] text-foreground"
      >
        {token.slice(1, -1)}
      </code>
    );
  }

  if (token.startsWith("**") && token.endsWith("**")) {
    return (
      <strong key={key} className="font-semibold text-foreground">
        {token.slice(2, -2)}
      </strong>
    );
  }

  if (token.startsWith("*") && token.endsWith("*")) {
    return (
      <em key={key} className="italic">
        {token.slice(1, -1)}
      </em>
    );
  }

  const link = LINK_PATTERN.exec(token);
  if (link) {
    const [, label = "", href = ""] = link;

    // An unsafe scheme degrades to text rather than being silently dropped, so the
    // content is never lost and the link is never live.
    if (!isSafeHref(href)) return <Fragment key={key}>{label}</Fragment>;

    const external = isExternalUrl(href);
    return (
      <a
        key={key}
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-foreground underline decoration-primary decoration-1 underline-offset-2 transition-colors hover:decoration-foreground"
      >
        {label}
        {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
      </a>
    );
  }

  return <Fragment key={key}>{token}</Fragment>;
}

export function InlineMarkdown({ children, className }: InlineMarkdownProps) {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of children.matchAll(TOKEN_PATTERN)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(
        <Fragment key={(key += 1)}>{children.slice(lastIndex, index)}</Fragment>,
      );
    }

    nodes.push(renderToken(match[0], (key += 1)));
    lastIndex = index + match[0].length;
  }

  if (lastIndex < children.length) {
    nodes.push(<Fragment key={(key += 1)}>{children.slice(lastIndex)}</Fragment>);
  }

  return <span className={cn(className)}>{nodes}</span>;
}
