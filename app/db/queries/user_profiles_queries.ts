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
          user.user_metadata?.first_name || user.email?.split("@")[0] || "User",
        avatarUrl: user.user_metadata?.avatar_url || "",
        lastName: user.user_metadata?.last_name || "",
        phone: user.user_metadata?.phone || "",
        email: user.email ?? "",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(`Created profile for user ${user.id}`);
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
    const profile = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.id, userId))
      .limit(1);

    return profile.length > 0 ? profile[0] : null;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
