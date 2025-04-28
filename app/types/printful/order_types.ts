/**
 * POST /v2/orders
 * Utility: Represents the request payload for creating a new Printful order.
 */
export interface PrintfulV2OrderRecipient {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  state_name?: string;
  country_code: string;
  country_name?: string;
  zip: string;
  phone?: string;
  email?: string;
  tax_number?: string;
}

/**
 * Represents an option for a layer in a placement (e.g., 3d_puff: true)
 */
export interface PrintfulV2OrderLayerOption {
  name: string;
  value: string | number | boolean | string[];
}

/**
 * Represents the position and size of a layer in a placement.
 */
export interface PrintfulV2OrderLayerPosition {
  width: number;
  height: number;
  top: number;
  left: number;
}

/**
 * Represents a file/image layer for a placement.
 */
export interface PrintfulV2OrderLayer {
  type: "file";
  url: string;
  layer_options?: PrintfulV2OrderLayerOption[];
  position?: PrintfulV2OrderLayerPosition;
}

/**
 * Represents an option for a placement (e.g., unlimited_color: true)
 */
export interface PrintfulV2OrderPlacementOption {
  name: string;
  value: string | number | boolean | string[];
}

/**
 * Represents a print placement on an item (e.g., front, back)
 */
export interface PrintfulV2OrderPlacement {
  placement: string;
  technique: string;
  print_area_type?: string;
  layers: PrintfulV2OrderLayer[];
  placement_options?: PrintfulV2OrderPlacementOption[];
}

/**
 * Represents a product-level option (e.g., inside_pocket: true)
 */
export interface PrintfulV2OrderProductOption {
  name: string;
  value: string | number | boolean;
}

/**
 * Represents a single item in the order.
 */
export interface PrintfulV2OrderItem {
  source: "catalog" | "template" | "product";
  catalog_variant_id?: number;
  external_id?: string;
  quantity: number;
  retail_price?: string;
  name?: string;
  placements?: PrintfulV2OrderPlacement[];
  product_options?: PrintfulV2OrderProductOption[];
}

/**
 * Represents gift message details for the order.
 */
export interface PrintfulV2OrderGift {
  subject: string;
  message: string;
}

/**
 * Represents packing slip customization for the order.
 */
export interface PrintfulV2OrderPackingSlip {
  email?: string;
  phone?: string;
  message?: string;
  logo_url?: string;
  store_name?: string;
  custom_order_id?: string;
}

/**
 * Represents order-level customization (gift, packing slip).
 */
export interface PrintfulV2OrderCustomization {
  gift?: PrintfulV2OrderGift;
  packing_slip?: PrintfulV2OrderPackingSlip;
}

/**
 * Represents retail costs for the order.
 */
export interface PrintfulV2OrderRetailCosts {
  currency: string;
  discount?: string;
  shipping?: string;
  tax?: string;
}

/**
 * POST /v2/orders
 * Utility: Represents the request payload for creating a new Printful order.
 */
export interface PrintfulV2CreateOrderRequest {
  external_id?: string;
  shipping: string;
  recipient: PrintfulV2OrderRecipient;
  order_items: PrintfulV2OrderItem[];
  customization?: PrintfulV2OrderCustomization;
  retail_costs?: PrintfulV2OrderRetailCosts;
}

/**
 * POST /v2/orders
 * Utility: Represents the response payload for creating a new Printful order.
 */
export interface PrintfulV2OrderCosts {
  calculation_status?: string;
  currency: string;
  subtotal?: string;
  discount?: string;
  shipping?: string;
  digitization?: string;
  additional_fee?: string;
  fulfillment_fee?: string;
  retail_delivery_fee?: string;
  vat?: string;
  tax?: string;
  total?: string;
}

export interface PrintfulV2OrderResponseItem {
  id: number;
  type: "order_item";
  source: "catalog" | "template" | "product";
  catalog_variant_id?: number;
  external_id?: string;
  quantity: number;
  name?: string;
  price?: string;
  retail_price?: string;
  currency?: string;
  retail_currency?: string;
  _links: import("./common_types").PrintfulV2Links;
}

export interface PrintfulV2OrderResponseData {
  id: number;
  external_id?: string;
  store_id: number;
  shipping: string;
  status: string;
  created_at: string;
  updated_at: string;
  recipient: PrintfulV2OrderRecipient;
  costs: PrintfulV2OrderCosts;
  retail_costs: PrintfulV2OrderCosts;
  order_items: PrintfulV2OrderResponseItem[];
  customization?: PrintfulV2OrderCustomization;
  _links: import("./common_types").PrintfulV2Links;
}

export interface PrintfulV2CreateOrderResponse {
  data: PrintfulV2OrderResponseData;
}
