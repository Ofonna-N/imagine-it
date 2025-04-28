import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { PrintfulV2CatalogVariantAvailabilityResponse } from "~/types/printful/catalog_variant_availability_types";

interface UseQueryCatalogVariantsAvailabilityOptions {
  variantId: string | null;
  techniques?: string[];
  queryOptions?: Partial<
    UseQueryOptions<PrintfulV2CatalogVariantAvailabilityResponse, Error>
  >;
}

/**
 * Custom hook to fetch availability for a specific catalog variant
 */
export function useQueryCatalogVariantsAvailability({
  variantId,
  techniques = [],
  queryOptions = {},
}: UseQueryCatalogVariantsAvailabilityOptions) {
  return useQuery<PrintfulV2CatalogVariantAvailabilityResponse>({
    queryKey: [
      "catalogVariantAvailability",
      variantId ?? "",
      techniques.join(","),
    ],
    queryFn: async () => {
      if (!variantId) {
        throw new Error("Variant ID is required to fetch availability");
      }
      const url = new URL(
        API_ROUTES.CATALOG_VARIANT_AVAILABILITY(variantId),
        window.location.origin
      );
      if (techniques.length) {
        url.searchParams.set("techniques", techniques.join(","));
      }
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(
          `Error fetching variant availability: ${response.statusText}`
        );
      }
      return response.json();
    },
    enabled: !!variantId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
    ...(queryOptions ?? {}), // Spread the custom query options
  });
}

export default useQueryCatalogVariantsAvailability;
