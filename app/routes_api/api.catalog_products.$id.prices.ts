import type { LoaderFunctionArgs } from "react-router";
import { fetchCatalogProductPrices } from "~/services/printful/printful_api";
import { applyProfitToProductPricesResponse } from "~/utils/profit_calculator"; // Adjust path if needed

/**
 * GET /api/catalog-products/:id/prices
 * Utility: Returns pricing information for a specific catalog product, with profit margin applied.
 */
export async function loader({ params }: LoaderFunctionArgs) {
  const productId = params.id;

  if (!productId) {
    return new Response(JSON.stringify({ error: "Product ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const originalPricingResponse = await fetchCatalogProductPrices(productId);
    // Apply profit margin
    const pricingResponseWithProfit = applyProfitToProductPricesResponse(
      originalPricingResponse
    );

    return new Response(JSON.stringify(pricingResponseWithProfit), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching product prices:", error);
    if (error instanceof Response) throw error;
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch product prices",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
