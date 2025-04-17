import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { PrintfulV2CatalogVariantPricesData } from "~/types/printful";

/**
 * Fetches pricing information for a specific catalog variant via the API proxy.
 */
async function fetchVariantPrices(
  variantId: string
): Promise<PrintfulV2CatalogVariantPricesData> {
  const response = await fetch(API_ROUTES.CATALOG_VARIANT_PRICES(variantId));
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error ?? `Error fetching variant prices: ${response.statusText}`
    );
  }
  const json = await response.json();
  return json.data;
}

/**
 * Custom hook to fetch variant prices using TanStack Query.
 *
 * @param variantId The ID of the catalog variant.
 * @param options Optional TanStack Query options.
 */
export const useQueryVariantPrices = (
  variantId: string | undefined,
  options?: UseQueryOptions<
    PrintfulV2CatalogVariantPricesData,
    Error,
    PrintfulV2CatalogVariantPricesData,
    ["variantPrices", string]
  >
) => {
  return useQuery({
    queryKey: ["variantPrices", variantId ?? ""],
    queryFn: () => {
      if (!variantId) {
        return Promise.reject(
          new Error("Variant ID is required to fetch prices.")
        );
      }
      return fetchVariantPrices(variantId);
    },
    enabled: !!variantId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
