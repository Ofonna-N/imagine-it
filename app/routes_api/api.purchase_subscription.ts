import type { ActionFunctionArgs } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client";
import { getPaypalSubscriptionDetails } from "../services/paypal/paypal_server_client";
import {
  getUserProfileById,
  updateUserActiveSubscription,
  updateUserPendingSubscription,
  clearUserActiveSubscription,
  clearUserPendingSubscription,
  grantUserSubscriptionCredits,
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
      periodEnd = details.billing_info?.next_billing_time
        ? new Date(details.billing_info.next_billing_time)
        : null;
    } catch (e) {
      console.error("Failed to fetch PayPal subscription details:", e);
      periodEnd = null;
    }
  }
  // Get current profile to check for resubscribe/upgrade/downgrade edge cases
  const profile = await getUserProfileById(userId);
  // Use active/pending fields for logic
  const activeTier = profile?.activeSubscriptionTier;
  const activePeriodEnd = profile?.activeSubscriptionPeriodEnd
    ? new Date(profile.activeSubscriptionPeriodEnd)
    : null;
  const pendingTier = profile?.pendingSubscriptionTier;
  const pendingPeriodEnd = profile?.pendingSubscriptionPeriodEnd
    ? new Date(profile.pendingSubscriptionPeriodEnd)
    : null;
  // If user is pending_cancel and periodEnd in future, treat as resubscribe (no double credits)
  if (
    pendingTier &&
    pendingPeriodEnd &&
    periodEnd &&
    pendingPeriodEnd > new Date()
  ) {
    await updateUserActiveSubscription(userId, {
      paypalSubscriptionId: paymentId,
      subscriptionTier: tier,
      subscriptionPeriodEnd: periodEnd,
    });
    await clearUserPendingSubscription(userId);
    return new Response(JSON.stringify({ success: true, newTier: tier }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Upgrade: creator -> pro mid-cycle
  if (
    activeTier === "creator" &&
    tier === "pro" &&
    activePeriodEnd &&
    periodEnd &&
    activePeriodEnd > new Date()
  ) {
    await updateUserActiveSubscription(userId, {
      paypalSubscriptionId: paymentId,
      subscriptionTier: tier,
      subscriptionPeriodEnd: periodEnd,
    });
    return new Response(JSON.stringify({ success: true, newTier: tier }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Downgrade: pro/creator -> lower tier, set pending_cancel
  if (
    ((activeTier === "pro" && (tier === "creator" || tier === "free")) ||
      (activeTier === "creator" && tier === "free")) &&
    activePeriodEnd &&
    periodEnd &&
    activePeriodEnd > new Date()
  ) {
    await updateUserPendingSubscription(userId, {
      paypalSubscriptionId: paymentId,
      subscriptionTier: tier,
      subscriptionPeriodEnd: periodEnd,
    });
    return new Response(
      JSON.stringify({ success: true, newTier: activeTier }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  if (planPrice === 0) {
    // Free plan, clear all subscription fields
    await clearUserActiveSubscription(userId);
    await clearUserPendingSubscription(userId);
    return new Response(JSON.stringify({ success: true, newTier: tier }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  // New subscription or new billing cycle
  await updateUserActiveSubscription(userId, {
    paypalSubscriptionId: paymentId,
    subscriptionTier: tier,
    subscriptionPeriodEnd: periodEnd,
  });
  await clearUserPendingSubscription(userId);
  // Grant credits for new billing cycle
  await grantUserSubscriptionCredits(userId, tier);
  return new Response(JSON.stringify({ success: true, newTier: tier }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
