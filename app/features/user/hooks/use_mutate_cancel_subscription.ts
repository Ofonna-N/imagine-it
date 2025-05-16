import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { CancelSubscriptionResponse } from "~/routes_api/api.cancel_subscription";

/**
 * POST /api/cancel-subscription
 * Mutation hook to cancel the current user's subscription (downgrade to free).
 */
export function useMutateCancelSubscription(
  options?: UseMutationOptions<CancelSubscriptionResponse, Error, void>
) {
  return useMutation({
    mutationKey: ["cancelSubscription"],
    mutationFn: async () => {
      const response = await fetch(API_ROUTES.CANCEL_SUBSCRIPTION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error ?? "Failed to cancel subscription");
      }
      return response.json();
    },
    ...options,
  });
}
