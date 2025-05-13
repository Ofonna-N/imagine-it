import { getUserProfileById } from "~/db/queries/user_profiles_queries";
import createSupabaseServerClient from "~/services/supabase/supabase_client";

/**
 * Resource route to fetch the current user's profile
 * Protected - requires authentication
 */
export async function loader({ request }: { request: Request }) {
  try {
    // Get authenticated session
    const { supabase, headers } = createSupabaseServerClient({ request });
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser();

    // Check authentication
    if (sessionError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(headers),
        },
      });
    }

    // Get user profile from database
    const profile = await getUserProfileById(user.id);

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          ...Object.fromEntries(headers),
        },
      });
    }

    // Return profile data
    return new Response(JSON.stringify({ profile }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...Object.fromEntries(headers),
      },
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch user profile" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
