import { db } from "../index";
import { orders, type Order, type NewOrder } from "../schema/orders";
import type { PrintfulV2OrderResponseData } from "~/types/printful/order_types";
import { eq } from "drizzle-orm";
/**
 * Inserts a new order into the orders table after Printful order creation.
 * @param params - Object containing userId and Printful order response data
 * @returns The inserted order record
 */
export async function insertOrder({
  userId,
  printfulOrderData,
}: {
  userId: string;
  printfulOrderData: PrintfulV2OrderResponseData;
}): Promise<Order> {
  try {
    const insertData: NewOrder = {
      user_id: userId,
      printful_order_id: printfulOrderData.id,
      // Only minimal fields needed
    };
    const [order] = await db.insert(orders).values(insertData).returning();
    return order;
  } catch (err) {
    // Log error without leaking sensitive info
    console.error("Failed to insert order after Printful:", err);
    throw new Error("Failed to save order. Please try again later.");
  }
}

/**
 * Query: Get all order records for a user
 * Returns a list of order records with only id, printful_order_id, and created_at
 */
export async function getOrdersByUserId(
  userId: string
): Promise<Pick<Order, "id" | "printful_order_id" | "created_at">[]> {
  try {
    return await db
      .select({
        id: orders.id,
        printful_order_id: orders.printful_order_id,
        created_at: orders.created_at,
      })
      .from(orders)
      .where(eq(orders.user_id, userId));
  } catch (err) {
    console.error("Failed to fetch order IDs for user:", err);
    throw new Error("Failed to fetch order IDs.");
  }
}
