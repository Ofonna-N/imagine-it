import replicate from "~/services/replicate/replicate";
import REPLICATE_MODELS, {
  ImageGenerationModelType,
} from "~/services/replicate/replicate_models";
import type {
  GenerateImageInput,
  GenerateImageOutput,
} from "~/features/design/types/image_generation";

/**
 * POST /api/generate-image
 * Resource route for AI image generation
 */
export async function action({ request }: { request: Request }) {
  try {
    const body = (await request.json()) as GenerateImageInput;

    console.log("Received request body:", body);
    if (!body.prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Determine model version (fallback to our default model identifier)
    const modelType =
      (body.model_type as ImageGenerationModelType) ??
      ImageGenerationModelType.PRUNAAI_HIDREAM_L1_FAST;
    const modelVersion = REPLICATE_MODELS.IMAGE_GENERATION[modelType] as
      | `${string}/${string}`
      | `${string}/${string}:${string}`;

    // Call Replicate API to generate images using the correct signature
    const output = await replicate.run(modelVersion, {
      input: {
        prompt: body.prompt,
        seed: body.seed ?? -1,
        model_type: body.model_type,
        speed_mode: body.speed_mode,
        resolution: body.resolution ?? "1024 × 1024 (Square)",
        output_format: body.output_format,
        output_quality: body.output_quality,
      },
    });

    // Extract image URIs from the Replicate output
    const outputs = Array.isArray(output) ? output : [output];
    const images = outputs.map((file: any) => file.url());

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating image:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
