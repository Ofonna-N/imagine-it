import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { User } from "@supabase/supabase-js";
import { API_ROUTES } from "~/constants/route_paths"; // Import API route constants

type CompactUserProfile = Pick<User, "id" | "email" | "user_metadata">;

/**
 * Interface for user query parameters
 */
interface UserQueryParams {
  includeMetadata?: boolean;
}

/**
 * Interface for user query response
 */
interface UserQueryResponse {
  user: CompactUserProfile | null;
}

/**
 * Hook for fetching the current user using TanStack Query
 *
 * @param params - Query parameters for customizing the user fetch
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with user data, loading state, error state, etc.
 */
export function useQueryUser({
  params = {},
  options,
}: {
  params?: UserQueryParams;
  options?: Partial<
    UseQueryOptions<
      UserQueryResponse,
      Error,
      UserQueryResponse,
      ["user", UserQueryParams]
    >
  >;
} = {}) {
  return useQuery({
    queryKey: ["user", params],
    queryFn: async () => {
      const response = await fetch(API_ROUTES.AUTH.SESSION, {
        // Use constant
        credentials: "include",
      });

      if (!response.ok) {
        // Handle non-OK responses, e.g., user not logged in
        return { user: null };
      }

      try {
        const data = await response.json();
        return { user: data.user ?? null };
      } catch (error) {
        // Handle JSON parsing errors or other issues
        console.error("Error fetching or parsing user session:", error);
        return { user: null };
      }
    },
    ...options,
  });
}
