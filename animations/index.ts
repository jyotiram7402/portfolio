export * from "./easings";
export * from "./transitions";
export * from "./variants";
// GSAP is intentionally not re-exported here: importing it pulls in
// ScrollTrigger, and this barrel is used by components that never need it.
// Import from "@/animations/gsap" directly at the point of use.
