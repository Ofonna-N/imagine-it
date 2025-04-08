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

    // Get all catalog products
    const response = await fetchCatalogProducts({
      categoryId: category ?? undefined, // Changed || to ??
    });

    if (!response) {
      throw new Error("Failed to fetch catalog products");
    }

    let products = response.result;

    // Client-side search filtering
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (product) =>
          product.title.toLowerCase().includes(searchLower) ||
          product.type_name.toLowerCase().includes(searchLower)
      );
    }

    // Calculate total for pagination
    const total = products.length;

    // Client-side pagination
    const paginatedProducts = products.slice(offset, offset + limit);

    // Return paginated products with pagination info
    const paging: PrintfulPagination = {
      total,
      offset,
      limit,
    };

    return new Response(
      JSON.stringify({
        products: paginatedProducts,
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
