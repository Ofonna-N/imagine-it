import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type {
  PurchaseCreditsRequest,
  PurchaseCreditsResponse,
} from "~/routes_api/api.purchase_credits";

/**
 * POST /api/purchase-credits
 * Mutation hook to purchase credits for the current user.
 */
export function useMutatePurchaseCredits(
  options?: UseMutationOptions<
    PurchaseCreditsResponse,
    Error,
    PurchaseCreditsRequest
  >
) {
  return useMutation({
    mutationKey: ["purchaseCredits"],
    mutationFn: async (payload) => {
      const response = await fetch(API_ROUTES.PURCHASE_CREDITS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to purchase credits");
      }
      return response.json();
    },
    ...options,
  });
}
