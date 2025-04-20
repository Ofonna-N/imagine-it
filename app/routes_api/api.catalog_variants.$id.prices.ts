import type { LoaderFunctionArgs } from "react-router";
import { fetchCatalogVariantPrices } from "~/services/printful/printful_api";

/**
 * GET /api/catalog-variants/:id/prices
 * Proxy route: Returns pricing information for a specific catalog variant.
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const variantId = params.id;
  if (!variantId) {
    return new Response(JSON.stringify({ error: "Variant ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const pricingResponse = await fetchCatalogVariantPrices(variantId);
    return new Response(JSON.stringify(pricingResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching variant prices:", error);
    if (error instanceof Response) throw error;
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch variant prices",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
