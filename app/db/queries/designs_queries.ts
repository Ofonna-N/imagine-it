import { db } from "..";
import {
  designsTable,
  type DesignRecord,
  type NewDesignRecord,
} from "../schema/designs";
import { eq, and, desc } from "drizzle-orm";

// Combine NewDesignRecord fields with explicit id
export type CreateDesignInput = NewDesignRecord & { id: string };

/**
 * Fetch all designs for a given user, most recent first
 */
export async function getDesignsByUserId(
  userId: string
): Promise<DesignRecord[]> {
  return db
    .select()
    .from(designsTable)
    .where(eq(designsTable.userId, userId))
    .orderBy(desc(designsTable.createdAt));
}

/**
 * Fetch a single design by its ID, scoped to a specific user
 */
export async function getDesignByIdAndUser(
  id: string,
  userId: string
): Promise<DesignRecord | null> {
  const result = await db
    .select()
    .from(designsTable)
    .where(and(eq(designsTable.id, id), eq(designsTable.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

/**
 * Create a new design record
 */
export async function createDesign(
  input: CreateDesignInput
): Promise<DesignRecord> {
  const [newDesign] = await db.insert(designsTable).values(input).returning();
  return newDesign;
}
