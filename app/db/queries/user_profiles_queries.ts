import type { User } from "@supabase/supabase-js";
import { db } from "..";
import { profilesTable, type UserProfile } from "../schema/profiles";
import { eq, and, lt } from "drizzle-orm";

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
        subscriptionTier: "free", // Default to free tier
      });
    } else {
      // Optionally, update subscriptionTier if missing (migration safety)
      if (!existingProfile[0].subscriptionTier) {
        await db
          .update(profilesTable)
          .set({ subscriptionTier: "free" })
          .where(eq(profilesTable.id, user.id));
      }
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
 * Updates the subscription tier for a user.
 * @param userId - The ID of the user.
 * @param newTier - The new subscription tier.
 * @returns The updated user profile.
 */
export async function updateUserSubscriptionTier(
  userId: string,
  newTier: "free" | "creator" | "pro"
): Promise<UserProfile | null> {
  try {
    const updatedProfiles = await db
      .update(profilesTable)
      .set({ subscriptionTier: newTier, updatedAt: new Date() })
      .where(eq(profilesTable.id, userId))
      .returning();
    return updatedProfiles[0] || null;
  } catch (error) {
    console.error("Error updating user subscription tier:", error);
    throw new Error("Could not update user subscription tier.");
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

// Update the user's PayPal subscription ID
export async function updateUserPaypalSubscriptionId(
  userId: string,
  paypalSubscriptionId: string | null
): Promise<UserProfile | null> {
  try {
    const updatedProfiles = await db
      .update(profilesTable)
      .set({ paypalSubscriptionId, updatedAt: new Date() })
      .where(eq(profilesTable.id, userId))
      .returning();
    return updatedProfiles[0] || null;
  } catch (error) {
    console.error("Error updating user PayPal subscription ID:", error);
    throw new Error("Could not update user PayPal subscription ID.");
  }
}

/**
 * Update a user's subscription status, period end, and PayPal subscription ID
 */
export async function updateUserSubscriptionStatus({
  userId,
  status,
  periodEnd,
  paypalSubscriptionId,
}: {
  userId: string;
  status: "active" | "pending_cancel" | "cancelled";
  periodEnd?: Date | null;
  paypalSubscriptionId?: string | null;
}): Promise<void> {
  await db
    .update(profilesTable)
    .set({
      subscriptionStatus: status,
      subscriptionPeriodEnd: periodEnd,
      paypalSubscriptionId,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, userId));
}

/**
 * Update a user's subscription status and period end (without changing PayPal ID)
 */
export async function updateUserSubscriptionStatusAndPeriodEnd(
  userId: string,
  {
    status,
    periodEnd,
  }: {
    status: "active" | "pending_cancel" | "cancelled";
    periodEnd?: string | Date | null;
  }
): Promise<void> {
  await db
    .update(profilesTable)
    .set({
      subscriptionStatus: status,
      subscriptionPeriodEnd: periodEnd ? new Date(periodEnd) : null,
      updatedAt: new Date(),
    })
    .where(eq(profilesTable.id, userId));
}

/**
 * Update lastCreditsGrantedAt for a user
 */
export async function updateUserLastCreditsGrantedAt(
  userId: string,
  date: Date
): Promise<void> {
  await db
    .update(profilesTable)
    .set({ lastCreditsGrantedAt: date, updatedAt: new Date() })
    .where(eq(profilesTable.id, userId));
}

/**
 * Get users whose subscription is pending_cancel and period end has passed
 */
export async function getUsersToDowngrade(now: Date): Promise<UserProfile[]> {
  return db
    .select()
    .from(profilesTable)
    .where(
      and(
        eq(profilesTable.subscriptionStatus, "pending_cancel"),
        lt(profilesTable.subscriptionPeriodEnd, now)
      )
    );
}

/**
 * Get user profile by PayPal subscription ID
 */
export async function getUserProfileByPaypalId(
  paypalSubscriptionId: string
): Promise<UserProfile | null> {
  const result = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.paypalSubscriptionId, paypalSubscriptionId))
    .limit(1);
  return result[0] || null;
}

/**
 * Grant user subscription credits for the current tier
 */
import { getSubscriptionTierConfig } from "~/config/subscription_tiers";
export async function grantUserSubscriptionCredits(
  userId: string,
  tier: "free" | "creator" | "pro"
): Promise<void> {
  const config = getSubscriptionTierConfig(tier);
  const credits = config.features.artGenCreditsPerMonth;
  await addUserCredits(userId, credits);
  await updateUserLastCreditsGrantedAt(userId, new Date());
}
