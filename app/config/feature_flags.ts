// Feature flags configuration for MVP rollout
// This controls which features are available to users

export interface FeatureFlags {
  // Design-related features
  enableDesignSaving: boolean;
  enableDesignsGallery: boolean;
  enableDesignPlayground: boolean;
  
  // Subscription features  
  enableSubscriptionPlans: boolean;
  enableMyDesignsPage: boolean;
  
  // Advanced image generation features
  enableAdvancedImageOptions: boolean;
  enablePremiumStyles: boolean;
  enableBatchGeneration: boolean;
  enableArtStyles: boolean;
  enableMultipleModels: boolean;
  
  // Core features (always enabled for MVP)
  enableCreditsSystem: boolean;
  enableProductCustomization: boolean;
  enableImageGeneration: boolean;
  enableCart: boolean;
  enableCheckout: boolean;
}

// MVP feature flags - disable advanced features, keep core functionality
export const FEATURE_FLAGS: FeatureFlags = {
  // Disabled for MVP
  enableDesignSaving: true,
  enableDesignsGallery: true,
  enableDesignPlayground: true,
  enableSubscriptionPlans: false,
  enableMyDesignsPage: true,
  enableAdvancedImageOptions: true,
  enablePremiumStyles: false,
  enableBatchGeneration: false,
  enableArtStyles: false,
  enableMultipleModels: true,
  
  // Enabled for MVP - core revenue-generating features
  enableCreditsSystem: true,
  enableProductCustomization: true,
  enableImageGeneration: true,
  enableCart: true,
  enableCheckout: true,
};

/**
 * Check if a specific feature is enabled
 * @param feature - The feature flag to check
 * @returns Whether the feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Get all feature flags for client consumption
 * @returns Current feature flag configuration
 */
export function getAllFeatureFlags(): FeatureFlags {
  return { ...FEATURE_FLAGS };
}
