/**
 * Server-only utility functions for interacting with the Printful API
 */

import type {
  PrintfulCatalogResponse,
  PrintfulProductResponse,
  Product,
} from "../types/printful";

// Helper function to transform a PrintfulSyncProduct to our app's Product type
function transformProduct(syncProduct: any): Product {
  return {
    ...syncProduct,
    isFeatured: false, // We could set this based on certain criteria
    price: syncProduct.retail_price || "0.00", // This would be set from variants ideally
  };
}

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
 */
export async function fetchFeaturedProducts(
  limit: number = 8
): Promise<Product[]> {
  try {
    const response = await fetchCatalogProducts();

    // Convert to our app's product type and select a subset as featured
    const featured = response.result
      .filter((product) => product.thumbnail_url) // Only products with images
      .slice(0, limit)
      .map(transformProduct);

    return featured;
  } catch (error) {
    console.error("Error fetching from Printful:", error);
    throw error;
  }
}
