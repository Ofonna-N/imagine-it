import { fetchCatalogProductMockupStyles } from "~/services/printful/printful_api";
import type { Route } from "./+types/api.catalog_products.$id.mockup_styles";

/**
 * GET /api/catalog-products/:id/mockup-styles
 * Utility: Returns available mockup style groups for a given catalog product.
 *
 * Path is managed via API_ROUTES in route_paths.ts for consistency.
 */
export async function loader({ params, request }: Route.LoaderArgs) {
  if (!params.id) {
    return new Response(JSON.stringify({ error: "Missing product id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    // Extract placements filter from query params (comma-separated)
    const url = new URL(request.url);
    const placementsParam = url.searchParams.get("placements");
    const placements = placementsParam ? placementsParam.split(",") : undefined;
    // Fetch mockup styles, with optional placements filter
    const filteredData = await fetchCatalogProductMockupStyles(
      params.id,
      placements
    );
    return new Response(JSON.stringify(filteredData), {
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
