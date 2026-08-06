import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

export interface SystemDiagramProps {
  className?: string;
}

/* ==========================================================================
   Diagram geometry.

   Declared once, as numbers, because every arrow endpoint has to agree with a box
   edge — and a diagram whose arrows miss by two pixels looks broken in a way that no
   amount of good copy recovers from. Deriving the connectors from these constants is
   what keeps them aligned when a row moves.

   The frame is 320 units wide. The column occupies 12…284, leaving 284…320 as a
   channel for the one edge that arrives from outside.
   ========================================================================== */

const COL_X = 12;
const COL_W = 272;
/** Spine — the x every full-width connector runs along. */
const MID = COL_X + COL_W / 2; // 148

/** Two-up row: two boxes of 130 with a 12 gutter, filling the same column. */
const HALF_W = 130;
const LEFT_MID = COL_X + HALF_W / 2; // 77
const RIGHT_MID = COL_X + COL_W - HALF_W / 2; // 219

const FULL_H = 44;
const HALF_H = 30;

/**
 * Row tops, in reading order.
 *
 * The spine is a *sequence* — the order a request actually travels — so everything on
 * it is a step. The data layer is deliberately not on the spine: MySQL does not call a
 * payment gateway, and drawing an arrow from a datastore to the next step would say
 * that it does. It sits below a rule instead, as what the API is backed by.
 */
const ROW = {
  client: 8,
  auth: 68,
  api: 128,
  gateways: 188,
  events: 248,
  consumers: 308,
  /** Below the rule. Not a step. */
  stores: 380,
} as const;

/** The rule that separates the request path from the persistence it rests on. */
const SPLIT_Y = 356;

/** Arrowheads stop short of the target edge so the marker tip lands on it. */
const GAP = 4;

/**
 * The request path, drawn.
 *
 * This is the one thing a backend engineer's portfolio can show that prose cannot: the
 * actual shape of a system, with the boundaries where they really sit. It fills the
 * column beside the sticky journey timeline, which previously ran out of content
 * halfway down and left the reader looking at empty space.
 *
 * Inline SVG rather than an image file, for three reasons:
 *
 * • **It is text.** It diffs, it is searchable, and the labels are real characters, so
 *   a screen reader and a text-only crawler both get something. The `aria-label`
 *   describes the topology in a sentence, which is the part a diagram usually loses.
 * • **It themes itself.** Every stroke and fill is a `--border` / `--muted` /
 *   `--primary` token, so the light theme is free rather than a second export.
 * • **It is resolution independent** and weighs a couple of kilobytes against a PNG
 *   that would need three densities to look right.
 *
 * The `viewBox` does the responsive work: it scales to the column with no media
 * queries and no per-breakpoint variant. Labels are 11 units, which lands near 12px on
 * a 320px phone — the floor for a diagram this dense, and the reason the layout is a
 * single spine rather than a wide graph.
 *
 * A Server Component: no state, no interaction, nothing to hydrate.
 *
 * The content is the system described in `data/journey.ts` — payments, the enterprise
 * integrations, the event stream — not a generic reference architecture. A diagram that
 * could belong to anyone is decoration.
 */
export function SystemDiagram({ className }: SystemDiagramProps) {
  return (
    <GlassCard padding="none" radius="2xl" className={cn("overflow-hidden", className)}>
      <div className="flex flex-col gap-1.5 border-b border-border px-5 py-4">
        <p className="eyebrow">In production</p>
        <h3 className="text-sm font-semibold tracking-tight text-foreground">
          The path a payment takes
        </h3>
        <p className="text-xs leading-relaxed text-muted">
          The services I own, and the boundaries between them. Every failure path on
          this diagram is one I have been the point of contact for.
        </p>
      </div>

      <div className="p-5">
        <svg
          viewBox="0 0 320 422"
          role="img"
          aria-label="Architecture diagram of a payment request, read top to bottom. A web client calls a Spring Security filter chain handling validation and JWT authentication, which passes to a Spring Boot REST API. The API calls the PayPal, Stripe and AsiaPay gateways through an idempotent handler with bounded retries; the provider's webhook arrives back at that handler from outside the system. Confirmed orders publish to a Kafka topic partitioned by order key, which fans out to a notification service and an enterprise CRM sync. Below a dividing rule, the persistence the API owns: MySQL and a Redis read cache."
          // Capped and centred rather than filling the column. The drawing is a narrow
          // vertical spine — that is what makes it legible on a phone — and letting it
          // scale to a 700px desktop column would stretch it to 900px tall for no gain.
          // At 20rem it renders close to 1:1 with the viewBox, so the type is crisp.
          className="mx-auto h-auto w-full max-w-80"
        >
          <defs>
            {/* `context-stroke` would let one marker inherit each edge's colour, but
                Safari's support is partial, so the two edge styles get one marker each. */}
            <marker
              id="sd-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0.5 1.4 7 4 0.5 6.6z" fill="var(--subtle)" />
            </marker>
            <marker
              id="sd-arrow-accent"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M0.5 1.4 7 4 0.5 6.6z" fill="var(--primary)" />
            </marker>
          </defs>

          {/* Connectors first, so every box paints over them. */}
          <g
            stroke="var(--border-strong)"
            strokeWidth="1.25"
            fill="none"
            markerEnd="url(#sd-arrow)"
          >
            {/* The spine, one step to the next. */}
            <path d={`M${MID} ${ROW.client + FULL_H}V${ROW.auth - GAP}`} />
            <path d={`M${MID} ${ROW.auth + FULL_H}V${ROW.api - GAP}`} />
            <path d={`M${MID} ${ROW.api + FULL_H}V${ROW.gateways - GAP}`} />
            <path d={`M${MID} ${ROW.gateways + FULL_H}V${ROW.events - GAP}`} />

            {/* The event log fans out to its consumers. */}
            <path d={`M${LEFT_MID} ${ROW.events + FULL_H}V${ROW.consumers - GAP}`} />
            <path d={`M${RIGHT_MID} ${ROW.events + FULL_H}V${ROW.consumers - GAP}`} />
          </g>

          {/* The webhook. Dashed and accented because it is the only edge that arrives
              from outside on someone else's schedule — which is the entire reason the
              handler it lands on has to be idempotent. */}
          <path
            d={`M316 ${ROW.gateways + 22}H${COL_X + COL_W + GAP}`}
            stroke="var(--primary)"
            strokeWidth="1.25"
            strokeDasharray="3 3"
            fill="none"
            markerEnd="url(#sd-arrow-accent)"
          />

          <Node y={ROW.client} label="Web client" sub="Browser · mobile" />
          <Node
            y={ROW.auth}
            label="Validation & JWT auth"
            sub="Spring Security filter chain"
            accent
          />
          <Node
            y={ROW.api}
            label="Spring Boot REST API"
            sub="Controllers · services · JPA"
            accent
          />

          <Node
            y={ROW.gateways}
            label="PayPal · Stripe · AsiaPay"
            sub="Idempotent handler · retries"
            accent
          />
          <Node y={ROW.events} label="Kafka order events" sub="Partitioned by order key" />

          <Node
            x={COL_X}
            y={ROW.consumers}
            w={HALF_W}
            label="Notifications"
            sub="Async"
            half
          />
          <Node
            x={COL_X + COL_W - HALF_W}
            y={ROW.consumers}
            w={HALF_W}
            label="CRM sync"
            sub="REST"
            half
          />

          {/* Below the rule: what the API is backed by, not a step in the request. */}
          <path
            d={`M${COL_X} ${SPLIT_Y}H${COL_X + COL_W}`}
            stroke="var(--border)"
            strokeWidth="1"
          />
          <text
            x={COL_X}
            y={SPLIT_Y + 16}
            fontSize="8.5"
            fill="var(--subtle)"
            className="font-mono"
          >
            PERSISTENCE THE API OWNS
          </text>

          <Node
            x={COL_X}
            y={ROW.stores}
            w={HALF_W}
            label="MySQL"
            sub="Indexed · EXPLAIN'd"
            half
          />
          <Node
            x={COL_X + COL_W - HALF_W}
            y={ROW.stores}
            w={HALF_W}
            label="Redis"
            sub="Read cache"
            half
          />
        </svg>

        {/* The legend earns its place: the dashed edge is the only thing here whose
            meaning is not carried by its own label. */}
        <p className="mt-4 flex items-start gap-2 text-2xs leading-relaxed text-subtle">
          <svg
            viewBox="0 0 20 2"
            aria-hidden="true"
            className="mt-1.5 h-0.5 w-5 shrink-0 overflow-visible"
          >
            <path
              d="M0 1h20"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          </svg>
          Inbound webhook. It arrives on the provider&rsquo;s schedule, not ours — which
          is why the handler is idempotent and the retries are bounded.
        </p>
      </div>
    </GlassCard>
  );
}

interface NodeProps {
  /** Left edge in viewBox units. Defaults to the full-width column. */
  x?: number;
  y: number;
  /** Box width. Defaults to the full-width column. */
  w?: number;
  label: string;
  sub: string;
  /** Accent treatment — the stages I own end to end. */
  accent?: boolean;
  /** A shorter box in a two-up row, which gets a tighter type scale. */
  half?: boolean;
}

/**
 * One box.
 *
 * A local component rather than a loop over a data array. The value of this diagram is
 * the specific arrangement, and a data-driven version would have to encode the edge
 * geometry too — at which point the data is harder to read than the drawing is.
 *
 * Opacity rather than `color-mix()` for the accent fill: presentation attributes accept
 * CSS functions unevenly across engines, and `fill-opacity` is universal.
 */
function Node({ x = COL_X, y, w = COL_W, label, sub, accent, half }: NodeProps) {
  const height = half ? HALF_H : FULL_H;
  const center = x + w / 2;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={height}
        rx="7"
        fill={accent ? "var(--primary)" : "var(--elevated)"}
        fillOpacity={accent ? 0.1 : 1}
        stroke={accent ? "var(--primary)" : "var(--border)"}
        strokeOpacity={accent ? 0.45 : 1}
        strokeWidth="1"
      />
      <text
        x={center}
        y={y + (half ? 13 : 19)}
        textAnchor="middle"
        fontSize={half ? 10 : 11}
        fontWeight="600"
        fill="var(--foreground)"
        className="font-sans"
      >
        {label}
      </text>
      <text
        x={center}
        y={y + (half ? 23 : 33)}
        textAnchor="middle"
        fontSize="8.5"
        fill="var(--muted)"
        className="font-mono"
      >
        {sub}
      </text>
    </g>
  );
}
