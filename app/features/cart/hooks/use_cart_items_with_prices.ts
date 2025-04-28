import { useMemo } from "react";
import { useQueryVariantsPrices } from "~/features/product/hooks/use_query_variants_prices";
import type { CartItem as CartItemType } from "~/db/schema/carts";

/**
 * Custom hook to calculate pricing for all cart items in the cart.
 * Returns an array of { item, basePrice, optionTotal, total } and the subtotal for the cart.
 */
export const useCartItemsWithPrices = (cartItems: CartItemType[]) => {
  // Extract all unique variant IDs from cart items
  const variantIds = useMemo(
    () =>
      Array.from(
        new Set(
          cartItems
            .map((item) => item.item_data.catalog_variant_id?.toString()!)
            .filter(Boolean)
        )
      ),
    [cartItems]
  );

  // Fetch all variant prices in one batch
  const { data: variantsPrices = [], isLoading } =
    useQueryVariantsPrices(variantIds);

  // Map variantId to price data for quick lookup
  const variantPriceMap = useMemo(() => {
    const map: Record<string, (typeof variantsPrices)[number]> = {};
    for (const priceData of variantsPrices) {
      if (priceData?.variant?.id != null) {
        map[priceData.variant.id.toString()] = priceData;
      }
    }
    return map;
  }, [variantsPrices]);

  // Calculate totals for each cart item
  const itemsWithPrices = useMemo(() => {
    return cartItems.map((item) => {
      const itemData = item.item_data;
      const variantId = itemData.catalog_variant_id?.toString() ?? "";
      const variantPrices = variantPriceMap[variantId];
      let basePrice = 0;
      let optionTotal = 0;
      if (variantPrices) {
        const technique = variantPrices.variant.techniques[0];
        basePrice = parseFloat(technique?.price ?? "0");
        if (Array.isArray(itemData.placements)) {
          for (const placement of itemData.placements) {
            const found = variantPrices.product.placements.find(
              (p) => p.id === placement.placement
            );
            if (found) {
              optionTotal += parseFloat(found.price ?? "0");
            }
          }
        }
      }
      const quantity = itemData.quantity ?? 1;
      const total = (basePrice + optionTotal) * quantity;
      return { item, basePrice, optionTotal, total };
    });
  }, [cartItems, variantPriceMap]);

  // Calculate subtotal
  const subtotal = useMemo(
    () => itemsWithPrices.reduce((sum, { total }) => sum + total, 0),
    [itemsWithPrices]
  );

  return { itemsWithPrices, subtotal, isLoading };
};
