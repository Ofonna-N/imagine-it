import { pgTable, serial, integer, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * orders table schema
 * Stores only minimal order metadata for each user, referencing Printful order ID.
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  printful_order_id: integer("printful_order_id").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
}).enableRLS(); // Enable Row-Level Security (RLS) for security

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
