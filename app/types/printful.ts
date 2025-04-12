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

// Product option - v2 API
export interface PrintfulV2CatalogOption {
  name: string;
  techniques: string[];
  type: string;
  values: (string | boolean | number)[];
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

// Error response type - keeping this as it might be used across both versions
export interface PrintfulErrorResponse {
  code: number;
  result: string;
  error: {
    reason: string;
    message: string;
  };
}
