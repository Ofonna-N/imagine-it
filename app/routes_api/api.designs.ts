import createSupabaseServerClient from "~/services/supabase/supabase_client.server";
import { randomUUID } from "crypto";
import {
  getDesignsByUserId,
  getDesignByIdAndUser,
  createDesign,
} from "~/db/queries/designs_queries";

// Returns the storage path for a design image or preview
function getDesignStoragePath(
  userId: string,
  designId: string,
  ext: string,
  opts?: { preview?: boolean }
) {
  // If opts.preview is true, store as preview image
  const suffix = opts?.preview ? `_preview` : "";
  return `${userId}-designs/${designId}${suffix}.${ext}`;
}

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
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) {
      return new Response(JSON.stringify({ design: null }), {
        headers: { ...headers, "Content-Type": "application/json" },
        status: 401,
      });
    }
    const userId = session.user.id;

    const design = await getDesignByIdAndUser(designId, userId);
    return new Response(JSON.stringify({ design }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: design ? 200 : 404,
    });
  }

  // Existing list loader logic...
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return new Response(JSON.stringify({ designs: [] }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 401,
    });
  }
  const userId = session.user.id;

  const designs = await getDesignsByUserId(userId);
  return new Response(JSON.stringify({ designs }), {
    headers: { ...headers, "Content-Type": "application/json" },
    status: 200,
  });
}

/**
 * POST /api/designs
 * Saves a new design for the authenticated user
 */
export async function action({ request }: { request: Request }) {
  const { headers, supabase } = createSupabaseServerClient({ request });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      headers: { ...headers, "Content-Type": "application/json" },
      status: 401,
    });
  }
  const userId = session.user.id;

  const formData = await request.formData();
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
    const storagePath = getDesignStoragePath(userId, id, imageExt);
    const { error: uploadError } = await supabase.storage
      .from("imagine-it")
      .upload(storagePath, Buffer.from(buffer), {
        contentType: imageType,
      });
    console.log("uploadError:", uploadError);
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
      const storagePath = getDesignStoragePath(userId, id, imageExt);
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
}
