import { fetchCatalogProducts } from "~/services/printful/printful_api";
import type { PrintfulPagination } from "~/types/printful";

/**
 * Resource route for catalog products with client-side pagination and search
 * Returns proper Response objects with appropriate status codes
 */
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
    const search = url.searchParams.get("search") ?? null;
    const category = url.searchParams.get("category") ?? null;

    // Get catalog products
    const response = await fetchCatalogProducts({
      categoryId: category ?? undefined,
      limit,
      offset,
    });

    if (!response || !response.data) {
      throw new Error("Failed to fetch catalog products");
    }

    let products = response.data;

    // Client-side search filtering if needed
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.type.toLowerCase().includes(searchLower)
      );
    }

    // Return products with pagination info from the response
    const paging: PrintfulPagination = response.paging || {
      total: products.length,
      offset,
      limit,
    };

    return new Response(
      JSON.stringify({
        products,
        paging,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
