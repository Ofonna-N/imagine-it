import {
  pgTable,
  serial,
  integer,
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
}).enableRLS(); // Enable RLS for security

/**
 * cart_items table
 * Each row is an item in a user's cart.
 * Uses PrintfulV2OrderItem shape for item data.
 * Adds design_meta for design metadata (name, id, image, etc.).
 */
export const cart_items = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cart_id: integer("cart_id")
    .notNull()
    .references(() => carts.id),
  item_data: jsonb("item_data").notNull().$type<PrintfulV2OrderItem>(), // PrintfulV2OrderItem shape
  mockup_urls: jsonb("mockup_urls").$type<string[]>(), // Store array of generated mock image URLs
  design_meta: jsonb("design_meta").$type<{
    designId: string;
    designName: string;
    designImageUrl: string;
  }>(), // <designId, designName, designImageUrl>
  created_at: timestamp("created_at").defaultNow().notNull(),
}).enableRLS(); // Enable RLS for security

/**
 * recipients table
 * Stores recipient info for a user (PrintfulV2OrderRecipient shape)
 */
export const recipients = pgTable("recipients", {
  id: serial("id").primaryKey(),
  user_id: uuid("user_id").notNull(),
  // PrintfulV2OrderRecipient shape
  /**
   * Utility: Enforces type safety for recipient_data using PrintfulV2OrderRecipient.
   * See: /types/printful.ts for PrintfulV2OrderRecipient definition.
   */
  recipient_data: jsonb("recipient_data")
    .$type<PrintfulV2OrderRecipient>()
    .notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
}).enableRLS(); // Enable RLS for security

// Type inference for queries
export type Cart = typeof carts.$inferSelect;
export type CartInsert = typeof carts.$inferInsert;
export type CartItem = typeof cart_items.$inferSelect;
export type CartItemInsert = typeof cart_items.$inferInsert;
export type Recipient = typeof recipients.$inferSelect;
export type RecipientInsert = typeof recipients.$inferInsert;
