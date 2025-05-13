import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type {
  PrintfulV2CatalogProductPricesData,
  PrintfulV2CatalogProductPricesResponse,
} from "~/types/printful/catalog_product_prices_types";

/**
 * Fetch pricing information for a specific catalog product via the API proxy.
 */
async function fetchProductPrices(
  productId: string
): Promise<PrintfulV2CatalogProductPricesResponse> {
  const response = await fetch(API_ROUTES.CATALOG_PRODUCT_PRICES(productId));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error ?? `Error fetching prices: ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * Custom hook to fetch catalog product prices using TanStack Query.
 *
 * @param productId The ID of the catalog product.
 * @param options Optional TanStack Query options.
 */
export const useQueryProductPrices = (
  productId: string | undefined,
  options?: UseQueryOptions<
    PrintfulV2CatalogProductPricesData,
    Error,
    PrintfulV2CatalogProductPricesData,
    ["productPrices", string]
  >
) => {
  return useQuery({
    queryKey: ["productPrices", productId ?? ""],
    queryFn: async () => {
      if (!productId) {
        return Promise.reject(
          new Error("Product ID is required to fetch prices.")
        );
      }
      return fetchProductPrices(productId).then((res) => res.data);
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...options,
  });
};
