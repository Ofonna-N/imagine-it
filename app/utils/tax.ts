// Utility for Texas sales tax
// HTTP: Internal use only
// Purpose: Provide a single source of truth for tax rate and calculation

/**
 * Texas sales tax rate (8.25%)
 */
export const TAX_RATE = 0.0825;

/**
 * Calculates tax for a given subtotal using the Texas tax rate.
 * @param subtotal - The amount to calculate tax on
 * @returns The tax amount, rounded to 2 decimals
 */
export function calculateTax(subtotal: number): number {
  return +(subtotal * TAX_RATE).toFixed(2);
}
