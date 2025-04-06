import { fetchCatalogFeaturedProducts } from "~/services/printful/printful-api";

/**
 * Resource route for featured products
 * Returns proper Response objects with appropriate status codes
 */
export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);

  // Get products filtered by category if provided
  const featuredProducts = await fetchCatalogFeaturedProducts(limit);
  console.log("Featured products:", featuredProducts);
  return new Response(JSON.stringify(featuredProducts), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
