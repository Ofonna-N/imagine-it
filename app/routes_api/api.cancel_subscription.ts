import type { ActionFunctionArgs } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client";
import { cancelPaypalSubscription, getPaypalSubscriptionDetails } from "../services/paypal/paypal_server_client";
import {
  updateUserSubscriptionStatusAndPeriodEnd,
  getUserProfileById,
} from "~/db/queries/user_profiles_queries";

/**
 * POST /api/cancel-subscription
 * Resource route for cancelling a user's PayPal subscription and downgrading to free tier.
 * Body: none (user is authenticated)
 */
export type CancelSubscriptionResponse = {
  success: boolean;
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
  // Get user's PayPal subscription ID from Drizzle query function
  const userId = userResponse.data.user.id;
  const profile = await getUserProfileById(userId);
  const paypalSubscriptionId = profile?.paypalSubscriptionId;
  if (!paypalSubscriptionId) {
    return new Response(
      JSON.stringify({ error: "No active subscription found" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // Cancel the PayPal subscription using REST API utility
  try {
    await cancelPaypalSubscription(paypalSubscriptionId);
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error cancelling PayPal subscription:", err);
    return new Response(
      JSON.stringify({ error: "Failed to cancel subscription" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
  // Get PayPal subscription details to find period end
  let periodEnd: string | null = null;
  try {
    const details = await getPaypalSubscriptionDetails(paypalSubscriptionId);
    periodEnd = details.billing_info?.next_billing_time ?? null;
  } catch (err) {
    console.error("Failed to fetch PayPal subscription details:", err);
    // fallback: leave periodEnd as null
  }
  // Mark user as pending_cancel, keep period end
  await updateUserSubscriptionStatusAndPeriodEnd(userId, {
    status: "pending_cancel",
    periodEnd,
  });
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
