import type { ActionFunctionArgs } from "react-router";
import { ordersController } from "../services/paypal/paypal_server_client";
import {
  CheckoutPaymentIntent,
  FulfillmentType,
  PayeePaymentMethodPreference,
  PaypalExperienceUserAction,
  PaypalWalletContextShippingPreference,
  ShippingPreference,
  type PaymentSource,
  type PurchaseUnitRequest,
} from "@paypal/paypal-server-sdk";
import type { CreateOrderData } from "@paypal/paypal-js/types/components/buttons";

/**
 * POST /api/paypal-create-order
 * Utility: Handles creation of a PayPal order using shipping info and cart items from the client.
 */
export type PaypalCreateOrderRequest = {
  createOrderParam: CreateOrderData;
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
  shippingCost?: number;
  currency?: string;
  tax?: number;
};

export type PaypalCreateOrderResponse = {
  orderId: string;
};

export async function action({ request }: ActionFunctionArgs) {
  const body = (await request.json()) as PaypalCreateOrderRequest;
  const {
    shipping,
    items,
    currency = "USD",
    createOrderParam,
    tax,
    shippingCost,
  } = body;

  // Map items to PayPal purchase_units.items
  // Calculate totals
  const itemTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingTotal = shippingCost ?? 0;
  const taxTotal = tax ?? 0;
  const totalValue = (itemTotal + shippingTotal + taxTotal).toFixed(2);

  const purchase_units: PurchaseUnitRequest[] = [
    {
      amount: {
        currencyCode: currency,
        value: totalValue,
        breakdown: {
          itemTotal: {
            currencyCode: currency,
            value: itemTotal.toFixed(2),
          },
          shipping: {
            currencyCode: currency,
            value: shippingTotal.toFixed(2),
          },
          taxTotal: {
            currencyCode: currency,
            value: taxTotal.toFixed(2),
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
        type: FulfillmentType.Shipping,
        emailAddress: shipping.email,
        name: { fullName: shipping.name },
        address: {
          addressLine1: shipping.address1,
          addressLine2: shipping.address2 ?? undefined,
          adminArea2: shipping.city,
          adminArea1: shipping.state_code ?? shipping.state_name ?? undefined,
          postalCode: shipping.zip,
          countryCode: shipping.country_code,
        },
      },
    },
  ];

  // Create PayPal order
  // Determine payment source based on createOrderParam
  const paymentSource: PaymentSource = {};

  if (createOrderParam.paymentSource === "paypal") {
    paymentSource.paypal = {
      experienceContext: {
        userAction: PaypalExperienceUserAction.PayNow,
        shippingPreference:
          PaypalWalletContextShippingPreference.SetProvidedAddress,
        paymentMethodPreference:
          PayeePaymentMethodPreference.ImmediatePaymentRequired,
        brandName: "Imagine it",
      },
    };
  } else if (createOrderParam.paymentSource === "card") {
    paymentSource.card = {
      billingAddress: {
        addressLine1: shipping.address1,
        countryCode: shipping.country_code,
        postalCode: shipping.zip,
        adminArea1: shipping.state_code ?? shipping.state_name ?? undefined,
      },
      name: shipping.name,
    };
  } else if (createOrderParam.paymentSource === "venmo") {
    paymentSource.venmo = {};
  }

  const order = await ordersController.createOrder({
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: purchase_units,
      paymentSource,
    },
  });

  // Return only the orderId for client compatibility with PayPal JS SDK
  return new Response(JSON.stringify({ orderId: order.result.id }), {
    status: order.statusCode,
    headers: { "Content-Type": "application/json" },
  });
}
