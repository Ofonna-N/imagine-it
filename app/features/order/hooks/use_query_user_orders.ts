import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import ROUTE_PATHS from "~/constants/route_paths";
import type { PrintfulV2GetOrderResponse } from "~/types/printful/order_types";

/**
 * useQueryUserOrders
 * Query hook for fetching all Printful orders for the current user
 *
 * @param options - Optional TanStack Query options
 * @returns TanStack Query result containing an array of Printful order details
 */
export const useQueryUserOrders = (
  options?: Partial<
    UseQueryOptions<
      { orders: PrintfulV2GetOrderResponse["data"][] },
      Error,
      { orders: PrintfulV2GetOrderResponse["data"][] },
      ["userOrders"]
    >
  >
) => {
  return useQuery({
    queryKey: ["userOrders"],
    queryFn: async () => {
      const res = await fetch(ROUTE_PATHS.API.USER_ORDERS);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    ...options,
  });
};
