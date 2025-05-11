import type { ActionFunctionArgs } from "react-router";
import { addUserCredits } from "~/db/queries/user_profiles_queries";
import createSupabaseServerClient from "~/services/supabase/supabase_client";

/**
 * POST /api/purchase-credits
 * Resource route for adding credits to a user's account after payment.
 */
export type PurchaseCreditsRequest = {
  credits: number; // Number of credits to add
  paymentId: string; // Payment provider transaction ID (for audit)
};

/**
 * POST /api/purchase-credits
 * Utility: Response after credits are added
 */
export type PurchaseCreditsResponse = {
  success: boolean;
  newBalance: number;
};

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as PurchaseCreditsRequest;
    if (!body.credits || body.credits <= 0) {
      return new Response(JSON.stringify({ error: "Invalid credits amount" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Optionally: verify paymentId with payment provider here
    const updated = await addUserCredits(user.id, body.credits);
    if (!updated) {
      throw new Error("Failed to add credits");
    }
    return new Response(
      JSON.stringify({ success: true, newBalance: updated.credits }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in purchase credits action:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
