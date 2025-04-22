import replicate from "~/services/replicate/replicate";
import REPLICATE_MODELS from "~/services/replicate/replicate_models";
import type {
  GenerateImageInput,
  PRUNAAI_HIDREAM_L1_FAST_SCHEMA,
} from "~/features/design/types/image_generation";

/**
 * POST /api/generate-image
 * Resource route for AI image generation
 */
type GenerateImageResponse = PRUNAAI_HIDREAM_L1_FAST_SCHEMA["output"];
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

    const modelVersion = REPLICATE_MODELS.IMAGE_GENERATION[
      "prunaai/hidream-l1-fast"
    ] as `${string}/${string}` | `${string}/${string}:${string}`;

    // Determine resolution based on user-selected orientation
    const orientation = body.orientation ?? "square";
    let resolution: PRUNAAI_HIDREAM_L1_FAST_SCHEMA["input"]["resolution"];
    switch (orientation) {
      case "landscape":
        resolution = "1360 × 768 (Landscape)";
        break;
      case "portrait":
        resolution = "768 × 1360 (Portrait)";
        break;
      default:
        resolution = "1024 × 1024 (Square)";
    }

    // Call Replicate API to generate images with the selected orientation
    const output = await replicate.run(modelVersion, {
      input: {
        prompt: body.prompt,
        seed: 15,
        resolution,
        output_format: "png",
        speed_mode: "Lightly Juiced 🍊 (more consistent)",
      } as PRUNAAI_HIDREAM_L1_FAST_SCHEMA["input"],
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
