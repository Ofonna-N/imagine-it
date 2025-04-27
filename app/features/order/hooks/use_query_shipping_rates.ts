import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type {
  PrintfulV2ShippingRatesRequest,
  PrintfulV2ShippingRatesResponse,
  PrintfulV2ShippingRatesErrorResponse400,
  PrintfulV2ShippingRatesErrorResponse5xx,
} from "~/types/printful/shipping_rates_types";

/**
 * Custom hook to fetch shipping rates using TanStack Query.
 *
 * @param options Optional TanStack Query mutation options.
 * @returns Mutation object for requesting shipping rates.
 */
export const useQueryShippingRates = (
  options?: UseMutationOptions<
    PrintfulV2ShippingRatesResponse,
    | PrintfulV2ShippingRatesErrorResponse400
    | PrintfulV2ShippingRatesErrorResponse5xx
    | Error,
    PrintfulV2ShippingRatesRequest,
    ["shippingRates"]
  >
) => {
  return useMutation({
    mutationKey: ["shippingRates"],
    mutationFn: async (payload: PrintfulV2ShippingRatesRequest) => {
      const response = await fetch(API_ROUTES.SHIPPING_RATES, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }
      return response.json();
    },
    ...options,
  });
};
