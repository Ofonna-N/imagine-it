import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ROUTE_PATHS from "~/constants/route_paths";
import type {
  PaypalCaptureOrderRequest,
  PaypalCaptureOrderResponse,
} from "~/routes_api/api.paypal_capture_order";

/**
 * POST /api/paypal-capture-order
 * Utility: Mutation hook for capturing a PayPal order after approval.
 */
export const useMutatePaypalCaptureOrder = (
  options?: UseMutationOptions<
    PaypalCaptureOrderResponse,
    Error,
    PaypalCaptureOrderRequest
  >
) => {
  return useMutation({
    mutationKey: ["paypalCaptureOrder"],
    mutationFn: async (payload: PaypalCaptureOrderRequest) => {
      const res = await fetch(ROUTE_PATHS.API.PAYPAL_CAPTURE_ORDER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to capture PayPal order");
      return (await res.json()) as PaypalCaptureOrderResponse;
    },
    ...options,
  });
};
