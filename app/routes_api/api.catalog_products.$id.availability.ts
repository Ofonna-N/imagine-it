import type { LoaderFunctionArgs } from "react-router";
import { fetchProductAvailability } from "~/services/printful/printful_api";

/**
 * API route handler for fetching product availability information
 * GET /api/catalog_products/:id/availability
 */
export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const productId = params.id;

    if (!productId) {
      throw new Response("Product ID is required", { status: 400 });
    }

    const availabilityData = await fetchProductAvailability(productId);

    return new Response(JSON.stringify(availabilityData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product availability:", error);

    if (error instanceof Response) {
      throw error;
    }

    throw new Response(
      error instanceof Error
        ? error.message
        : "Failed to fetch product availability",
      {
        status: 500,
      }
    );
  }
}
