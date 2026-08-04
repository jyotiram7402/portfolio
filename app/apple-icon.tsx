import { ImageResponse } from "next/og";

import { palette } from "@/config/theme";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon.
 *
 * Deliberately not the favicon scaled up: at 180px there is room for the outer
 * aperture of the mark, and iOS applies its own corner mask, so the artwork fills
 * the square edge to edge with no rounding of its own.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: palette.dark.background,
        }}
      >
        {/* Outer aperture */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 108,
            height: 108,
            borderRadius: 16,
            transform: "rotate(45deg)",
            border: `4px solid ${palette.dark.secondary}`,
          }}
        >
          {/* Solid core */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 8,
              backgroundImage: `linear-gradient(135deg, ${palette.dark.primary}, ${palette.dark.accent})`,
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
