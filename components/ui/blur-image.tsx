"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export interface BlurImageProps extends Omit<ImageProps, "onLoad" | "className"> {
  /** Applied to the wrapper, which owns the aspect ratio and the placeholder. */
  className?: string;
  /** Applied to the image itself. */
  imageClassName?: string;
  rounded?: "none" | "lg" | "xl" | "2xl" | "3xl";
}

const roundedClass = {
  none: "",
  lg: "rounded-lg",
  xl: "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
} as const;

/**
 * Image with a shimmer placeholder.
 *
 * `next/image` already prevents layout shift by reserving the intrinsic size, and it already
 * supports `placeholder="blur"` — but only for statically imported images, where the build can
 * generate the base64 preview. For a remote or dynamically-sourced image there is no blur data,
 * and the default is a blank box.
 *
 * This fills that gap with the shimmer the design system already uses for skeletons, so a
 * loading image looks like every other loading surface on the site rather than like a hole.
 *
 * The placeholder is removed on load rather than faded under the image: keeping an animated
 * gradient alive behind every loaded image is a composited layer per image, for nothing.
 */
export function BlurImage({
  className,
  imageClassName,
  rounded = "2xl",
  alt,
  ...imageProps
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-surface",
        roundedClass[rounded],
        className,
      )}
    >
      {loaded ? null : (
        <span
          aria-hidden="true"
          data-motion-decorative
          className={cn(
            "absolute inset-0 animate-shimmer",
            "bg-linear-to-r from-transparent via-highlight to-transparent",
          )}
        />
      )}

      <Image
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={cn(
          "size-full object-cover transition-opacity duration-[var(--duration-slow)]",
          loaded ? "opacity-100" : "opacity-0",
          imageClassName,
        )}
        {...imageProps}
      />
    </div>
  );
}
