/**
 * Server-only utility functions for interacting with the Printful API v2
 */

import type {
  PrintfulV2CatalogProductResponse,
  PrintfulV2CatalogProductsResponse,
  PrintfulV2CatalogProduct,
  PrintfulV2CatalogVariantsResponse,
} from "../../types/printful";

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
      errorMessage = errorData.error?.message || errorMessage;
    } catch (e) {
      // If we can't parse the error response, use the default error message
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches catalog products from Printful API v2
 */
export async function fetchCatalogProducts(params?: {
  categoryId?: string;
  limit?: number;
  offset?: number;
  search?: string;
}) {
  const { categoryId, limit = 20, offset = 0, search } = params || {};

  // Build query string
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append("category_ids", categoryId);
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

    // Make sure we have a valid response with paging data
    if (!countResponse || !countResponse.paging) {
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
