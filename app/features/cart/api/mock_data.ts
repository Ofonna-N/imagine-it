import { getProductById } from "../../product/api/mock_data";
import type { CartItem } from "../types";

// Mock cart data
export const mockCartItems: CartItem[] = [
  {
    id: 1,
    product: getProductById("1"),
    design: "Mountain Landscape",
    quantity: 2,
  },
  {
    id: 2,
    product: getProductById("3"),
    design: "Abstract Pattern",
    quantity: 1,
  },
];

// Helper functions to calculate cart totals
export const calculateCartTotals = (items: CartItem[]) => {
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = items.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax rate
  const total = subtotal + shipping + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
};
