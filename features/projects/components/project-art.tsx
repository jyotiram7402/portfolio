import type { ReactElement } from "react";

/**
 * Per-project cover illustrations.
 *
 * Each scene depicts what the project actually does — a balancing ledger, a seat grid with
 * one seat locked, traffic being scored and diverted. The monogram cover these replace was
 * honest but interchangeable: it told a reader which letter the project started with and
 * nothing else.
 *
 * **Drawn rather than photographed** because there is nothing to photograph. Most of these
 * are backend services with no UI, and a screenshot of a terminal is not a product shot.
 * A diagram of the mechanism is the truthful image for this kind of work.
 *
 * Four rules hold the set together, and they are what stop twelve drawings looking like
 * twelve different sites:
 *
 * 1. **One coordinate space.** Every scene is authored for the 800×500 viewBox its parent
 *    supplies, and draws inside roughly x 60–740, y 90–410 so the technology label in the
 *    corner is never collided with.
 * 2. **Bold, few shapes.** A card renders this about 600px wide, and on a phone closer to
 *    320px. Anything finer than a 6px stroke disappears, so each scene is five to ten large
 *    elements rather than thirty small ones.
 * 3. **Two inks only** — `--foreground` at low opacity for structure, and the project's
 *    `accent` for the one thing the scene is about. That single highlight is what carries
 *    the meaning: the blocked request, the locked seat, the out-of-balance entry.
 * 4. **Tokens, never hexes.** `--foreground` and the passed accent both retint with the
 *    theme, so these work in light mode without a second set of drawings.
 */

export interface ProjectArtProps {
  /** The project's derived hue as a CSS colour. The scene's single highlight. */
  accent: string;
}

/* -------------------------------------------------------------------------- */
/*  Shared primitives                                                         */
/* -------------------------------------------------------------------------- */

/** Structural ink. Everything that is context rather than subject. */
const INK = "var(--foreground)";

/** A rounded node box — the unit most of these scenes are built from. */
function Box({
  x,
  y,
  w,
  h,
  o = 0.09,
  stroke,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  o?: number;
  stroke?: string;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx="10"
      fill={INK}
      fillOpacity={o}
      stroke={stroke ?? INK}
      strokeOpacity={stroke ? 0.7 : 0.16}
      strokeWidth="2"
    />
  );
}

/** A connector. Straight lines only — a scene of curves stops reading as a system. */
function Wire({ d, accent = false }: { d: string; accent?: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      stroke={accent ? "currentColor" : INK}
      strokeOpacity={accent ? 0.85 : 0.18}
      strokeWidth="3"
      strokeLinecap="round"
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Scenes                                                                    */
/* -------------------------------------------------------------------------- */

/** SmartShield — a stream of requests scored at a gate, one diverted. */
function SmartShieldArt({ accent }: ProjectArtProps) {
  const lanes = [140, 200, 260, 320];

  return (
    <g color={accent}>
      {/* Inbound traffic. */}
      {lanes.map((y, index) => (
        <g key={y}>
          <Wire d={`M70 ${y}H300`} />
          {[90, 140, 190, 240].map((x) => (
            <circle
              key={x}
              cx={x + index * 8}
              cy={y}
              r="7"
              fill={INK}
              fillOpacity="0.24"
            />
          ))}
        </g>
      ))}

      {/* The scoring gate. */}
      <Box x={310} y={110} w={110} h={250} stroke={accent} />
      <path
        d="M365 150 405 168v42c0 26-17 44-40 54-23-10-40-28-40-54v-42z"
        fill="currentColor"
        fillOpacity="0.28"
        stroke="currentColor"
        strokeOpacity="0.8"
        strokeWidth="2.5"
      />
      <text
        x="365"
        y="320"
        textAnchor="middle"
        fontSize="18"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.4"
        className="font-mono"
      >
        SCORE
      </text>

      {/* Allowed traffic continues. */}
      <Wire d="M430 170H720" />
      <Wire d="M430 230H720" />
      <Wire d="M430 290H660" />

      {/* One request diverted and stopped — the whole point of the drawing. */}
      <Wire d="M430 350H560l40 60" accent />
      <circle cx="612" cy="424" r="16" fill="currentColor" fillOpacity="0.9" />
      <path
        d="M604 416l16 16M620 416l-16 16"
        stroke="var(--background)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

/** LedgerCore — a balance beam with matching debit and credit columns. */
function LedgerCoreArt({ accent }: ProjectArtProps) {
  const debits = [70, 120, 95];
  const credits = [110, 90, 85];

  return (
    <g color={accent}>
      {/* The beam, level — the invariant the project exists to hold. */}
      <Wire d="M150 250H650" accent />
      <circle cx="400" cy="250" r="14" fill="currentColor" fillOpacity="0.9" />
      <Wire d="M400 264v56" />
      <Wire d="M330 320H470" />

      {/* Debits. */}
      {debits.map((h, index) => (
        <rect
          key={`d-${h}`}
          x={170 + index * 56}
          y={250 - h}
          width="40"
          height={h}
          rx="6"
          fill={INK}
          fillOpacity="0.16"
        />
      ))}

      {/* Credits, mirrored — deliberately the same total height. */}
      {credits.map((h, index) => (
        <rect
          key={`c-${h}`}
          x={470 + index * 56}
          y={250 - h}
          width="40"
          height={h}
          rx="6"
          fill="currentColor"
          fillOpacity="0.34"
        />
      ))}

      <text
        x="170"
        y="380"
        fontSize="19"
        letterSpacing="3"
        fill={INK}
        fillOpacity="0.4"
        className="font-mono"
      >
        DEBIT
      </text>
      <text
        x="470"
        y="380"
        fontSize="19"
        letterSpacing="3"
        fill={INK}
        fillOpacity="0.4"
        className="font-mono"
      >
        CREDIT
      </text>
    </g>
  );
}

/** KnowledgePulse — documents chunked, retrieved, and answered with a citation. */
function KnowledgePulseArt({ accent }: ProjectArtProps) {
  return (
    <g color={accent}>
      {/* Source documents. */}
      {[0, 1, 2].map((index) => (
        <Box key={index} x={70 + index * 14} y={140 + index * 14} w={130} h={170} />
      ))}

      {/* Chunks. */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={290 + col * 74}
            y={150 + row * 52}
            width="62"
            height="38"
            rx="6"
            fill={row === 1 && col === 1 ? "currentColor" : INK}
            fillOpacity={row === 1 && col === 1 ? 0.45 : 0.12}
          />
        )),
      )}

      <Wire d="M232 230H282" />
      <Wire d="M438 228H500" accent />

      {/* The answer, with its citation marker. */}
      <Box x={510} y={160} w={210} h={180} stroke={accent} />
      <g stroke={INK} strokeOpacity="0.22" strokeWidth="7" strokeLinecap="round">
        <path d="M540 200h150" />
        <path d="M540 228h120" />
        <path d="M540 256h150" />
      </g>
      <circle cx="552" cy="304" r="15" fill="currentColor" fillOpacity="0.85" />
      <text
        x="552"
        y="311"
        textAnchor="middle"
        fontSize="17"
        fontWeight="700"
        fill="var(--background)"
        className="font-mono"
      >
        1
      </text>
    </g>
  );
}

/** Foodies — services fanning out from one event topic. */
function EventFanArt({ accent }: ProjectArtProps) {
  const consumers = [130, 250, 370];

  return (
    <g color={accent}>
      <Box x={60} y={210} w={150} h={90} />
      <text
        x="135"
        y="262"
        textAnchor="middle"
        fontSize="19"
        fill={INK}
        fillOpacity="0.45"
        className="font-mono"
      >
        ORDER
      </text>

      {/* The topic: a spine with ordered events on it. */}
      <rect
        x="300"
        y="120"
        width="86"
        height="270"
        rx="12"
        fill="currentColor"
        fillOpacity="0.16"
        stroke="currentColor"
        strokeOpacity="0.6"
        strokeWidth="2.5"
      />
      {[160, 210, 260, 310, 355].map((y) => (
        <rect
          key={y}
          x="316"
          y={y}
          width="54"
          height="26"
          rx="5"
          fill="currentColor"
          fillOpacity="0.5"
        />
      ))}

      <Wire d="M210 255H292" accent />

      {consumers.map((y) => (
        <g key={y}>
          <Wire d={`M394 255H470v${y - 255}h60`} />
          <Box x={540} y={y - 38} w={170} h={76} />
        </g>
      ))}
    </g>
  );
}

/** BookShowHere — a seat map with exactly one seat held. */
function SeatMapArt({ accent }: ProjectArtProps) {
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <g color={accent}>
      {/* The screen. */}
      <path
        d="M170 128q230-46 460 0"
        fill="none"
        stroke={INK}
        strokeOpacity="0.22"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {rows.map((row) =>
        cols.map((col) => {
          const held = row === 2 && col === 4;
          const taken = (row + col) % 5 === 0 && !held;
          return (
            <rect
              key={`${row}-${col}`}
              x={166 + col * 62}
              y={186 + row * 58}
              width="46"
              height="40"
              rx="8"
              fill={held ? "currentColor" : INK}
              fillOpacity={held ? 0.9 : taken ? 0.2 : 0.08}
              stroke={held ? "currentColor" : INK}
              strokeOpacity={held ? 1 : 0.16}
              strokeWidth="2"
            />
          );
        }),
      )}

      {/* The lock on the held seat. */}
      <g transform="translate(474 288)">
        <rect
          x="-11"
          y="-4"
          width="22"
          height="17"
          rx="3"
          fill="var(--background)"
          fillOpacity="0.9"
        />
        <path
          d="M-6 -4v-6a6 6 0 0112 0v6"
          fill="none"
          stroke="var(--background)"
          strokeOpacity="0.9"
          strokeWidth="3"
        />
      </g>
    </g>
  );
}

/** Kafka microservices — partitions as lanes, ordered within each. */
function PartitionsArt({ accent }: ProjectArtProps) {
  const lanes = [150, 250, 350];

  return (
    <g color={accent}>
      {lanes.map((y, lane) => (
        <g key={y}>
          <text
            x="70"
            y={y + 7}
            fontSize="17"
            fill={INK}
            fillOpacity="0.38"
            className="font-mono"
          >
            P{lane}
          </text>
          <Wire d={`M112 ${y}H720`} />
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <rect
              key={index}
              x={140 + index * 96}
              y={y - 22}
              width="76"
              height="44"
              rx="8"
              fill={lane === 1 ? "currentColor" : INK}
              fillOpacity={lane === 1 ? 0.3 : 0.12}
              stroke={lane === 1 ? "currentColor" : INK}
              strokeOpacity={lane === 1 ? 0.65 : 0.16}
              strokeWidth="2"
            />
          ))}
        </g>
      ))}
      <text
        x="140"
        y="418"
        fontSize="18"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.35"
        className="font-mono"
      >
        ORDER GUARANTEED WITHIN A PARTITION
      </text>
    </g>
  );
}

/** MusicON — a waveform served from cache rather than from the database. */
function StreamingArt({ accent }: ProjectArtProps) {
  const bars = [
    40, 92, 58, 132, 74, 156, 46, 118, 88, 168, 62, 140, 52, 104, 78, 148, 44, 96,
  ];

  return (
    <g color={accent}>
      {bars.map((h, index) => (
        <rect
          key={index}
          x={80 + index * 36}
          y={230 - h / 2}
          width="18"
          height={h}
          rx="9"
          fill={index > 4 && index < 12 ? "currentColor" : INK}
          fillOpacity={index > 4 && index < 12 ? 0.6 : 0.16}
        />
      ))}

      <Box x={80} y={318} w={250} h={72} />
      <text
        x="205"
        y="362"
        textAnchor="middle"
        fontSize="18"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.45"
        className="font-mono"
      >
        REDIS CACHE
      </text>

      <Box x={440} y={318} w={250} h={72} />
      <text
        x="565"
        y="362"
        textAnchor="middle"
        fontSize="18"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.45"
        className="font-mono"
      >
        S3 MEDIA
      </text>
    </g>
  );
}

/** Spring Boot Mastery — the container, the context, the bean. */
function LayersArt({ accent }: ProjectArtProps) {
  return (
    <g color={accent}>
      <Box x={120} y={110} w={560} h={290} />
      <Box x={180} y={155} w={440} h={200} />
      <Box x={244} y={200} w={312} h={110} stroke={accent} />

      <text
        x="140"
        y="140"
        fontSize="17"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.35"
        className="font-mono"
      >
        CONTAINER
      </text>
      <text
        x="200"
        y="185"
        fontSize="17"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.35"
        className="font-mono"
      >
        CONTEXT
      </text>
      <text
        x="400"
        y="263"
        textAnchor="middle"
        fontSize="24"
        letterSpacing="3"
        fill="currentColor"
        fillOpacity="0.85"
        className="font-mono"
      >
        BEAN
      </text>
    </g>
  );
}

/** OneClick — two halves meeting at a documented contract. */
function ContractArt({ accent }: ProjectArtProps) {
  return (
    <g color={accent}>
      <Box x={70} y={140} w={230} h={220} />
      <g stroke={INK} strokeOpacity="0.2" strokeWidth="7" strokeLinecap="round">
        <path d="M104 186h150" />
        <path d="M104 218h110" />
        <path d="M104 250h140" />
      </g>
      <text
        x="104"
        y="330"
        fontSize="18"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.4"
        className="font-mono"
      >
        REACT
      </text>

      {/* The contract. The only thing either side is allowed to know about the other. */}
      <rect
        x="336"
        y="196"
        width="128"
        height="108"
        rx="12"
        fill="currentColor"
        fillOpacity="0.2"
        stroke="currentColor"
        strokeOpacity="0.75"
        strokeWidth="2.5"
      />
      <text
        x="400"
        y="258"
        textAnchor="middle"
        fontSize="20"
        letterSpacing="2"
        fill="currentColor"
        fillOpacity="0.95"
        className="font-mono"
      >
        REST
      </text>

      <Wire d="M300 250H330" accent />
      <Wire d="M470 250H500" accent />

      <Box x={500} y={140} w={230} h={220} />
      <g stroke={INK} strokeOpacity="0.2" strokeWidth="7" strokeLinecap="round">
        <path d="M534 186h150" />
        <path d="M534 218h110" />
        <path d="M534 250h140" />
      </g>
      <text
        x="534"
        y="330"
        fontSize="18"
        letterSpacing="2"
        fill={INK}
        fillOpacity="0.4"
        className="font-mono"
      >
        SPRING BOOT
      </text>
    </g>
  );
}

/** DevSync — the same clipboard payload on a laptop and a phone. */
function ClipboardSyncArt({ accent }: ProjectArtProps) {
  return (
    <g color={accent}>
      {/* Laptop. */}
      <Box x={70} y={150} w={270} h={170} />
      <path
        d="M52 330h306"
        stroke={INK}
        strokeOpacity="0.22"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <rect
        x="104"
        y="196"
        width="200"
        height="34"
        rx="8"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect x="104" y="248" width="140" height="16" rx="8" fill={INK} fillOpacity="0.16" />

      {/* The sync arc — the one accent line, going both ways. */}
      <path
        d="M366 236q84-86 168 0"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="3"
        strokeDasharray="9 8"
        strokeLinecap="round"
      />
      <circle cx="450" cy="196" r="17" fill="currentColor" fillOpacity="0.9" />
      <path
        d="M443 196h14M451 190l6 6-6 6"
        stroke="var(--background)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Phone, showing the same payload. */}
      <Box x={556} y={120} w={150} h={260} />
      <rect
        x="580"
        y="176"
        width="102"
        height="30"
        rx="8"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <rect x="580" y="222" width="72" height="14" rx="7" fill={INK} fillOpacity="0.16" />
      <rect x="580" y="252" width="88" height="14" rx="7" fill={INK} fillOpacity="0.16" />
    </g>
  );
}

/** Roadmap Tracker — a branching path, part walked. */
function RoadmapArt({ accent }: ProjectArtProps) {
  const done = [
    [110, 250],
    [230, 250],
    [350, 250],
  ] as const;
  const pending = [
    [470, 170],
    [470, 330],
    [610, 170],
    [610, 330],
  ] as const;

  return (
    <g color={accent}>
      <Wire d="M110 250H350" accent />
      <Wire d="M350 250H420v-80h50" />
      <Wire d="M350 250H420v80h50" />
      <Wire d="M470 170H610" />
      <Wire d="M470 330H610" />

      {done.map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="26" fill="currentColor" fillOpacity="0.9" />
          <path
            d={`M${cx - 11} ${cy}l8 9 15-17`}
            fill="none"
            stroke="var(--background)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}

      {pending.map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="24"
          fill={INK}
          fillOpacity="0.08"
          stroke={INK}
          strokeOpacity="0.24"
          strokeWidth="2.5"
          strokeDasharray="7 6"
        />
      ))}
    </g>
  );
}

/** TrackFit — sets logged, one per bar, this week beating last. */
function SetsArt({ accent }: ProjectArtProps) {
  const previous = [90, 120, 110, 140, 130];
  const current = [110, 145, 132, 168, 158];

  return (
    <g color={accent}>
      <Wire d="M110 372H700" />

      {previous.map((h, index) => (
        <rect
          key={`p-${index}`}
          x={150 + index * 112}
          y={372 - h}
          width="42"
          height={h}
          rx="8"
          fill={INK}
          fillOpacity="0.14"
        />
      ))}

      {current.map((h, index) => (
        <rect
          key={`c-${index}`}
          x={198 + index * 112}
          y={372 - h}
          width="42"
          height={h}
          rx="8"
          fill="currentColor"
          fillOpacity="0.6"
        />
      ))}

      {current.map((_, index) => (
        <text
          key={`l-${index}`}
          x={196 + index * 112}
          y="400"
          textAnchor="middle"
          fontSize="16"
          fill={INK}
          fillOpacity="0.34"
          className="font-mono"
        >
          SET {index + 1}
        </text>
      ))}
    </g>
  );
}

/** Payment gateways — four providers behind one idempotent handler. */
function GatewaysArt({ accent }: ProjectArtProps) {
  const providers = ["PAYPAL", "STRIPE", "ASIAPAY", "CCAVENUE"];

  return (
    <g color={accent}>
      {providers.map((name, index) => (
        <g key={name}>
          <Box x={60} y={112 + index * 72} w={190} h={56} />
          <text
            x="155"
            y={147 + index * 72}
            textAnchor="middle"
            fontSize="17"
            letterSpacing="1.5"
            fill={INK}
            fillOpacity="0.45"
            className="font-mono"
          >
            {name}
          </text>
          <Wire d={`M250 ${140 + index * 72}H330v${248 - (140 + index * 72)}h30`} />
        </g>
      ))}

      <rect
        x="368"
        y="188"
        width="180"
        height="120"
        rx="14"
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeOpacity="0.7"
        strokeWidth="2.5"
      />
      <text
        x="458"
        y="240"
        textAnchor="middle"
        fontSize="19"
        letterSpacing="1.5"
        fill="currentColor"
        fillOpacity="0.95"
        className="font-mono"
      >
        IDEMPOTENT
      </text>
      <text
        x="458"
        y="270"
        textAnchor="middle"
        fontSize="19"
        letterSpacing="1.5"
        fill="currentColor"
        fillOpacity="0.95"
        className="font-mono"
      >
        HANDLER
      </text>

      <Wire d="M548 248H660" accent />
      <Box x={660} y={212} w={80} h={72} />
    </g>
  );
}

/** The DevContainer — the agent inside the box, company data outside it. */
function IsolationArt({ accent }: ProjectArtProps) {
  return (
    <g color={accent}>
      {/* Outside: files the tool must not reach. */}
      {[0, 1, 2].map((index) => (
        <g key={index}>
          <Box x={70} y={140 + index * 86} w={130} h={62} />
          <path
            d={`M96 ${162 + index * 86}h78M96 ${182 + index * 86}h52`}
            stroke={INK}
            strokeOpacity="0.2"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* The boundary. Dashed, accented, and crossed out — the whole point. */}
      <rect
        x="300"
        y="100"
        width="18"
        height="310"
        rx="9"
        fill="currentColor"
        fillOpacity="0.22"
      />
      <path
        d="M309 100v310"
        stroke="currentColor"
        strokeOpacity="0.9"
        strokeWidth="3"
        strokeDasharray="12 10"
      />
      <circle cx="309" cy="255" r="22" fill="currentColor" fillOpacity="0.95" />
      <path
        d="M299 245l20 20M319 245l-20 20"
        stroke="var(--background)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Inside: the isolated container. */}
      <Box x={380} y={130} w={340} h={250} stroke={accent} />
      <text
        x="404"
        y="164"
        fontSize="17"
        letterSpacing="2"
        fill="currentColor"
        fillOpacity="0.8"
        className="font-mono"
      >
        DEVCONTAINER
      </text>
      <g stroke={INK} strokeOpacity="0.2" strokeWidth="7" strokeLinecap="round">
        <path d="M410 220h240" />
        <path d="M410 254h180" />
        <path d="M410 288h220" />
        <path d="M410 322h150" />
      </g>
    </g>
  );
}

/* -------------------------------------------------------------------------- */
/*  Registry                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Slug → scene.
 *
 * Keyed by `slug` rather than `id` because the slug is the stable, human-chosen handle;
 * ids for discovered repositories are whatever the repository is called. A project with no
 * entry falls back to the monogram cover, so adding a project never breaks the grid — it
 * just does not get a drawing until someone writes one.
 */
const ART: Record<string, (props: ProjectArtProps) => ReactElement> = {
  smartshield: SmartShieldArt,
  ledgercore: LedgerCoreArt,
  "knowledgepulse-ai": KnowledgePulseArt,
  foodies: EventFanArt,
  bookshowhere: SeatMapArt,
  "kafka-java-microservices": PartitionsArt,
  musicon: StreamingArt,
  "spring-boot-mastery": LayersArt,
  "oneclick-movie-review": ContractArt,
  devsync: ClipboardSyncArt,
  "roadmap-tracker": RoadmapArt,
  trackfit: SetsArt,
  "payment-gateway-integrations": GatewaysArt,
  "ai-devcontainer": IsolationArt,
};

export function getProjectArt(
  slug: string,
): ((props: ProjectArtProps) => ReactElement) | undefined {
  return ART[slug];
}
