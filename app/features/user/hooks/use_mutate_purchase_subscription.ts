import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type {
  PurchaseSubscriptionRequest,
  PurchaseSubscriptionResponse,
} from "~/routes_api/api.purchase_subscription";

/**
 * POST /api/purchase-subscription
 * Mutation hook to purchase a subscription plan for the current user.
 */
export function useMutatePurchaseSubscription(
  options?: UseMutationOptions<
    PurchaseSubscriptionResponse,
    Error,
    PurchaseSubscriptionRequest
  >
) {
  return useMutation({
    mutationKey: ["purchaseSubscription"],
    mutationFn: async (payload) => {
      const response = await fetch(API_ROUTES.PURCHASE_SUBSCRIPTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to purchase subscription");
      }
      return response.json();
    },
    ...options,
  });
}
