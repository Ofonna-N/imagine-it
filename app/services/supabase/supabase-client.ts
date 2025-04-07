import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import type { LoaderFunctionArgs } from "react-router";

// Get environment variables
const supabaseUrl =
  process.env.SUPABASE_URL ?? "https://bnrdhpyasurtcrananic.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY ?? "";

// Initialize the Supabase client
function createSupabaseClient(request: LoaderFunctionArgs["request"]) {
  const headers = new Headers();
  const client = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      // Using the new API pattern
      getAll: () => {
        const cookieHeader = request.headers.get("Cookie") ?? "";
        const parsedCookieHeader = parseCookieHeader(cookieHeader);
        // Convert to required format with explicit name/value
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

  return { headers, client };
}

export default createSupabaseClient;
