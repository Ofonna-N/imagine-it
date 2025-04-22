import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { DesignRecord } from "~/db/schema/designs";

/**
 * Type representing a user's design record
 */
export type UserDesign = DesignRecord;

/**
 * Hook for fetching the authenticated user's saved designs
 *
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with user's designs data
 */
export function useQueryUserDesigns(
  options?: Partial<
    UseQueryOptions<UserDesign[], Error, UserDesign[], ["designs", "user"]>
  >
) {
  return useQuery({
    queryKey: ["designs", "user"],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.DESIGNS, { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch designs");
      }
      const json = await res.json();
      return json.designs as UserDesign[];
    },
    ...options,
  });
}
