import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { Recipient } from "~/db/schema/carts";

/**
 * Query hook to fetch recipient info for the authenticated user
 */
export const useQueryRecipient = (
  options?: UseQueryOptions<Recipient | null, Error>
) => {
  return useQuery({
    queryKey: ["recipient"],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.RECIPIENT, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recipient info");
      return res.json();
    },
    ...options,
  });
};
