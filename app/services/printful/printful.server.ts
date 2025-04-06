/**
 * Printful API service - server-side only
 */
import type {
  PrintfulCatalogResponse,
  PrintfulProductResponse,
  Product,
} from "../../types/printful";

// Helper function to transform a PrintfulSyncProduct to our app's Product type
function transformProduct(syncProduct: any): Product {
  return {
    ...syncProduct,
    isFeatured: false,
    price: syncProduct.retail_price || "0.00",
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

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.result || `Printful API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error("Printful API error:", error);
    throw error;
  }
}

/**
 * Fetches catalog products from Printful
 */
export async function fetchCatalogProducts() {
  if (!process.env.PRINTFUL_ACCESS_TOKEN) {
    throw new Error("PRINTFUL_ACCESS_TOKEN is required but not set");
  }

  return fetchFromPrintful<PrintfulCatalogResponse>("/store/products");
}

/**
 * Fetches a specific product by ID
 */
export async function fetchProductById(productId: string) {
  if (!process.env.PRINTFUL_ACCESS_TOKEN) {
    throw new Error("PRINTFUL_ACCESS_TOKEN is required but not set");
  }

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
  const response = await fetchCatalogProducts();

  // Convert to our app's product type and select a subset as featured
  const featured = response.result
    .filter((product) => product.thumbnail_url) // Only products with images
    .slice(0, limit)
    .map(transformProduct);

  return featured;
}
