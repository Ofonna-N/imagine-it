import createSupabaseServerClient from "~/services/supabase/supabase_client";
import { randomUUID } from "crypto";
import {
  getDesignsByUserId,
  getDesignByIdAndUser,
  createDesign,
  deleteDesignByIdAndUser,
} from "~/db/queries/designs_queries";
import { getStoragePath } from "../utils/storage_path";

/**
 * GET /api/designs
 * Returns the list of designs for the authenticated user
 */
export async function loader({ request }: { request: Request }) {
  const { headers, supabase } = createSupabaseServerClient({ request });
  const url = new URL(request.url);
  const designId = url.searchParams.get("designId");

  // If requesting a single design by ID
  if (designId) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      return new Response(JSON.stringify({ design: null }), {
        headers: { ...headers, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const userId = user.id;

    const design = await getDesignByIdAndUser(designId, userId);
    return new Response(JSON.stringify({ design }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: design ? 200 : 404,
    });
  }

  // Existing list loader logic...
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response(JSON.stringify({ designs: [] }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 401,
    });
  }
  const userId = user.id;

  const designs = await getDesignsByUserId(userId);
  return new Response(JSON.stringify({ designs }), {
    headers: { ...headers, "Content-Type": "application/json" },
    status: 200,
  });
}

/**
 * POST /api/designs - Saves a new design for the authenticated user
 * DELETE /api/designs - Deletes a design for the authenticated user
 */
export async function action({ request }: { request: Request }) {
  if (request.method === "POST") {
    // Existing POST logic
    const { headers, supabase } = createSupabaseServerClient({ request });
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        headers: { ...headers, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const userId = user.id;

    const formData = await request.formData(); // Correct for POST with form data
    const file = formData.get("file") as Blob | null;
    const name = formData.get("name") as string;
    const imageUrl = formData.get("image_url") as string;
    const productId = formData.get("product_id") as string | null;
    const canvasData = formData.get("canvas_data") as string | null;

    // Create new design record with image stored in Supabase bucket
    const id = randomUUID();
    // Upload main image
    let storedImageUrl: string;
    if (file instanceof Blob) {
      // Upload the uploaded file blob
      const imageType = file.type || "image/png";
      const imageExt = imageType.split("/")[1] ?? "png";
      const buffer = await file.arrayBuffer();
      const storagePath = getStoragePath(userId, "design", id, imageExt);
      const { error: uploadError } = await supabase.storage
        .from("imagine-it")
        .upload(storagePath, Buffer.from(buffer), {
          contentType: imageType,
        });
      if (uploadError) {
        return new Response(
          JSON.stringify({
            data: null,
            error: {
              statusCode: "500",
              error: "StorageUploadError",
              message: uploadError.message,
            },
          }),
          {
            headers: { ...headers, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from("imagine-it").getPublicUrl(storagePath);
      storedImageUrl = publicUrl;
    } else {
      try {
        const imageResponse = await fetch(imageUrl);
        const imageType =
          imageResponse.headers.get("content-type") ?? "image/png";
        const imageExt = imageType.split("/")[1] ?? "png";
        const imageBuffer = await imageResponse.arrayBuffer();
        const storagePath = getStoragePath(userId, "design", id, imageExt);
        const { error: uploadError } = await supabase.storage
          .from("imagine-it")
          .upload(storagePath, Buffer.from(imageBuffer), {
            contentType: imageType,
          });
        if (uploadError) {
          return new Response(
            JSON.stringify({
              data: null,
              error: {
                statusCode: "500",
                error: "StorageUploadError",
                message: uploadError.message,
              },
            }),
            {
              headers: { ...headers, "Content-Type": "application/json" },
              status: 500,
            }
          );
        }
        const {
          data: { publicUrl },
        } = supabase.storage.from("imagine-it").getPublicUrl(storagePath);
        storedImageUrl = publicUrl;
      } catch (err: any) {
        return new Response(
          JSON.stringify({
            data: null,
            error: {
              statusCode: "500",
              error: "UploadException",
              message: err.message ?? "Unexpected upload error",
            },
          }),
          {
            headers: { ...headers, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Insert record referencing storage URLs
    const design = await createDesign({
      id,
      userId,
      name,
      imageUrl: storedImageUrl,
      productId: productId ?? undefined,
      canvasData: canvasData ? JSON.parse(canvasData) : undefined,
      isPublic: false,
    });
    return new Response(JSON.stringify({ design }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 201,
    });
  } else if (request.method === "DELETE") {
    // Delegate to the destroy function for DELETE requests
    return destroy({ request });
  } else {
    // Handle other methods if necessary, or return Method Not Allowed
    const { headers } = createSupabaseServerClient({ request }); // Get headers for the response
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: {
        ...headers,
        "Content-Type": "application/json",
        Allow: "POST, DELETE",
      },
    });
  }
}

/**
 * DELETE /api/designs
 * Deletes a design for the authenticated user
 * Expects: { designId: string, imageUrl?: string }
 */
export async function destroy({ request }: { request: Request }) {
  const { headers, supabase } = createSupabaseServerClient({ request });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 401,
    });
  }
  const userId = user.id;
  let designId: string | undefined;
  let imageUrl: string | undefined;
  try {
    const body = await request.json();
    designId = body.designId;
    imageUrl = body.imageUrl;
  } catch (e) {
    // Log the error for debugging purposes
    console.error("Failed to parse request body in destroy:", e);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 400,
    });
  }
  if (!designId) {
    return new Response(JSON.stringify({ error: "Missing designId" }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 400,
    });
  }
  // Find the design to confirm ownership and get image URL if not provided
  const design = await getDesignByIdAndUser(designId, userId);
  if (!design) {
    return new Response(JSON.stringify({ error: "Design not found" }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 404,
    });
  }
  // Remove image from Supabase storage
  let deleteError = null;
  if (design.imageUrl || imageUrl) {
    const url = imageUrl ?? design.imageUrl;
    const regex = /\/public\/imagine-it\/(.+)$/;
    const match = regex.exec(url);
    const storagePath = match ? match[1] : null;
    if (storagePath) {
      const { error: removeError } = await supabase.storage
        .from("imagine-it")
        .remove([storagePath]);
      if (removeError) {
        deleteError = removeError.message;
      }
    }
  }
  // Delete the design record
  const deletedCount = await deleteDesignByIdAndUser(designId, userId);
  if (deletedCount === 0) {
    return new Response(JSON.stringify({ error: "Delete failed" }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 500,
    });
  }
  return new Response(JSON.stringify({ success: true, deleteError }), {
    headers: { ...headers, "Content-Type": "application/json" },
    status: 200,
  });
}
