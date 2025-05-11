import { useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
}

export interface CreditPackagesResponse {
  packages: CreditPackage[];
}

/**
 * GET /api/credit-packages
 * Query hook to fetch available credit packages for purchase.
 */
export function useQueryCreditPackages() {
  return useQuery<CreditPackagesResponse, Error>({
    queryKey: ["creditPackages"],
    queryFn: async () => {
      const res = await fetch(API_ROUTES.CREDIT_PACKAGES);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error ?? "Failed to fetch credit packages");
      }
      return res.json();
    },
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}
