import { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { ReactNode } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { redirect } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase-client";
import {
  useLoginMutation,
  useSignupMutation,
  useSignoutMutation,
} from "~/features/auth/hooks/useAuthMutations";

// Types for our auth context
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Environment variables for client-side only state monitoring
// Using the VITE_ prefixed variables which are safe to expose to the client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";

// Browser client ONLY for tracking auth state changes
export const supabaseBrowserClient = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

// Auth provider component
export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener - this is the ONLY thing we use the browser client for
    const {
      data: { subscription },
    } = supabaseBrowserClient.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    supabaseBrowserClient.auth
      .getSession()
      .then(({ data: { session: initialSession } }) => {
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
        setLoading(false);
      });

    // Clean up
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      session,
      user,
      loading,
    }),
    [session, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Get authentication mutations
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();
  const signoutMutation = useSignoutMutation();

  // Create helper functions with the same API as before
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

  return {
    ...context,
    signIn,
    signUp,
    signOut,
  };
}

// Server-side auth check for protected routes
export async function requireAuth(request: Request) {
  const { supabase } = createSupabaseServerClient({ request });

  // Check if user is authenticated using cookies from request
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // If not authenticated, redirect to login
    throw redirect("/login");
  }

  return session;
}
