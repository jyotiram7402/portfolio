import Image from "next/image";

import { ISSUER_META } from "@/data/certifications";
import { cn } from "@/lib/utils";
import type { Certification } from "@/types/certifications";

export interface CertificateCoverProps {
  certification: Certification;
  /** Above-the-fold covers load eagerly. Everything in the library stays lazy. */
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * A certificate's visual: the scan when one exists, a generated stand-in otherwise.
 *
 * **The generated path is not a placeholder.** It carries the entries whose document is a
 * text PDF with no image to extract — both Anthropic certificates today — and it is built to
 * look deliberate: a ruled inner frame, the issuer's accent as a corner wash, a seal mark
 * from the title's initials, and the issuer name in mono. It reads as a document rather than
 * as a missing image, which is what lets a mixed grid of scans and generated covers look
 * intentional instead of half-finished.
 *
 * `object-contain`, not `cover`, for real scans. A certificate is a fixed-aspect document
 * with its border, logo and signature near the edges — cropping it to fill the box removes
 * exactly what a reader is checking. The box is 4:3 because that is what the issuers
 * actually export (Udemy's is 1600×1190), so in practice there is almost nothing to
 * letterbox; `contain` is the guarantee for the odd one out, not the normal case.
 *
 * A Server Component. The hover treatment and the lightbox belong to the card around it.
 */
export function CertificateCover({
  certification,
  priority = false,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw",
  className,
}: CertificateCoverProps) {
  if (certification.image !== undefined) {
    return (
      <Image
        src={certification.image}
        alt={`${certification.title} — certificate issued by ${ISSUER_META[certification.issuer].label}`}
        fill
        priority={priority}
        sizes={sizes}
        className={cn("object-contain object-center", className)}
      />
    );
  }

  return <GeneratedCover certification={certification} className={className} />;
}

/**
 * Initials for the seal.
 *
 * Two letters, from the title's significant words. Three or more stop reading as a mark.
 */
function seal(title: string): string {
  const letters = title
    .split(/[\s—–\-_]+/)
    .filter((word) => word.length > 2 && /[a-z0-9]/i.test(word))
    .map((word) => word[0])
    .filter((letter): letter is string => letter !== undefined);

  return letters.slice(0, 2).join("").toUpperCase() || "CE";
}

function GeneratedCover({
  certification,
  className,
}: {
  certification: Certification;
  className?: string;
}) {
  const issuer = ISSUER_META[certification.issuer];
  const mark = seal(certification.title);

  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden bg-surface", className)}
    >
      {/* 4:3, matching the real scans, so a generated cover and a scanned one occupy the
          same box and a mixed grid stays on one baseline. */}
      <svg
        viewBox="0 0 640 480"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          {/* Ids are namespaced by slug because several covers can share a page and a
              duplicate id would make them all paint the first one's gradient. */}
          <linearGradient
            id={`cc-wash-${certification.slug}`}
            x1="1"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={issuer.accent} stopOpacity="0.26" />
            <stop offset="60%" stopColor={issuer.accent} stopOpacity="0.06" />
            <stop offset="100%" stopColor={issuer.accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width="640" height="480" fill={`url(#cc-wash-${certification.slug})`} />

        {/* The double rule. A certificate's most recognisable feature is its frame, and two
            concentric rules at different opacities read as one immediately. */}
        <rect
          x="26"
          y="26"
          width="588"
          height="428"
          rx="6"
          fill="none"
          stroke="var(--foreground)"
          strokeOpacity="0.14"
        />
        <rect
          x="34"
          y="34"
          width="572"
          height="412"
          rx="4"
          fill="none"
          stroke="var(--foreground)"
          strokeOpacity="0.07"
        />

        {/* The seal: a ring, an inner ring and the initials. */}
        <g transform="translate(320 196)">
          <circle
            r="62"
            fill="none"
            stroke={issuer.accent}
            strokeOpacity="0.45"
            strokeWidth="1.5"
          />
          <circle
            r="52"
            fill="var(--foreground)"
            fillOpacity="0.04"
            stroke="var(--foreground)"
            strokeOpacity="0.1"
          />
          <text
            y="15"
            textAnchor="middle"
            fontSize="40"
            fontWeight="700"
            letterSpacing="-1"
            fill="var(--foreground)"
            fillOpacity="0.5"
            className="font-sans"
          >
            {mark}
          </text>
        </g>

        {/* Two ruled lines standing in for the certificate's body text. Suggests a document
            without imitating one. */}
        <g
          stroke="var(--foreground)"
          strokeOpacity="0.1"
          strokeWidth="6"
          strokeLinecap="round"
        >
          <path d="M210 312h220" />
          <path d="M250 338h140" />
        </g>

        <text
          x="320"
          y="396"
          textAnchor="middle"
          fontSize="15"
          letterSpacing="4"
          fill="var(--muted)"
          className="font-mono"
        >
          {issuer.label.toUpperCase()}
        </text>
      </svg>

      {/* Real DOM text, so it stays crisp when the card scales on hover. */}
      <p className="absolute right-5 bottom-4 font-mono text-2xs tracking-widest text-subtle uppercase">
        {certification.issued}
      </p>
    </div>
  );
}
