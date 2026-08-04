import { z } from "zod";

/**
 * The contact form's contract, in its own module.
 *
 * Shared verbatim between the form and the route handler. The client validates as a courtesy —
 * it makes errors immediate — and the route re-validates because anything arriving at an
 * endpoint is untrusted regardless of what claims to have sent it.
 *
 * The option unions live here rather than in `data/` because they are part of the contract: a
 * label can change freely, but an id change is a breaking change to stored submissions.
 */

export const PROJECT_TYPES = [
  "backend-service",
  "ai-feature",
  "full-stack-app",
  "integration",
  "consulting",
  "role",
  "other",
] as const;

export const BUDGET_RANGES = [
  "not-applicable",
  "under-5k",
  "5k-15k",
  "15k-40k",
  "40k-plus",
  "undecided",
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type BudgetRange = (typeof BUDGET_RANGES)[number];

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  companyMax: 120,
  roleMax: 80,
  messageMin: 20,
  messageMax: 2000,
} as const;

/** Below this, the form was filled by a script rather than read by a person. */
export const MIN_ELAPSED_MS = 2000;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.nameMin, "Please enter your name.")
    .max(CONTACT_LIMITS.nameMax, `Keep this under ${CONTACT_LIMITS.nameMax} characters.`),

  email: z
    .string()
    .trim()
    .min(1, "An email address is how I reply.")
    .max(254, "That address is too long.")
    .email("That does not look like a valid email address."),

  company: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.companyMax, "Keep this shorter.")
    .optional()
    .or(z.literal("")),

  role: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.roleMax, "Keep this shorter.")
    .optional()
    .or(z.literal("")),

  projectType: z.enum(PROJECT_TYPES, {
    errorMap: () => ({ message: "Pick the closest match." }),
  }),

  budget: z.enum(BUDGET_RANGES).optional(),

  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.messageMin,
      `A little more detail helps — at least ${CONTACT_LIMITS.messageMin} characters.`,
    )
    .max(
      CONTACT_LIMITS.messageMax,
      `Keep this under ${CONTACT_LIMITS.messageMax} characters.`,
    ),

  /**
   * Honeypot. Hidden from sight, from assistive tech and from the tab order, so the only thing
   * that can fill it is a script.
   */
  website: z.string().max(0).optional(),

  /** Milliseconds between form mount and submit. */
  elapsedMs: z.number().int().nonnegative().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Fields the form renders, in order. Drives the field-level error map. */
export type ContactField = keyof Pick<
  ContactInput,
  "name" | "email" | "company" | "role" | "projectType" | "budget" | "message"
>;

export type ContactErrors = Partial<Record<ContactField, string>>;

/**
 * Flattens a Zod error into a field-keyed map.
 *
 * Returns the first message per field: a stack of three messages under one input is noise, and
 * fixing the first usually resolves the rest.
 */
export function toFieldErrors(error: z.ZodError): ContactErrors {
  const errors: ContactErrors = {};

  for (const issue of error.issues) {
    const field = issue.path[0];
    if (typeof field !== "string") continue;
    if (field in errors) continue;
    errors[field as ContactField] = issue.message;
  }

  return errors;
}
