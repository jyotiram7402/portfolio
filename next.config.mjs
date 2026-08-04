import createMDX from "@next/mdx";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * Shiki, run at build time by `rehype-pretty-code`.
 *
 * Both themes are compiled into the markup at once and selected by CSS from the theme class on
 * `<html>` (see `styles/code.css`). That is what makes the theme toggle recolour code instantly,
 * with no highlighter in the client bundle and no second request.
 */
const prettyCodeOptions = {
  theme: {
    dark: "github-dark-default",
    light: "github-light-default",
  },
  keepBackground: false,
  defaultLang: "plaintext",
  /** Gives empty lines a height, so a highlighted blank line is still visible. */
  onVisitLine(node) {
    if (node.children.length === 0) {
      node.children = [{ type: "text", value: " " }];
    }
  },
};

/* -------------------------------------------------------------------------- */
/*  Content Security Policy                                                   */
/* -------------------------------------------------------------------------- */

/**
 * The CSP, and an honest account of its one compromise.
 *
 * `script-src` includes `'unsafe-inline'`. That is not an oversight — it is the cost of static
 * generation. Next.js emits an inline bootstrap script in every document, and the strict
 * alternative is a per-request nonce issued from middleware. A nonce has to differ per response,
 * which forces every page to render dynamically and gives up the static generation that this site's
 * performance depends on. For a portfolio with no authenticated session, no user-generated content
 * and no cookies to steal, that trade is wrong: the XSS surface is close to nil and the performance
 * cost is real and measurable.
 *
 * Everything else is enforced strictly, and those directives are the ones that matter here:
 *
 * • `object-src 'none'` and `base-uri 'self'` close the two most reliable XSS primitives that
 *   survive an inline-script allowance.
 * • `frame-ancestors 'none'` prevents clickjacking, and supersedes `X-Frame-Options`.
 * • `form-action 'self'` means an injected form cannot exfiltrate to a third party.
 * • `connect-src` is enumerated, so even injected script cannot beacon to an arbitrary host.
 *
 * The upgrade path, when it is worth it: add `middleware.ts` that generates a nonce per request,
 * pass it through to `next/script`, and swap `'unsafe-inline'` for `'nonce-…' 'strict-dynamic'`.
 * Do it when there is a login form, not before.
 */
const cspDirectives = {
  "default-src": ["'self'"],

  // See the note above. `'unsafe-eval'` is development-only — React Refresh needs it.
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    ...(process.env.NODE_ENV === "development" ? ["'unsafe-eval'"] : []),
    "https://va.vercel-scripts.com",
    "https://www.googletagmanager.com",
    "https://plausible.io",
    "https://www.clarity.ms",
    "https://us-assets.i.posthog.com",
    "https://assets.calendly.com",
  ],

  // Framer Motion writes inline styles for every animated element, and Tailwind's arbitrary
  // values compile to them too. There is no nonce-based alternative for style attributes.
  "style-src": ["'self'", "'unsafe-inline'"],

  // `data:` covers the inlined noise texture and the generated OG images.
  "img-src": ["'self'", "data:", "blob:", "https:"],

  // Fonts are self-hosted by `next/font`, so no third-party font origin is needed.
  "font-src": ["'self'", "data:"],

  // Enumerated rather than `https:` — this is the directive that actually stops
  // exfiltration, so it is worth keeping tight.
  "connect-src": [
    "'self'",
    "https://api.github.com",
    "https://va.vercel-scripts.com",
    "https://vitals.vercel-insights.com",
    "https://www.google-analytics.com",
    "https://plausible.io",
    "https://us.i.posthog.com",
    "https://us-assets.i.posthog.com",
    "https://api.emailjs.com",
    ...(process.env.NODE_ENV === "development" ? ["ws://localhost:*"] : []),
  ],

  // Only the Calendly embed, and only because it is click-to-load.
  "frame-src": ["'self'", "https://calendly.com"],

  "media-src": ["'self'"],
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],

  // The three directives that close the primitives an inline-script allowance leaves open.
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],

  "upgrade-insecure-requests": [],
};

function serialiseCsp(directives) {
  return Object.entries(directives)
    .map(([directive, values]) =>
      values.length === 0 ? directive : `${directive} ${values.join(" ")}`,
    )
    .join("; ");
}

/**
 * Security headers applied to every response.
 *
 * `Permissions-Policy` denies the whole sensor and payment surface rather than listing what is
 * used, because nothing here uses any of it — and a deny-by-default list does not need updating
 * when a browser adds a new API.
 */
const securityHeaders = [
  { key: "Content-Security-Policy", value: serialiseCsp(cspDirectives) },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Superseded by `frame-ancestors`, kept for browsers that predate CSP Level 2.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "autoplay=()",
      "camera=()",
      "display-capture=()",
      "encrypted-media=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "midi=()",
      "payment=()",
      "usb=()",
      "xr-spatial-tracking=()",
    ].join(", "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Isolates the browsing context from cross-origin popups and openers.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  eslint: {
    dirs: [
      "app",
      "components",
      "features",
      "hooks",
      "lib",
      "services",
      "utils",
      "config",
      "animations",
    ],
  },

  experimental: {
    // Rewrites barrel imports into deep ones, so a single `import { Menu }` does not pull
    // the whole icon set into the bundle. Deliberately limited to lucide-react: the motion
    // libraries have side-effectful entry points and are better left to normal tree shaking.
    optimizePackageImports: ["lucide-react"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 420, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    // A year. Every image URL is either content-hashed or remote-and-immutable.
    minimumCacheTTL: 31_536_000,
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/fonts/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Hashed by the build, so it can be cached indefinitely.
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Must never be cached at the edge, or a new deployment cannot reach a client
        // that already has the old worker installed.
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600" },
          { key: "Content-Type", value: "application/manifest+json" },
        ],
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    // Order matters: ids must exist before the autolink pass can wrap them, and
    // pretty-code runs last so it sees the final code nodes.
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, prettyCodeOptions],
    ],
  },
});

export default withMDX(nextConfig);
