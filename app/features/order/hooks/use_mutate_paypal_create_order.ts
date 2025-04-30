import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ROUTE_PATHS from "~/constants/route_paths";
import type {
  PaypalCreateOrderRequest,
  PaypalCreateOrderResponse,
} from "~/routes_api/api.paypal_create_order";

/**
 * POST /api/paypal-create-order
 * Utility: Mutation hook for creating a PayPal order with shipping info and cart items.
 */
export const useMutatePaypalCreateOrder = (
  options?: UseMutationOptions<
    PaypalCreateOrderResponse,
    Error,
    PaypalCreateOrderRequest
  >
) => {
  return useMutation({
    mutationKey: ["paypalCreateOrder"],
    mutationFn: async (payload: PaypalCreateOrderRequest) => {
      const res = await fetch(ROUTE_PATHS.API.PAYPAL_CREATE_ORDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create PayPal order");
      return (await res.json()) as PaypalCreateOrderResponse;
    },
    ...options,
  });
};
