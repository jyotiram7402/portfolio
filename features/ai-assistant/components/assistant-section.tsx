import { Bot, FileCheck, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/animation/reveal";
import { Section } from "@/components/layout/section";
import { SectionHeader } from "@/components/layout/section-header";
import { SECTIONS } from "@/constants/sections";
import { knowledge } from "@/data/ai";
import { ChatPanel } from "@/features/ai-assistant/components/chat-panel";
import { cn } from "@/lib/utils";

/**
 * The assistant section.
 *
 * A Server Component; `ChatPanel` is the client boundary. The explanatory column beside
 * it is rendered on the server, which matters more than it looks: it is the part that
 * tells a visitor what this thing is before they trust it, and it should be in the HTML
 * whether or not the chat script has loaded.
 *
 * The three notes are not decoration. An AI feature on a portfolio invites exactly one
 * question — "is this making things up?" — and answering it up front is what makes the
 * feature usable rather than suspicious.
 */
const NOTES = [
  {
    id: "grounded",
    icon: ShieldCheck,
    title: "Grounded, not generative",
    body: "Answers come from a structured knowledge base built from this page. Nothing is inferred, estimated or filled in.",
  },
  {
    id: "honest",
    icon: FileCheck,
    title: "It says when it does not know",
    body: "Ask something that is not published and it tells you so, then points at email — rather than guessing plausibly.",
  },
  {
    id: "ready",
    icon: Bot,
    title: "Built for a model to take over",
    body: "The engine is an async-iterable interface behind one factory. Swapping the local knowledge base for an LLM changes one line.",
  },
] as const;

export function AssistantSection() {
  return (
    <Section
      id={SECTIONS.assistant}
      spacing="lg"
      ariaLabelledBy="assistant-heading"
      containerSize="page"
      innerClassName="flex flex-col gap-12 lg:gap-14"
    >
      <SectionHeader
        badge="AI Assistant"
        headingId="assistant-heading"
        title="Ask about the work instead of reading all of it."
        description="A chat interface over everything on this page — experience, projects, the stack, the roadmap. It answers from structured data, and it will tell you when something is not published."
        size="lg"
      />

      <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:gap-12">
        <ChatPanel />

        <div className="flex flex-col gap-8">
          <ul className="flex flex-col gap-5">
            {NOTES.map((note, index) => {
              const Icon = note.icon;

              return (
                <Reveal
                  key={note.id}
                  as="li"
                  effect="up"
                  distance={14}
                  delay={0.06 * index}
                  className="flex gap-4"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl",
                      "border border-border bg-elevated text-muted",
                      "[&_svg]:size-4",
                    )}
                  >
                    <Icon />
                  </span>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold tracking-tight text-foreground">
                      {note.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted">{note.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <Reveal effect="fade" delay={0.24}>
            <dl
              className={cn(
                "grid grid-cols-3 gap-4 rounded-2xl border border-border",
                "bg-surface/50 p-5",
              )}
            >
              {[
                { label: "Projects", value: knowledge.projectCount },
                { label: "Technologies", value: knowledge.technologyCount },
                { label: "Articles", value: knowledge.posts.length },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dd className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                    {stat.value}
                  </dd>
                  <dt className="font-mono text-2xs tracking-widest text-subtle uppercase">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
