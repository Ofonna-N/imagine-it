import type { User } from "@supabase/supabase-js";
import { db } from "..";
import { profilesTable, type UserProfile } from "../schema/profiles";
import { eq, or, lt, and, isNotNull } from "drizzle-orm";
import { getSubscriptionTierConfig } from "~/config/subscription_tiers";

export async function insertOrCreateUserProfile(user: User): Promise<void> {
  try {
    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.id, user.id))
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
        // No subscription fields set here; handled by business logic elsewhere
      });
    } else {
      // Profile already exists
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
    if (!result[0]) return null;
    return result[0];
  } catch (error) {
    console.error("Error fetching user profile by ID:", error);
    throw new Error("Could not fetch user profile.");
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
    if (!updatedProfiles[0]) return null;
    return updatedProfiles[0];
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

/**
 * Grant user subscription credits for the current tier
 */
export async function grantUserSubscriptionCredits(
  userId: string,
  tier: "free" | "creator" | "pro"
): Promise<void> {
  const config = getSubscriptionTierConfig(tier);
  const credits = config.features.artGenCreditsPerMonth;
  await addUserCredits(userId, credits);
  // Removed updateUserLastCreditsGrantedAt
}

// --- Subscription management queries ---

/**
 * Update the user's active subscription fields atomically.
 */
export async function updateUserActiveSubscription(
  userId: string,
  {
    paypalSubscriptionId,
    subscriptionTier,
    subscriptionPeriodEnd,
  }: {
    paypalSubscriptionId: string | null;
    subscriptionTier: "free" | "creator" | "pro" | null;
    subscriptionPeriodEnd: Date | null;
  }
): Promise<UserProfile | null> {
  const updated = await db
    .update(profilesTable)
    .set({
      activePaypalSubscriptionId: paypalSubscriptionId,
      activeSubscriptionTier: subscriptionTier,
      activeSubscriptionPeriodEnd: subscriptionPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, userId))
    .returning();
  return updated[0] ?? null;
}

/**
 * Update the user's pending-cancel subscription fields atomically.
 */
export async function updateUserPendingSubscription(
  userId: string,
  {
    paypalSubscriptionId,
    subscriptionTier,
    subscriptionPeriodEnd,
  }: {
    paypalSubscriptionId: string | null;
    subscriptionTier: "free" | "creator" | "pro" | null;
    subscriptionPeriodEnd: Date | null;
  }
): Promise<UserProfile | null> {
  const updated = await db
    .update(profilesTable)
    .set({
      pendingPaypalSubscriptionId: paypalSubscriptionId,
      pendingSubscriptionTier: subscriptionTier,
      pendingSubscriptionPeriodEnd: subscriptionPeriodEnd,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, userId))
    .returning();
  return updated[0] ?? null;
}

/**
 * Clear the user's active subscription fields.
 */
export async function clearUserActiveSubscription(
  userId: string
): Promise<UserProfile | null> {
  const updated = await db
    .update(profilesTable)
    .set({
      activePaypalSubscriptionId: null,
      activeSubscriptionTier: null,
      activeSubscriptionPeriodEnd: null,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, userId))
    .returning();
  return updated[0] ?? null;
}

/**
 * Clear the user's pending-cancel subscription fields.
 */
export async function clearUserPendingSubscription(
  userId: string
): Promise<UserProfile | null> {
  const updated = await db
    .update(profilesTable)
    .set({
      pendingPaypalSubscriptionId: null,
      pendingSubscriptionTier: null,
      pendingSubscriptionPeriodEnd: null,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, userId))
    .returning();
  return updated[0] ?? null;
}

/**
 * Find users whose active or pending subscription period has expired (for downgrading).
 */
export async function getUsersWithExpiredSubscriptions(
  now: Date
): Promise<UserProfile[]> {
  return await db
    .select()
    .from(profilesTable)
    .where(
      or(
        and(
          lt(profilesTable.activeSubscriptionPeriodEnd, now),
          isNotNull(profilesTable.activeSubscriptionPeriodEnd)
        ),
        and(
          lt(profilesTable.pendingSubscriptionPeriodEnd, now),
          isNotNull(profilesTable.pendingSubscriptionPeriodEnd)
        )
      )
    );
}

/**
 * Find a user by PayPal subscription ID (active or pending).
 */
export async function getUserProfileByPaypalSubscriptionId(
  paypalSubscriptionId: string
): Promise<UserProfile | null> {
  const result = await db
    .select()
    .from(profilesTable)
    .where(
      or(
        eq(profilesTable.activePaypalSubscriptionId, paypalSubscriptionId),
        eq(profilesTable.pendingPaypalSubscriptionId, paypalSubscriptionId)
      )
    )
    .limit(1);
  return result[0] ?? null;
}
