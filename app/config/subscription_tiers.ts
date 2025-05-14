// Subscription tiers and their feature limits
// This config can be imported on both backend and frontend

export type SubscriptionTier = "free" | "creator" | "pro";

export interface SubscriptionFeatures {
  artGenCreditsPerMonth: number;
  savedDesignsLimit: number | null; // null = unlimited
  uploadsPerMonth: number | null;
  premiumStyles: boolean;
  batchGeneration: boolean;
  supportLevel: "basic" | "priority" | "priority+";
}

export const SUBSCRIPTION_TIERS: Record<
  SubscriptionTier,
  SubscriptionFeatures
> = {
  free: {
    artGenCreditsPerMonth: 10,
    savedDesignsLimit: 10,
    uploadsPerMonth: 10,
    premiumStyles: false,
    batchGeneration: false,
    supportLevel: "basic",
  },
  creator: {
    artGenCreditsPerMonth: 100,
    savedDesignsLimit: 100,
    uploadsPerMonth: 100,
    premiumStyles: true,
    batchGeneration: false,
    supportLevel: "priority",
  },
  pro: {
    artGenCreditsPerMonth: 500,
    savedDesignsLimit: null,
    uploadsPerMonth: null,
    premiumStyles: true,
    batchGeneration: true,
    supportLevel: "priority+",
  },
};

// Utility to get features for a tier
export function getSubscriptionFeatures(
  tier: SubscriptionTier
): SubscriptionFeatures {
  return SUBSCRIPTION_TIERS[tier];
}
