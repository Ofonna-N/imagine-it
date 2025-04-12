import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { PrintfulV2Category } from "~/types/printful";

/**
 * Hook for fetching catalog categories using TanStack Query
 *
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with data, loading state, error state, etc.
 */
const useQueryCatalogCategories = (
  options?: Partial<
    UseQueryOptions<
      PrintfulV2Category[],
      Error,
      PrintfulV2Category[],
      ["catalogCategories"]
    >
  >
) => {
  return useQuery({
    queryKey: ["catalogCategories"],
    queryFn: async () => {
      const response = await fetch("/api/catalog-categories");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch categories");
      }
      const data: PrintfulV2Category[] = await response.json();
      return data;
    },
    staleTime: 60 * 60 * 1000, // Cache categories for 1 hour
    ...options,
  });
};

export default useQueryCatalogCategories;
