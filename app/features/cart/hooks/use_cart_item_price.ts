import { useQueryVariantPrices } from "~/features/product/hooks/use_query_variant_prices";
import type { CartItem as CartItemType } from "~/db/schema/carts";
import type { PrintfulV2OrderItem } from "~/types/printful";
import { useMemo } from "react";

/**
 * Custom hook to calculate pricing for a cart item.
 * Returns base price, placement options total, and total price for the quantity.
 */
export const useCartItemPrice = (item: CartItemType) => {
  const itemData = item.item_data as PrintfulV2OrderItem;
  const variantId = itemData.catalog_variant_id?.toString() ?? "";
  const { data: variantPrices, isLoading } = useQueryVariantPrices(variantId);

  const pricing = useMemo(() => {
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
    return { basePrice, optionTotal, total };
  }, [variantPrices, itemData]);

  return { ...pricing, isLoading };
};
