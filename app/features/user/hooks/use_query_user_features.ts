import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

export interface UserFeatures {
  // Usage-based feature checks
  canGenerateArt: boolean;
  canSaveDesign: boolean;
  canUpload: boolean;
  
  // Boolean feature checks
  hasPremiumStyles: boolean;
  hasBatchGeneration: boolean;
  hasAdvancedImageOptions: boolean;
  
  // Usage limits for UI display
  limits: {
    artGenCreditsRemaining: number | null;
    savedDesignsRemaining: number | null;
  };
  
  // Feature flags for UI rendering
  flags: {
    enableDesignSaving: boolean;
    enableDesignsGallery: boolean;
    enableDesignPlayground: boolean;
    enableSubscriptionPlans: boolean;
    enableMyDesignsPage: boolean;
    enableAdvancedImageOptions: boolean;
    enablePremiumStyles: boolean;
    enableBatchGeneration: boolean;
    enableArtStyles: boolean;
    enableMultipleModels: boolean;
    enableCreditsSystem: boolean;
    enableProductCustomization: boolean;
    enableImageGeneration: boolean;
    enableCart: boolean;
    enableCheckout: boolean;
  };
}

/**
 * Hook to fetch user features and feature flags
 * This provides both usage-based feature checks and global feature flags
 */
export function useQueryUserFeatures() {
  return useQuery<UserFeatures, Error>({
    queryKey: ["userFeatures"],
    queryFn: async () => {
      const response = await fetch(API_ROUTES.USER_FEATURES);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error ?? "Failed to fetch user features");
      }

      const data = await response.json();
      return data.features;
    },
    enabled: true,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
