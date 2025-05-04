import { redirect } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client.server";
import { insertOrCreateUserProfile } from "~/db/queries/user_profiles_queries";
import { APP_ROUTES, AUTH_ROUTES } from "~/constants/route_paths"; // Import AUTH_ROUTES

/**
 * OAuth callback handler
 * Processes the OAuth provider's response and establishes a session
 */
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? APP_ROUTES.HOME;

    if (code) {
      const { supabase, headers } = createSupabaseServerClient({ request });
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        // Create profile for OAuth users
        await insertOrCreateUserProfile(data.user);

        return redirect(next, { headers });
      }
    }

    return redirect(`${AUTH_ROUTES.LOGIN}?error=Missing code parameter`);
  } catch (err) {
    console.error("OAuth callback processing error:", err);
    return redirect(`${AUTH_ROUTES.LOGIN}?error=Authentication failed`);
  }
}
