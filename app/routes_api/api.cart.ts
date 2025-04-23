import { type ActionFunctionArgs } from "react-router";
import {
  getOrCreateCart,
  addCartItem,
  getCartItems,
  removeCartItem,
  clearCart,
  updateCartItemQuantity,
} from "../db/queries/carts_queries";
import createSupabaseServerClient from "../services/supabase/supabase_client";
import type { PrintfulV2OrderItem } from "../types/printful";

/**
 * Resource Route: /api/cart
 * GET: Get all cart items for the authenticated user
 * POST: Add an item to the user's cart
 * DELETE: Remove an item or clear the cart
 */

/**
 * Helper to get the authenticated user ID from Supabase session
 */
async function getUserIdFromRequest(request: Request): Promise<string | null> {
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session?.user?.id) return null;
  return session.user.id;
}

export async function loader({ request }: { request: Request }) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const items = await getCartItems(userId);
  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  const method = request.method.toUpperCase();

  if (method === "POST") {
    const { item, mockupUrls, designMeta } = await request.json();
    if (!item)
      return new Response(JSON.stringify({ error: "Missing item" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    const created = await addCartItem({
      userId,
      item,
      mockupUrls,
      designMeta,
    });
    return new Response(JSON.stringify(created), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (method === "PATCH") {
    const { itemId, quantity } = await request.json();
    if (!itemId || typeof quantity !== "number" || quantity < 1) {
      return new Response(JSON.stringify({ error: "Invalid input" }), {
        status: 400,
      });
    }
    try {
      const updated = await updateCartItemQuantity({
        userId,
        itemId,
        quantity,
      });
      return new Response(JSON.stringify(updated), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: (err as Error).message }), {
        status: 400,
      });
    }
  }

  if (method === "DELETE") {
    const { itemId, clear } = await request.json();
    if (clear) {
      await clearCart(userId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    if (itemId) {
      await removeCartItem(itemId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }
    return new Response(
      JSON.stringify({ error: "Missing itemId or clear flag" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}
