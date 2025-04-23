import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  json,
} from "drizzle-orm/pg-core";

/**
 * Drizzle schema for storing user designs
 */
export const designsTable = pgTable("designs", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  productId: uuid("product_id"),
  isPublic: boolean("is_public").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  canvasData: json("canvas_data").notNull().default({}),
}).enableRLS();

/**
 * Type for selecting designs
 */
export type DesignRecord = typeof designsTable.$inferSelect;

/**
 * Type for inserting new designs
 */
export type NewDesignRecord = typeof designsTable.$inferInsert;
