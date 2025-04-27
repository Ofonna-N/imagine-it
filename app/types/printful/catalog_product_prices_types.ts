import type { PrintfulV2OptionValue } from "./catalog_product_types";
import type { PrintfulV2BaseResponse } from "./common_types";

/**
 * GET /v2/catalog-products/{id}/prices
 * Response payload for product pricing, including placements, layers, and variant technique prices.
 */
export interface PrintfulV2CatalogProductPricesPlacementOption {
  name: string;
  type: string;
  values: PrintfulV2OptionValue[];
  description: string;
  price: Record<string, string>;
}
export interface PrintfulV2CatalogProductPricesLayerOption {
  name: string;
  type: string;
  values: PrintfulV2OptionValue[];
  description: string;
  price: Record<string, string>;
}
export interface PrintfulV2CatalogProductPricesLayer {
  type: string;
  additional_price: string;
  layer_options: PrintfulV2CatalogProductPricesLayerOption[];
}
export interface PrintfulV2CatalogProductPricesPlacement {
  id: string;
  title: string;
  type: string;
  technique_key: string;
  price: string;
  discounted_price: string;
  placement_options: PrintfulV2CatalogProductPricesPlacementOption[];
  layers: PrintfulV2CatalogProductPricesLayer[];
}
export interface PrintfulV2CatalogProductPricesProduct {
  id: number;
  placements: PrintfulV2CatalogProductPricesPlacement[];
}
export interface PrintfulV2CatalogProductPricesVariantTechnique {
  technique_key: string;
  technique_display_name: string;
  price: string;
  discounted_price: string;
}
export interface PrintfulV2CatalogProductPricesVariant {
  id: number;
  techniques: PrintfulV2CatalogProductPricesVariantTechnique[];
}
export interface PrintfulV2CatalogProductPricesData {
  currency: string;
  product: PrintfulV2CatalogProductPricesProduct;
  variants: PrintfulV2CatalogProductPricesVariant[];
}
export interface PrintfulV2CatalogProductPricesResponse
  extends PrintfulV2BaseResponse<PrintfulV2CatalogProductPricesData> {}
