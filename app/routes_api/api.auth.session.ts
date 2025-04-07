import createSupabaseServerClient from "~/services/supabase/supabase-client";

/**
 * Resource route for getting the current user session
 * Uses the SERVICE_ROLE key securely on the server
 */
export async function loader({ request }: { request: Request }) {
  try {
    // Use unified server client to get the current session
    const { supabase, headers } = createSupabaseServerClient({ request });

    // Get the current session from cookies
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({
          user: null,
          authenticated: false,
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...Object.fromEntries(headers),
          },
        }
      );
    }

    // Return minimal user data (no sensitive information)
    return new Response(
      JSON.stringify({
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
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
    console.error("Session fetch error:", err);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch session",
        authenticated: false,
        user: null,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
