import { fetchCatalogProducts } from "~/services/printful/printful-api";

/**
 * Resource route for catalog products
 * Returns proper Response objects with appropriate status codes
 */
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
    const category = url.searchParams.get("category") ?? null;

    // Get all catalog products
    const response = await fetchCatalogProducts();

    if (!response) {
      throw new Error("Failed to fetch catalog products");
    }

    // Filter by category if provided
    let products = response.result;
    if (category) {
      products = products.filter(
        (product) => product.main_category_id.toString() === category
      );
    }

    // Apply limit
    products = products.slice(0, limit);

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in catalog products loader:", error);
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
