import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

/**
 * Type representing a user's design record
 */
export type UserDesign = {
  id: string;
  name: string;
  image_url: string;
  preview_url?: string;
  canvas_data?: string;
  product_id?: string;
  created_at: string;
};

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
