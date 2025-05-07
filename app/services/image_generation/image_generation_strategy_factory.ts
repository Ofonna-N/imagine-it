import type { ImageGenerationStrategy } from "./image_generation_strategy";
import { PrunaaiFastStrategy } from "./strategies/prunaai_fast_strategy";
import { GptImage1Strategy } from "./strategies/gpt_image1_strategy";
import { DallE3Strategy } from "./strategies/dall_e3_strategy";
import type { ModelKey } from "./model_registry";

export function getImageGenerationStrategy(
  model?: ModelKey
): ImageGenerationStrategy {
  switch (model) {
    case "prunaai-fast":
      return new PrunaaiFastStrategy();
    case "gpt-image-1":
      return new GptImage1Strategy();
    case "dall-e-3":
      return new DallE3Strategy();
    default:
      return new PrunaaiFastStrategy(); // Default strategy
  }
}
