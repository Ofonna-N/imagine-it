import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import ROUTE_PATHS from "~/constants/route_paths";
import type {
  PrintfulV2CreateOrderRequest,
  PrintfulV2CreateOrderResponse,
} from "~/types/printful/order_types";

/**
 * useMutatePrintfulOrder
 * Mutation hook for creating a Printful order after payment
 */
export const useMutatePrintfulOrder = (
  options?: UseMutationOptions<
    PrintfulV2CreateOrderResponse,
    Error,
    PrintfulV2CreateOrderRequest
  >
) => {
  return useMutation({
    mutationKey: ["printfulOrderCreate"],
    mutationFn: async (payload: PrintfulV2CreateOrderRequest) => {
      const res = await fetch(ROUTE_PATHS.API.PRINTFUL_ORDER_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    ...options,
  });
};
