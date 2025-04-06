/**
 * Utility functions for interacting with the Printful API
 */

import type {
  PrintfulCatalogResponse,
  PrintfulProductResponse,
} from "~/types/printful";

const PRINTFUL_BASE_URL =
  process.env.PRINTFUL_BASE_URL || "https://api.printful.com";
const PRINTFUL_ACCESS_TOKEN = process.env.PRINTFUL_ACCESS_TOKEN;

/**
 * Creates headers for Printful API requests
 */
function getHeaders() {
  return {
    Authorization: `Bearer ${PRINTFUL_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

/**
 * Generic fetch function for Printful API
 * @param endpoint - API endpoint to call
 * @param options - Additional fetch options
 */
export async function fetchFromPrintful<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${PRINTFUL_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    // Extract error details from response if possible
    let errorMessage = `API error: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // If we can't parse the error response, use the default error message
    }
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetches catalog products from Printful
 */
export async function fetchCatalogProducts() {
  return fetchFromPrintful<PrintfulCatalogResponse>("/store/products");
}

/**
 * Fetches a specific product by ID
 */
export async function fetchProductById(productId: string) {
  return fetchFromPrintful<PrintfulProductResponse>(
    `/store/products/${productId}`
  );
}

/**
 * Fetches featured products
 * Currently using a simple approach of getting all products and filtering
 * Could be enhanced with specific criteria or using Printful's filtering
 */
export async function fetchFeaturedProducts(limit: number = 8) {
  const response = await fetchCatalogProducts();

  // Logic to determine featured products
  // For now, we'll simply take the first few available products
  const featured = response.result
    .filter((product) => product.thumbnail_url) // Only products with images
    .slice(0, limit);

  return featured;
}
