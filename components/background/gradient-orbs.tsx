import { cn } from "@/lib/utils";

export interface GradientOrbsProps {
  className?: string;
  still?: boolean;
}

/**
 * Soft glow orbs anchored to the lower half of the page.
 *
 * Where `Aurora` establishes the top of the page, these keep the deep scroll
 * region from going flat black. Kept to two layers and one blur radius: each
 * additional blurred surface is a full-screen composite, and three is where the
 * cost starts showing on integrated GPUs.
 */
export function GradientOrbs({ className, still = false }: GradientOrbsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 h-[min(60rem,90vh)] overflow-hidden",
        "mask-fade-t",
        className,
      )}
    >
      <div className="absolute -bottom-1/4 left-[-6%] size-[min(44rem,70vw)]">
        <div
          data-motion-decorative={still ? undefined : true}
          className={cn(
            "size-full rounded-full blur-3xl",
            "bg-[radial-gradient(circle_at_center,var(--aurora-2),transparent_70%)]",
            !still && "animate-orb",
          )}
        />
      </div>

      <div className="absolute -bottom-1/3 right-[-4%] size-[min(38rem,62vw)]">
        <div
          data-motion-decorative={still ? undefined : true}
          className={cn(
            "size-full rounded-full blur-3xl",
            "bg-[radial-gradient(circle_at_center,var(--aurora-3),transparent_72%)]",
            !still && "animate-float-slow",
          )}
        />
      </div>
    </div>
  );
}
