import {
  pgTable,
  serial,
  integer,
  text,
  jsonb,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import type {
  PrintfulV2OrderItem,
  PrintfulV2OrderRecipient,
} from "~/types/printful";

/**
 * carts table
 * Each user/session has one cart.
 */
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull(), // Foreign key to users table
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * cart_items table
 * Each row is an item in a user's cart.
 * Uses PrintfulV2OrderItem shape for item data.
 */
export const cart_items = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cart_id: integer("cart_id")
    .notNull()
    .references(() => carts.id),
  item_data: jsonb("item_data").notNull(), // PrintfulV2OrderItem shape
  mockup_urls: jsonb("mockup_urls"), // Store array of generated mock image URLs
  created_at: timestamp("created_at").defaultNow().notNull(),
});

/**
 * recipients table
 * Stores recipient info for a user (PrintfulV2OrderRecipient shape)
 */
export const recipients = pgTable("recipients", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  recipient_data: jsonb("recipient_data").notNull(), // PrintfulV2OrderRecipient shape
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// Type inference for queries
export type Cart = typeof carts.$inferSelect;
export type CartInsert = typeof carts.$inferInsert;
export type CartItem = typeof cart_items.$inferSelect;
export type CartItemInsert = typeof cart_items.$inferInsert;
export type Recipient = typeof recipients.$inferSelect;
export type RecipientInsert = typeof recipients.$inferInsert;
