import { type ActionFunctionArgs } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client.server";
import { createPrintfulOrder } from "~/services/printful/printful_api";
import { insertOrder } from "~/db/queries/orders_queries";
import type { PrintfulV2CreateOrderRequest } from "~/types/printful/order_types";

/**
 * POST /api/printful-order
 * Resource route for creating a Printful order after payment
 */
export async function action({ request }: ActionFunctionArgs) {
  // Use Supabase server client to get user session
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: PrintfulV2CreateOrderRequest;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Call Printful API to create order
  let printfulOrder;
  try {
    printfulOrder = await createPrintfulOrder(body);
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Printful order failed" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  // Store minimal order info in DB using the dedicated query
  try {
    await insertOrder({
      userId,
      printfulOrderData: printfulOrder.data,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Failed to save order." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  const orderData = printfulOrder.data;
  return new Response(
    JSON.stringify({
      orderId: orderData.id,
      status: orderData.status,
      total: orderData.costs.total,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
