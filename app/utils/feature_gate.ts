import type { UserProfile } from "~/db/schema/profiles";
import {
  getSubscriptionFeatures,
  type SubscriptionTier,
} from "~/config/subscription_tiers";

/**
 * Checks if a user can perform a gated action based on their subscription tier and usage.
 * @param user - The user profile object
 * @param feature - The feature to check (e.g., 'artGenCredits', 'savedDesigns', 'uploads')
 * @param currentUsage - The user's current usage for the feature
 * @returns boolean indicating if the user can perform the action
 */
export function canUserAccessFeature(
  user: UserProfile,
  feature: "artGenCredits" | "savedDesigns" | "uploads",
  currentUsage: number
): boolean {
  const tier = (user.subscriptionTier || "free") as SubscriptionTier;
  const features = getSubscriptionFeatures(tier);
  switch (feature) {
    case "artGenCredits":
      return currentUsage < features.artGenCreditsPerMonth;
    case "savedDesigns":
      return (
        features.savedDesignsLimit === null ||
        currentUsage < features.savedDesignsLimit
      );
    case "uploads":
      return (
        features.uploadsPerMonth === null ||
        currentUsage < features.uploadsPerMonth
      );
    default:
      return false;
  }
}

/**
 * Checks if a user has access to a boolean feature (e.g., premiumStyles, batchGeneration)
 */
export function hasUserFeature(
  user: UserProfile,
  feature: "premiumStyles" | "batchGeneration"
): boolean {
  const tier = (user.subscriptionTier || "free") as SubscriptionTier;
  const features = getSubscriptionFeatures(tier);
  return features[feature];
}
