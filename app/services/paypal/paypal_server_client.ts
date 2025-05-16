import {
  ApiError,
  Client,
  Environment,
  LogLevel,
  OrdersController,
  PaymentsController,
} from "@paypal/paypal-server-sdk";

// Utility to get PayPal access token using client credentials
export async function getPaypalAccessToken() {
  const token =
    await paypalServerClient.clientCredentialsAuthManager.fetchToken();
  return token.accessToken;
}

// Utility to get PayPal subscription details
export async function getPaypalSubscriptionDetails(subscriptionId: string) {
  const accessToken = await getPaypalAccessToken();
  const baseUrl =
    process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";
  const res = await fetch(
    `${baseUrl}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch PayPal subscription details");
  return res.json();
}

// Utility to cancel a PayPal subscription
export async function cancelPaypalSubscription(
  subscriptionId: string,
  reason?: string
) {
  const accessToken = await getPaypalAccessToken();
  const baseUrl =
    process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";
  const res = await fetch(
    `${baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: reason ? JSON.stringify({ reason }) : undefined,
    }
  );
  if (!res.ok) throw new Error("Failed to cancel PayPal subscription");
  return true;
}

// Utility to capture a PayPal subscription payment (REST API)
export async function capturePaypalSubscriptionPayment(
  subscriptionId: string,
  options?: {
    note?: string;
    captureType?: "OUTSTANDING_BALANCE";
    amount?: { currency_code: string; value: string };
    requestId?: string;
  }
) {
  const accessToken = await getPaypalAccessToken();
  const baseUrl =
    process.env.PAYPAL_BASE_URL ?? "https://api-m.sandbox.paypal.com";
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (options?.requestId) {
    headers["PayPal-Request-Id"] = options.requestId;
  }
  const body: Record<string, any> = {};
  if (options?.note) body.note = options.note;
  if (options?.captureType) body.capture_type = options.captureType;
  if (options?.amount) body.amount = options.amount;
  const res = await fetch(
    `${baseUrl}/v1/billing/subscriptions/${subscriptionId}/capture`,
    {
      method: "POST",
      headers,
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    }
  );
  if (!res.ok) throw new Error("Failed to capture PayPal subscription payment");
  return res.json();
}

export const paypalServerClient = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID ?? "",
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET ?? "",
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

export const ordersController = new OrdersController(paypalServerClient);
export const paymentsController = new PaymentsController(paypalServerClient);
