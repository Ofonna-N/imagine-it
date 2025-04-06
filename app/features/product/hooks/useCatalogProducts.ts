import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
  PrintfulCatalogProductsList,
  PrintfulPagination,
} from "~/types/printful";

interface CatalogProductsParams {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
}

interface CatalogProductsResponse {
  products: PrintfulCatalogProductsList;
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
  options?: UseQueryOptions<
    CatalogProductsResponse,
    Error,
    CatalogProductsResponse,
    ["catalogProducts", CatalogProductsParams]
  >;
} = {}) => {
  const { limit = 20, offset = 0, category, search } = params;

  return useQuery({
    queryKey: ["catalogProducts", params],
    queryFn: async () => {
      // Build the URL with all parameters
      const queryParams = new URLSearchParams();
      queryParams.append("limit", limit.toString());
      queryParams.append("offset", offset.toString());
      if (category) queryParams.append("category", category);
      if (search) queryParams.append("search", search);

      const url = `api/catalog-products?${queryParams.toString()}`;

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
