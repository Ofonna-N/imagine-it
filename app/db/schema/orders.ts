import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * orders table schema
 * Stores minimal order metadata for each user, referencing Printful order ID.
 */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  printful_order_id: integer("printful_order_id").notNull(),
  status: text("status").notNull(),
  created_at: timestamp("created_at").notNull().defaultNow(),
  total: integer("total").notNull(),
  summary: jsonb("summary").notNull(), // e.g., { items: [...], shipping: {...} }
}).enableRLS(); // Enable Row-Level Security (RLS) for security

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
