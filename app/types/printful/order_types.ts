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

export interface PrintfulV2OrderLayerOption {
  name: string;
  value: string | number | boolean | string[];
}

export interface PrintfulV2OrderLayerPosition {
  width: number;
  height: number;
  top: number;
  left: number;
}

export interface PrintfulV2OrderLayer {
  type: "file";
  url: string;
  layer_options?: PrintfulV2OrderLayerOption[];
  position?: PrintfulV2OrderLayerPosition;
}

export interface PrintfulV2OrderPlacementOption {
  name: string;
  value: string | number | boolean | string[];
}

export interface PrintfulV2OrderPlacement {
  placement: string;
  technique: string;
  print_area_type?: string;
  layers: PrintfulV2OrderLayer[];
  placement_options?: PrintfulV2OrderPlacementOption[];
}

export interface PrintfulV2OrderProductOption {
  name: string;
  value: string | number | boolean;
}

export interface PrintfulV2OrderItem {
  source: "catalog" | "template" | "product";
  catalog_variant_id?: number;
  product_id?: number;
  variant_id?: number;
  external_id?: string;
  quantity: number;
  retail_price?: string;
  name?: string;
  placements?: PrintfulV2OrderPlacement[];
  product_options?: PrintfulV2OrderProductOption[];
}

export interface PrintfulV2OrderGift {
  subject: string;
  message: string;
}

export interface PrintfulV2OrderPackingSlip {
  email?: string;
  phone?: string;
  message?: string;
  logo_url?: string;
  store_name?: string;
  custom_order_id?: string;
}

export interface PrintfulV2OrderCustomization {
  gift?: PrintfulV2OrderGift;
  packing_slip?: PrintfulV2OrderPackingSlip;
}

export interface PrintfulV2OrderRetailCosts {
  currency: string;
  discount?: string;
  shipping?: string;
  tax?: string;
}

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
