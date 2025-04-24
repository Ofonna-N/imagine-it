import { db } from "../index";
import { carts, cart_items, recipients } from "../schema/carts";
import type { Cart, CartItem, Recipient } from "../schema/carts";
import type {
  PrintfulV2OrderItem,
  PrintfulV2OrderRecipient,
} from "~/types/printful";
import { eq } from "drizzle-orm"; // Import eq for query conditions

/**
 * Get or create a cart for a user
 */
export async function getOrCreateCart(userId: string): Promise<Cart> {
  let cart = await db
    .select()
    .from(carts)
    .where(eq(carts.user_id, userId))
    .limit(1)
    .then((r) => r[0]);
  if (!cart) {
    const [created] = await db
      .insert(carts)
      .values({ user_id: userId })
      .returning();
    cart = created;
  }
  return cart;
}

/**
 * Add an item to a user's cart
 */
export async function addCartItem({
  userId,
  item,
  mockupUrls,
  designMeta,
}: {
  userId: string;
  item: PrintfulV2OrderItem;
  mockupUrls?: string[];
  designMeta?: any;
}): Promise<CartItem> {
  const cart = await getOrCreateCart(userId);
  const [created] = await db
    .insert(cart_items)
    .values({
      cart_id: cart.id,
      item_data: item,
      mockup_urls: mockupUrls,
      design_meta: designMeta,
    })
    .returning();
  return created;
}

/**
 * Get all items in a user's cart
 */
export async function getCartItems(userId: string): Promise<CartItem[]> {
  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.user_id, userId))
    .limit(1)
    .then((r) => r[0]);
  if (!cart) return [];
  return db.select().from(cart_items).where(eq(cart_items.cart_id, cart.id));
}

/**
 * Remove an item from a cart by item id
 */
export async function removeCartItem(itemId: number): Promise<void> {
  await db.delete(cart_items).where(eq(cart_items.id, itemId));
}

/**
 * Clear all items from a user's cart
 */
export async function clearCart(userId: string): Promise<void> {
  const cart = await db
    .select()
    .from(carts)
    .where(eq(carts.user_id, userId))
    .limit(1)
    .then((r) => r[0]);
  if (!cart) return;
  await db.delete(cart_items).where(eq(cart_items.cart_id, cart.id));
}

/**
 * Save or update recipient info for a user
 */
export async function saveRecipient({
  userId,
  recipient,
}: {
  userId: string;
  recipient: PrintfulV2OrderRecipient;
}): Promise<Recipient> {
  // Upsert: if exists, update; else, insert
  const existing = await db
    .select()
    .from(recipients)
    .where(eq(recipients.user_id, userId))
    .limit(1)
    .then((r) => r[0]);
  if (existing) {
    const [updated] = await db
      .update(recipients)
      .set({ recipient_data: recipient, updated_at: new Date() })
      .where(eq(recipients.user_id, userId))
      .returning();
    return updated;
  } else {
    const [created] = await db
      .insert(recipients)
      .values({ user_id: userId, recipient_data: recipient })
      .returning();
    return created;
  }
}

/**
 * Get recipient info for a user
 */
export async function getRecipient(userId: string): Promise<Recipient | null> {
  return db
    .select()
    .from(recipients)
    .where(eq(recipients.user_id, userId))
    .limit(1)
    .then((r) => r[0] ?? null);
}

/**
 * Update the quantity of a cart item
 *
 * PATCH /api/cart
 * Utility: Updates the quantity of a specific cart item for the authenticated user.
 */
export async function updateCartItemQuantity({
  userId,
  itemId,
  quantity,
}: {
  userId: string;
  itemId: number;
  quantity: number;
}) {
  // Fetch the cart item and ensure it belongs to the user
  const cart = await getOrCreateCart(userId);
  const item = await db
    .select()
    .from(cart_items)
    .where(eq(cart_items.id, itemId))
    .then((r) => r[0]);
  if (!item || item.cart_id !== cart.id)
    throw new Error("Unauthorized or not found");
  // Update the quantity in item_data
  const newItemData = { ...(item.item_data ?? {}), quantity };
  const [updated] = await db
    .update(cart_items)
    .set({ item_data: newItemData })
    .where(eq(cart_items.id, itemId))
    .returning();
  return updated;
}
