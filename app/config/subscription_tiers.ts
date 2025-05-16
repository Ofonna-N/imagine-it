// Subscription tiers and their feature limits
// This config can be imported on both backend and frontend

export type SubscriptionTier = "free" | "creator" | "pro";

export interface SubscriptionTierConfig {
  id: SubscriptionTier;
  name: string;
  description: string;
  paypalPlanId?: string; // Only for paid plans
  features: SubscriptionFeatures;
}

export interface SubscriptionFeatures {
  artGenCreditsPerMonth: number;
  savedDesignsLimit: number | null; // null = unlimited
  uploadsPerMonth: number | null;
  premiumStyles: boolean;
  batchGeneration: boolean;
  supportLevel: "basic" | "priority" | "priority+";
}

export const SUBSCRIPTION_TIERS: SubscriptionTierConfig[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic access with limited features.",
    features: {
      artGenCreditsPerMonth: 10,
      savedDesignsLimit: 10,
      uploadsPerMonth: 10,
      premiumStyles: false,
      batchGeneration: false,
      supportLevel: "basic",
    },
  },
  {
    id: "creator",
    name: "Creator",
    description: "Unlock more credits and premium styles.",
    paypalPlanId: import.meta.env.VITE_PAYPAL_CREATOR_PLAN_ID,
    features: {
      artGenCreditsPerMonth: 100,
      savedDesignsLimit: 100,
      uploadsPerMonth: 100,
      premiumStyles: true,
      batchGeneration: false,
      supportLevel: "priority",
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "All features unlocked, unlimited designs.",
    paypalPlanId: import.meta.env.VITE_PAYPAL_PRO_PLAN_ID,
    features: {
      artGenCreditsPerMonth: 500,
      savedDesignsLimit: null,
      uploadsPerMonth: null,
      premiumStyles: true,
      batchGeneration: true,
      supportLevel: "priority+",
    },
  },
];

// Utility to get features for a tier
export function getSubscriptionFeatures(
  tier: SubscriptionTier
): SubscriptionFeatures {
  const config = SUBSCRIPTION_TIERS.find((t) => t.id === tier);
  if (!config) throw new Error(`Unknown subscription tier: ${tier}`);
  return config.features;
}

// Utility to get config for a tier
export function getSubscriptionTierConfig(
  tier: SubscriptionTier
): SubscriptionTierConfig {
  const config = SUBSCRIPTION_TIERS.find((t) => t.id === tier);
  if (!config) throw new Error(`Unknown subscription tier: ${tier}`);
  return config;
}
