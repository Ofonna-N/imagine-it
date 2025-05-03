/**
 * Server-only utility functions for interacting with the Printful API v2
 */

import type { PrintfulV2MockupStylesResponse } from "~/types/printful/catalog_mockup_styles_types";
import type { PrintfulV2CatalogProductPricesResponse } from "~/types/printful/catalog_product_prices_types";
import type {
  PrintfulV2CatalogProduct,
  PrintfulV2CatalogProductResponse,
  PrintfulV2CatalogProductsResponse,
  PrintfulV2CatalogVariantsResponse,
  PrintfulV2CategoriesResponse,
  PrintfulV2ProductAvailabilityResponse,
} from "~/types/printful/catalog_product_types";
import type { PrintfulV2CatalogVariantAvailabilityResponse } from "~/types/printful/catalog_variant_availability_types";
import type { PrintfulV2CatalogVariantPricesResponse } from "~/types/printful/catalog_variant_prices_types";
import type {
  PrintfulV2ShippingRatesRequest,
  PrintfulV2ShippingRatesResponse,
} from "~/types/printful/shipping_rates_types";
import type {
  PrintfulV2CreateOrderRequest,
  PrintfulV2CreateOrderResponse,
} from "~/types/printful/order_types";

/**
 * Creates headers for Printful API requests
 */
function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.PRINTFUL_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
    // Include language header for localized responses
    "X-PF-Language": "en_US",
  };
}

/**
 * Generic fetch function for Printful API v2
 */
export async function fetchFromPrintful<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${
    process.env.PRINTFUL_BASE_URL || "https://api.printful.com"
  }${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = `Printful API error: ${response.status}`;
    try {
      const errorData = await response.json();
      // Replace logical OR with nullish coalescing for error message
      errorMessage = errorData.error?.message ?? errorMessage;
    } catch (e) {
      // If we can't parse the error response, use the default error message
      console.error("Failed to parse error response:", e);
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches catalog products from Printful API v2
 */
export async function fetchCatalogProducts(params?: {
  categoryIds?: string; // Changed from categoryId to categoryIds (string)
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { categoryIds, limit = 20, offset = 0, search } = params || {}; // Changed variable name

  // Build query string
  const queryParams = new URLSearchParams();
  if (categoryIds) queryParams.append("category_ids", categoryIds); // Changed parameter name
  if (limit) queryParams.append("limit", limit.toString());
  if (offset) queryParams.append("offset", offset.toString());
  if (search) queryParams.append("search", search);

  const queryString = queryParams.toString();
  const endpoint = `/v2/catalog-products${
    queryString ? `?${queryString}` : ""
  }`;

  return fetchFromPrintful<PrintfulV2CatalogProductsResponse>(endpoint);
}

/**
 * Fetches a specific product by ID using API v2
 */
export async function fetchCatalogProductById(productId: string) {
  return fetchFromPrintful<PrintfulV2CatalogProductResponse>(
    `/v2/catalog-products/${productId}`
  );
}

/**
 * Fetches variants for a specific product using API v2
 */
export async function fetchCatalogVariantsByProductId(productId: string) {
  return fetchFromPrintful<PrintfulV2CatalogVariantsResponse>(
    `/v2/catalog-products/${productId}/catalog-variants`
  );
}

/**
 * Fetches availability information for a specific product using API v2
 */
export async function fetchProductAvailability(productId: string) {
  return fetchFromPrintful<PrintfulV2ProductAvailabilityResponse>(
    `/v2/catalog-products/${productId}/availability`
  );
}

/**
 * Fetches catalog categories from Printful API v2
 */
export async function fetchCatalogCategories() {
  return fetchFromPrintful<PrintfulV2CategoriesResponse>(
    `/v2/catalog-categories`
  );
}

/**
 * Fetches featured products using the v2 API with random pagination
 */
export async function fetchCatalogFeaturedProducts(
  limit: number = 6
): Promise<PrintfulV2CatalogProduct[]> {
  try {
    // First, get the total count of products without fetching all products
    const countResponse = await fetchCatalogProducts({
      limit: 1, // Just need minimal data to get total count
    });

    // Make sure we have a valid response with paging data - Use optional chaining
    if (!countResponse?.paging) {
      console.error("Unexpected API response format:", countResponse);
      throw new Error("Unexpected API response format");
    }

    const totalProducts = countResponse.paging.total;

    // If there are fewer products than the limit, just return them all
    if (totalProducts <= limit) {
      const response = await fetchCatalogProducts({
        limit: totalProducts,
      });
      return response.data;
    }

    // Generate a random offset to get a random page of products
    // Ensure we don't go beyond available products considering our limit
    const maxOffset = totalProducts - limit;
    const randomOffset = Math.floor(Math.random() * maxOffset);

    // Fetch random products using pagination
    const response = await fetchCatalogProducts({
      limit,
      offset: randomOffset,
    });

    // Return the randomly offset products
    return response.data;
  } catch (error) {
    console.error("Error fetching featured products from Printful:", error);
    throw error;
  }
}

/**
 * Fetches a mockup task by ID from Printful API v2
 */
export async function fetchPrintfulMockupTask(id: string) {
  return fetchFromPrintful<any>(`/v2/mockup-tasks?id=${id}`);
}

/**
 * Creates a new mockup task via Printful API v2
 */
export async function createPrintfulMockupTask(body: any) {
  return fetchFromPrintful<any>(`/v2/mockup-tasks`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * Fetches mockup styles for a specific catalog product from Printful API v2
 * Supports filtering by placements via query parameter.
 *
 * @param productId The catalog product ID
 * @param placements Optional array of placement identifiers to filter styles
 */
export async function fetchCatalogProductMockupStyles(
  productId: string,
  placements?: string[]
) {
  // Build endpoint with optional placements filter
  let endpoint = `/v2/catalog-products/${productId}/mockup-styles`;
  if (placements && placements.length > 0) {
    const params = new URLSearchParams();
    params.append("placements", placements.join(","));
    endpoint += `?${params.toString()}`;
  }
  return fetchFromPrintful<PrintfulV2MockupStylesResponse>(endpoint);
}

/**
 * GET /v2/catalog-products/{id}/prices
 * Utility: Fetches catalog product pricing information.
 */
export async function fetchCatalogProductPrices(productId: string) {
  return fetchFromPrintful<PrintfulV2CatalogProductPricesResponse>(
    `/v2/catalog-products/${productId}/prices`
  );
}

/**
 * GET /v2/catalog-variants/{id}/prices
 * Utility: Fetches pricing information for a specific catalog variant.
 */
export async function fetchCatalogVariantPrices(
  variantId: string
): Promise<PrintfulV2CatalogVariantPricesResponse> {
  return fetchFromPrintful<PrintfulV2CatalogVariantPricesResponse>(
    `/v2/catalog-variants/${variantId}/prices`
  );
}

/**
 * GET /v2/catalog-variants/{id}/availability
 * Utility: Fetches availability information for a specific catalog variant.
 */
export async function fetchCatalogVariantAvailability(
  variantId: string,
  techniques?: string[]
): Promise<PrintfulV2CatalogVariantAvailabilityResponse> {
  let endpoint = `/v2/catalog-variants/${variantId}/availability`;
  if (techniques && techniques.length > 0) {
    const params = new URLSearchParams();
    params.append("techniques", techniques.join(","));
    endpoint += `?${params.toString()}`;
  }
  return fetchFromPrintful<PrintfulV2CatalogVariantAvailabilityResponse>(
    endpoint
  );
}

/**
 * POST /v2/shipping-rates
 * Utility: Fetches available shipping rates for a set of order items and recipient.
 *
 * @param payload - The request payload for shipping rates
 * @returns The shipping rates response from Printful
 */
export async function fetchPrintfulShippingRates(
  payload: PrintfulV2ShippingRatesRequest
): Promise<PrintfulV2ShippingRatesResponse> {
  return fetchFromPrintful<PrintfulV2ShippingRatesResponse>(
    "/v2/shipping-rates",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/**
 * POST /v2/orders
 * Utility: Creates a new Printful order.
 * @param body - The request payload for creating a Printful order
 * @returns The Printful order creation response
 */
export async function createPrintfulOrder(
  body: PrintfulV2CreateOrderRequest
): Promise<PrintfulV2CreateOrderResponse> {
  return fetchFromPrintful<PrintfulV2CreateOrderResponse>("/v2/orders", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
