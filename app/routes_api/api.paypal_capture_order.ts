import { ordersController } from "../services/paypal/paypal_server_client";
import type { ActionFunctionArgs } from "react-router";

/**
 * POST /api/paypal-capture-order
 * Resource route for capturing a PayPal order after approval
 */
export type PaypalCaptureOrderRequest = {
  /** The PayPal order ID to capture */
  orderId: string;
};

/**
 * POST /api/paypal-capture-order
 * Utility: Response from PayPal capture API
 */
export type PaypalCaptureOrderResponse = {
  status: string;
  id: string;
  payer?: unknown;
  purchase_units?: unknown;
  [key: string]: unknown;
};

export async function action({ request }: ActionFunctionArgs) {
  const { orderId } = (await request.json()) as PaypalCaptureOrderRequest;
  try {
    const { body, ...httpResponse } = await ordersController.captureOrder({
      id: orderId,
      prefer: "return=minimal",
    });
    // Ensure the response body is a JSON string
    return new Response(
      typeof body === "string" ? body : JSON.stringify(body),
      {
        status: httpResponse.statusCode,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: (error as any).statusCode ?? 500,
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: "Failed to capture PayPal order." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
