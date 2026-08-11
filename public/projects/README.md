# Project cover images

Drop a cover here and a project switches from its generated visual to the real thing. No
code change beyond one line of data.

## How to add one

1. Export at **1600×1000** (16:10 — the card's aspect ratio) as `.webp` or `.avif`.
   A screenshot of the running product beats a mockup.
2. Save it as `<slug>.webp`, matching the project's `slug` in `data/projects.ts`.
   For example `smartshield.webp`, `ledgercore.webp`, `devsync.webp`.
3. Set `image` on that project:

   ```ts
   image: "/projects/devsync.webp",
   ```

That is the whole contract. `ProjectCover` renders `next/image` when `image` is set and the
generated visual when it is not.

## Only set `image` if the file exists

`next/image` renders a broken image for a missing file — it cannot fall back. So `image`
stays `undefined` until the asset is actually committed. Undefined is the safe default, not
a missing feature.

## What the generated visual is for

Every project currently uses it. It is not a placeholder waiting to be replaced: it is a
deterministic composition — hue hashed from the slug, a hairline grid, an oversized
monogram and the project's primary technology — designed to hold up on its own. Stock
photography and random Unsplash images are deliberately not used; they say nothing about
the work and read as a template.

Real screenshots are still better where they exist, which is what this directory is for.
