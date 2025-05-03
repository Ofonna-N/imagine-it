// --- Mockup Generator Types ---

import type { PrintfulV2BaseResponse } from "./common_types";

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
  product_options?: import("./product_option_types").ProductOption[];
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
  _links: import("./common_types").PrintfulV2Links;
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
