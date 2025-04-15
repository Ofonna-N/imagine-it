import { fetchCatalogProductMockupStyles } from "~/services/printful/printful_api";

/**
 * GET /api/catalog-products/:id/mockup-styles
 * Utility: Returns available mockup style groups for a given catalog product.
 *
 * Path is managed via API_ROUTES in route_paths.ts for consistency.
 */
export async function loader({ params }: { params: { id: string } }) {
  if (!params.id) {
    return new Response(JSON.stringify({ error: "Missing product id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const data = await fetchCatalogProductMockupStyles(params.id);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: (error as Error).message || "Failed to fetch mockup styles",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
