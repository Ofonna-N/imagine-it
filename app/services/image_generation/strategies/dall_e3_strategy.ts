import type { ImageGenerationStrategy } from "../image_generation_strategy";
import type { GenerateImageInputPayload } from "../image_generation_types";
import openai from "~/services/openai/open_ai";
import { MODEL_REGISTRY } from "../model_registry";
import type { ImageGenerateParams } from "openai/resources/images.mjs";

export class DallE3Strategy implements ImageGenerationStrategy {
  async generate(input: GenerateImageInputPayload): Promise<string[]> {
    //one of 1024x1024, 1792x1024, or 1024x1792 for dall-e-3
    let size: ImageGenerateParams["size"] = "1024x1024";
    switch (input.orientation) {
      case "landscape":
        size = "1792x1024";
        break;
      case "portrait":
        size = "1024x1792";
        break;
    }

    const result = await openai.images.generate({
      model: MODEL_REGISTRY["dall-e-3"],
      prompt: input.prompt,
      size,
      quality: "standard",
      n: 1,
    });
    return (
      result?.data?.map((img) => {
        if (img.b64_json) {
          return `data:image/jpeg;base64,${img.b64_json}`;
        } else if (img.url) {
          return img.url;
        }
        return "";
      }) ?? []
    );
  }
}
