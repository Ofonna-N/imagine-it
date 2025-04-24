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
  options?: UseMutationOptions<
    any,
    Error,
    { itemId: number; quantity: number },
    { previous?: any[] }
  >
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
    // Optimistic update
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<any[]>(["cart"]);
      queryClient.setQueryData<any[]>(["cart"], (old = []) =>
        old.map((item) =>
          item.id === itemId
            ? { ...item, item_data: { ...item.item_data, quantity } }
            : item
        )
      );
      return { previous } as any;
    },
    onError: (err, variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["cart"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
};
