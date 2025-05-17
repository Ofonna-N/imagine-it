// filepath: app/jobs/downgrade_expired_subscriptions.ts
import {
  getUsersToDowngrade,
  updateUserSubscriptionTier,
  updateUserSubscriptionStatusAndPeriodEnd,
  updateUserPaypalSubscriptionId,
} from "../db/queries/user_profiles_queries";

/**
 * Scheduled job to downgrade users whose paid subscription period has ended.
 * Should be run daily (e.g. via cron or background worker).
 */
export async function downgradeExpiredSubscriptionsJob(now: Date = new Date()) {
  const users = await getUsersToDowngrade(now);
  for (const user of users) {
    await updateUserSubscriptionTier(user.id, "free");
    await updateUserSubscriptionStatusAndPeriodEnd(user.id, {
      status: "cancelled",
      periodEnd: null,
    });
    await updateUserPaypalSubscriptionId(user.id, null);
    // Optionally: remove paid benefits, send notification, etc.
  }
}
