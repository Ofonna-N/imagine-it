import { insertOrCreateUserProfile } from "~/db/queries/user_profiles_queries";
import createSupabaseServerClient from "~/services/supabase/supabase_client.server";

/**
 * Resource route for user login
 * Uses the SERVICE_ROLE key securely on the server
 */
export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { email, password } = await request.json();

    // Validate inputs
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Use unified client for secure server-side auth
    const { supabase, headers } = createSupabaseServerClient({ request });

    // Sign in the user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(headers),
        },
      });
    }

    // After successful login
    if (data.user) {
      await insertOrCreateUserProfile(data.user);
    }

    // Return minimal user data (no sensitive information)
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          user_metadata: data.user?.user_metadata,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(headers),
        },
      }
    );
  } catch (err) {
    console.error("Login error:", err);
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
