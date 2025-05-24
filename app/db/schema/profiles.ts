import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";

// Create a roles enum for type safety
export const userRoleEnum = pgEnum("user_role", ["admin", "customer"]);
export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "creator",
  "pro",
]);

export const profilesTable = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  roles: userRoleEnum("roles").array().notNull().default(["customer"]),
  credits: integer("credits").notNull().default(0), // Add credits column
  // --- Active subscription fields ---
  activePaypalSubscriptionId: text("active_paypal_subscription_id"),
  activeSubscriptionTier: subscriptionTierEnum("active_subscription_tier"),
  activeSubscriptionPeriodEnd: timestamp("active_subscription_period_end"),
  // --- Pending-cancel subscription fields ---
  pendingPaypalSubscriptionId: text("pending_paypal_subscription_id"),
  pendingSubscriptionTier: subscriptionTierEnum("pending_subscription_tier"),
  pendingSubscriptionPeriodEnd: timestamp("pending_subscription_period_end"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}).enableRLS();

export type UserProfile = typeof profilesTable.$inferSelect & {
  activeSubscriptionTier?: "free" | "creator" | "pro" | null;
  pendingSubscriptionTier?: "free" | "creator" | "pro" | null;
};
export type NewUserProfile = typeof profilesTable.$inferInsert & {
  activeSubscriptionTier?: "free" | "creator" | "pro" | null;
  pendingSubscriptionTier?: "free" | "creator" | "pro" | null;
};
