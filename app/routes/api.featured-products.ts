import { fetchFeaturedProducts } from "../services/printful/printful.server";
import { getFeaturedProducts } from "../features/product/api/mockData";

/**
 * Resource route for featured products
 * Returns proper Response objects with appropriate status codes
 */
export async function loader() {
  try {
    // Try to fetch from Printful API
    const featuredProducts = await fetchFeaturedProducts(8);

    return new Response(
      JSON.stringify({
        products: featuredProducts,
        source: "printful",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching featured products from Printful:", error);

    // Fall back to mock data if API fails
    const mockProducts = getFeaturedProducts();

    return new Response(
      JSON.stringify({
        products: mockProducts,
        source: "mock",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 200, // Still returning 200 since we're providing fallback data
        headers: {
          "Content-Type": "application/json",
          "X-Data-Source": "mock",
        },
      }
    );
  }
}
