import type { LoaderFunctionArgs } from "react-router";
import createSupabaseServerClient from "~/services/supabase/supabase_client.server";
import { getOrdersByUserId } from "~/db/queries/orders_queries";
import { fetchPrintfulOrderById } from "~/services/printful/printful_api";
import type { PrintfulV2GetOrderResponse } from "~/types/printful/order_types";

/**
 * GET /api/user-orders
 * Resource route for fetching all Printful orders for the current user
 * Returns an array of Printful order details for the authenticated user
 */
export async function loader({ request }: LoaderFunctionArgs) {
  // Authenticate user
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  const userId = user?.id;
  if (error || !userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  // Get all Printful order IDs for this user
  let orderIdRows;
  try {
    orderIdRows = await getOrdersByUserId(userId);
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error fetching order IDs:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch order IDs." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
  // Fetch full Printful order details for each order
  try {
    const orders: PrintfulV2GetOrderResponse["data"][] = await Promise.all(
      orderIdRows.map((row) => fetchPrintfulOrderById(row.printful_order_id))
    );
    return new Response(JSON.stringify({ orders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Log the error for debugging purposes
    console.error("Error fetching Printful order details:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Printful order details." }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }
}
