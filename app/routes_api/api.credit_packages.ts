import { CREDIT_PACKAGES, type CreditPackage } from "../utils/credit_packages";
/**
 * GET /api/credit-packages
 * Returns the available credit packages for purchase.
 * No authentication required (public info).
 */
export type CreditPackagesResponse = {
  packages: CreditPackage[];
};
export async function loader() {
  return new Response(JSON.stringify({ packages: CREDIT_PACKAGES }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
