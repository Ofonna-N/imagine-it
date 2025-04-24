import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { CartItem } from "~/db/schema/carts";

/**
 * Query hook to fetch all cart items for the authenticated user
 */
export const useQueryCart = (options?: UseQueryOptions<CartItem[], Error>) => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.CART, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      return res.json();
    },
    ...options,
  });
};
