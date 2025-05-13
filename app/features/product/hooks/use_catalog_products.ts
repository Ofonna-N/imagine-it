import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { PrintfulV2CatalogProduct } from "~/types/printful/catalog_product_types";
import type { PrintfulPagination } from "~/types/printful/common_types";
import ROUTE_PATHS from "~/constants/route_paths";

interface CatalogProductsParams {
  limit?: number;
  offset?: number;
  categoryIds?: string; // Changed from category to categoryIds (string)
  search?: string;
}

interface CatalogProductsResponse {
  products: PrintfulV2CatalogProduct[];
  paging: PrintfulPagination;
}

/**
 * Hook for fetching catalog products using TanStack Query
 *
 * @param params - Query parameters for filtering and paginating catalog products
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with data, loading state, error state, etc.
 */
const useQueryCatalogProducts = ({
  params = {},
  options,
}: {
  params?: CatalogProductsParams;
  options?: Partial<
    UseQueryOptions<
      CatalogProductsResponse,
      Error,
      CatalogProductsResponse,
      ["catalogProducts", CatalogProductsParams]
    >
  >;
} = {}) => {
  const { limit = 20, offset = 0, categoryIds, search } = params; // Changed variable name

  return useQuery({
    queryKey: ["catalogProducts", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit.toString());
      queryParams.append("offset", offset.toString());
      if (categoryIds) queryParams.append("category_ids", categoryIds); // Changed parameter name
      if (search) queryParams.append("search", search);

      const response = await fetch(
        `${ROUTE_PATHS.API.CATALOG_PRODUCTS}?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Assuming the API route returns the full response including 'data' and 'paging'
      return {
        products: data.data,
        paging: data.paging,
      };
    },
    ...options,
    staleTime: 45 * 60 * 1000, // 5 minutes
  });
};

export default useQueryCatalogProducts;
