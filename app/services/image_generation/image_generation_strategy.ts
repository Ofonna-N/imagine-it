import type { GenerateImageInputPayload } from "./image_generation_types";

export interface ImageGenerationStrategy {
  generate(input: GenerateImageInputPayload): Promise<string[]>;
}
