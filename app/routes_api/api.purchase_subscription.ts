import type { ActionFunctionArgs } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client";
import {
  ordersController,
  capturePaypalSubscriptionPayment,
} from "../services/paypal/paypal_server_client";
import { CaptureStatus, OrderStatus } from "@paypal/paypal-server-sdk";
import { getUserProfileById } from "~/db/queries/user_profiles_queries";
import { updateUserSubscriptionTier } from "~/db/queries/user_profiles_queries";
import { updateUserPaypalSubscriptionId } from "~/db/queries/user_profiles_queries";
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
    await updateUserSubscriptionTier(userResponse.data.user.id, "free");
    await updateUserPaypalSubscriptionId(userResponse.data.user.id, null);
    return new Response(JSON.stringify({ success: true, newTier: tier }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Capture PayPal subscription payment (REST API)
  // try {
  //   await capturePaypalSubscriptionPayment(paymentId, {
  //     note: `Initial payment for ${tier} plan`,
  //     captureType: "OUTSTANDING_BALANCE",
  //   });
  // } catch (err) {
  //   // Log the error for debugging purposes
  //   console.error("Error capturing PayPal subscription payment:", err);
  //   return new Response(
  //     JSON.stringify({ error: "Payment not captured for subscription", details: err instanceof Error ? err.message : String(err) }),
  //     { status: 400, headers: { "Content-Type": "application/json" } }
  //   );
  // }
  // Update user subscription tier
  await updateUserSubscriptionTier(userResponse.data.user.id, tier);
  // Save PayPal subscription ID if present (for paid plans)
  if (paymentId && tier !== "free") {
    await updateUserPaypalSubscriptionId(userResponse.data.user.id, paymentId);
  } else if (tier === "free") {
    await updateUserPaypalSubscriptionId(userResponse.data.user.id, null);
  }
  return new Response(JSON.stringify({ success: true, newTier: tier }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
