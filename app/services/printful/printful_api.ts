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
 * Fetches featured products using the v2 API
 */
export async function fetchCatalogFeaturedProducts(
  limit: number = 6
): Promise<PrintfulV2CatalogProduct[]> {
  try {
    const response = await fetchCatalogProducts({
      limit: Math.max(limit * 2, 20),
    });

    // Make sure we have a valid response with data
    if (!response || !response.data) {
      console.error("Unexpected API response format:", response);
      throw new Error("Unexpected API response format");
    }

    const productsArray = response.data;

    // Ensure limit doesn't exceed array length
    const actualLimit = Math.min(limit, productsArray.length);

    // Create an array of featured products by selecting random indices
    const featured: PrintfulV2CatalogProduct[] = [];
    const usedIndices = new Set<number>();

    while (
      featured.length < actualLimit &&
      usedIndices.size < productsArray.length
    ) {
      const randomIndex = Math.floor(Math.random() * productsArray.length);

      // Avoid duplicates
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        featured.push(productsArray[randomIndex]);
      }
    }

    return featured;
  } catch (error) {
    console.error("Error fetching featured products from Printful:", error);
    throw error;
  }
}
