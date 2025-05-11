import type { User } from "@supabase/supabase-js";
import { db } from "..";
import { profilesTable, type UserProfile } from "../schema/profiles";
import { eq } from "drizzle-orm";

export async function insertOrCreateUserProfile(user: User): Promise<void> {
  try {
    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.id ?? "", user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      await db.insert(profilesTable).values({
        id: user.id,
        firstName:
          user.user_metadata?.first_name ?? user.email?.split("@")[0] ?? "User",
        avatarUrl: user.user_metadata?.avatar_url ?? "",
        lastName: user.user_metadata?.last_name ?? "",
        phone: user.user_metadata?.phone ?? "",
        email: user.email ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      console.log(`Profile already exists for user ${user.id}`);
    }
  } catch (error) {
    console.error("Error ensuring user profile:", error);
    // Don't throw - we don't want to break the auth flow if profile creation fails
  }
}

export async function getUserProfileById(
  userId: string
): Promise<UserProfile | null> {
  try {
    const result = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.id, userId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Error fetching user profile by ID:", error);
    throw new Error("Could not fetch user profile."); // Changed to throw error
  }
}

/**
 * Updates the credit balance for a user.
 * @param userId - The ID of the user.
 * @param newCreditAmount - The new credit amount.
 * @returns The updated user profile.
 */
export async function updateUserCredits(
  userId: string,
  newCreditAmount: number
): Promise<UserProfile | null> {
  try {
    if (newCreditAmount < 0) {
      throw new Error("Credit amount cannot be negative.");
    }
    const updatedProfiles = await db
      .update(profilesTable)
      .set({ credits: newCreditAmount, updatedAt: new Date() })
      .where(eq(profilesTable.id, userId))
      .returning();
    return updatedProfiles[0] || null;
  } catch (error) {
    console.error("Error updating user credits:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Could not update user credits.");
  }
}

/**
 * Deducts credits from a user's balance.
 * @param userId - The ID of the user.
 * @param creditsToDeduct - The amount of credits to deduct.
 * @returns The updated user profile.
 * @throws Error if user has insufficient credits or if update fails.
 */
export async function deductUserCredits(
  userId: string,
  creditsToDeduct: number
): Promise<UserProfile> {
  const user = await getUserProfileById(userId);

  if (!user) {
    throw new Error("User not found for credit deduction.");
  }

  if (user.credits === undefined || user.credits === null) {
    throw new Error("User credits information is missing.");
  }

  if (user.credits < creditsToDeduct) {
    throw new Error("Insufficient credits.");
  }

  const newCreditAmount = user.credits - creditsToDeduct;
  const updatedProfile = await updateUserCredits(userId, newCreditAmount);

  if (!updatedProfile) {
    throw new Error("Failed to update user credits after deduction.");
  }
  return updatedProfile;
}

/**
 * Adds credits to a user's balance.
 * @param userId - The ID of the user.
 * @param creditsToAdd - The amount of credits to add.
 * @returns The updated user profile.
 */
export async function addUserCredits(
  userId: string,
  creditsToAdd: number
): Promise<UserProfile | null> {
  try {
    if (creditsToAdd <= 0) {
      throw new Error("Credits to add must be positive.");
    }
    const user = await getUserProfileById(userId);
    if (!user) {
      throw new Error("User not found for credit addition.");
    }
    const newCreditAmount = (user.credits ?? 0) + creditsToAdd;
    return await updateUserCredits(userId, newCreditAmount);
  } catch (error) {
    console.error("Error adding user credits:", error);
    throw error;
  }
}
