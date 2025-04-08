import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import {
  useLoginMutation,
  useSignupMutation,
  useSignoutMutation,
} from "~/features/auth/hooks/useAuthMutations";
import { useQueryUser } from "~/features/auth/hooks/useQueryUser";
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
