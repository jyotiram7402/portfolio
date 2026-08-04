export { aiService, createChatEngine, resolveIntent } from "./ai.service";
export type { IntentMatch } from "./ai.service";
export { requestJson } from "./api-client";
export {
  BUDGET_RANGES,
  CONTACT_LIMITS,
  PROJECT_TYPES,
  contactSchema,
  toFieldErrors,
} from "./contact.schema";
export type {
  BudgetRange,
  ContactErrors,
  ContactField,
  ContactInput,
  ProjectType,
} from "./contact.schema";
export { contactService, sendContactMessage } from "./contact.service";
export type { ContactTransport } from "./contact.service";
export { contentService } from "./content.service";
export type { ListOptions } from "./content.service";
export { emailService } from "./email.service";
export type { ContactPayload, ValidationIssues } from "./email.service";
export { MIN_ELAPSED_MS, subscribeSchema } from "./newsletter.schema";
export type { SubscribeInput } from "./newsletter.schema";
export { newsletterService, subscribe } from "./newsletter.service";
export type { SubscribeResult } from "./newsletter.service";

// `github.service` is deliberately absent: it imports `server-only`, and re-exporting
// it here would make this barrel unusable from client components. Import it directly
// from "@/services/github.service" in server code.
