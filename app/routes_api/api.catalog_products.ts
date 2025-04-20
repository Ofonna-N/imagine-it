import { fetchCatalogProducts } from "~/services/printful/printful_api";

/**
 * Resource route for catalog products with client-side pagination and search
 * Returns proper Response objects with appropriate status codes
 */
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);
    const offset = parseInt(url.searchParams.get("offset") ?? "0", 10);
    const search = url.searchParams.get("search") ?? undefined;
    const categoryIds = url.searchParams.get("category_ids") ?? undefined; // Added categoryIds

    const productsResponse = await fetchCatalogProducts({
      limit,
      offset,
      search,
      categoryIds, // Pass categoryIds
    });

    return new Response(JSON.stringify(productsResponse), {
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
