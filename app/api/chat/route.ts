import { LocalKnowledgeEngine } from "@/services/ai.service";
import type { ChatMessage } from "@/types/ai";

/**
 * `POST /api/chat`
 *
 * The LLM seam, implemented against the local engine.
 *
 * The assistant runs entirely in the browser today — the knowledge base is static data, so a
 * network round trip would add latency and buy nothing. This route exists anyway, and is
 * genuinely functional, for one reason: it means the migration to a model is a configuration
 * change rather than a rewrite. `RemoteChatEngine` already speaks this protocol, so flipping
 * `createChatEngine({ remote: true })` moves the assistant server-side with no other edit.
 *
 * The protocol is newline-delimited JSON rather than SSE. The chunk union is already JSON, so
 * NDJSON needs no `data:` framing and no event names — and a streamed model response maps
 * onto it one-to-one.
 *
 * When a real model is wired in, only the `engine` line below changes. Everything else — the
 * stream shape, the abort handling, the backpressure — is already correct.
 */

const encoder = new TextEncoder();

interface ChatRequestBody {
  query?: unknown;
  history?: unknown;
}

function parseHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter(
      (entry): entry is { role: string; text: string } =>
        typeof entry === "object" &&
        entry !== null &&
        typeof (entry as { text?: unknown }).text === "string",
    )
    .slice(-8)
    .map((entry, index) => ({
      id: `history-${index}`,
      role: entry.role === "user" ? "user" : "assistant",
      text: entry.text,
      createdAt: 0,
    }));
}

export async function POST(request: Request) {
  let body: ChatRequestBody;

  try {
    body = (await request.json()) as ChatRequestBody;
  } catch {
    return Response.json({ error: "Expected a JSON body." }, { status: 400 });
  }

  if (typeof body.query !== "string" || body.query.trim().length === 0) {
    return Response.json({ error: "A non-empty `query` is required." }, { status: 400 });
  }

  const query = body.query.slice(0, 280);
  const history = parseHistory(body.history);

  const engine = new LocalKnowledgeEngine();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // `request.signal` aborts when the client disconnects, which stops the
        // generator rather than producing tokens nobody will read.
        for await (const chunk of engine.stream(query, history, request.signal)) {
          controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));
        }
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError") {
          // Expected on disconnect. Close cleanly.
        } else {
          controller.enqueue(
            encoder.encode(
              `${JSON.stringify({ type: "text", value: "\n\nSomething went wrong reading the knowledge base." })}\n`,
            ),
          );
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      // Stops proxies from buffering the stream into one response.
      "X-Accel-Buffering": "no",
    },
  });
}
