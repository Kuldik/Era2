import type { GenType } from "@/entities/generation-task";

export const MODELS_BY_TYPE = {
  text: ["GPT-4o", "Claude Sonnet"],
  image: ["Midjourney v6", "DALL-E 3"],
  video: ["Runway Gen-3"],
  audio: ["elevenLabs", "Suno"],
} satisfies Record<GenType, string[]>;

export const DEFAULT_CREDITS_BY_TYPE = {
  text: 4,
  image: 10,
  video: 28,
  audio: 12,
} satisfies Record<GenType, number>;
