// Define a type for the product structure
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  details?: Record<string, string>;
}

// Types for product listings and filtering
export type ProductCategory = "clothing" | "accessories" | "art";

export interface ProductFilterOptions {
  category?: ProductCategory;
}
