import type { Project, ProjectDomain } from "@/types/projects";

/**
 * The curated project list.
 *
 * `id` is the **exact GitHub repository name** for anything that has one. That is not
 * cosmetic: `services/projects.service.ts` de-duplicates discovered repositories against
 * this list by id, so a mismatch renders the same project twice — once with live stars
 * and once without.
 *
 * Ordering is the argument, and it is deliberate:
 *
 * 1. **SmartShield first.** It is the only project here that began as a production
 *    outage, and it is the one that proves the claim the hero makes — that backend
 *    engineering is principles, not a language. It is written in Python because the
 *    problem was a classification problem.
 * 2. **Then Java and Spring**, heaviest first. The target role is Java backend, and a
 *    reader who stops after four cards should have seen Spring Boot, Kafka,
 *    PostgreSQL and a double-entry ledger.
 * 3. **Then full-stack and MERN**, which are real and secondary, in that order.
 *
 * Every `summary` is written to be read cold by someone who has never met me: what the
 * problem was, what was actually built, and why it was hard. `highlights` are the three
 * things worth asking about in an interview — not a feature list.
 */
export const projects: readonly Project[] = [
  /* ======================================================================== */
  /*  The one that started as an incident                                     */
  /* ======================================================================== */
  {
    id: "SmartShield-AI-Adaptive-Bot-Mitigation-Traffic-Intelligence-System",
    slug: "smartshield",
    name: "SmartShield — Adaptive Bot Mitigation",
    tagline:
      "Built after bots took our site down at Christmas. Learns which traffic is human instead of blacklisting countries.",
    summary:
      "In the 2024 Christmas peak our production site went down under a bot flood out of China. We blocked the source ranges, and the attack reappeared from Russian ranges within hours — which is when it became obvious that blocking addresses is chasing symptoms. The accepted fix at the time was to switch on the platform's built-in JavaScript challenge, and it worked, but it left me with the question I could not drop: how does a system actually decide which requests are human? SmartShield is my answer. It is a traffic-intelligence service in Python that scores requests on behaviour — request cadence, navigation shape, header consistency, session coherence — using an ensemble of machine-learning and deep-learning models, so mitigation adapts instead of expiring the moment the source IP changes. Aimed at small and mid-sized businesses, who get hit by exactly this and cannot afford an enterprise WAF.",
    domains: ["ai", "backend"],
    stack: [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "Feature Engineering",
      "REST API",
      "TypeScript",
    ],
    highlights: [
      "Started from a real outage I lived through, not a tutorial dataset — the feature set comes from the traffic patterns we actually saw during the incident.",
      "Behavioural scoring rather than IP reputation, because the attack proved that rotating source ranges costs an attacker nothing.",
      "An ensemble instead of one model, so a single classifier's blind spot is not the whole system's blind spot. Still actively learning this domain and saying so.",
    ],
    status: "active",
    period: "2025 — Present",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/SmartShield-AI-Adaptive-Bot-Mitigation-Traffic-Intelligence-System",
        kind: "repo",
      },
    ],
    featured: true,
    source: "curated",
  },

  /* ======================================================================== */
  /*  Java and Spring                                                         */
  /* ======================================================================== */
  {
    id: "ledgercore",
    slug: "ledgercore",
    name: "LedgerCore",
    tagline:
      "Event-driven wallet and double-entry ledger in Java 21, built so the books cannot go out of balance.",
    summary:
      "A wallet and double-entry accounting core in Java 21 and Spring Boot, with Kafka carrying the events and PostgreSQL holding the ledger. The design constraint is financial correctness rather than throughput: every movement of money is two matching entries, debits and credits must reconcile at all times, and no path is allowed to write a single-sided transaction. That constraint is what makes the project interesting — it forces idempotency, ordering and transactional boundaries to be decided up front instead of patched in later, which is exactly the reasoning a payments backend is really tested on.",
    domains: ["java", "spring", "microservices", "backend"],
    stack: ["Java 21", "Spring Boot", "Apache Kafka", "PostgreSQL", "Event-Driven"],
    highlights: [
      "Double-entry invariants enforced in the domain model, so an unbalanced write is impossible rather than merely discouraged.",
      "Idempotent event handling — a replayed Kafka message must not move money twice, which is the failure that actually happens in production.",
      "Ordering handled by partition key, so two operations on one wallet can never be applied out of sequence.",
    ],
    status: "active",
    period: "2025",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/ledgercore",
        kind: "repo",
      },
    ],
    featured: true,
    source: "curated",
  },
  {
    id: "knowledgepulse-ai",
    slug: "knowledgepulse-ai",
    name: "KnowledgePulse AI",
    tagline:
      "Turns scattered engineering reading into retrievable, cited knowledge instead of forty open tabs.",
    summary:
      "A retrieval service over the material a developer accumulates and never revisits — documentation, articles, notes. Content is chunked, embedded and retrieved with a hybrid of semantic and keyword search, then reranked, and every answer carries its citations so the source can be checked rather than trusted. The engineering problem is not calling a model; it is retrieval quality, chunk boundaries, and returning a defensible answer instead of a confident one. Built behind a typed service boundary so the model provider is a swappable detail.",
    domains: ["ai", "backend", "fullstack"],
    stack: ["Python", "RAG", "Vector Search", "LLM APIs", "REST API"],
    highlights: [
      "Hybrid retrieval and reranking, because pure vector similarity returns plausible-sounding but wrong chunks often enough to matter.",
      "Citations on every answer — an uncheckable answer is not useful in an engineering context.",
      "Provider held behind a typed boundary, so swapping the model does not touch the retrieval layer.",
    ],
    status: "active",
    period: "2025",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/knowledgepulse-ai",
        kind: "repo",
      },
    ],
    featured: true,
    source: "curated",
  },
  {
    id: "Foodies--Food_Delivery_Application",
    slug: "foodies",
    name: "Foodies — Food Delivery Platform",
    tagline:
      "Independent Spring Boot services for ordering, dispatch and notifications, talking over Kafka.",
    summary:
      "A food-delivery backend split into services that own their own data — orders, driver dispatch, merchants and notifications — rather than one application with four packages in it. Services communicate over REST where a caller needs an answer now, and over Kafka where it does not. This is the project where service boundaries stopped being a diagram to me: putting driver location in the same database as order state looks convenient right up to the point where one of them needs to scale or fail on its own.",
    domains: ["java", "spring", "microservices", "backend"],
    stack: [
      "Java",
      "Spring Boot",
      "Spring MVC",
      "Apache Kafka",
      "MySQL",
      "REST API",
    ],
    highlights: [
      "Boundaries drawn around data ownership, so no service reaches into another's tables.",
      "Order events published to Kafka and consumed by dispatch and notifications independently — a slow notification cannot delay an order.",
      "Kafka keys chosen to preserve per-order sequencing, because 'delivered' arriving before 'picked up' is a data bug, not a display bug.",
    ],
    status: "shipped",
    period: "2024",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/Foodies--Food_Delivery_Application",
        kind: "repo",
      },
    ],
    featured: true,
    source: "curated",
  },
  {
    id: "BookShowHere-Movie-ticket-booking-system",
    slug: "bookshowhere",
    name: "BookShowHere — Ticket Booking",
    tagline:
      "Seat booking under concurrency: the problem is two people wanting seat 14A at the same instant.",
    summary:
      "A movie ticket booking system in Spring Boot whose entire difficulty is one requirement — a seat must never be sold twice. That single line is what makes it a genuine backend exercise: it needs a locking strategy, a holding window while payment is in flight, a release path for abandoned checkouts, and a transaction boundary that survives two concurrent requests hitting the same row. Anyone can model shows and seats. Getting the contention right, and being able to explain why the chosen approach is correct rather than merely working, is the actual work.",
    domains: ["java", "spring", "backend"],
    stack: [
      "Java",
      "Spring Boot",
      "Hibernate & JPA",
      "MySQL",
      "Transactions",
      "Concurrency",
    ],
    highlights: [
      "Seat locking with a timed hold, so a seat is neither double-sold nor stranded by someone who closed the tab mid-payment.",
      "Transaction boundaries and isolation chosen deliberately, with the race condition each one does and does not prevent written down.",
      "Reference data and availability reads separated from the booking write path, so browsing load does not contend with purchases.",
    ],
    status: "shipped",
    period: "2024 — 2025",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/BookShowHere-Movie-ticket-booking-system",
        kind: "repo",
      },
    ],
    source: "curated",
  },
  {
    id: "Kafka-With-Java-Microservices",
    slug: "kafka-java-microservices",
    name: "Kafka With Java Microservices",
    tagline:
      "A working reference for event-driven Java: producers, consumers, groups, ordering and replay.",
    summary:
      "The repository I built to stop hand-waving about Kafka. It works through the parts that decide whether an event-driven system behaves under stress: partitioning and key choice, consumer groups and rebalancing, offset commits and what at-least-once really obliges a consumer to handle, retry and dead-letter paths, and idempotent consumption. Each concept exists as runnable Spring Boot services rather than notes, because the difference between understanding Kafka and having used it shows up immediately in an interview.",
    domains: ["java", "spring", "microservices", "backend"],
    stack: ["Java", "Spring Boot", "Apache Kafka", "Event-Driven", "Docker"],
    highlights: [
      "At-least-once delivery treated as the default, so consumers are written to be idempotent instead of assuming exactly-once.",
      "Partition key choice demonstrated as an ordering decision, which is what it is — ordering is only ever guaranteed within a partition.",
      "Retry and dead-letter handling included, because the interesting question is what happens to the message that keeps failing.",
    ],
    status: "shipped",
    period: "2025",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/Kafka-With-Java-Microservices",
        kind: "repo",
      },
    ],
    source: "curated",
  },
  {
    id: "MusicON--MusicApplication",
    slug: "musicon",
    name: "MusicON — Streaming Backend",
    tagline:
      "Media streaming on Spring Boot with S3 storage and a Redis cache that earns its place.",
    summary:
      "A music streaming backend in Spring Boot, with audio in S3 and metadata in the database. The lesson here was caching. The first version read track and playlist metadata from MySQL on every request, which was fine locally and obviously wrong under repeated load; adding Redis in front of it cut the repeated reads, and adding it carelessly would have served stale playlists instead. Deciding what to cache, for how long, and precisely when to invalidate it turned out to be a design decision about the domain rather than a configuration value.",
    domains: ["java", "spring", "backend"],
    stack: ["Java", "Spring Boot", "AWS S3", "Redis", "MySQL", "REST API"],
    highlights: [
      "Redis caching with deliberate invalidation, so a playlist edit is visible immediately while the read path stays cheap.",
      "Media in object storage and metadata in the database — the database never streams bytes it has no reason to hold.",
      "Range-request support so a client can seek within a track instead of refetching it.",
    ],
    status: "shipped",
    period: "2024",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/MusicON--MusicApplication",
        kind: "repo",
      },
    ],
    source: "curated",
  },
  {
    id: "spring-boot-mastery",
    slug: "spring-boot-mastery",
    name: "Spring Boot Mastery",
    tagline:
      "Spring internals written down properly — how it works, not just which annotation to use.",
    summary:
      "A structured Spring Boot reference covering the parts that separate someone who configures Spring from someone who understands it: the bean lifecycle and container startup, how auto-configuration actually resolves, proxying and why a self-invoked @Transactional method silently does nothing, the filter chain, and production concerns like actuator health and profile-based configuration. Written as production-style examples with interview notes alongside, because the fastest way to find out whether you understand a framework is to try to explain its internals.",
    domains: ["java", "spring", "backend"],
    stack: ["Java", "Spring Boot", "Spring MVC", "Hibernate & JPA", "JUnit"],
    highlights: [
      "Covers proxying and self-invocation, which is the Spring behaviour most often misunderstood in production code.",
      "Auto-configuration traced through rather than accepted, so a failing context can be diagnosed instead of guessed at.",
      "Interview notes kept next to runnable examples, so the explanation and the proof live together.",
    ],
    status: "active",
    period: "2025 — Present",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/spring-boot-mastery",
        kind: "repo",
      },
    ],
    source: "curated",
  },

  /* ======================================================================== */
  /*  Full stack, MERN and the things I built because they annoyed me         */
  /* ======================================================================== */
  {
    id: "OneClick-MovieReviewWebApp",
    slug: "oneclick-movie-review",
    name: "OneClick — Movie Reviews",
    tagline:
      "React front end against a Spring Boot API, decoupled hard enough that either side can be rebuilt.",
    summary:
      "A full-stack review application with a React front end and a Spring Boot and MongoDB back end, built specifically to practise the contract between them. The rule I set was that the front end knows nothing about the database and the back end knows nothing about the UI — they meet at a documented REST contract and nowhere else. That constraint is what makes the project useful: it is the same discipline that lets a service outlive the client that first consumed it.",
    domains: ["fullstack", "mern", "java", "spring"],
    stack: ["React", "Spring Boot", "MongoDB", "REST API", "JavaScript"],
    highlights: [
      "A REST contract designed first, so the two halves were genuinely developed against an interface rather than against each other.",
      "MongoDB chosen where the document shape genuinely varies, not as a default.",
      "Validation duplicated on purpose — the client for feedback, the server for truth, since the client is not a trust boundary.",
    ],
    status: "shipped",
    period: "2024",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/OneClick-MovieReviewWebApp",
        kind: "repo",
      },
    ],
    source: "curated",
  },
  {
    id: "DevSync",
    slug: "devsync",
    name: "DevSync — Cross-Device Clipboard",
    tagline:
      "Copy on your laptop, paste on your phone. Solves a problem every developer has and nobody fixes.",
    summary:
      "Cross-device clipboard and snippet sync, running on web, a browser extension and Android against one realtime Supabase backend. The problem is completely ordinary — you copy a token, a command or a link on one machine and need it on another, and the usual answer is messaging it to yourself. Which makes it a good project: the value is entirely in latency and reliability, so there is nowhere to hide. Three clients sharing one realtime data model means conflict handling, ordering and device identity all have to be decided rather than assumed.",
    domains: ["fullstack", "mern", "backend"],
    stack: [
      "TypeScript",
      "Next.js",
      "Supabase",
      "Realtime",
      "Browser Extension",
      "Android",
    ],
    highlights: [
      "One realtime data model serving three very different clients, so the sync rules live in the backend rather than three times over.",
      "Ordering and conflict handling made explicit — two devices can copy at the same moment, and the last writer is not automatically right.",
      "Built and shipped quickly by leaning on Supabase and Vercel, which is the right trade when the interesting part is the data model.",
    ],
    status: "active",
    period: "2025",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/DevSync",
        kind: "repo",
      },
    ],
    source: "curated",
  },
  {
    id: "roadmap-tracker",
    slug: "roadmap-tracker",
    name: "Roadmap Tracker",
    tagline:
      "A learning log organised by the questions interviews actually ask, with every topic under one roof.",
    summary:
      "A tracker for a learning journey rather than a to-do list. Topics are organised into categories and curated around the questions that come up in real interviews, so progress is measured against what will actually be asked instead of against how many tutorials were finished. I built it because my own preparation was scattered across notes, bookmarks and half-remembered videos, and the thing I needed was one place that could tell me honestly what I had covered and what I was avoiding.",
    domains: ["fullstack", "mern"],
    stack: ["JavaScript", "React", "Node.js", "MongoDB"],
    highlights: [
      "Structured around interview questions, which makes 'done' a testable claim rather than a feeling.",
      "Every category under one roof, because the scattering was the original problem.",
      "Honest progress state — it is designed to show the gaps, not to reward streaks.",
    ],
    status: "active",
    period: "2025 — Present",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/roadmap-tracker",
        kind: "repo",
      },
    ],
    source: "curated",
  },
  {
    id: "trackfit",
    slug: "trackfit",
    name: "TrackFit — Workout Tracking",
    tagline:
      "Built to solve my own problem in the gym. It is now what the rest of the gym uses.",
    summary:
      "A workout tracker built because writing sets into my phone's notes app between exercises was genuinely annoying. Set-by-set logging with per-set weight and reps, so you can see what you actually lifted last week rather than what you think you lifted. It ended up being adopted by other people at my gym, which is the outcome I am most pleased with on this list: nobody was told to use it, and it was not a portfolio piece — it just solved the problem well enough that people preferred it to paper.",
    domains: ["fullstack", "mern"],
    stack: ["TypeScript", "Next.js", "Supabase", "Tailwind CSS", "PostgreSQL"],
    highlights: [
      "Per-set logging rather than per-workout, because the useful comparison is set three last week against set three today.",
      "Real users I see in person, which is a far harsher review than a GitHub star — friction gets reported immediately.",
      "Built from scratch and shipped in days on Next.js, Supabase and Vercel, then iterated on actual feedback.",
    ],
    status: "shipped",
    period: "2025",
    links: [
      {
        label: "Repository",
        href: "https://github.com/jyotiram7402/trackfit",
        kind: "repo",
      },
    ],
    source: "curated",
  },

  /* ======================================================================== */
  /*  Work with no public repository                                          */
  /* ======================================================================== */
  {
    id: "payment-gateway-integrations",
    slug: "payment-gateway-integrations",
    name: "Payment Gateway Integrations",
    tagline: "PayPal, Stripe and AsiaPay — owned end to end, including the failure paths.",
    summary:
      "Work at Southco, not a public repository. End-to-end ownership of three payment gateways on an enterprise platform, and the single point of contact for every payment issue in production. The interesting part is not the happy path — it is transaction validation, webhook and callback processing, retries and failure handling.",
    domains: ["backend", "microservices"],
    stack: ["REST API", "Webhooks", "MySQL", "Integrations", "Production Support"],
    highlights: [
      "Three gateways including AsiaPay for China and APAC, each with its own settlement and callback semantics.",
      "Webhook and callback processing built for replay and duplication, because both happen in production.",
      "Resolved a critical PayPal failure during a midnight incident with zero downtime — Spot Award.",
    ],
    status: "shipped",
    period: "2024 — Present",
    links: [],
    source: "curated",
  },
  {
    id: "ai-devcontainer",
    slug: "ai-devcontainer",
    name: "Isolated AI DevContainer",
    tagline:
      "The security answer that let 20 developers adopt agentic AI instead of being told to wait.",
    summary:
      "Work at Southco, not a public repository. While leading the R&D on agentic AI tooling I found the risk nobody had raised — the tooling could read legacy customer data on a developer machine. Rather than block adoption, I built a Docker-based DevContainer giving each developer a fully isolated environment with no path to that data. It became the standard workflow for all 20 developers, which is the part that matters: the R&D was only useful because it ended in something the organisation accepted and shipped.",
    domains: ["ai", "backend"],
    stack: ["Docker", "DevContainers", "Claude Code", "MCP", "Security"],
    highlights: [
      "Found the risk before rollout rather than after, which is the only time finding it is cheap.",
      "Answered the security objection with an implementation instead of a policy document.",
      "Adopted by all 20 developers as the default environment.",
    ],
    status: "shipped",
    period: "2025",
    links: [],
    source: "curated",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id || project.slug === id);
}

/** Used by the assistant to answer domain-scoped questions. */
export function getProjectsByDomain(domain: ProjectDomain): readonly Project[] {
  return projects.filter((project) => project.domains.includes(domain));
}

/**
 * Every filterable domain, in display order — hiring priority, not alphabetical.
 *
 * `as const satisfies` rather than a type annotation: an annotation on a filtered result does not
 * reach the array literal, so each `id` would widen to `string` and no longer satisfy
 * `ProjectDomain`.
 */
export const projectDomains = [
  { id: "java", label: "Java" },
  { id: "spring", label: "Spring Boot" },
  { id: "microservices", label: "Microservices" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI" },
  { id: "fullstack", label: "Full Stack" },
  { id: "mern", label: "MERN" },
] as const satisfies readonly { id: ProjectDomain; label: string }[];
