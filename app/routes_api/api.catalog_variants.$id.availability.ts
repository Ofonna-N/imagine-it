import type { LoaderFunctionArgs } from "react-router";
import { fetchCatalogVariantAvailability } from "~/services/printful/printful_api";

/**
 * GET /api/catalog-variants/:id/availability
 * Proxy route: Returns availability information for a specific catalog variant.
 */
export async function loader({ params, request }: LoaderFunctionArgs) {
  const variantId = params.id;
  if (!variantId) {
    return new Response(JSON.stringify({ error: "Variant ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const url = new URL(request.url);
    const techniquesParam = url.searchParams.get("techniques");
    const techniques = techniquesParam ? techniquesParam.split(",") : undefined;
    const availabilityResponse = await fetchCatalogVariantAvailability(
      variantId,
      techniques
    );
    return new Response(JSON.stringify(availabilityResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching variant availability:", error);
    if (error instanceof Response) throw error;
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch variant availability",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
