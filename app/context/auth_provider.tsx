import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { redirect } from "react-router";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import createSupabaseServerClient from "~/services/supabase/supabase-client";
import {
  useLoginMutation,
  useSignupMutation,
  useSignoutMutation,
} from "~/features/auth/hooks/useAuthMutations";
import type { User } from "@supabase/supabase-js";

type CompactUserProfile = Pick<User, "id" | "email" | "user_metadata">;

// Enhanced types for our auth context to include auth methods
type AuthContextType = {
  user: CompactUserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => Promise<{ error: Error | null; emailConfirmationRequired?: boolean }>;
  signOut: () => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
      const response = await fetch("/api/auth/session", {
        credentials: "include",
      });

      if (!response.ok) {
        return { user: null };
      }

      const data = await response.json();
      return { user: data.user || null };
    },
    ...options,
  });
}

// Auth provider component
export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const { data, isLoading: loading } = useQueryUser();
  const user = data?.user ?? null;

  // Get authentication mutations within the provider
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const signoutMutation = useSignoutMutation();

  // Implement auth methods in the provider
  const signIn = async (email: string, password: string) => {
    try {
      await loginMutation.mutateAsync({ email, password });
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: Record<string, any>
  ) => {
    try {
      const result = await signupMutation.mutateAsync(
        { email, password },
        metadata
      );
      return {
        error: null,
        emailConfirmationRequired: result.emailConfirmationRequired,
      };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await signoutMutation.mutateAsync();
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Memoize the context value including auth methods
  const value: AuthContextType = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [user, loading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Simplified hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Server-side auth check for protected routes
export async function requireAuth(request: Request) {
  const { supabase } = createSupabaseServerClient({ request });

  // Check if user is authenticated using cookies from request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // If not authenticated, redirect to login
    throw redirect("/");
  }

  return user;
}
