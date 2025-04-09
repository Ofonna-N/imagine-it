import { redirect } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client";
import { insertOrCreateUserProfile } from "~/db/queries/user_profiles_queries";

/**
 * OAuth callback handler
 * Processes the OAuth provider's response and establishes a session
 */
export async function loader({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const next = url.searchParams.get("next") ?? "/";

    if (code) {
      const { supabase, headers } = createSupabaseServerClient({ request });
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        // Create profile for OAuth users
        await insertOrCreateUserProfile(data.user);

        return redirect(next, { headers });
      }
    }

    return redirect("/login?error=Missing code parameter");
  } catch (err) {
    console.error("OAuth callback processing error:", err);
    return redirect("/login?error=Authentication failed");
  }
}
