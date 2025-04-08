import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { PrintfulCatalogProductsList } from "~/types/printful";

interface FeaturedProductsParams {
  limit?: number;
}

/**
 * Hook for fetching featured products using TanStack Query
 *
 * @param params - Query parameters for filtering featured products
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with data, loading state, error state, etc.
 */
const useQueryFeaturedProducts = ({
  params = {},
  options,
}: {
  params?: FeaturedProductsParams;
  options?: UseQueryOptions<
    PrintfulCatalogProductsList,
    Error,
    PrintfulCatalogProductsList,
    ["featuredProducts", FeaturedProductsParams]
  >;
} = {}) => {
  const { limit = 8 } = params;

  return useQuery({
    queryKey: ["featuredProducts", params],
    queryFn: async () => {
      const response = await fetch(`api/products/featured?limit=${limit}`);
      const data = await response.json();
      return data;
    },
    ...options,
  });
};

export default useQueryFeaturedProducts;
