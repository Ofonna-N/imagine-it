import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { LoaderFunctionArgs } from "react-router";

// Get environment variables - never exposed to client
const supabaseUrl = process.env.SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

/**
 * Creates a Supabase server client with the SERVICE_ROLE key for server-side operations
 * This function will handle authentication and database operations securely on the server
 */
function createSupabaseServerClient({
  request,
}: {
  request: LoaderFunctionArgs["request"];
}) {
  const headers = new Headers();
  const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      getAll: () => {
        const cookieHeader = request.headers.get("Cookie") ?? "";
        const parsedCookieHeader = parseCookieHeader(cookieHeader);
        return parsedCookieHeader.map(({ name, value }) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          const serialized = serializeCookieHeader(name, value, options);
          headers.append("Set-Cookie", serialized);
        });
      },
    },
  });

  return { headers, supabase };
}

export default createSupabaseServerClient;
