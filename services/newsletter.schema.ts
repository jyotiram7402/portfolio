import { z } from "zod";

/**
 * The subscription contract, in its own module.
 *
 * Split out from `newsletter.service.ts` deliberately. The form needs the schema, and the
 * service reads a server-only environment variable — importing the service from a client
 * component would pull that logic into the browser bundle. This way both sides share exactly
 * one definition of what a valid submission is, and neither drags the other's dependencies
 * along.
 */

export const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .max(254, "That address is too long.")
    .email("That does not look like a valid email address."),
  /**
   * Honeypot. Bots fill every field they parse; humans never see this one, so any value at
   * all means the submission is automated.
   */
  company: z.string().max(0).optional(),
  /**
   * Milliseconds between form mount and submit. A real person takes longer than a second to
   * read a label and type an address.
   */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;

/** Below this, the form was filled by a script rather than read by a person. */
export const MIN_ELAPSED_MS = 1200;
