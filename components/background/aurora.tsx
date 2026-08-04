import { cn } from "@/lib/utils";

export interface AuroraProps {
  className?: string;
  /** Freezes the drift. The wrapper passes this when motion is reduced. */
  still?: boolean;
}

interface BlobProps {
  /** Positioning classes for the outer wrapper. */
  position: string;
  /** The radial gradient class. */
  gradient: string;
  /** Keyframe animation class. */
  animation: string;
  still: boolean;
}

/**
 * One aurora layer.
 *
 * Position and animation are split across two elements on purpose: the keyframes
 * animate `transform`, which would otherwise overwrite any Tailwind
 * `translate` used for placement.
 */
function Blob({ position, gradient, animation, still }: BlobProps) {
  return (
    <div className={cn("absolute", position)}>
      <div
        data-motion-decorative={still ? undefined : true}
        className={cn(
          "size-full rounded-full blur-3xl",
          gradient,
          !still && animation,
        )}
      />
    </div>
  );
}

/**
 * Aurora gradient wash across the top of the viewport.
 *
 * Three heavily blurred radial gradients drifting on different periods, so they
 * never resolve into a recognisable loop. Each layer animates only `transform`
 * and `opacity`, which keeps the whole effect on the compositor — no layout, no
 * paint, no main-thread work per frame.
 *
 * Sized in viewport units and capped in rem, because a large `blur()` is the
 * expensive part and must not scale with document height.
 */
export function Aurora({ className, still = false }: AuroraProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 h-[min(72rem,110vh)] overflow-hidden",
        "mask-fade-b",
        className,
      )}
    >
      <Blob
        still={still}
        position="-top-1/3 left-[6%] size-[min(56rem,82vw)]"
        gradient="bg-[radial-gradient(circle_at_center,var(--aurora-1),transparent_70%)]"
        animation="animate-aurora"
      />
      <Blob
        still={still}
        position="-top-1/4 right-[2%] size-[min(48rem,74vw)]"
        gradient="bg-[radial-gradient(circle_at_center,var(--aurora-2),transparent_70%)]"
        animation="animate-float-slow"
      />
      <Blob
        still={still}
        position="top-[10%] left-[24%] size-[min(40rem,66vw)]"
        gradient="bg-[radial-gradient(circle_at_center,var(--aurora-3),transparent_72%)]"
        animation="animate-orb"
      />
    </div>
  );
}
