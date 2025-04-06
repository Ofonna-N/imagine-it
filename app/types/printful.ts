/**
 * Types for Printful API responses
 */

// Base response type from Printful
export interface PrintfulBaseResponse<T> {
  code: number;
  result: T;
  extra: any[];
}

// Product variant
export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  image: string;
  price: string;
  in_stock: boolean;
  availability_status: string;
}

// Sync product (product in your store)
export interface PrintfulSyncProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

// Sync variant
export interface PrintfulSyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  synced: boolean;
  variant_id: number;
  warehouse_product_variant_id: number;
  retail_price: string;
  sku: string;
  currency: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string;
    name: string;
  };
  files: Array<{
    id: number;
    type: string;
    hash: string;
    url: string;
    filename: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    dpi: number;
    status: string;
    created: number;
    thumbnail_url: string;
    preview_url: string;
    visible: boolean;
    is_temporary: boolean;
  }>;
}

// Type aliases for common response types
export type PrintfulCatalogResponse = PrintfulBaseResponse<
  PrintfulSyncProduct[]
>;
export type PrintfulProductResponse = PrintfulBaseResponse<{
  sync_product: PrintfulSyncProduct;
  sync_variants: PrintfulSyncVariant[];
}>;

// Extended product type with our app-specific fields
export type Product = PrintfulSyncProduct & {
  description?: string;
  category?: string;
  isFeatured?: boolean;
  variants?: PrintfulVariant[];
  price?: string; // We'll use the lowest price from variants
};
