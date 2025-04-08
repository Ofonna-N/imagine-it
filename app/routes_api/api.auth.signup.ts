import createSupabaseServerClient from "~/services/supabase/supabase_client";

/**
 * Resource route for user registration
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
    const { email, password, metadata } = await request.json();

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

    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}, // Additional user metadata if provided
      },
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

    // Handle email confirmation if needed
    const emailConfirmationRequired = !data.session;

    // Return user data and confirmation status
    return new Response(
      JSON.stringify({
        success: true,
        emailConfirmationRequired,
        user: emailConfirmationRequired
          ? null
          : {
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
    console.error("Signup error:", err);
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
