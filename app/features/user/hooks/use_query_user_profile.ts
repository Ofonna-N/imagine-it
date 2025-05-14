import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "~/db/schema/profiles";
import { API_ROUTES } from "~/constants/route_paths"; // Import API route constants

/**
 * Custom hook to fetch the user's profile
 * Uses TanStack Query for data fetching, caching, and revalidation
 */
function useQueryUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch(API_ROUTES.USER_PROFILE); // Use constant

      if (!response.ok) {
        // Handle HTTP errors
        const error = await response.json();
        throw new Error(error.error ?? "Failed to fetch user profile");
      }

      const data = await response.json();
      return data.profile; // <-- Fix: return the profile object directly
    },
    // Don't fetch if not authenticated (you can add a dependency to user session status)
    enabled: true,
    // Refresh data when window regains focus
    refetchOnWindowFocus: true,
    // Keep data for 5 hours
    staleTime: 5 * 60 * 60 * 1000,
  });
}

export default useQueryUserProfile;

/**
 * Selector to get the user's subscription tier from the profile
 */
export function useUserSubscriptionTier(): string | undefined {
  const { data: profile } = useQueryUserProfile();
  return profile?.subscriptionTier;
}
