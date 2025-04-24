import { redirect } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client.server";

/**
 * Utility function to check authentication status and redirect if needed
 * @param request Current request object
 * @param redirectAuthenticatedTo Path to redirect authenticated users to (usually "/")
 * @param redirectUnauthenticatedTo Path to redirect unauthenticated users to (or null to not redirect)
 * @returns Object containing authentication status
 */
export async function checkAuthAndRedirect(
  request: Request,
  redirectAuthenticatedTo: string | null = "/",
  redirectUnauthenticatedTo: string | null = null
) {
  try {
    const { supabase } = createSupabaseServerClient({ request });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const isAuthenticated = !!user;

    // Redirect authenticated users away from login/signup pages
    if (isAuthenticated && redirectAuthenticatedTo) {
      throw redirect(redirectAuthenticatedTo);
    }

    // Redirect unauthenticated users away from protected pages
    if (!isAuthenticated && redirectUnauthenticatedTo) {
      throw redirect(redirectUnauthenticatedTo);
    }

    return {
      isAuthenticated,
      user: {
        id: user?.id ?? null,
        email: user?.email ?? null,
        user_metadata: user?.user_metadata || null,
        created_at: user?.user_metadata?.created_at || null,
        // Add any other user properties you need
      },
    };
  } catch (error) {
    // If the error is a redirect, let it bubble up
    if (error instanceof Response && error.status === 302) {
      throw error;
    }

    // Otherwise return not authenticated
    return {
      isAuthenticated: false,
      user: null,
    };
  }
}
