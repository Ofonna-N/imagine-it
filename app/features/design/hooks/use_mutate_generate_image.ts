import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ROUTE_PATHS from "~/constants/route_paths";
import type { GenerateImageInputPayload } from "../../../services/image_generation/image_generation_types";

export type GenerateImageResponse = { images: string[] };

/**
 * POST /api/generate-image
 * Utility: Mutation hook to generate AI images based on a text prompt.
 */
export function useMutateGenerateImage(
  options?: UseMutationOptions<
    GenerateImageResponse,
    Error,
    GenerateImageInputPayload
  >
) {
  return useMutation({
    mutationKey: ["generateImage"], // Adding a mutation key for identification
    mutationFn: async (payload) => {
      const response = await fetch(ROUTE_PATHS.GENERATE_IMAGE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to generate images");
      }
      return response.json();
    },
    ...options,
  });
}
