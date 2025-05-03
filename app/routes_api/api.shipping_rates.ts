import type { ActionFunctionArgs } from "react-router";
import type {
  PrintfulV2ShippingRatesRequest,
  PrintfulV2ShippingRatesResponse,
  PrintfulV2ShippingRatesErrorResponse400,
  PrintfulV2ShippingRatesErrorResponse5xx,
} from "../types/printful/shipping_rates_types";
import { fetchPrintfulShippingRates } from "../services/printful/printful_api";

/**
 * POST /api/shipping-rates
 * Resource route: Retrieves available shipping rates for a set of order items and recipient.
 * Only POST is supported. Calls Printful API server-side.
 */
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const body = (await request.json()) as PrintfulV2ShippingRatesRequest;
    // Call Printful API server-side (never expose API key to client)
    const rates: PrintfulV2ShippingRatesResponse =
      await fetchPrintfulShippingRates(body);
    return new Response(JSON.stringify(rates), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    // Handle Printful API errors
    if (err?.response?.status === 400) {
      const error400: PrintfulV2ShippingRatesErrorResponse400 =
        await err.response.json();
      return new Response(JSON.stringify(error400), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (err?.response?.status >= 500) {
      const error5xx: PrintfulV2ShippingRatesErrorResponse5xx =
        await err.response.json();
      return new Response(JSON.stringify(error5xx), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({
        error: err?.message ?? "Failed to fetch shipping rates",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
