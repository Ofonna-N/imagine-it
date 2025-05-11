import type { LoaderFunctionArgs } from "react-router";
import { fetchCatalogVariantPrices } from "~/services/printful/printful_api";
import { applyProfitToVariantPricesResponse } from "~/utils/profit_calculator"; // Adjust path if needed

/**
 * GET /api/catalog-variants/:id/prices
 * Proxy route: Returns pricing information for a specific catalog variant, with profit margin applied.
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
    const originalPricingResponse = await fetchCatalogVariantPrices(variantId);
    // Apply profit margin
    const pricingResponseWithProfit = applyProfitToVariantPricesResponse(
      originalPricingResponse
    );

    return new Response(JSON.stringify(pricingResponseWithProfit), {
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
