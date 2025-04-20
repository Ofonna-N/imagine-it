import { fetchCatalogCategories } from "~/services/printful/printful_api";

/**
 * Resource route for fetching all catalog categories
 * Returns proper Response objects with appropriate status codes
 */
export async function loader() {
  try {
    const categoriesResponse = await fetchCatalogCategories();

    return new Response(JSON.stringify(categoriesResponse.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        // Add caching headers if desired
        // "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error in catalog categories loader:", error);
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
