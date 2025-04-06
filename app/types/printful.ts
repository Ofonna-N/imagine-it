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

// Catalog file option
export interface PrintfulFileOption {
  id: string;
  type: string;
  title: string;
  additional_price: string | number;
}

// Catalog file
export interface PrintfulFile {
  id: string;
  type: string;
  title: string;
  additional_price: string;
  options?: PrintfulFileOption[];
}

// Product option value breakdown
export interface PrintfulOptionPriceBreakdown {
  [key: string]: string;
}

// Product option
export interface PrintfulProductOption {
  id: string;
  title: string;
  type: string;
  values: {
    [key: string]: string;
  };
  additional_price: string;
  additional_price_breakdown: PrintfulOptionPriceBreakdown;
}

// Printing technique
export interface PrintfulTechnique {
  key: string;
  display_name: string;
  is_default: boolean;
}

// Material composition
export interface PrintfulMaterial {
  name: string;
  percentage: number;
}

// Region availability status
export interface PrintfulRegionAvailability {
  region: string;
  status: string;
}

// Catalog product
export interface PrintfulCatalogProduct {
  id: number;
  main_category_id: number;
  type: string;
  type_name: string;
  title: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  files: PrintfulFile[];
  options: PrintfulProductOption[];
  is_discontinued: boolean;
  avg_fulfillment_time: number;
  description: string;
  techniques: PrintfulTechnique[];
  origin_country: string;
}

// Catalog variant
export interface PrintfulCatalogVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  color_code2?: string;
  image: string;
  price: string;
  in_stock: boolean;
  availability_regions: {
    [key: string]: string;
  };
  availability_status: PrintfulRegionAvailability[];
  material?: PrintfulMaterial[];
}

// Catalog product detail response (for single product with variants)
export type PrintfulCatalogProductResponse = PrintfulBaseResponse<{
  product: PrintfulCatalogProduct;
  variants: PrintfulCatalogVariant[];
}>;

// Catalog products list response (for multiple products without variants)
export type PrintfulCatalogProductsResponse =
  PrintfulBaseResponse<PrintfulCatalogProductsList>;

// Type for catalog products list with expanded result definition
export type PrintfulCatalogProductsList = {
  id: number;
  main_category_id: number;
  type: string;
  type_name: string;
  title: string;
  brand: string;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  files: PrintfulFile[];
  options: PrintfulProductOption[];
  is_discontinued: boolean;
  avg_fulfillment_time: number;
  description: string;
  techniques: PrintfulTechnique[];
  origin_country: string;
}[];
