import { ImageGenerationModelType } from "~/services/replicate/replicate_models";

export type PRUNAAI_HIDREAM_L1_FAST_SCHEMA = {
  input: {
    prompt: string;
    seed?: number;
    model_type?: ImageGenerationModelType;
    speed_mode?:
      | "Unsqueezed 🍋 (highest quality)"
      | "Lightly Juiced 🍊 (more consistent)"
      | "Juiced 🔥 (more speed)"
      | "Extra Juiced 🚀 (even more speed)";
    resolution?:
      | "1024 × 1024 (Square)"
      | "768 × 1360 (Portrait)"
      | "1360 × 768 (Landscape)"
      | "880 × 1168 (Portrait)"
      | "1168 × 880 (Landscape)"
      | "1248 × 832 (Landscape)"
      | "832 × 1248 (Portrait)";
    output_format?: "png" | "jpg" | "webp";
    output_quality?: number;
  };
  output: string[];
};

export interface GenerateImageInput {
  /** Prompt */
  prompt: string;
  orientation?: "landscape" | "portrait" | "square";
}
