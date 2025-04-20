import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type {
  PrintfulV2BaseResponse, // Corrected import
  PrintfulV2MockupStyleGroup,
} from "~/types/printful";
import { API_ROUTES } from "~/constants/route_paths"; // Assuming API_ROUTES is defined here

/**
 * Utility function to fetch mockup styles for a given product ID from the API proxy.
 */
const fetchProductMockupStyles = async (
  productId: string,
  placements?: string[]
): Promise<PrintfulV2BaseResponse<PrintfulV2MockupStyleGroup[]>> => {
  // Corrected return type
  if (!productId) {
    throw new Error("Product ID is required to fetch mockup styles.");
  }

  let apiUrl = API_ROUTES.MOCK_UP_STYLES(productId);
  if (placements && placements.length > 0) {
    const params = new URLSearchParams();
    params.append("placements", placements.join(","));
    apiUrl += `?${params.toString()}`;
  }
  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error ?? `Failed to fetch mockup styles: ${response.statusText}`
    );
  }

  return response.json();
};

/**
 * Custom hook to fetch Printful product mockup styles using TanStack Query.
 *
 * @param productId The ID of the Printful catalog product.
 * @param placements Optional array of placement identifiers to filter styles.
 * @param options Optional TanStack Query options.
 */
export const useQueryProductMockupStyles = (
  productId: string | undefined,
  placements?: string[],
  options?: Partial<
    UseQueryOptions<
      PrintfulV2BaseResponse<PrintfulV2MockupStyleGroup[]>,
      Error,
      PrintfulV2MockupStyleGroup[]
    >
  >
) => {
  return useQuery({
    queryKey: ["productMockupStyles", productId, placements],
    queryFn: () => {
      if (!productId) {
        return Promise.reject(new Error("Product ID is required."));
      }
      return fetchProductMockupStyles(productId, placements);
    },
    select: (response) => response.data,
    enabled: !!productId,
    staleTime: 1000 * 60 * 35,
    ...options,
  });
};
