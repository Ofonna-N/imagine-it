// This file provides the mutation hook for clearing the cart.
import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

/**
 * Mutation hook to clear the cart
 *
 * @param options - TanStack Query mutation options
 * @returns useMutation hook for clearing the cart
 */
export const useMutateClearCart = (
  options?: UseMutationOptions<any, Error, void>
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["cart", "clear"],
    mutationFn: async () => {
      const res = await fetch(API_ROUTES.CART, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ clear: true }),
      });
      if (!res.ok) throw new Error("Failed to clear cart");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    ...options,
  });
};
