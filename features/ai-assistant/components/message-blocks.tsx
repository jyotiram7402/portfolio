"use client";

import { ArrowUpRight, Download, ExternalLink, Mail } from "lucide-react";
import Link from "next/link";

import { InlineMarkdown } from "@/components/markdown/inline-markdown";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/utils";
import type { ChatAction, ResponseBlock } from "@/types/ai";
import { scrollToElement } from "@/utils/scroll";

/**
 * Renders one response block.
 *
 * This is the component an LLM migration reuses unchanged. The blocks are already the
 * shape a tool-calling model emits — prose plus structured attachments — so a model that
 * returns `{ type: "projects", ids: [...] }` renders identically to the local engine's
 * answer today.
 *
 * Project cards resolve ids against `data/projects.ts` at render time rather than
 * carrying the project inline. The engine therefore never has to serialise an icon
 * component, and a project edit is reflected in the chat immediately.
 */

function ActionButton({ action }: { action: ChatAction }) {
  const base = cn(
    "inline-flex items-center gap-1.5 rounded-full border border-border",
    "bg-elevated px-3 py-1.5 text-xs font-medium text-foreground",
    "transition-colors duration-[var(--duration-fast)]",
    "hover:border-border-strong hover:bg-card focus-ring",
  );

  if (action.kind === "internal" && action.href.startsWith("#")) {
    const id = action.href.slice(1);
    return (
      <button
        type="button"
        onClick={() => scrollToElement(id)}
        className={base}
      >
        {action.label}
        <ArrowUpRight aria-hidden="true" className="size-3" />
      </button>
    );
  }

  if (action.kind === "internal") {
    return (
      <Link href={action.href} className={base}>
        {action.label}
        <ArrowUpRight aria-hidden="true" className="size-3" />
      </Link>
    );
  }

  if (action.kind === "mail") {
    return (
      <a href={action.href} className={base}>
        <Mail aria-hidden="true" className="size-3" />
        {action.label}
      </a>
    );
  }

  if (action.kind === "download") {
    return (
      <a href={action.href} download className={base}>
        <Download aria-hidden="true" className="size-3" />
        {action.label}
      </a>
    );
  }

  return (
    <a href={action.href} target="_blank" rel="noopener noreferrer" className={base}>
      {action.label}
      <ExternalLink aria-hidden="true" className="size-3" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function ChatProjectCard({ id }: { id: string }) {
  const project = getProject(id);
  if (!project) return null;

  const Icon = project.icon;

  return (
    <li>
      <article
        className={cn(
          "group/card flex flex-col gap-3 rounded-xl border border-border",
          "bg-card p-3.5 transition-colors duration-[var(--duration-normal)]",
          "hover:border-primary/40",
        )}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg",
              "border border-border bg-elevated text-muted",
              "transition-colors group-hover/card:text-primary",
              "[&_svg]:size-4",
            )}
          >
            <Icon />
          </span>

          <div className="flex min-w-0 flex-col gap-0.5">
            <h4 className="text-sm font-semibold tracking-tight text-foreground">
              {project.name}
            </h4>
            <p className="text-xs leading-relaxed text-muted">{project.tagline}</p>
          </div>

          <Badge
            tone={project.status === "active" ? "primary" : "default"}
            size="sm"
            className="ml-auto shrink-0"
          >
            {project.status}
          </Badge>
        </div>

        <ul className="flex flex-wrap gap-1">
          {project.stack.slice(0, 5).map((technology) => (
            <li
              key={technology}
              className="rounded-full border border-border bg-input px-2 py-0.5 font-mono text-2xs text-subtle"
            >
              {technology}
            </li>
          ))}
        </ul>
      </article>
    </li>
  );
}

export function ResponseBlockView({ block }: { block: ResponseBlock }) {
  switch (block.type) {
    case "text":
      return (
        <p className="text-sm leading-relaxed text-muted">
          <InlineMarkdown>{block.value}</InlineMarkdown>
        </p>
      );

    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List
          className={cn(
            "flex flex-col gap-2 text-sm leading-relaxed text-muted",
            block.ordered ? "list-decimal pl-5" : "pl-0",
          )}
        >
          {block.items.map((item) => (
            <li
              key={item}
              className={cn("flex gap-2.5", block.ordered && "list-item pl-0")}
            >
              {block.ordered ? null : (
                <span
                  aria-hidden="true"
                  className="mt-2 size-1 shrink-0 rounded-full bg-border-strong"
                />
              )}
              <span>
                <InlineMarkdown>{item}</InlineMarkdown>
              </span>
            </li>
          ))}
        </List>
      );
    }

    case "code":
      return (
        <figure className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
            <span className="font-mono text-2xs tracking-wider text-subtle uppercase">
              {block.language}
            </span>
            <CopyButton value={block.code} label="Copy code" />
          </div>
          <pre className="overflow-x-auto p-3.5 font-mono text-xs leading-relaxed text-foreground">
            <code>{block.code}</code>
          </pre>
          {block.caption ? (
            <figcaption className="border-t border-border px-3.5 py-2 text-2xs text-subtle">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      );

    case "badges":
      return (
        <div className="flex flex-col gap-2">
          {block.label ? (
            <p className="font-mono text-2xs tracking-widest text-subtle uppercase">
              {block.label}
            </p>
          ) : null}
          <ul className="flex flex-wrap gap-1.5">
            {block.items.map((item) => (
              <li key={item}>
                <span
                  className={cn(
                    "inline-flex h-6 items-center rounded-full border border-border",
                    "bg-input px-2.5 font-mono text-2xs text-muted",
                  )}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );

    case "projects":
      return (
        <ul className="flex flex-col gap-2.5">
          {block.ids.map((id) => (
            <ChatProjectCard key={id} id={id} />
          ))}
        </ul>
      );

    case "actions":
      return (
        <div className="flex flex-wrap gap-2">
          {block.actions.map((action) => (
            <ActionButton key={`${action.kind}:${action.href}`} action={action} />
          ))}
        </div>
      );

    case "facts":
      return (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 rounded-xl border border-border bg-surface/60 p-3.5">
          {block.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <dt className="font-mono text-2xs tracking-widest text-subtle uppercase">
                {fact.label}
              </dt>
              <dd className="text-sm font-medium text-foreground">{fact.value}</dd>
            </div>
          ))}
        </dl>
      );
  }
}

export function ResponseBlocks({
  blocks,
  className,
}: {
  blocks: readonly ResponseBlock[];
  className?: string;
}) {
  if (blocks.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-3.5", className)}>
      {blocks.map((block, index) => (
        <ResponseBlockView key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
