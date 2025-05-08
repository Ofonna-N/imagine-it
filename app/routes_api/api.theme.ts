import { themeSessionStorage } from "~/utils/theme_session";

/**
 * PATCH /api/theme
 * Resource Route: Persists the user's theme mode (light/dark) in a cookie session
 */
export async function action({ request }: { request: Request }) {
  if (request.method !== "PATCH") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const { mode } = await request.json();
    if (mode !== "light" && mode !== "dark") {
      return new Response(JSON.stringify({ error: "Invalid mode" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const cookie = request.headers.get("Cookie");
    const session = await themeSessionStorage.getSession(cookie);
    session.set("mode", mode);
    return new Response(JSON.stringify({ success: true, mode }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": await themeSessionStorage.commitSession(session),
      },
    });
  } catch (err) {
    // Handle known error types, otherwise return a generic error
    const message =
      err instanceof Error ? err.message : "Failed to update theme mode";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
