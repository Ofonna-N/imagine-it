import type { GenerateImageInputPayload } from "~/services/image_generation/image_generation_types";
import { getImageGenerationStrategy } from "~/services/image_generation/image_generation_strategy_factory";
import createSupabaseServerClient from "~/services/supabase/supabase_client"; // For user auth
import {
  getUserProfileById,
  deductUserCredits,
} from "~/db/queries/user_profiles_queries"; // Import new queries
import type { ModelKey } from "~/services/image_generation/model_registry";
import { getAllFeatureFlags } from "~/config/feature_flags";

// Define credit costs per model
// 1 credit = $0.06 (example pricing)
// prunaai-fast (basic): $0.01 cost -> charge 2 credits ($0.04)
// gpt-image-1 (advanced): $0.063 cost -> charge 13 credits ($0.26)
// dall-e-3: $0.04 cost -> charge 8 credits ($0.16)
const MODEL_CREDIT_COSTS: Record<ModelKey, number> = {
  "prunaai-fast": 2,
  "gpt-image-1": 13,
  "dall-e-3": 8,
  "new-model": 1, // Placeholder, adjust as needed
};

/**
 * POST /api/generate-image
 * Resource route for AI image generation. Deducts credits from user.
 */
export async function action({ request }: { request: Request }) {
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }  try {
    const body = (await request.json()) as GenerateImageInputPayload;
    console.log("Received request body for image generation:", body);

    // ✅ SERVER-SIDE FEATURE FLAG VALIDATION
    const featureFlags = getAllFeatureFlags();
    if (!featureFlags.enableImageGeneration) {
      return new Response(
        JSON.stringify({ error: "Image generation is currently disabled" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (!body.prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Default to prunaai-fast if no model is specified, aligning with getImageGenerationStrategy
    const modelKey: ModelKey = body.model ?? "prunaai-fast";
    const creditsRequired = MODEL_CREDIT_COSTS[modelKey];

    if (creditsRequired === undefined) {
      console.error(`Credit cost not defined for model: ${modelKey}`);
      return new Response(
        JSON.stringify({
          error: "Invalid model selected or credit cost not defined.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userProfile = await getUserProfileById(user.id);
    if (!userProfile?.credits) {
      // Use optional chaining and check for falsy (0, null, undefined)
      // If credits can legitimately be 0 and that's a valid state for this check,
      // then a more specific check like (userProfile?.credits === null || userProfile?.credits === undefined) might be needed.
      // For now, assuming 0 credits means user can't proceed if creditsRequired > 0.
      return new Response(
        JSON.stringify({
          error: "User profile or credits not found/initialized",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (userProfile.credits < creditsRequired) {
      return new Response(
        JSON.stringify({
          error: "Insufficient credits.",
          message: `You need ${creditsRequired} credits for this model, but you only have ${userProfile.credits}. Please purchase more credits.`,
        }),
        {
          status: 402, // Payment Required
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Deduct credits BEFORE attempting generation for this basic implementation
    // In a more robust system, use a transaction or a two-phase commit.
    await deductUserCredits(user.id, creditsRequired);

    const imageGenerationService = getImageGenerationStrategy(modelKey);
    const images = await imageGenerationService.generate(body);

    return new Response(JSON.stringify({ images }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in image generation action:", error);
    // Note: If credit deduction succeeded but image generation failed,
    // you might want to implement a refund mechanism or log for manual review.
    const message =
      error instanceof Error
        ? error.message
        : "Unknown error during image generation";
    const status =
      error instanceof Error && error.message === "Insufficient credits."
        ? 402
        : 500;
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
