import { fetchCatalogFeaturedProducts } from "~/services/printful/printful_api";

/**
 * Resource route for featured products using Printful API
 * Returns proper Response objects with appropriate status codes
 */
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "6", 10);

    // Get featured products
    const featuredProducts = await fetchCatalogFeaturedProducts(limit);

    return new Response(JSON.stringify(featuredProducts), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in featured products loader:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || "Unknown error" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
