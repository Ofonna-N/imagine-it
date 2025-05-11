import type {
  PrintfulV2CatalogProductPricesData,
  PrintfulV2CatalogProductPricesResponse,
  PrintfulV2CatalogProductPricesVariantTechnique,
  PrintfulV2CatalogProductPricesVariant,
} from "~/types/printful/catalog_product_prices_types";
import type {
  PrintfulV2CatalogVariantPricesData,
  PrintfulV2CatalogVariantPricesResponse,
  PrintfulV2CatalogVariantPricesTechnique,
} from "~/types/printful/catalog_variant_prices_types";

/**
 * Calculates the final price after adding a profit margin.
 * Reads PROFIT_MARGIN_PERCENTAGE from environment variables (e.g., 0.20 for 20%).
 * @param basePrice The original price from Printful (as a string or number).
 * @returns The price with profit added (as a string), or null if basePrice is null/undefined.
 */
function calculatePriceWithProfit(
  basePrice: string | number | null | undefined
): string | null {
  if (basePrice === null || basePrice === undefined) {
    return null;
  }
  const numericBasePrice =
    typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;
  console.log("Base Price:", basePrice);
  if (isNaN(numericBasePrice)) {
    return null; // or throw an error, depending on desired handling
  }

  // Ensure PROFIT_MARGIN_PERCENTAGE is set in your .env file
  const profitPercentage = parseFloat(
    process.env.PROFIT_MARGIN_PERCENTAGE ?? "0.20"
  ); // Default to 20% if not set
  const finalPrice = numericBasePrice * (1 + profitPercentage);
  console.log("Final Price:", finalPrice);
  return finalPrice.toFixed(2); // Round to 2 decimal places and return as string
}

/**
 * Modifies a PrintfulV2CatalogVariantPricesResponse to include profit margins.
 * @param response The original response from fetchCatalogVariantPrices.
 * @returns The modified response with profit added to prices.
 */
export function applyProfitToVariantPricesResponse(
  response: PrintfulV2CatalogVariantPricesResponse
): PrintfulV2CatalogVariantPricesResponse {
  if (!response.data?.variant?.techniques) {
    return response;
  }

  const modifiedTechniques = response.data.variant.techniques.map(
    (technique: PrintfulV2CatalogVariantPricesTechnique) => {
      const newPrice = calculatePriceWithProfit(technique.price);
      const newDiscountedPrice = calculatePriceWithProfit(
        technique.discounted_price
      );
      return {
        ...technique,
        price: newPrice ?? technique.price, // Fallback to original if calculation fails
        discounted_price: newDiscountedPrice ?? technique.discounted_price, // Fallback to original
      };
    }
  );

  const modifiedData: PrintfulV2CatalogVariantPricesData = {
    ...response.data,
    variant: {
      ...response.data.variant,
      techniques: modifiedTechniques,
    },
  };

  return {
    ...response,
    data: modifiedData,
  };
}

/**
 * Modifies a PrintfulV2CatalogProductPricesResponse to include profit margins.
 * @param response The original response from fetchCatalogProductPrices.
 * @returns The modified response with profit added to prices.
 */
export function applyProfitToProductPricesResponse(
  response: PrintfulV2CatalogProductPricesResponse
): PrintfulV2CatalogProductPricesResponse {
  if (!response.data?.variants) {
    return response;
  }

  const modifiedVariants = response.data.variants.map(
    (variant: PrintfulV2CatalogProductPricesVariant) => {
      if (!variant.techniques) return variant;

      const modifiedTechniques = variant.techniques.map(
        (technique: PrintfulV2CatalogProductPricesVariantTechnique) => {
          const newPrice = calculatePriceWithProfit(technique.price);
          const newDiscountedPrice = calculatePriceWithProfit(
            technique.discounted_price
          );
          return {
            ...technique,
            price: newPrice ?? technique.price, // Fallback to original
            discounted_price: newDiscountedPrice ?? technique.discounted_price, // Fallback to original
          };
        }
      );
      return {
        ...variant,
        techniques: modifiedTechniques,
      };
    }
  );

  const modifiedData: PrintfulV2CatalogProductPricesData = {
    ...response.data,
    product: response.data.product, // Product details remain unchanged
    variants: modifiedVariants,
  };

  return {
    ...response,
    data: modifiedData,
  };
}
