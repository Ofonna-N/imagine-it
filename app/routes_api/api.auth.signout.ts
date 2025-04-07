import createSupabaseServerClient from "~/services/supabase/supabase-client";

/**
 * Resource route for user logout
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
    // Use unified client for secure server-side auth
    const { supabase, headers } = createSupabaseServerClient({ request });

    // Sign out the user
    const { error } = await supabase.auth.signOut();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(headers),
        },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(headers),
      },
    });
  } catch (err) {
    console.error("Signout error:", err);
    return new Response(JSON.stringify({ error: "Sign out failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
