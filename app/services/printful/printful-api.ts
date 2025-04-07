/**
 * Server-only utility functions for interacting with the Printful API
 */

import type {
  PrintfulCatalogProductResponse,
  PrintfulCatalogProductsResponse,
  PrintfulCatalogProductsList,
} from "../../types/printful";

/**
 * Creates headers for Printful API requests
 */
function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.PRINTFUL_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

/**
 * Generic fetch function for Printful API
 */
export async function fetchFromPrintful<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${process.env.PRINTFUL_BASE_URL}${endpoint}`;
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
      errorMessage = errorData.result || errorMessage;
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
export async function fetchCatalogProducts(params?: { categoryId?: string }) {
  const { categoryId } = params || {};

  // Build query string - only categoryId is supported by Printful API
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append("category_id", categoryId);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `/products?${queryString}` : "/products";

  return fetchFromPrintful<PrintfulCatalogProductsResponse>(endpoint);
}

/**
 * Fetches a specific product by ID
 */
export async function fetchCatalogProductById(productId: string) {
  return fetchFromPrintful<PrintfulCatalogProductResponse>(
    `/products/${productId}`
  );
}

/**
 * Fetches featured products
 */
export async function fetchCatalogFeaturedProducts(
  limit: number = 6
): Promise<PrintfulCatalogProductsList> {
  try {
    const response = await fetchCatalogProducts();

    // Make sure we have a valid response with results
    if (!response) {
      console.error("Unexpected API response format:", response);
      throw new Error("Unexpected API response format");
    }

    // The result field contains the array of products directly
    const productsArray = response.result;

    // Ensure limit doesn't exceed array length
    const actualLimit = Math.min(limit, productsArray.length);

    // Create an array of featured products by selecting random indices
    const featured = [];
    const usedIndices = new Set<number>();

    while (featured.length < actualLimit) {
      const randomIndex = Math.floor(Math.random() * productsArray.length);

      // Avoid duplicates
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        featured.push(productsArray[randomIndex]);
      }
    }

    return featured;
  } catch (error) {
    console.error("Error fetching from Printful:", error);
    throw error;
  }
}
