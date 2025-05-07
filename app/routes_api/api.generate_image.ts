import type { GenerateImageInputPayload } from "~/services/image_generation/image_generation_types";
import { getImageGenerationStrategy } from "~/services/image_generation/image_generation_strategy_factory";

/**
 * POST /api/generate-image
 * Resource route for AI image generation
 */

export async function action({ request }: { request: Request }) {
  try {
    const body = (await request.json()) as GenerateImageInputPayload;
    console.log("Received request body:", body);
    if (!body.prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const model = getImageGenerationStrategy(body.model);
    const images = await model.generate(body);

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
