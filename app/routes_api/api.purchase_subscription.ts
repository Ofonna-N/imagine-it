import type { ActionFunctionArgs } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client";
import {
  ordersController,
  capturePaypalSubscriptionPayment,
  getPaypalSubscriptionDetails,
} from "../services/paypal/paypal_server_client";
import {
  getUserProfileById,
  updateUserSubscriptionStatus,
  updateUserLastCreditsGrantedAt,
} from "~/db/queries/user_profiles_queries";
import { type SubscriptionTier } from "~/config/subscription_tiers";

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
  const userId = userResponse.data.user.id;
  // Get PayPal subscription details if paymentId is present
  let periodEnd: Date | null = null;
  if (paymentId && tier !== "free") {
    try {
      const details = await getPaypalSubscriptionDetails(paymentId);
      // PayPal returns ISO8601 string for current_period_end
      periodEnd = details.billing_info?.next_billing_time
        ? new Date(details.billing_info.next_billing_time)
        : null;
    } catch (e) {
      // fallback: don't set periodEnd
      periodEnd = null;
    }
  }
  // Get current profile to check for resubscribe edge case
  const profile = await getUserProfileById(userId);
  if (
    profile &&
    profile.subscriptionStatus === "pending_cancel" &&
    profile.subscriptionPeriodEnd &&
    periodEnd &&
    profile.subscriptionPeriodEnd > new Date()
  ) {
    // Just update status and PayPal info, do not grant extra credits
    await updateUserSubscriptionStatus({
      userId,
      status: "active",
      periodEnd,
      paypalSubscriptionId: paymentId,
    });
    return new Response(JSON.stringify({ success: true, newTier: tier }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (planPrice === 0) {
    // Free plan, just downgrade
    await updateUserSubscriptionStatus({
      userId,
      status: "active",
      periodEnd: null,
      paypalSubscriptionId: null,
    });
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
  // Set user to active, update period end, PayPal ID
  await updateUserSubscriptionStatus({
    userId,
    status: "active",
    periodEnd,
    paypalSubscriptionId: paymentId,
  });
  // Grant credits for new billing cycle
  await updateUserLastCreditsGrantedAt(userId, new Date());
  return new Response(JSON.stringify({ success: true, newTier: tier }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
