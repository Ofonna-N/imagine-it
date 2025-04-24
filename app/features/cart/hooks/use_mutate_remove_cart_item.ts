// This file provides the mutation hook for removing an item from the cart.
import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

/**
 * Mutation hook to remove an item from the cart
 *
 * @param options - TanStack Query mutation options
 * @returns useMutation hook for removing a cart item
 */
export const useMutateRemoveCartItem = (
  options?: UseMutationOptions<any, Error, { itemId: number }>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cart", "removeItem"],
    mutationFn: async ({ itemId }) => {
      const res = await fetch(API_ROUTES.CART, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId }),
      });
      if (!res.ok) throw new Error("Failed to remove item from cart");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
};
