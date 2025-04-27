import { useCartItemPrice } from "./use_cart_item_price";
import type { CartItem as CartItemType } from "~/db/schema/carts";

/**
 * Custom hook to map cart items to their calculated prices and subtotal.
 * Returns an array of { item, total, isLoading } and the subtotal.
 */
export function useCartItemsWithPrices(cartItems: CartItemType[]) {
  // Call useCartItemPrice for each item in a stable order
  const itemsWithPrices = cartItems.map((item) => {
    const { total, isLoading } = useCartItemPrice(item);
    return { item, total, isLoading };
  });
  const subtotal = itemsWithPrices.reduce((sum, { total }) => sum + total, 0);
  const isLoading = itemsWithPrices.some(({ isLoading }) => isLoading);
  return { itemsWithPrices, subtotal, isLoading };
}
