// Utility for credit package lookup
// HTTP: Internal use only
// Purpose: Find a credit package by its ID from the static list
export type CreditPackage = {
  id: string; // Unique package ID
  credits: number;
  price: number; // USD
};

// The single source of truth for available credit packages
export const CREDIT_PACKAGES: CreditPackage[] = [
  { id: "small", credits: 10, price: 4.99 },
  { id: "medium", credits: 25, price: 9.99 },
  { id: "large", credits: 60, price: 19.99 },
  { id: "xl", credits: 150, price: 39.99 },
];

export function getCreditPackageById(id: string): CreditPackage | undefined {
  return CREDIT_PACKAGES.find((pkg: CreditPackage) => pkg.id === id);
}
