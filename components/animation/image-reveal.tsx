"use client";

import { motion } from "framer-motion";
import Image, { type ImageProps } from "next/image";

import { imageRevealFrame, imageRevealInner } from "@/animations/variants";
import { VIEWPORT } from "@/config/animations";
import { useMotionVariants } from "@/hooks/use-motion-variants";
import { cn } from "@/lib/utils";

export interface ImageRevealProps extends Omit<ImageProps, "className"> {
  /** Applied to the clipping frame. */
  className?: string;
  /** Applied to the `next/image` element itself. */
  imageClassName?: string;
  /** Aspect ratio for the frame, e.g. `16/9`. Omit when using a fixed height. */
  ratio?: "square" | "video" | "portrait" | "wide";
  rounded?: "lg" | "xl" | "2xl" | "3xl" | "none";
}

const ratioClass = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
  wide: "aspect-[21/9]",
} as const;

const roundedClass = {
  none: "",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
} as const;

/**
 * Editorial image reveal: the frame wipes open while the image settles from a
 * slight over-scale.
 *
 * The two halves are separate variants on separate elements because they need
 * different properties — `clip-path` on the frame, `scale` on the picture — but
 * share one duration and easing so they read as a single gesture.
 *
 * `next/image` still does the real work: AVIF/WebP negotiation, responsive
 * `srcset` and an intrinsic size to reserve, so the reveal never causes layout
 * shift.
 */
export function ImageReveal({
  className,
  imageClassName,
  ratio,
  rounded = "2xl",
  alt,
  ...imageProps
}: ImageRevealProps) {
  const frame = useMotionVariants(imageRevealFrame);
  const inner = useMotionVariants(imageRevealInner);

  return (
    <motion.div
      variants={frame}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT.once}
      className={cn(
        "relative overflow-hidden bg-surface",
        ratio ? ratioClass[ratio] : undefined,
        roundedClass[rounded],
        className,
      )}
    >
      <motion.div variants={inner} className="h-full w-full">
        <Image
          alt={alt}
          className={cn("h-full w-full object-cover", imageClassName)}
          {...imageProps}
        />
      </motion.div>
    </motion.div>
  );
}
