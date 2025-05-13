import type { ImageGenerationStrategy } from "../image_generation_strategy";
import type { GenerateImageInputPayload } from "../image_generation_types";
import openai from "~/services/openai/open_ai";
import { MODEL_REGISTRY } from "../model_registry";
import type { ImageGenerateParams } from "openai/resources/images.mjs";

export class GptImage1Strategy implements ImageGenerationStrategy {
  async generate(input: GenerateImageInputPayload): Promise<string[]> {
    //1024x1024, 1536x1024 (landscape), 1024x1536 (portrait), or auto
    let size: ImageGenerateParams["size"] = "auto";
    switch (input.orientation) {
      case "landscape":
        size = "1536x1024";
        break;
      case "portrait":
        size = "1024x1536";
        break;
      case "square":
        size = "1024x1024";
        break;
    }
    const result = await openai.images.generate({
      model: MODEL_REGISTRY["gpt-image-1"],
      prompt: input.prompt,
      size,
      quality: "medium",
      n: 1,
      output_format: input.transparent ? "png" : "jpeg",
      background: input.transparent ? "transparent" : "auto",
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
