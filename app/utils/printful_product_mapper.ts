// Utility to map a Printful v1 catalog product to the v2 catalog product schema
// Ensures the frontend always receives a PrintfulV2CatalogProduct
import type {
  PrintfulV1CatalogProduct,
  PrintfulV2CatalogProduct,
} from "~/types/printful/catalog_product_types";

/**
 * Utility: Maps a Printful v1 catalog product to the v2 catalog product schema.
 * Ensures the frontend always receives a PrintfulV2CatalogProduct.
 *
 * @param v1 - The Printful v1 catalog product object
 * @returns PrintfulV2CatalogProduct
 */
export function mapV1ToV2CatalogProduct(
  v1: PrintfulV1CatalogProduct
): PrintfulV2CatalogProduct {
  return {
    id: v1.id,
    main_category_id: v1.main_category_id,
    type: v1.type,
    name: v1.title, // v1 uses 'title', v2 uses 'name'
    brand: v1.brand ?? "",
    model: v1.model ?? "",
    image: v1.image,
    variant_count: v1.variant_count,
    is_discontinued: v1.is_discontinued,
    description: v1.description ?? "",
    sizes: [], // v1 does not provide sizes directly
    colors: [],
    techniques: [], // v1 techniques are not typed, so leave empty or map if needed
    placements: [],
    product_options: [],
  };
}
