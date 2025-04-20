import { ImageGenerationModelType } from "~/services/replicate/replicate_models";

/**
 * POST /api/generate-image
 * Input schema for AI image generation
 */
/**
 * POST /api/generate-image
 * Input schema for AI image generation
 */
export interface GenerateImageInput {
  /** Prompt */
  prompt: string;
  /** Random seed (-1 for random) */
  seed?: number;
  /** Model type */
  model_type?: "fast";
  /** Speed optimization level */
  speed_mode?:
    | "Unsqueezed 🍋 (highest quality)"
    | "Lightly Juiced 🍊 (more consistent)"
    | "Juiced 🔥 (more speed)"
    | "Extra Juiced 🚀 (even more speed)";
  /** Output resolution */
  resolution?:
    | "1024 × 1024 (Square)"
    | "768 × 1360 (Portrait)"
    | "1360 × 768 (Landscape)"
    | "880 × 1168 (Portrait)"
    | "1168 × 880 (Landscape)"
    | "1248 × 832 (Landscape)"
    | "832 × 1248 (Portrait)";
  /** Output format */
  output_format?: "png" | "jpg" | "webp";
  /** Output quality (for jpg and webp) */
  output_quality?: number;
}

/**
 * Output schema for AI image generation
 * Returns a URI of the generated image
 */
export type GenerateImageOutput = string;
