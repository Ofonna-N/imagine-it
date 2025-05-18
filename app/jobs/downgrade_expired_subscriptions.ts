// filepath: app/jobs/downgrade_expired_subscriptions.ts
import {
  getUsersWithExpiredSubscriptions,
  clearUserActiveSubscription,
  clearUserPendingSubscription,
} from "../db/queries/user_profiles_queries";

/**
 * Scheduled job to downgrade users whose paid subscription period has ended.
 * Should be run daily (e.g. via cron or background worker).
 */
export async function downgradeExpiredSubscriptionsJob(now: Date = new Date()) {
  const users = await getUsersWithExpiredSubscriptions(now);
  for (const user of users) {
    await clearUserActiveSubscription(user.id);
    await clearUserPendingSubscription(user.id);
    // Optionally: remove paid benefits, send notification, etc.
  }
}
