import { useQuery } from "@tanstack/react-query";
import type { UserProfile } from "~/db/queries/user_profiles_queries";

/**
 * Custom hook to fetch the user's profile
 * Uses TanStack Query for data fetching, caching, and revalidation
 */
function useQueryUserProfile() {
  return useQuery<UserProfile, Error>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const response = await fetch("/api/user/profile");

      if (!response.ok) {
        // Handle HTTP errors
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch user profile");
      }

      return response.json();
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
