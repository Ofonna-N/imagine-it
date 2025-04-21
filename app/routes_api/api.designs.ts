import createSupabaseServerClient from "../services/supabase/supabase_client";
import { randomUUID } from "crypto";
import {
  getDesignsByUserId,
  createDesign,
} from "../db/queries/designs_queries";

/**
 * GET /api/designs
 * Returns the list of designs for the authenticated user
 */
export async function loader({ request }: { request: Request }) {
  const { headers, supabase } = createSupabaseServerClient({ request });
  // Get session user
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
  const name = formData.get("name") as string;
  const imageUrl = formData.get("image_url") as string;
  const previewUrl = formData.get("preview_url") as string | null;
  const productId = formData.get("product_id") as string | null;
  const canvasData = formData.get("canvas_data") as string | null;

  // Create new design record with image stored in Supabase bucket
  const id = randomUUID();
  // Upload main image to storage
  const imageResponse = await fetch(imageUrl);
  const imageType = imageResponse.headers.get("content-type") ?? "image/png";
  const imageExt = imageType.split("/")[1] ?? "png";
  const imageBuffer = await imageResponse.arrayBuffer();
  await supabase.storage
    .from("imagine-it")
    .upload(`designs/${id}.${imageExt}`, new Uint8Array(imageBuffer), {
      contentType: imageType,
    });
  const {
    data: { publicUrl: storedImageUrl },
  } = supabase.storage
    .from("imagine-it")
    .getPublicUrl(`designs/${id}.${imageExt}`);
  // Optionally upload preview image
  let storedPreviewUrl: string | undefined = undefined;
  if (previewUrl) {
    const previewResponse = await fetch(previewUrl);
    const previewType =
      previewResponse.headers.get("content-type") ?? imageType;
    const previewExt = previewType.split("/")[1] ?? imageExt;
    const previewBuffer = await previewResponse.arrayBuffer();
    await supabase.storage
      .from("imagine-it")
      .upload(
        `designs/${id}_preview.${previewExt}`,
        new Uint8Array(previewBuffer),
        { contentType: previewType }
      );
    const {
      data: { publicUrl: previewPublicUrl },
    } = supabase.storage
      .from("imagine-it")
      .getPublicUrl(`designs/${id}_preview.${previewExt}`);
    storedPreviewUrl = previewPublicUrl;
  }
  // Insert record referencing storage URLs
  const design = await createDesign({
    id,
    userId,
    name,
    imageUrl: storedImageUrl,
    previewUrl: storedPreviewUrl,
    productId: productId ?? undefined,
    canvasData: canvasData ? JSON.parse(canvasData) : undefined,
    isPublic: false,
    tags: [],
  });
  return new Response(JSON.stringify({ design }), {
    headers: { ...headers, "Content-Type": "application/json" },
    status: 201,
  });
}
