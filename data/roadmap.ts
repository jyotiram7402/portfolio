import {
  Boxes,
  Brain,
  Braces,
  Cloud,
  Container,
  Database,
  Layers,
  Network,
  Radio,
  Server,
  Sparkles,
  Workflow,
} from "lucide-react";

import type { RoadmapStatus, RoadmapTrack } from "@/types/explore";

/**
 * The learning roadmap.
 *
 * Statuses are used honestly. A roadmap where everything is `completed` is a CV;
 * one where everything is `planned` is a wish list. The value of this section is
 * that a reader can see exactly where the edge of competence is.
 *
 * Milestones are the expandable content, and each one is a thing that can be
 * demonstrated — not "learn Kafka" but "consumer group rebalancing understood well
 * enough to explain a lag spike".
 */
export const roadmapTracks: readonly RoadmapTrack[] = [
  {
    id: "core-backend",
    label: "Core backend",
    summary:
      "The foundation everything else sits on. This is the track I am judged on, so it is the one held to the highest standard.",
    icon: Server,
    nodes: [
      {
        id: "java",
        label: "Java",
        detail:
          "Fluency in the language and its standard library, not just its syntax.",
        status: "completed",
        stack: ["Java"],
        milestones: [
          "Records, sealed types and pattern matching used where they remove a class of bug.",
          "Streams and collectors understood well enough to know when a loop is clearer.",
          "Concurrency: executors, futures, and why shared mutable state is the real problem.",
        ],
        icon: Braces,
      },
      {
        id: "spring-boot",
        label: "Spring Boot",
        detail: "Building services that are boring to operate.",
        status: "completed",
        stack: ["Spring Boot", "Spring Security", "Spring Data JPA"],
        milestones: [
          "Configuration profiles and externalised config with no secrets in the repository.",
          "Method-level authorisation, so a new endpoint is closed until it is opened.",
          "Actuator health and readiness wired to what the orchestrator actually checks.",
        ],
        icon: Layers,
      },
      {
        id: "microservices",
        label: "Microservices",
        detail:
          "Boundaries drawn around ownership. Learning where a monolith is still the right answer.",
        status: "learning",
        stack: ["Microservices", "REST API"],
        milestones: [
          "Service boundaries derived from data ownership rather than from team structure.",
          "Async messaging where a synchronous call would turn one outage into three.",
          "Distributed tracing, so a slow request can be attributed rather than guessed at.",
        ],
        icon: Network,
      },
      {
        id: "system-design",
        label: "System design",
        detail:
          "Being able to defend a design under questioning, including the parts I would do differently.",
        status: "learning",
        milestones: [
          "Capacity estimation that starts from a number rather than from a diagram.",
          "Consistency trade-offs stated explicitly instead of assumed away.",
          "Failure modes designed for first — timeouts, retries with backoff, circuit breaking.",
        ],
        icon: Workflow,
      },
    ],
  },
  {
    id: "platform",
    label: "Platform & data",
    summary:
      "The layer that decides whether a service survives contact with production traffic.",
    icon: Cloud,
    nodes: [
      {
        id: "docker",
        label: "Docker",
        detail: "Local environments that match what ships.",
        status: "completed",
        stack: ["Docker"],
        milestones: [
          "Multi-stage builds with a final image that contains only what runs.",
          "Compose stacks that stand up the whole dependency set for integration tests.",
        ],
        icon: Container,
      },
      {
        id: "redis",
        label: "Redis",
        detail: "Caching with a deliberate invalidation story.",
        status: "completed",
        stack: ["Redis"],
        milestones: [
          "Cache keys designed so invalidation is scoped to what changed.",
          "Rate limiting and short-lived locks around critical sections.",
        ],
        icon: Database,
      },
      {
        id: "aws",
        label: "AWS",
        detail:
          "Currently comfortable on Azure; building the same depth on AWS.",
        status: "learning",
        stack: ["AWS", "Azure"],
        milestones: [
          "EC2, S3 and RDS provisioned as code rather than through a console.",
          "IAM policies written least-privilege first, then relaxed only with a reason.",
          "Cost attribution understood well enough to explain a bill.",
        ],
        icon: Cloud,
      },
      {
        id: "kafka",
        label: "Kafka",
        detail: "Event-driven integration between services that must not block each other.",
        status: "planned",
        milestones: [
          "Partitioning and key design that preserves the ordering the domain requires.",
          "Consumer groups, rebalancing, and diagnosing a lag spike from metrics.",
          "Exactly-once semantics — and knowing when at-least-once plus idempotency is simpler.",
        ],
        icon: Radio,
      },
      {
        id: "kubernetes",
        label: "Kubernetes",
        detail:
          "Deliberately after Kafka. An orchestrator earns its operational cost only once there is something to orchestrate.",
        status: "planned",
        stack: ["Kubernetes"],
        milestones: [
          "Deployments, services and probes that reflect real readiness rather than liveness theatre.",
          "Resource requests and limits set from measurement instead of from a default.",
          "A rollback that is one command and does not depend on remembering anything.",
        ],
        icon: Boxes,
      },
    ],
  },
  {
    id: "ai",
    label: "Applied AI",
    summary:
      "Moving from prompting to plumbing: features that can be evaluated, versioned and defended.",
    icon: Brain,
    nodes: [
      {
        id: "llms",
        label: "LLM fundamentals",
        detail: "Context, tokens, structured output and the failure modes that only appear at scale.",
        status: "completed",
        stack: ["LLMs", "Prompt Engineering"],
        milestones: [
          "Token budgets managed explicitly rather than discovered through a 400 response.",
          "Structured output with schema validation on the way back in.",
        ],
        icon: Sparkles,
      },
      {
        id: "rag",
        label: "RAG pipelines",
        detail: "Retrieval that can be audited: chunking, reranking and mandatory citations.",
        status: "learning",
        stack: ["RAG", "Vector Databases", "LangChain"],
        milestones: [
          "Chunking tuned to document structure rather than to a fixed character count.",
          "Hybrid retrieval with a reranking pass before the model sees anything.",
          "An evaluation set that a prompt change has to pass before it ships.",
        ],
        icon: Brain,
      },
      {
        id: "agentic",
        label: "Agentic AI",
        detail:
          "Tool-using loops with real guardrails. The interesting problem is bounding what an agent may do.",
        status: "planned",
        milestones: [
          "Tool definitions with typed inputs and validated outputs.",
          "Budget and step limits enforced outside the model, not requested inside the prompt.",
          "Human approval gates on anything irreversible.",
        ],
        icon: Workflow,
      },
    ],
  },
];

export const ROADMAP_STATUS_META = {
  completed: {
    label: "Completed",
    description: "Used in production, can be defended in detail",
  },
  learning: {
    label: "Learning",
    description: "Actively working through it right now",
  },
  planned: {
    label: "Planned",
    description: "Queued, with a reason for the ordering",
  },
} as const satisfies Record<RoadmapStatus, { label: string; description: string }>;

/** Progress per track, derived so the figure can never contradict the nodes. */
export function getTrackProgress(trackId: string): {
  completed: number;
  total: number;
} {
  const track = roadmapTracks.find((entry) => entry.id === trackId);
  if (!track) return { completed: 0, total: 0 };

  return {
    completed: track.nodes.filter((node) => node.status === "completed").length,
    total: track.nodes.length,
  };
}

export const roadmapTotals = roadmapTracks.reduce(
  (totals, track) => {
    for (const node of track.nodes) totals[node.status] += 1;
    return totals;
  },
  { completed: 0, learning: 0, planned: 0 } as Record<RoadmapStatus, number>,
);
