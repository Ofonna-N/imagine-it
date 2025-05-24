import { getAllFeatureFlags, type FeatureFlags } from "~/config/feature_flags";

/**
 * Server-side feature flag validation utility
 * Use this in API routes to enforce feature flags on the backend
 */

export interface FeatureValidationResult {
  isAllowed: boolean;
  error?: {
    message: string;
    status: number;
  };
}

/**
 * Validates if a feature is enabled and returns appropriate response
 * @param feature - The feature flag to check
 * @param customMessage - Optional custom error message
 * @returns Validation result with error response if needed
 */
export function validateFeatureAccess(
  feature: keyof FeatureFlags,
  customMessage?: string
): FeatureValidationResult {
  const featureFlags = getAllFeatureFlags();
  const isEnabled = featureFlags[feature];

  if (!isEnabled) {
    return {
      isAllowed: false,
      error: {
        message: customMessage ?? `This feature is currently disabled`,
        status: 403,
      },
    };
  }

  return { isAllowed: true };
}

/**
 * Creates a standardized error response for disabled features
 * @param feature - The feature that was attempted to be accessed
 * @param customMessage - Optional custom error message
 * @returns Response object
 */
export function createFeatureDisabledResponse(
  feature: keyof FeatureFlags,
  customMessage?: string
): Response {
  const validation = validateFeatureAccess(feature, customMessage);
  
  if (!validation.error) {
    throw new Error("Feature is enabled, cannot create disabled response");
  }

  return new Response(
    JSON.stringify({ 
      error: validation.error.message,
      feature,
      enabled: false 
    }),
    {
      status: validation.error.status,
      headers: { "Content-Type": "application/json" },
    }
  );
}

/**
 * Validates multiple features at once
 * @param features - Array of features to validate
 * @returns Validation result for all features
 */
export function validateMultipleFeatures(
  features: (keyof FeatureFlags)[]
): FeatureValidationResult {
  const featureFlags = getAllFeatureFlags();
  
  for (const feature of features) {
    if (!featureFlags[feature]) {
      return {
        isAllowed: false,
        error: {
          message: `Required feature '${feature}' is currently disabled`,
          status: 403,
        },
      };
    }
  }

  return { isAllowed: true };
}

/**
 * Middleware-style function for feature validation in API routes
 * @param feature - The feature to validate
 * @param handler - The handler function to run if feature is enabled
 * @returns Either error response or handler result
 */
export async function withFeatureValidation<T>(
  feature: keyof FeatureFlags,
  handler: () => Promise<T>
): Promise<T | Response> {
  const validation = validateFeatureAccess(feature);
  
  if (!validation.isAllowed) {
    return createFeatureDisabledResponse(feature);
  }

  return handler();
}
