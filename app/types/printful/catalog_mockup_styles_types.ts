// GET /v2/catalog-products/{id}/mockup-styles

import type { PrintfulV2BaseResponse } from "./common_types";

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
