import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";

// Create a roles enum for type safety
export const userRoleEnum = pgEnum("user_role", ["admin", "customer"]);

export const profilesTable = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  avatarUrl: text("avatar_url"),
  // Change to array of roles
  roles: userRoleEnum("roles").array().notNull().default(["customer"]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}).enableRLS();

export type UserProfile = typeof profilesTable.$inferSelect;
export type NewUserProfile = typeof profilesTable.$inferInsert;
