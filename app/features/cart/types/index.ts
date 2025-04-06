import type { Product } from "~/features/product/types";

// Define a type for cart items
export interface CartItem {
  id: number;
  product: Product;
  design?: string;
  quantity: number;
}

// Cart state interface
export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

// Cart operations types
export type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { product: Product; design?: string; quantity: number };
    }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" };
