import { ImageResponse } from "next/og";

import { palette } from "@/config/theme";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon, generated at build time.
 *
 * Generated rather than committed as a binary so the mark and the palette have a
 * single definition in code. Next emits the `<link rel="icon">` for this route
 * automatically.
 *
 * Built from divs, not SVG paths: Satori's SVG support is partial, and a rotated
 * square is exactly the mark anyway.
 */
export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: 3,
            transform: "rotate(45deg)",
            background: palette.dark.foreground,
          }}
        />
      </div>
    ),
    size,
  );
}
