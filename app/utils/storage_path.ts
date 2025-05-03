// Utility for generating organized Supabase storage paths for user assets
// Supports: designs, cart mockups, and other user-specific files

/**
 * Returns a storage path for a user asset in Supabase storage.
 *
 * @param userId - The user's unique ID
 * @param type - The asset type (e.g., 'design', 'cart-mockup')
 * @param id - The design ID, cart item ID, etc.
 * @param ext - File extension (e.g., 'png', 'jpg')
 * @param opts - Optional flags (e.g., preview, imageKey)
 * @returns A string path for Supabase storage
 *
 * Example:
 *   getStoragePath('user123', 'design', 'design456', 'png')
 *   // 'user123/designs/design456.png'
 *
 *   getStoragePath('user123', 'cart-mockup', 'cart789', 'jpg', { imageKey: 'abc123' })
 *   // 'user123/cart-design/cart789/image-abc123.jpg'
 */
export function getStoragePath(
  userId: string,
  type: "design" | "cart-mockup",
  id: string,
  ext: string,
  opts?: { preview?: boolean; imageKey?: string | number }
): string {
  if (type === "design") {
    const suffix = opts?.preview ? "_preview" : "";
    return `${userId}/designs/${id}${suffix}.${ext}`;
  }
  if (type === "cart-mockup") {
    // Use imageKey (index, uuid, or hash) to ensure uniqueness for each mockup image
    const imageKey = opts?.imageKey !== undefined ? `-${opts.imageKey}` : "";
    return `${userId}/cart-design/${id}/image${imageKey}.${ext}`;
  }
  throw new Error("Unsupported storage type");
}
