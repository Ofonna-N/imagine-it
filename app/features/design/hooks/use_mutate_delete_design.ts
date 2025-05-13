import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

/**
 * DELETE /api/designs
 * Utility: Mutation hook for deleting a user design
 */
export interface DeleteDesignPayload {
  designId: string;
  imageUrl?: string;
}

export interface DeleteDesignResponse {
  success: boolean;
  deleteError?: string | null;
}

export function useMutateDeleteDesign(
  options?: UseMutationOptions<
    DeleteDesignResponse,
    Error,
    DeleteDesignPayload,
    ["delete_design", DeleteDesignPayload]
  >
) {
  return useMutation({
    mutationKey: ["delete_design"],
    mutationFn: async (payload: DeleteDesignPayload) => {
      const res = await fetch(API_ROUTES.DESIGNS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error ?? "Failed to delete design");
      }
      return res.json() as Promise<DeleteDesignResponse>;
    },
    ...options,
  });
}
