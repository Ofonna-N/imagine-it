import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

/**
 * Mutation hook to update the quantity of a cart item
 *
 * PATCH /api/cart
 * Utility: Updates the quantity of a specific cart item for the authenticated user.
 */
export const useMutateUpdateCartItemQuantity = (
  options?: UseMutationOptions<any, Error, { itemId: number; quantity: number }>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cart", "updateItemQuantity"],
    mutationFn: async ({ itemId, quantity }) => {
      const res = await fetch(API_ROUTES.CART, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId, quantity }),
      });
      if (!res.ok) throw new Error("Failed to update cart item quantity");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
};
