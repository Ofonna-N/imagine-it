import {
  fetchCatalogProducts,
  fetchV1CatalogProducts,
} from "~/services/printful/printful_api";
import { mapV1ToV2CatalogProduct } from "~/utils/printful_product_mapper";

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
    const categoryIds = url.searchParams.get("category_ids") ?? undefined;

    // If a search query is present, fetch all products from v1, map to v2, filter, and paginate manually
    if (search) {
      const resp = await fetchV1CatalogProducts({ categoryIds });
      const allProducts = resp?.result || [];
      // Filter by search (case-insensitive, match in name or description)
      const filtered = allProducts.filter((product) => {
        const name = product.title?.toLowerCase() || "";
        const desc = product.description?.toLowerCase() ?? "";
        const q = search.toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
      // Map only the filtered products to v2 schema
      const mapped = filtered.map(mapV1ToV2CatalogProduct);
      // Paginate
      const paged = mapped.slice(offset, offset + limit);
      return new Response(
        JSON.stringify({
          data: paged,
          paging: {
            total: filtered.length,
            offset,
            limit,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // No search: use Printful's default v2 pagination
    const productsResponse = await fetchCatalogProducts({
      limit,
      offset,
      categoryIds,
    });
    return new Response(JSON.stringify(productsResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
