import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { PrintfulCatalogProductsList } from "~/types/printful";

interface CatalogProductsParams {
  limit?: number;
  category?: string;
}

/**
 * Hook for fetching catalog products using TanStack Query
 *
 * @param params - Query parameters for filtering catalog products
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with data, loading state, error state, etc.
 */
const useQueryCatalogProducts = ({
  params = {},
  options,
}: {
  params?: CatalogProductsParams;
  options?: UseQueryOptions<
    PrintfulCatalogProductsList,
    Error,
    PrintfulCatalogProductsList,
    ["catalogProducts", CatalogProductsParams]
  >;
} = {}) => {
  const { limit = 20, category } = params;

  return useQuery({
    queryKey: ["catalogProducts", params],
    queryFn: async () => {
      let url = `api/catalog-products?limit=${limit}`;
      if (category) {
        url += `&category=${category}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch catalog products");
      }

      const data = await response.json();
      return data;
    },
    ...options,
  });
};

export default useQueryCatalogProducts;
