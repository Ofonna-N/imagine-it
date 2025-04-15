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
  productId: string
): Promise<PrintfulV2BaseResponse<PrintfulV2MockupStyleGroup[]>> => {
  // Corrected return type
  if (!productId) {
    throw new Error("Product ID is required to fetch mockup styles.");
  }

  const apiUrl = API_ROUTES.MOCK_UP_STYLES(productId); // Use the constant for the API path
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
 * @param options Optional TanStack Query options.
 */
export const useQueryProductMockupStyles = (
  productId: string | undefined, // Allow undefined to disable the query initially
  options?: UseQueryOptions<
    PrintfulV2BaseResponse<PrintfulV2MockupStyleGroup[]>, // Corrected Query function result type
    Error, // Error type
    PrintfulV2MockupStyleGroup[], // Select function result type (the actual data array)
    (string | undefined)[] // Query key type
  >
) => {
  return useQuery({
    queryKey: ["productMockupStyles", productId],
    queryFn: () => {
      if (!productId) {
        // Should not happen if enabled is false, but good practice
        return Promise.reject(new Error("Product ID is required."));
      }
      return fetchProductMockupStyles(productId);
    },
    // Select the 'data' part from the API response
    select: (response) => response.data,
    // Disable the query if productId is not provided
    enabled: !!productId,
    staleTime: 1000 * 60 * 35, // Cache data for 35 minutes
    ...options,
  });
};
