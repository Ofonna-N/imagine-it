// filepath: app/routes_api/api.paypal_webhook.ts
import type { ActionFunctionArgs } from "react-router";
import { getPaypalSubscriptionDetails } from "~/services/paypal/paypal_server_client";
import {
  updateUserSubscriptionStatusAndPeriodEnd,
  getUserProfileByPaypalId,
  grantUserSubscriptionCredits,
} from "~/db/queries/user_profiles_queries";

/**
 * POST /api/paypal-webhook
 * Resource route for handling PayPal subscription webhooks.
 * Handles events like BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED, BILLING.SUBSCRIPTION.CANCELLED, etc.
 */
export async function action({ request }: ActionFunctionArgs) {
  const event = await request.json();
  // Example: event.event_type === 'BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED'
  const eventType = event.event_type;
  const subscriptionId = event.resource?.id;
  if (!subscriptionId) {
    return new Response(JSON.stringify({ error: "Missing subscription id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Find user by PayPal subscription id
  const userProfile = await getUserProfileByPaypalId(subscriptionId);
  if (!userProfile) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (eventType === "BILLING.SUBSCRIPTION.PAYMENT.SUCCEEDED") {
    // Grant credits and update period end
    const details = await getPaypalSubscriptionDetails(subscriptionId);
    const nextBillingTime = details.billing_info.next_billing_time;
    await updateUserSubscriptionStatusAndPeriodEnd(userProfile.id, {
      status: "active",
      periodEnd: nextBillingTime,
    });
    await grantUserSubscriptionCredits(
      userProfile.id,
      userProfile.subscriptionTier
    );
  } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED") {
    // Mark as pending_cancel, keep period end
    const details = await getPaypalSubscriptionDetails(subscriptionId);
    const periodEnd = details.billing_info.next_billing_time;
    await updateUserSubscriptionStatusAndPeriodEnd(userProfile.id, {
      status: "pending_cancel",
      periodEnd,
    });
  }
  // Add more event types as needed
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
