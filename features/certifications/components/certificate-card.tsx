"use client";

import { BadgeCheck, ExternalLink, FileText, Maximize2 } from "lucide-react";
import { type CSSProperties, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ISSUER_META } from "@/data/certifications";
import { CertificateCover } from "@/features/certifications/components/certificate-cover";
import { cn } from "@/lib/utils";
import type { Certification } from "@/types/certifications";
import { externalLinkAttributes } from "@/utils/url";

export interface CertificateCardProps {
  certification: Certification;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/** At most four. A certificate listing ten skills has told the reader nothing. */
const MAX_SKILLS = 4;

/**
 * One certificate, with a viewer.
 *
 * **A button, not a link.** The primary action is "let me actually look at it", and the
 * artefact is an image on this page rather than a destination — so it opens a dialog. That
 * also keeps the verification link usable: a link nested inside a link is invalid HTML, and
 * "Verify" is the second thing a recruiter reaches for after seeing the scan.
 *
 * The hover treatment is pure CSS from `group-hover`, gated behind `motion-safe:`, matching
 * the project cards. No tilt, no pointer tracking, nothing per-card to hydrate beyond the
 * dialog's own state.
 *
 * The dialog is only mounted once opened, so a page of thirty certificates does not carry
 * thirty mounted dialogs.
 */
export function CertificateCard({
  certification,
  priority = false,
  sizes,
  className,
}: CertificateCardProps) {
  const [open, setOpen] = useState(false);

  const issuer = ISSUER_META[certification.issuer];
  const skills = certification.skills.slice(0, MAX_SKILLS);
  const overflow = certification.skills.length - skills.length;

  return (
    <>
      <div
        className={cn(
          "group/cert flex h-full flex-col overflow-hidden rounded-3xl",
          "border border-border bg-card",
          "transition-[transform,border-color,box-shadow]",
          "duration-[var(--duration-normal)] ease-[var(--ease-out-quint)]",
          "hover:border-border-strong hover:shadow-xl",
          "motion-safe:hover:-translate-y-1",
          "focus-within:border-border-strong",
          className,
        )}
      >
        {/* --------------------------------------------------------- cover -- */}
        {/* The whole cover is the view trigger, which gives it a target the size of the
            image rather than the size of a caption. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`View the ${certification.title} certificate`}
          // 4:3, which is what Udemy actually exports (1600×1190). Matching the source
          // means the scans fill the box instead of sitting between two letterbox bars.
          className={cn(
            "relative block aspect-[4/3] w-full overflow-hidden",
            "border-b border-border focus-ring",
          )}
        >
          <span
            className={cn(
              "absolute inset-0 block",
              "transition-transform duration-[var(--duration-slow)]",
              "ease-[var(--ease-out-quint)]",
              "motion-safe:group-hover/cert:scale-[1.03]",
            )}
          >
            <CertificateCover
              certification={certification}
              priority={priority}
              sizes={sizes}
            />
          </span>

          {/* The affordance. Always present for touch and keyboard — where there is no
              hover — and simply more prominent on hover. */}
          <span
            aria-hidden="true"
            className={cn(
              "absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full",
              "border border-border bg-card/90 px-2.5 py-1.5 backdrop-blur-sm",
              "font-mono text-2xs text-muted",
              "transition-colors duration-[var(--duration-normal)]",
              "group-hover/cert:border-border-strong group-hover/cert:text-foreground",
            )}
          >
            <Maximize2 className="size-3" />
            View
          </span>
        </button>

        {/* ---------------------------------------------------------- body -- */}
        <div className="flex flex-1 flex-col gap-3.5 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {/* `--issuer` is per-entry data, which no static class can express — the same
                justification as the brand chips in the skills grid. */}
            <span
              style={{ "--brand": issuer.accent } as CSSProperties}
              className={cn(
                "brand-chip inline-flex h-6 items-center rounded-full border px-2.5",
                "font-mono text-2xs text-foreground",
              )}
            >
              {issuer.label}
            </span>

            <span className="font-mono text-2xs text-subtle">{certification.issued}</span>

            {certification.hours !== undefined ? (
              <span className="font-mono text-2xs text-subtle">
                {certification.hours}h
              </span>
            ) : null}
          </div>

          <h3 className="text-base leading-snug font-semibold tracking-tight text-foreground">
            {certification.title}
          </h3>

          <p className="line-clamp-2 text-sm leading-relaxed text-muted">
            {certification.summary}
          </p>

          <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {skills.map((skill) => (
              <li key={skill}>
                <span
                  className={cn(
                    "inline-flex h-6 items-center rounded-full border border-border",
                    "bg-input px-2.5 font-mono text-2xs text-muted",
                  )}
                >
                  {skill}
                </span>
              </li>
            ))}
            {overflow > 0 ? (
              <li>
                <span className="inline-flex h-6 items-center px-1 font-mono text-2xs text-subtle">
                  +{overflow}
                </span>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <CertificateViewer
        certification={certification}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

/**
 * The full-size viewer.
 *
 * Reuses the shared `Modal`, which already owns the focus trap, escape handling, the Lenis
 * pause and the scrim — so this is only the content.
 *
 * The credential id is rendered in mono and left selectable: someone verifying a
 * certificate needs to copy it, and that is the whole reason it is on the page.
 */
function CertificateViewer({
  certification,
  open,
  onOpenChange,
}: {
  certification: Certification;
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const issuer = ISSUER_META[certification.issuer];

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={certification.title}
      description={`Issued by ${issuer.label} · ${certification.issued}`}
      size="lg"
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {certification.verifyUrl !== undefined ? (
            <a
              href={certification.verifyUrl}
              {...externalLinkAttributes()}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-full",
                "bg-primary px-5 text-sm font-medium text-primary-foreground",
                "transition-colors hover:bg-primary-hover focus-ring",
              )}
            >
              <BadgeCheck aria-hidden="true" className="size-4" />
              Verify with {issuer.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}

          {certification.file !== undefined ? (
            <a
              href={certification.file}
              {...externalLinkAttributes()}
              className={cn(
                "inline-flex min-h-11 items-center justify-center gap-2 rounded-full",
                "border border-border px-5 text-sm font-medium text-foreground",
                "transition-colors hover:border-border-strong focus-ring",
              )}
            >
              <FileText aria-hidden="true" className="size-4" />
              Open the PDF
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}

          {/* Said plainly rather than shown as a disabled button. Some issuers do not offer
              a verification URL at all, and a dead "Verify" control costs more trust than
              an honest sentence. */}
          {certification.verifyUrl === undefined && certification.file === undefined ? (
            <p className="text-xs leading-relaxed text-subtle">
              {issuer.label} does not issue a public verification link for this one. Happy
              to send the original on request.
            </p>
          ) : null}
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-surface">
          <CertificateCover
            certification={certification}
            priority
            sizes="(min-width: 640px) 42rem, 92vw"
          />
        </div>

        <p className="text-sm leading-relaxed text-muted">{certification.summary}</p>

        <dl className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="font-mono text-2xs tracking-wider text-subtle uppercase">
              Issued by
            </dt>
            <dd className="text-sm text-foreground">{issuer.label}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="font-mono text-2xs tracking-wider text-subtle uppercase">
              Date
            </dt>
            <dd className="text-sm text-foreground">{certification.issued}</dd>
          </div>

          {certification.credentialId !== undefined ? (
            <div className="flex flex-col gap-1 sm:col-span-2">
              <dt className="font-mono text-2xs tracking-wider text-subtle uppercase">
                Credential ID
              </dt>
              <dd className="font-mono text-xs break-all text-muted select-all">
                {certification.credentialId}
              </dd>
            </div>
          ) : null}
        </dl>

        {certification.skills.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            <p className="font-mono text-2xs tracking-wider text-subtle uppercase">
              Covered
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {certification.skills.map((skill) => (
                <li key={skill}>
                  <Badge tone="default" size="sm" className="font-mono">
                    {skill}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {certification.image === undefined ? (
          <p className="flex items-start gap-2 text-xs leading-relaxed text-subtle">
            <ExternalLink aria-hidden="true" className="mt-0.5 size-3 shrink-0" />
            The scan for this one is not uploaded yet — the visual above is generated. The
            credential details and the verification link are the real thing.
          </p>
        ) : null}
      </div>
    </Modal>
  );
}
