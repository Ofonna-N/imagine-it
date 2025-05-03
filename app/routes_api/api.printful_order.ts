import { type ActionFunctionArgs } from "react-router";
import { db } from "~/db/index";
import { orders } from "~/db/schema/orders";
import createSupabaseServerClient from "~/services/supabase/supabase_client.server";
import { createPrintfulOrder } from "~/services/printful/printful_api";
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
  // Store minimal order info in DB
  const orderData = printfulOrder.data;
  await db.insert(orders).values({
    user_id: userId,
    printful_order_id: orderData.id,
    status: orderData.status,
    total: Number(orderData.costs.total ?? 0),
    summary: {
      items: orderData.order_items,
      shipping: orderData.recipient,
      costs: orderData.costs,
    },
  });
  return new Response(
    JSON.stringify({
      orderId: orderData.id,
      status: orderData.status,
      total: orderData.costs.total,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
