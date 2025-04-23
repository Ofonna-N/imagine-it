import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { PrintfulV2OrderRecipient } from "~/types/printful";
import type { Recipient } from "~/db/schema/carts";

/**
 * Mutation hook to save or update recipient info
 */
export const useMutateRecipient = (
  options?: UseMutationOptions<
    Recipient,
    Error,
    { recipient: PrintfulV2OrderRecipient }
  >
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["recipient", "save"],
    mutationFn: async ({ recipient }) => {
      const res = await fetch(API_ROUTES.RECIPIENT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ recipient }),
      });
      if (!res.ok) throw new Error("Failed to save recipient info");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipient"] });
    },
    ...options,
  });
};
