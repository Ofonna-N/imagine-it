import type { ActionFunctionArgs } from "react-router";
import { addUserCredits } from "~/db/queries/user_profiles_queries";
import createSupabaseServerClient from "~/services/supabase/supabase_client";
import { getCreditPackageById } from "../utils/credit_packages";
import { ordersController } from "../services/paypal/paypal_server_client";
import { CaptureStatus, OrderStatus } from "@paypal/paypal-server-sdk";
import { calculateTax } from "../utils/tax";

/**
 * POST /api/purchase-credits
 * Resource route for adding credits to a user's account after payment.
 */
export type PurchaseCreditsRequest = {
  packageId: string; // The ID of the credit package
  paymentId: string; // PayPal order ID
};

/**
 * POST /api/purchase-credits
 * Utility: Response after credits are added
 */
export type PurchaseCreditsResponse = {
  success: boolean;
  newBalance: number;
};

export async function action({ request }: ActionFunctionArgs) {
  const { supabase } = createSupabaseServerClient({ request });
  const {
    data: { user },
    error: sessionError,
  } = await supabase.auth.getUser();

  if (sessionError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = (await request.json()) as PurchaseCreditsRequest;
    const creditPackage = getCreditPackageById(body.packageId);
    if (!creditPackage) {
      return new Response(JSON.stringify({ error: "Invalid credit package" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Calculate Texas sales tax (8.25%) using shared utility
    const expectedTax = calculateTax(creditPackage.price);
    const expectedTotal = +(creditPackage.price + expectedTax).toFixed(2);
    // Capture PayPal payment (server-side, never trust client)
    const capture = await ordersController.captureOrder({ id: body.paymentId });
    const captureResult = capture.result;
    console.log("PayPal capture result:", captureResult);
    // Check capture status and amount (must match price + tax)
    const capturedAmount = parseFloat(
      captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount
        ?.value ?? "0"
    );
    if (
      captureResult.status !== OrderStatus["Completed"] ||
      captureResult.purchaseUnits?.[0]?.payments?.captures?.[0]?.status !==
        CaptureStatus["Completed"] ||
      Math.abs(capturedAmount - expectedTotal) > 0.01 // allow for floating point rounding
    ) {
      return new Response(
        JSON.stringify({
          error: "Payment not captured or amount mismatch (tax included)",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // Add credits
    const updated = await addUserCredits(user.id, creditPackage.credits);
    if (!updated) {
      throw new Error("Failed to add credits");
    }
    return new Response(
      JSON.stringify({ success: true, newBalance: updated.credits }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in purchase credits action:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
