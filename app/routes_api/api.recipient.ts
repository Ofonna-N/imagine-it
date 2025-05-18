import { type ActionFunctionArgs } from "react-router";
import { getRecipient, saveRecipient } from "../db/queries/carts_queries";
import createSupabaseServerClient from "~/services/supabase/supabase_client";

/**
 * Resource Route: /api/recipient
 * GET: Get recipient info for the authenticated user
 * POST: Save/update recipient info
 */

export async function loader({ request }: { request: Request }) {
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const recipient = await getRecipient(user.id);
  return new Response(JSON.stringify(recipient), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const method = request.method.toUpperCase();

  if (method === "POST") {
    const { recipient } = await request.json();
    if (!recipient)
      return new Response(JSON.stringify({ error: "Missing recipient" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    const saved = await saveRecipient({ userId: user.id, recipient });
    return new Response(JSON.stringify(saved), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
