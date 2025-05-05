import { type ActionFunctionArgs } from "react-router";
import { getStoragePath } from "../utils/storage_path";
import {
  addCartItem,
  getCartItems,
  removeCartItem,
  clearCart,
  updateCartItemQuantity,
} from "../db/queries/carts_queries";
import createSupabaseServerClient from "../services/supabase/supabase_client.server";
import type { PrintfulV2OrderItem } from "~/types/printful/order_types";

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
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user?.id) return null;
  return user.id;
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
    // Accepts: item, mockupUrls (array of URLs or file data), designMeta
    const {
      item,
      mockupUrls,
      designMeta,
    }: {
      item: PrintfulV2OrderItem; // Define the type of item based on your application
      mockupUrls?: string[];
      designMeta?: any; // Define the type of designMeta based on your application
    } = await request.json();
    if (!item)
      return new Response(JSON.stringify({ error: "Missing item" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    // Upload mockup images to Supabase storage and collect new URLs
    let storedMockupUrls: string[] = [];
    if (Array.isArray(mockupUrls) && mockupUrls.length > 0) {
      const { supabase } = createSupabaseServerClient({ request });
      const userIdForStorage = userId;
      // Use product_id and variant_id for traceable storage, fallback to UUID if missing
      const variantId = item.catalog_variant_id ?? "unknown";
      // Add a timestamp for uniqueness in case of duplicate cart items
      const cartImageId = `${variantId}_${Date.now()}`;
      for (let i = 0; i < mockupUrls.length; i++) {
        const url = mockupUrls[i];
        try {
          // Fetch the image data from the provided URL
          const imageResponse = await fetch(url);
          const imageType =
            imageResponse.headers.get("content-type") ?? "image/png";
          const imageExt = imageType.split("/")[1] ?? "png";
          // Use imageKey (index) to ensure unique path for each image
          const storagePath = getStoragePath(
            userIdForStorage,
            "cart-mockup",
            cartImageId,
            imageExt,
            { imageKey: i }
          );
          const imageBuffer = await imageResponse.arrayBuffer();
          const { error: uploadError } = await supabase.storage
            .from("imagine-it")
            .upload(storagePath, Buffer.from(imageBuffer), {
              contentType: imageType,
            });
          if (uploadError) {
            // Skip this image if upload fails
            continue;
          }
          const {
            data: { publicUrl },
          } = supabase.storage.from("imagine-it").getPublicUrl(storagePath);
          storedMockupUrls.push(publicUrl);
        } catch (err) {
          // Skip this image if fetch/upload fails
          continue;
        }
      }
    }
    const created = await addCartItem({
      userId,
      item,
      mockupUrls: storedMockupUrls.length > 0 ? storedMockupUrls : undefined,
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
      // --- Begin: Delete all associated mockup images for all cart items ---
      const { supabase } = createSupabaseServerClient({ request });
      const cartItems = await getCartItems(userId);
      const deleteErrors: { itemId: any; url: string; error: any }[] = [];
      for (const cartItem of cartItems) {
        if (Array.isArray(cartItem.mockup_urls)) {
          for (const url of cartItem.mockup_urls) {
            const match = url.match(/\/public\/imagine-it\/(.+)$/);
            const storagePath = match ? match[1] : null;
            if (storagePath) {
              const { data, error } = await supabase.storage
                .from("imagine-it")
                .remove([storagePath]);
              if (error) {
                deleteErrors.push({ itemId: cartItem.id, url, error });
              }
              // Optionally log all deletions
              // console.log("Deleted:", storagePath, "Error:", error);
            }
          }
        }
      }
      // --- End: Delete all associated mockup images ---
      await clearCart(userId);
      return new Response(
        JSON.stringify({
          success: deleteErrors.length === 0,
          errors: deleteErrors.length > 0 ? deleteErrors : undefined,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    if (itemId) {
      // --- Begin: Delete associated mockup images from Supabase storage ---
      const { supabase } = createSupabaseServerClient({ request });
      // Fetch the cart item to get its mockup_urls
      const cartItems = await getCartItems(userId);
      const cartItem = cartItems.find((item) => item.id === itemId);
      const deleteErrors: { url: string; error: any }[] = [];
      if (cartItem && Array.isArray(cartItem.mockup_urls)) {
        for (const url of cartItem.mockup_urls) {
          // Supabase public URL: https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
          // Extract the path after '/public/<bucket>/'
          const match = url.match(/\/public\/imagine-it\/(.+)$/);
          const storagePath = match ? match[1] : null;
          // console.log("Storage Path:", storagePath);
          if (storagePath) {
            const { data, error } = await supabase.storage
              .from("imagine-it")
              .remove([storagePath]);
            if (error) {
              deleteErrors.push({ url, error });
            }
          }
        }
      }
      // --- End: Delete associated mockup images ---
      await removeCartItem(itemId);
      return new Response(
        JSON.stringify({
          success: deleteErrors.length === 0,
          errors: deleteErrors.length > 0 ? deleteErrors : undefined,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
