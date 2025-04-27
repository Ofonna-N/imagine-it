import type { PrintfulV2CatalogProductPricesProduct } from "./catalog_product_prices_types";
import type { PrintfulV2OptionValue } from "./catalog_product_types";
import type { PrintfulV2BaseResponse } from "./common_types";

/**
 * GET /v2/catalog-variants/{id}/prices
 * Response payload for variant pricing, including placements and variant-specific technique prices.
 */
export interface PrintfulV2CatalogVariantPricesPlacementOption {
  name: string;
  type: string;
  values: PrintfulV2OptionValue[];
  description: string;
  price: Record<string, string>;
}
export interface PrintfulV2CatalogVariantPricesLayerOption {
  name: string;
  type: string;
  values: PrintfulV2OptionValue[];
  description: string;
  price: Record<string, string>;
}
export interface PrintfulV2CatalogVariantPricesLayer {
  type: string;
  additional_price: string;
  layer_options: PrintfulV2CatalogVariantPricesLayerOption[];
}
export interface PrintfulV2CatalogVariantPricesPlacement {
  id: string;
  title: string;
  type: string;
  technique_key: string;
  price: string;
  discounted_price: string;
  placement_options: PrintfulV2CatalogVariantPricesPlacementOption[];
  layers: PrintfulV2CatalogVariantPricesLayer[];
}
export interface PrintfulV2CatalogVariantPricesProduct {
  id: number;
  placements: PrintfulV2CatalogVariantPricesPlacement[];
}
export interface PrintfulV2CatalogVariantPricesTechnique {
  technique_key: string;
  technique_display_name: string;
  price: string;
  discounted_price: string;
}
export interface PrintfulV2CatalogVariantPricesVariant {
  id: number;
  techniques: PrintfulV2CatalogVariantPricesTechnique[];
}
export interface PrintfulV2CatalogVariantPricesData {
  currency: string;
  product: PrintfulV2CatalogProductPricesProduct; // reuse product placement types
  variant: PrintfulV2CatalogVariantPricesVariant;
}
export interface PrintfulV2CatalogVariantPricesResponse
  extends PrintfulV2BaseResponse<PrintfulV2CatalogVariantPricesData> {}
