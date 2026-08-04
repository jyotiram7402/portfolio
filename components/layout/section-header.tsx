import type { ReactNode } from "react";

import { AnimatedHeading } from "@/components/animation/animated-heading";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SectionHeaderProps {
  /** Short label in the pill above the title. Two or three words. */
  badge: string;
  /** Plain string — it is split per word for the reveal animation. */
  title: string;
  description?: ReactNode;
  /** Id for the heading, so the parent `<Section>` can reference it. */
  headingId?: string;
  /** Heading level. Choose from the document outline, not the desired size. */
  as?: "h2" | "h3";
  size?: "lg" | "md" | "sm";
  align?: "left" | "center";
  className?: string;
}

/**
 * The badge / title / description block every section opens with.
 *
 * Exists so the three elements share one set of sizes, one alignment rule and one
 * entrance choreography. Without it each section would re-specify the spacing and
 * they would drift apart within a sprint.
 *
 * A Server Component — `AnimatedHeading` and `Reveal` are the client leaves.
 */
export function SectionHeader({
  badge,
  title,
  description,
  headingId,
  as = "h2",
  size = "md",
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Badge tone="outline" size="sm" dot className="w-fit">
        {badge}
      </Badge>

      <AnimatedHeading
        id={headingId}
        as={as}
        size={size}
        align={align}
        description={description}
        className="max-w-3xl"
        descriptionClassName="max-w-2xl text-lg"
      >
        {title}
      </AnimatedHeading>
    </div>
  );
}
