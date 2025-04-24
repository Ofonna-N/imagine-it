// This file provides the mutation hook for adding an item to the cart.
import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { PrintfulV2OrderItem } from "~/types/printful";
import type { CartItem } from "~/db/schema/carts";

/**
 * Mutation hook to add an item to the cart
 *
 * @param options - TanStack Query mutation options
 * @returns useMutation hook for adding a cart item
 */
export const useMutateAddCartItem = (
  options?: UseMutationOptions<
    CartItem,
    Error,
    { item: PrintfulV2OrderItem; mockupUrls?: string[]; designMeta?: any }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cart", "addItem"],
    mutationFn: async ({ item, mockupUrls, designMeta }) => {
      const res = await fetch(API_ROUTES.CART, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ item, mockupUrls, designMeta }),
      });
      if (!res.ok) throw new Error("Failed to add item to cart");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
};
