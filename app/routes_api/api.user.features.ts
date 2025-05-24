import createSupabaseServerClient from "~/services/supabase/supabase_client";
import { canUserAccessFeature, hasUserFeature } from "~/utils/feature_gate";
import { getUserProfileById } from "~/db/queries/user_profiles_queries";
import { getAllFeatureFlags } from "~/config/feature_flags";

interface UserFeatures {
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
 * GET /api/user/features
 * Returns user's feature access and current usage limits
 */
export async function loader({ request }: { request: Request }) {
  try {
    const { supabase, headers } = createSupabaseServerClient({ request });
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const profile = await getUserProfileById(user.id);
    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Get current feature flags
    const featureFlags = getAllFeatureFlags();

    // Calculate current usage (you'll need to implement these queries based on your DB schema)
    // For now, using the credits directly - you may want to add usage tracking tables
    const currentUsage = {
      artGenCredits: profile.credits ?? 0,
      savedDesigns: 0, // TODO: Implement saved designs count query
      uploads: 0, // TODO: Implement uploads count query
    };

    const features: UserFeatures = {
      // Usage-based features - only check if feature flags are enabled
      canGenerateArt: featureFlags.enableImageGeneration && 
                     canUserAccessFeature(profile, "artGenCredits", currentUsage.artGenCredits),
      canSaveDesign: featureFlags.enableDesignSaving && 
                    canUserAccessFeature(profile, "savedDesigns", currentUsage.savedDesigns),
      canUpload: canUserAccessFeature(profile, "uploads", currentUsage.uploads),
      
      // Boolean features - only if feature flags are enabled
      hasPremiumStyles: featureFlags.enablePremiumStyles && 
                       hasUserFeature(profile, "premiumStyles"),
      hasBatchGeneration: featureFlags.enableBatchGeneration && 
                         hasUserFeature(profile, "batchGeneration"),
      hasAdvancedImageOptions: featureFlags.enableAdvancedImageOptions,
      
      // Usage limits for UI display
      limits: {
        artGenCreditsRemaining: profile.credits ?? 0,
        savedDesignsRemaining: null, // TODO: Calculate based on subscription tier
      },
      
      // Feature flags for UI rendering
      flags: featureFlags,
    };

    return new Response(JSON.stringify({ features }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(headers),
      },
    });
  } catch (error) {
    console.error("Error fetching user features:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch features" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
