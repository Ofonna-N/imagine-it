import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { PrintfulV2CatalogVariantPricesData } from "~/types/printful/catalog_variant_prices_types";

/**
 * Fetches pricing information for multiple catalog variants via the API proxy.
 */
async function fetchVariantsPrices(
  variantIds: string[]
): Promise<PrintfulV2CatalogVariantPricesData[]> {
  // Fetch all variant prices in parallel
  const results = await Promise.all(
    variantIds.map(async (variantId) => {
      const response = await fetch(
        API_ROUTES.CATALOG_VARIANT_PRICES(variantId)
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ??
            `Error fetching variant prices: ${response.statusText}`
        );
      }
      const json = await response.json();
      return json.data;
    })
  );
  return results;
}

/**
 * Custom hook to fetch prices for multiple variants using TanStack Query.
 *
 * @param variantIds Array of catalog variant IDs.
 * @param options Optional TanStack Query options.
 */
export const useQueryVariantsPrices = (
  variantIds: string[] | undefined,
  options?: UseQueryOptions<
    PrintfulV2CatalogVariantPricesData[],
    Error,
    PrintfulV2CatalogVariantPricesData[],
    ["variantPrices", string[]]
  >
) => {
  return useQuery({
    queryKey: ["variantPrices", variantIds ?? []],
    queryFn: () => {
      if (!variantIds || variantIds.length === 0) {
        return Promise.resolve([]);
      }
      return fetchVariantsPrices(variantIds);
    },
    enabled: !!variantIds && variantIds.length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};
