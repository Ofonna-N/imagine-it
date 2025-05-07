import type { ImageGenerationStrategy } from "../image_generation_strategy";
import type {
  GenerateImageInputPayload,
  PRUNAAI_HIDREAM_L1_FAST_SCHEMA,
} from "../image_generation_types";
import replicate from "~/services/replicate/replicate";
import { MODEL_REGISTRY } from "../model_registry";

export class PrunaaiFastStrategy implements ImageGenerationStrategy {
  async generate(input: GenerateImageInputPayload): Promise<string[]> {
    let resolution: PRUNAAI_HIDREAM_L1_FAST_SCHEMA["input"]["resolution"];
    switch (input.orientation) {
      case "landscape":
        resolution = "1360 × 768 (Landscape)";
        break;
      case "portrait":
        resolution = "768 × 1360 (Portrait)";
        break;
      default:
        resolution = "1024 × 1024 (Square)";
    }
    const seed = Math.floor(Math.random() * 20) + 1;
    const modelVersion = MODEL_REGISTRY["prunaai-fast"];
    const output = await replicate.run(modelVersion, {
      input: {
        prompt: input.prompt,
        seed,
        resolution,
        output_format: "jpg",
        speed_mode: "Juiced 🔥 (more speed)",
      },
    });
    const outputs = Array.isArray(output) ? output : [output];
    return outputs.map((file: any) => file.url());
  }
}
