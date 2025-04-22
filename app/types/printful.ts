/**
 * Types for Printful API v2 responses
 */

// Pagination information
export interface PrintfulPagination {
  total: number;
  offset: number;
  limit: number;
}

// Base response type for v2 API
export interface PrintfulV2BaseResponse<T> {
  data: T;
  _links: PrintfulV2Links;
  paging?: PrintfulPagination;
}

// HATEOAS Links structure (v2 API)
export interface PrintfulV2Link {
  href: string;
}

export interface PrintfulV2Links {
  self: PrintfulV2Link;
  first?: PrintfulV2Link;
  last?: PrintfulV2Link;
  next?: PrintfulV2Link;
  previous?: PrintfulV2Link;
  [key: string]: PrintfulV2Link | undefined;
}

// Value union alias for option and layer values
export type PrintfulV2OptionValue = string | number | boolean;

// Product option - v2 API
export interface PrintfulV2CatalogOption {
  name: string;
  techniques: string[];
  type: string;
  values:
    | PrintfulV2OptionValue[]
    | {
        [key: string]: PrintfulV2OptionValue[];
      };
}

// Printing technique - v2 API
export interface PrintfulV2Technique {
  key: string;
  display_name: string;
  is_default: boolean;
}

// V2 API Design Placement
export interface PrintfulV2DesignPlacement {
  placement: string;
  technique: string;
  print_area_width?: number;
  print_area_height?: number;
  layers: PrintfulV2Layer[];
  placement_options?: PrintfulV2CatalogOption[];
}

// V2 API Layer
export interface PrintfulV2Layer {
  id: string;
  type: string;
  options?: PrintfulV2CatalogOption[];
}

// Region availability status for v2 API
export interface PrintfulV2RegionAvailability {
  name: string;
  availability: string;
  placement_option_availability: {
    name: string;
    availability: boolean;
  }[];
}

// Product availability in v2 API
export interface PrintfulV2ProductAvailabilityItem {
  catalog_variant_id: number;
  techniques: {
    technique: string;
    selling_regions: PrintfulV2RegionAvailability[];
  }[];
}

export interface PrintfulV2ProductAvailabilityResponse
  extends PrintfulV2BaseResponse<PrintfulV2ProductAvailabilityItem[]> {}

// Catalog product in v2 API
export interface PrintfulV2CatalogProduct {
  id: number;
  main_category_id: number;
  type: string;
  name: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  is_discontinued: boolean;
  description: string;
  sizes: string[];
  colors: string[];
  techniques: PrintfulV2Technique[];
  placements: PrintfulV2DesignPlacement[];
  product_options: PrintfulV2CatalogOption[];
}

// Catalog variant in v2 API
export interface PrintfulV2CatalogVariant {
  id: number;
  catalog_product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  color_code2?: string;
  image: string;
  _links: {
    self: PrintfulV2Link;
    product_details: PrintfulV2Link;
    variant_prices: PrintfulV2Link;
    variant_images: PrintfulV2Link;
  };
}

// Catalog variant detail response with availability info
export interface PrintfulV2CatalogVariantAvailability {
  id: number;
  catalog_product_id: number;
  selling_region_stock_availability: PrintfulV2RegionAvailability[];
  technique_stock_availability: {
    technique: string;
    selling_region_stock_availability: PrintfulV2RegionAvailability[];
  }[];
  _links: {
    variant: PrintfulV2Link;
  };
}

// Catalog product variants list response (v2)
export interface PrintfulV2CatalogVariantsResponse
  extends PrintfulV2BaseResponse<PrintfulV2CatalogVariant[]> {}

// Catalog product detail response (v2)
export type PrintfulV2CatalogProductResponse =
  PrintfulV2BaseResponse<PrintfulV2CatalogProduct>;

// Catalog products list response (v2)
export type PrintfulV2CatalogProductsResponse = PrintfulV2BaseResponse<
  PrintfulV2CatalogProduct[]
>;

// Catalog category in v2 API
export interface PrintfulV2Category {
  id: number;
  parent_id: number | null;
  image_url: string | null;
  title: string;
  size: string; // Seems to indicate number of products, might need clarification from API docs
}

// Catalog categories list response (v2)
export interface PrintfulV2CategoriesResponse
  extends PrintfulV2BaseResponse<PrintfulV2Category[]> {}

// --- Mockup Generator Types ---

// POST /v2/mockup-tasks
// Request body for creating a mockup generator task
export interface PrintfulV2MockupGeneratorTaskRequest {
  format: "jpg" | "png" | "pdf";
  products: PrintfulV2MockupGeneratorProductRequest[];
}

// POST /v2/mockup-tasks
// Part of the request body for each product in the mockup task
export interface PrintfulV2MockupGeneratorProductRequest {
  source: "catalog" | "template" | "product";
  mockup_style_ids: number[];
  // For source "catalog" or "template"
  catalog_product_id?: number;
  catalog_variant_ids?: number[];
  // For source "product"
  product_id?: number;
  variant_ids?: number[];
  placements: PrintfulV2MockupDesignPlacement[];
  product_options?: ProductOption[];
}

// POST /v2/mockup-tasks
// Design placement for a product in the mockup task
export interface PrintfulV2MockupDesignPlacement {
  placement: string;
  technique: string;
  print_area_width?: number;
  print_area_height?: number;
  layers: PrintfulV2DesignLayer[];
  placement_options?: PrintfulV2DesignPlacementOption[];
}

// POST /v2/mockup-tasks
// Layer for a design placement
export interface PrintfulV2DesignLayer {
  type: "file";
  url: string;
  layer_options?: PrintfulV2DesignLayerOption[];
  position?: PrintfulV2DesignLayerPosition;
}

// POST /v2/mockup-tasks
// Option for a design layer
export interface PrintfulV2DesignLayerOption {
  name: string;
  value: string | boolean | string[];
}

// POST /v2/mockup-tasks
// Option for a design placement
export interface PrintfulV2DesignPlacementOption {
  name: string;
  value: string | boolean | string[];
}

// POST /v2/mockup-tasks
// Positioning for a design layer
export interface PrintfulV2DesignLayerPosition {
  area_width: number;
  area_height: number;
  width: number;
  height: number;
  top: number;
  left: number;
}

// GET /v2/mockup-tasks
// Response for retrieving a mockup generator task
export interface PrintfulV2MockupGeneratorTask {
  id: number;
  status: "pending" | "completed" | "failed";
  catalog_variant_mockups: PrintfulV2CatalogVariantMockup[];
  failure_reasons: string[];
  _links: PrintfulV2Links;
}

// GET /v2/mockup-tasks
// Represents a generated mockup for a variant
export interface PrintfulV2CatalogVariantMockup {
  catalog_variant_id: number;
  mockups: PrintfulV2Mockup[];
}

// GET /v2/mockup-tasks
// Represents the result of a single mockup generation within a task.
export interface PrintfulV2Mockup {
  placement: string; // Placement name for which the mockup was generated (e.g., "front")
  display_name: string; // Name suitable for display to end customers (e.g., "Front Print")
  technique: string; // Technique name used for the mockup (e.g., "dtg")
  style_id: number; // Identifier for the mockup style used
  mockup_url: string; // Temporary URL to the generated mockup image
}

// POST /v2/mockup-tasks, GET /v2/mockup-tasks
// Response structure for mockup generator task endpoints
export interface PrintfulV2MockupGeneratorTaskResponse
  extends PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask> {}

// --- End Mockup Generator Types ---

// Error response type - keeping this as it might be used across both versions
export interface PrintfulErrorResponse {
  code: number;
  result: string;
  error: {
    reason: string;
    message: string;
  };
}

// GET /v2/catalog-products/{id}/mockup-styles
// Represents a single mockup style for a catalog product
export interface PrintfulV2MockupStyle {
  id: number; // Unique style ID
  category_name: string; // e.g. "Flat", "On hanger", "Men's", "Women's Lifestyle"
  view_name: string; // e.g. "Front", "Left", "Back"
  restricted_to_variants?: number[] | null; // Optional: restricts style to certain variant IDs
}

// GET /v2/catalog-products/{id}/mockup-styles
// Represents a group of mockup styles for a specific placement/technique
export interface PrintfulV2MockupStyleGroup {
  placement: string; // e.g. "front"
  display_name: string; // e.g. "Front print"
  technique: string; // e.g. "dtg", "embroidery"
  print_area_width: number; // in inches
  print_area_height: number; // in inches
  print_area_type: string; // e.g. "simple"
  dpi: number; // e.g. 150
  mockup_styles: PrintfulV2MockupStyle[]; // Available styles for this placement/technique
}

// GET /v2/catalog-products/{id}/mockup-styles
// Response structure for the mockup styles endpoint
export interface PrintfulV2MockupStylesResponse
  extends PrintfulV2BaseResponse<PrintfulV2MockupStyleGroup[]> {}

// --- Product Option Types ---
//
// The Printful API expects product_options to be a discriminated union by name,
// but the UI may generate generic { name: string, value: string | number | boolean } objects.
// To allow this, add a fallback type to the union for unknown options.

export type ProductOption =
  | InsidePocketOption
  | StitchColorOption
  | NotesOption
  | LifelikeOption
  | CustomBorderColorOption
  | KnitwearBaseColor
  | KnitwearTrimColor
  | KnitwearColorReductionMode
  | GenericProductOption; // fallback for unknown/other options

export interface InsidePocketOption {
  name: "inside_pocket";
  value: boolean;
}
export interface StitchColorOption {
  name: "stitch_color";
  value: string;
}
export interface NotesOption {
  name: "notes";
  value: string;
}
export interface LifelikeOption {
  name: "lifelike";
  value: boolean;
}
export interface CustomBorderColorOption {
  name: "custom_border_color";
  value: string;
}
export interface KnitwearBaseColor {
  name: "base_color";
  value: string;
}
export interface KnitwearTrimColor {
  name: "trim_color";
  value: string;
}
export interface KnitwearColorReductionMode {
  name: "color_reduction_mode";
  value: "pixelated";
}
/**
 * Fallback for unknown product options.
 * Allows the UI to pass generic { name, value } objects for options not explicitly typed above.
 */
export interface GenericProductOption {
  name: string;
  value: string | number | boolean;
}

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

// Types for variant availability (v2/catalog-variants/{id}/availability)
export interface PrintfulV2CatalogVariantSellingRegionAvailability {
  name: string;
  availability: string;
  placement_option_availability: { name: string; availability: boolean }[];
}

export interface PrintfulV2CatalogVariantAvailabilityTechnique {
  technique: string;
  selling_regions: PrintfulV2CatalogVariantSellingRegionAvailability[];
}

export interface PrintfulV2CatalogVariantAvailabilityData {
  catalog_variant_id: number;
  techniques: PrintfulV2CatalogVariantAvailabilityTechnique[];
  _links: {
    variant: PrintfulV2Link;
  };
}

export interface PrintfulV2CatalogVariantAvailabilityFilterSetting {
  name: string;
  value: string;
}

export interface PrintfulV2CatalogVariantAvailabilityResponse {
  data: PrintfulV2CatalogVariantAvailabilityData;
  filter_settings: PrintfulV2CatalogVariantAvailabilityFilterSetting[];
  _links: {
    self: PrintfulV2Link;
    variant: PrintfulV2Link;
  };
}
