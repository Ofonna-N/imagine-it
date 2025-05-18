import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";
import type { PrintfulV2ProductAvailabilityResponse } from "~/types/printful/catalog_product_types";

// Legacy types kept for backward compatibility with existing code
export interface ProductAvailabilityRegion {
  id: string;
  name: string;
  available: boolean;
  delivery_time?: {
    min: number;
    max: number;
    unit: string;
  };
  restrictions?: string[];
}

export interface ProductAvailabilityResponse {
  product_id: string;
  regions: ProductAvailabilityRegion[];
  updated_at: string;
}

/**
 * Custom hook to fetch product availability information by product ID
 * @param productId - The ID of the product to fetch availability for
 * @returns Query result object containing availability data, loading state, and error state
 */
export function useQueryProductAvailability(productId: string | null) {
  return useQuery<PrintfulV2ProductAvailabilityResponse>({
    queryKey: ["productAvailability", productId],
    queryFn: async () => {
      if (!productId) {
        throw new Error("Product ID is required to fetch availability");
      }

      const response = await fetch(
        API_ROUTES.CATALOG_PRODUCT_AVAILABILITY(productId)
      );

      if (!response.ok) {
        throw new Error(
          `Error fetching product availability: ${response.statusText}`
        );
      }

      return response.json();
    },
    enabled: !!productId, // Only run the query if we have a product ID
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once if the request fails
  });
}

// Export the hook as default for backward compatibility
export default useQueryProductAvailability;
