import type { ActionFunctionArgs } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client";
import { ordersController } from "../services/paypal/paypal_server_client";
import { CaptureStatus, OrderStatus } from "@paypal/paypal-server-sdk";
import { getUserProfileById } from "~/db/queries/user_profiles_queries";
import { updateUserSubscriptionTier } from "~/db/queries/user_profiles_queries";
import {
  SUBSCRIPTION_TIERS,
  type SubscriptionTier,
} from "~/config/subscription_tiers";

/**
 * POST /api/purchase-subscription
 * Resource route for upgrading a user's subscription after PayPal payment.
 * Body: { tier: SubscriptionTier, paymentId: string }
 */
export type PurchaseSubscriptionRequest = {
  tier: SubscriptionTier;
  paymentId: string;
};

export type PurchaseSubscriptionResponse = {
  success: boolean;
  newTier: SubscriptionTier;
};

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createSupabaseServerClient({ request });
  const userResponse = await supabase.auth.getUser();
  if (!userResponse?.data?.user?.id) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const body = (await request.json()) as PurchaseSubscriptionRequest;
  const { tier, paymentId } = body;
  const planPrice = tier === "creator" ? 9 : tier === "pro" ? 29 : 0;
  if (planPrice === 0) {
    // Free plan, just downgrade
    await updateUserSubscriptionTier(userResponse.data.user.id, tier);
    return new Response(JSON.stringify({ success: true, newTier: tier }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Capture PayPal payment
  const capture = await ordersController.captureOrder({ id: paymentId });
  const captureResult = capture.result;
  const capturedAmount = parseFloat(
    captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount?.value ??
      "0"
  );
  if (
    captureResult.status !== OrderStatus["Completed"] ||
    captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.status !==
      CaptureStatus["Completed"] ||
    Math.abs(capturedAmount - planPrice) > 0.01
  ) {
    return new Response(
      JSON.stringify({ error: "Payment not captured or amount mismatch" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  // Update user subscription tier
  await updateUserSubscriptionTier(userResponse.data.user.id, tier);
  return new Response(JSON.stringify({ success: true, newTier: tier }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
