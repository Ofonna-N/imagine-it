import type {
  PrintfulV2OrderRecipient,
  PrintfulV2OrderItem,
} from "./order_types";

/**
 * POST /v2/shipping-rates
 * Utility: Represents the request payload for retrieving shipping rates for a set of order items and recipient.
 */
export interface PrintfulV2ShippingRatesRequest {
  recipient: PrintfulV2OrderRecipient;
  order_items: PrintfulV2OrderItem[];
  currency?: string;
}

/**
 * POST /v2/shipping-rates
 * Utility: Represents a single shipment item in the shipping rates response.
 */
export interface PrintfulV2ShippingRatesShipmentItem {
  catalog_variant_id: number;
  quantity: number;
}

/**
 * POST /v2/shipping-rates
 * Utility: Represents a shipment in the shipping rates response.
 */
export interface PrintfulV2ShippingRatesShipment {
  departure_country: string;
  shipment_items: PrintfulV2ShippingRatesShipmentItem[];
  customs_fees_possible: boolean;
}

/**
 * POST /v2/shipping-rates
 * Utility: Represents a single shipping rate option in the response.
 */
export interface PrintfulV2ShippingRate {
  shipping: string;
  shipping_method_name: string;
  rate: string;
  currency: string;
  min_delivery_days: number;
  max_delivery_days: number;
  min_delivery_date: string;
  max_delivery_date: string;
  shipments: PrintfulV2ShippingRatesShipment[];
}

/**
 * POST /v2/shipping-rates
 * Utility: Represents the successful response payload for retrieving shipping rates.
 */
export interface PrintfulV2ShippingRatesResponse {
  data: PrintfulV2ShippingRate[];
}

/**
 * POST /v2/shipping-rates
 * Utility: Represents a 400 error response for missing or invalid parameters.
 */
export interface PrintfulV2ShippingRatesErrorResponse400 {
  data: string;
  error: {
    reason: string;
    message: string;
  };
}

/**
 * POST /v2/shipping-rates
 * Utility: Represents a 5xx error response for internal server errors.
 */
export interface PrintfulV2ShippingRatesErrorResponse5xx {
  type: string;
  status: number;
  title: string;
  details: string;
  instance: string;
}
