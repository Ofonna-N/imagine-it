import createSupabaseServerClient from "~/services/supabase/supabase_client.server";
import type { OAuthProvider } from "~/features/auth/hooks/use_auth_mutations";

/**
 * Resource route for initiating OAuth sign-in flow
 * Uses the SERVICE_ROLE key securely on the server
 */
export async function action({
  request,
  params,
}: {
  request: Request;
  params: { provider: string };
}) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const provider = params.provider as OAuthProvider;

  if (!["google", "github", "facebook", "twitter"].includes(provider)) {
    return new Response(
      JSON.stringify({ error: "Unsupported OAuth provider" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Use unified client for secure server-side auth
    const { supabase, headers } = createSupabaseServerClient({ request });

    // Get the redirect URL from the request or use a default
    const redirectTo = `${new URL(request.url).origin}/api/auth/oauth/callback`;

    // Initiate the OAuth sign-in process
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          prompt: "consent",
          access_type: "offline",
        },
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

    // Return the URL to redirect to
    return new Response(
      JSON.stringify({
        url: data.url,
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
    console.error("OAuth error:", err);
    return new Response(JSON.stringify({ error: "Authentication failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
