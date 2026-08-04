"use client";

import { Check, Link2, Linkedin, Share2, Twitter } from "lucide-react";

import { Tooltip } from "@/components/ui/tooltip";
import { useShare } from "@/hooks/use-share";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/utils/url";

export interface ShareRowProps {
  title: string;
  /** Site-relative path. Resolved to an absolute URL for the share targets. */
  path: string;
  className?: string;
}

/**
 * Share controls.
 *
 * On a device with the OS share sheet — which is most phones — one native button replaces
 * three network-specific ones. That is strictly better: it offers every app the reader
 * actually uses rather than the two a developer guessed.
 *
 * Desktop gets explicit intent links plus copy, because `navigator.share` is still patchy
 * there and a share sheet that does nothing is worse than a link.
 *
 * The copy confirmation is announced through a live region, not just shown as a tick —
 * "did that work?" is the whole question the control answers.
 */
export function ShareRow({ title, path, className }: ShareRowProps) {
  const url = absoluteUrl(path);
  const { canShare, state, share, copy } = useShare();

  const buttonClass = cn(
    "grid size-9 place-items-center rounded-full border border-border",
    "bg-elevated text-muted transition-colors duration-[var(--duration-fast)]",
    "hover:border-border-strong hover:text-foreground focus-ring",
  );

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="font-mono text-2xs tracking-widest text-subtle uppercase">
        Share
      </span>

      <ul className="flex items-center gap-2">
        {canShare ? (
          <li>
            <Tooltip content="Share">
              <button
                type="button"
                onClick={() => void share({ title, url })}
                aria-label={`Share “${title}”`}
                className={buttonClass}
              >
                <Share2 aria-hidden="true" className="size-4" />
              </button>
            </Tooltip>
          </li>
        ) : (
          <>
            <li>
              <Tooltip content="Share on X">
                <a
                  href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on X"
                  className={buttonClass}
                >
                  <Twitter aria-hidden="true" className="size-4" />
                </a>
              </Tooltip>
            </li>
            <li>
              <Tooltip content="Share on LinkedIn">
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className={buttonClass}
                >
                  <Linkedin aria-hidden="true" className="size-4" />
                </a>
              </Tooltip>
            </li>
          </>
        )}

        <li>
          <Tooltip content={state === "copied" ? "Copied" : "Copy link"}>
            <button
              type="button"
              onClick={() => void copy(url)}
              aria-label="Copy link to this article"
              className={cn(buttonClass, state === "copied" && "text-success")}
            >
              {state === "copied" ? (
                <Check aria-hidden="true" className="size-4" />
              ) : (
                <Link2 aria-hidden="true" className="size-4" />
              )}
            </button>
          </Tooltip>
        </li>
      </ul>

      <span role="status" aria-live="polite" className="sr-only">
        {state === "copied" ? "Link copied to clipboard" : null}
        {state === "shared" ? "Shared" : null}
        {state === "error" ? "Could not share — copy the address from the bar" : null}
      </span>
    </div>
  );
}
