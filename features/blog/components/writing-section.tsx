import { ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { SECTIONS } from "@/constants/sections";
import { PostCard } from "@/features/blog/components/post-card";
import { renderablePosts } from "@/services/content.service";

/**
 * The writing preview on the home page.
 *
 * Three posts and a link to the index, rather than the whole archive. The home page's job
 * is to establish that there is writing worth reading; the index's job is to let someone
 * browse it.
 *
 * A Server Component. `PostCard` is one too, so this whole section costs the client bundle
 * nothing at all — which is the point of keeping the browser's filter state on `/blog`
 * rather than here.
 */
export function WritingSection() {
  const posts = renderablePosts.slice(0, 3);

  return (
    <Section
      id={SECTIONS.writing}
      spacing="lg"
      ariaLabelledBy="writing-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          badge="Writing"
          headingId="writing-heading"
          title="Notes on things that actually shipped."
          description="Long-form, technical, and specific. Each one is about a problem I had to solve properly rather than a topic I read about."
          size="lg"
        />

        <Button asChild variant="secondary" className="shrink-0">
          <Link href={ROUTES.blog}>
            All articles
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nothing published yet"
          description="The blog pipeline is wired — registry, MDX bodies, search and syntax highlighting. Articles appear here as they are written."
        />
      ) : (
        <ul className="grid gap-5 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal
              key={post.slug}
              as="li"
              effect="up"
              distance={16}
              delay={0.07 * index}
              className="h-full"
            >
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      )}
    </Section>
  );
}
