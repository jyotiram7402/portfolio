import { cn } from "@/lib/utils";

export interface MeshGradientProps {
  className?: string;
  still?: boolean;
}

/**
 * Animated mesh gradient.
 *
 * Four offset radial stops on a single over-sized background layer, panned by
 * `background-position`. One element and one animated property, versus the
 * several blurred layers a "real" mesh would need — visually near-identical at
 * this opacity, and an order of magnitude cheaper.
 *
 * Sits below `Aurora` and provides the low-frequency colour that keeps large
 * flat regions of the page from banding.
 */
export function MeshGradient({ className, still = false }: MeshGradientProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden opacity-70",
        className,
      )}
    >
      <div
        data-motion-decorative={still ? undefined : true}
        className={cn(
          "absolute inset-[-25%]",
          "bg-[radial-gradient(at_18%_22%,var(--aurora-1)_0px,transparent_52%),radial-gradient(at_82%_12%,var(--aurora-2)_0px,transparent_50%),radial-gradient(at_68%_78%,var(--aurora-3)_0px,transparent_54%),radial-gradient(at_24%_84%,var(--aurora-1)_0px,transparent_48%)]",
          "bg-[length:200%_200%]",
          !still && "animate-gradient",
        )}
      />
    </div>
  );
}
