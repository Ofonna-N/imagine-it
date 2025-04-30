import type { ActionFunctionArgs } from "react-router";
import { ordersController } from "../services/paypal/paypal_server_client";
import {
  CheckoutPaymentIntent,
  type PurchaseUnitRequest,
} from "@paypal/paypal-server-sdk";

/**
 * POST /api/paypal-create-order
 * Utility: Handles creation of a PayPal order using shipping info and cart items from the client.
 */
export type PaypalCreateOrderRequest = {
  shipping: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    state_code?: string;
    state_name?: string;
    country_code: string;
    country_name?: string;
    zip: string;
    phone?: string;
    email?: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  currency?: string;
};

export type PaypalCreateOrderResponse = {
  orderId: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const body = (await request.json()) as PaypalCreateOrderRequest;
  const { shipping, items, currency = "USD" } = body;

  // Map items to PayPal purchase_units.items
  const purchase_units: PurchaseUnitRequest[] = [
    {
      amount: {
        currencyCode: currency,
        value: items
          .reduce((sum, item) => sum + item.price * item.quantity, 0)
          .toFixed(2),
        breakdown: {
          itemTotal: {
            currencyCode: currency,
            value: items
              .reduce((sum, item) => sum + item.price * item.quantity, 0)
              .toFixed(2),
          },
        },
      },
      items: items.map((item) => ({
        name: item.name,
        unitAmount: {
          currencyCode: currency,
          value: item.price.toFixed(2),
        },
        quantity: item.quantity.toString(),
      })),
      shipping: {
        name: { fullName: shipping.name },
        address: {
          addressLine1: shipping.address1,
          addressLine2: shipping.address2 || undefined,
          adminArea2: shipping.city,
          adminArea1: shipping.state_code || shipping.state_name || undefined,
          postalCode: shipping.zip,
          countryCode: shipping.country_code,
        },
      },
    },
  ];

  // Create PayPal order
  const order = await ordersController.createOrder({
    body: {
      intent: CheckoutPaymentIntent.Authorize,
      purchaseUnits: purchase_units,
      applicationContext: {
        shippingPreference: undefined, // Use provided shipping info
        userAction: undefined,
      },
    },
  });

  return new Response(JSON.stringify({ orderId: order.result.id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
