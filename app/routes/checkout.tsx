import {
  Box,
  Button,
  Checkbox,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  alpha,
} from "@mui/material";
import { z } from "zod";
import {
  useForm,
  FormProvider,
  useFormContext,
  useFormState,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useQueryCart } from "~/features/cart/hooks/use_query_cart";
import { useMutateShippingRates } from "~/features/order/hooks/use_query_shipping_rates";
import { useEffect, useState } from "react";
import { useCartItemsWithPrices } from "~/features/cart/hooks/use_cart_items_with_prices";
import { CartSummaryItem } from "~/features/cart/components/cart_summary_item";
import { useQueryRecipient } from "~/features/cart/hooks/use_query_recipient";
import { useMutateRecipient } from "~/features/cart/hooks/use_mutate_recipient";
import { useMutatePaypalCreateOrder } from "~/features/order/hooks/use_mutate_paypal_create_order";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import {
  PayPalCardFieldsProvider,
  PayPalNameField,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
  PayPalButtons,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import { grey } from "@mui/material/colors";

// --- Schema and Types ---
const orderRecipientSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    company: z.string().optional(),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state_code: z.string().optional(),
    state_name: z.string().optional(),
    country_code: z.string().min(1, "Country code is required"),
    country_name: z.string().optional(),
    zip: z.string().min(1, "Zip code is required"),
    phone: z.string().optional(),
    email: z.string().optional(),
  })
  .strict();

const checkoutSchema = z.object({
  shipping: orderRecipientSchema,
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

// --- Tax Calculation Helper ---
const TAX_RATE = 0.08; // 8% industry standard
function calculateTax(subtotal: number): number {
  return +(subtotal * TAX_RATE).toFixed(2);
}

// --- Shipping Form Component ---
function ShippingForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();
  return (
    <Box>
      <Typography variant="h5" gutterBottom mb={2}>
        Shipping Address
      </Typography>
      <Grid container spacing={3}>
        {/* ...existing code for all address fields... */}
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            id="name"
            label="Full Name"
            fullWidth
            autoComplete="name"
            {...register("shipping.name", { required: "Name is required" })}
            error={!!errors.shipping?.name}
            helperText={errors.shipping?.name?.message ?? ""}
          />
        </Grid>
        {/* ...other address fields as before... */}
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            id="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            {...register("shipping.address1", {
              required: "Address is required",
            })}
            error={!!errors.shipping?.address1}
            helperText={errors.shipping?.address1?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            id="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            {...register("shipping.address2")}
            error={!!errors.shipping?.address2}
            helperText={errors.shipping?.address2?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            id="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            {...register("shipping.city", { required: "City is required" })}
            error={!!errors.shipping?.city}
            helperText={errors.shipping?.city?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="state_code"
            label="State/Province Code"
            fullWidth
            {...register("shipping.state_code")}
            error={!!errors.shipping?.state_code}
            helperText={errors.shipping?.state_code?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="state_name"
            label="State/Province Name"
            fullWidth
            {...register("shipping.state_name")}
            error={!!errors.shipping?.state_name}
            helperText={errors.shipping?.state_name?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            id="country_code"
            label="Country Code (e.g. US)"
            fullWidth
            autoComplete="shipping country"
            {...register("shipping.country_code", {
              required: "Country code is required",
            })}
            error={!!errors.shipping?.country_code}
            helperText={errors.shipping?.country_code?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="country_name"
            label="Country Name"
            fullWidth
            {...register("shipping.country_name")}
            error={!!errors.shipping?.country_name}
            helperText={errors.shipping?.country_name?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            id="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            {...register("shipping.zip", { required: "Zip code is required" })}
            error={!!errors.shipping?.zip}
            helperText={errors.shipping?.zip?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="phone"
            label="Phone"
            fullWidth
            autoComplete="tel"
            {...register("shipping.phone")}
            error={!!errors.shipping?.phone}
            helperText={errors.shipping?.phone?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="email"
            label="Email"
            fullWidth
            autoComplete="email"
            {...register("shipping.email")}
            error={!!errors.shipping?.email}
            helperText={errors.shipping?.email?.message ?? ""}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

// --- Stepper Steps ---
const steps = ["Shipping Address", "Review Order"];

// --- PayPal Card Fields Form Component ---
function PayPalCardFieldsForm({
  loading,
  onSubmit,
}: Readonly<{
  loading: boolean;
  onSubmit?: () => void;
}>) {
  const { cardFieldsForm } = usePayPalCardFields();

  return (
    <Box sx={{ mb: 2, px: 2 }}>
      <PayPalNameField
        style={{
          input: { color: "blue" },
          ".invalid": { color: "purple" },
        }}
      />
      <PayPalNumberField />
      <PayPalExpiryField />
      <PayPalCVVField />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading}
        onClick={async () => {
          if (!cardFieldsForm) {
            const childErrorMessage =
              "Unable to find any child components in the <PayPalCardFieldsProvider />";
            throw new Error(childErrorMessage);
          }
          const formState = await cardFieldsForm.getState();
          if (!formState.isFormValid) {
            return alert("The payment form is invalid");
          }
          if (onSubmit) {
            onSubmit();
          }
          cardFieldsForm.submit().catch((err) => {
            console.log("Error submitting PayPal card fields form", err);
          });
        }}
        sx={{ mt: 2 }}
      >
        {loading ? "Processing Payment..." : "Submit Payment"}
      </Button>
    </Box>
  );
}

// --- Main Checkout Component ---
export default function Checkout() {
  const shippingForm = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        name: "",
        company: "",
        address1: "",
        address2: "",
        city: "",
        state_code: "",
        state_name: "",
        country_code: "",
        country_name: "",
        zip: "",
        phone: "",
        email: "",
      },
    },
    mode: "onChange",
  });

  const { data: cartItems = [] } = useQueryCart();
  const {
    itemsWithPrices,
    subtotal,
    isLoading: isSubtotalLoading,
  } = useCartItemsWithPrices(cartItems);
  const {
    data: recipientData,
    isLoading: isRecipientLoading,
    status: recipientDataStatus,
  } = useQueryRecipient();
  const mutateRecipient = useMutateRecipient();
  const formState = useFormState({ control: shippingForm.control });
  const [activeStep, setActiveStep] = useState(0);
  const paypalCreateOrderMutation = useMutatePaypalCreateOrder();
  const [paypalDialogOpen, setPaypalDialogOpen] = useState(false);
  const shippingRatesMutation = useMutateShippingRates();
  const [shippingRate, setShippingRate] = useState<number | null>(null);
  const [tax, setTax] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  // Step navigation handlers
  const handleNext = async () => {
    if (activeStep === 0) {
      const valid = await shippingForm.trigger("shipping");
      if (!valid) return;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);
  const handleStepClick = async (step: number) => {
    if (step < activeStep) {
      setActiveStep(step);
      return;
    }
    if (step === 1 && activeStep === 0) {
      const valid = await shippingForm.trigger("shipping");
      if (!valid) return;
      setActiveStep(step);
      return;
    }
  };

  // Pre-fill form with recipient info on mount
  useEffect(() => {
    if (recipientDataStatus === "success" && recipientData?.recipient_data) {
      shippingForm.reset({
        shipping: recipientData.recipient_data,
      });
    }
    // if (recipientData?.recipient_data) {
    //   shippingForm.setValue("shipping", recipientData.recipient_data);
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientDataStatus]);

  // Fetch shipping rates when review step is entered
  useEffect(() => {
    if (activeStep === 1 && itemsWithPrices.length > 0) {
      const order_items = itemsWithPrices.map(({ item }) => item.item_data);
      shippingRatesMutation.mutate(
        { recipient: shippingForm.getValues().shipping, order_items },
        {
          onSuccess: (data) => {
            const rate = Number(data.data?.[0]?.rate || 0);
            setShippingRate(rate);
            const taxVal = calculateTax(subtotal);
            setTax(taxVal);
            setTotal(subtotal + rate + taxVal);
          },
        }
      );
    }
  }, [activeStep, itemsWithPrices, shippingForm, subtotal]);

  const handlePlaceOrder = () => {
    setPaypalDialogOpen(true);
  };

  async function handlePaypalCreateOrder() {
    const shipping = shippingForm.getValues().shipping;
    const items = itemsWithPrices.map(({ item, basePrice }) => ({
      id: String(item.id),
      name: item.item_data.name!,
      price: basePrice,
      quantity: item.item_data.quantity,
    }));

    const response = await paypalCreateOrderMutation.mutateAsync({
      shipping,
      items,
      currency: "USD",
    });

    return response.orderId;
  }
  // Handler for PayPal approval (trigger Printful order here)
  const handlePaypalApprove = async (data: any, actions: any) => {
    setPaypalDialogOpen(false);
    // TODO: Trigger Printful order creation here
  };

  // --- Render ---
  return (
    <FormProvider {...shippingForm}>
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label, idx) => (
              <Step key={label}>
                <StepLabel
                  onClick={() => handleStepClick(idx)}
                  sx={{
                    cursor: "pointer",
                    ":hover": { cursor: "pointer" },
                    "&:hover svg": {
                      boxShadow: "0 0 12px 4px rgba(25, 118, 210, 0.4)",
                      filter: "brightness(1.15)",
                      borderRadius: "50%",
                    },
                  }}
                  slotProps={{
                    label: {
                      sx: {
                        ":hover": {
                          color: (theme) =>
                            alpha(theme.palette.text.primary, 0.35),
                        },
                      },
                    },
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          {isRecipientLoading && (
            <Typography color="text.secondary">Loading address...</Typography>
          )}
          {mutateRecipient.isPending && (
            <Typography color="text.secondary">Saving address...</Typography>
          )}
          {mutateRecipient.isError && (
            <Typography color="error">Failed to save address</Typography>
          )}
          <form>
            <Grid container spacing={4}>
              {/* Step 1: Shipping Address */}
              {activeStep === 0 && (
                <Grid size={12}>
                  <ShippingForm />
                  <Box
                    sx={{
                      alignItems: "center",
                      mt: 2,
                      display: "flex",
                      visibility: shippingForm.formState.isValid
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    <Checkbox
                      disabled={
                        !shippingForm.formState.isValid || isRecipientLoading
                      }
                      checked={
                        JSON.stringify(recipientData?.recipient_data) ===
                        JSON.stringify(shippingForm.watch("shipping"))
                      }
                      onChange={(e) => {
                        if (
                          e.target.checked &&
                          shippingForm.formState.isValid
                        ) {
                          mutateRecipient.mutate({
                            recipient: shippingForm.getValues().shipping,
                          });
                        }
                      }}
                      id="save-as-default"
                    />
                    <Typography
                      htmlFor="save-as-default"
                      component="label"
                      sx={{ cursor: "pointer" }}
                    >
                      Save as default address
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  </Box>
                </Grid>
              )}
              {/* Step 2: Review Order */}
              {activeStep === 1 && (
                <Grid container spacing={4} sx={{ width: "100%" }}>
                  {/* Left: Shipping & Items */}
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Shipping Address
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {shippingForm.getValues().shipping.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingForm.getValues().shipping.address1}
                          {shippingForm.getValues().shipping.address2
                            ? `, ${shippingForm.getValues().shipping.address2}`
                            : ""}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingForm.getValues().shipping.city},{" "}
                          {shippingForm.getValues().shipping.state_code ||
                            shippingForm.getValues().shipping.state_name}{" "}
                          {shippingForm.getValues().shipping.zip}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {shippingForm.getValues().shipping.country_name ||
                            shippingForm.getValues().shipping.country_code}
                        </Typography>
                        {shippingForm.getValues().shipping.phone && (
                          <Typography variant="body2" color="text.secondary">
                            Phone: {shippingForm.getValues().shipping.phone}
                          </Typography>
                        )}
                        {shippingForm.getValues().shipping.email && (
                          <Typography variant="body2" color="text.secondary">
                            Email: {shippingForm.getValues().shipping.email}
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        Order Items
                      </Typography>
                      {itemsWithPrices.map(({ item, total }) => (
                        <CartSummaryItem
                          key={item.id}
                          item={item}
                          total={total}
                        />
                      ))}
                    </Paper>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                      }}
                    >
                      <Button onClick={handleBack}>Back</Button>
                    </Box>
                  </Grid>
                  {/* Right: Order Summary */}
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 3,
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark"
                            ? grey["900"]
                            : grey["50"],
                        minWidth: 280,
                      }}
                    >
                      <Typography
                        variant="h6"
                        gutterBottom
                        color="text.primary"
                      >
                        Order Summary
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography color="text.primary">
                          {isSubtotalLoading
                            ? "Calculating..."
                            : `$${subtotal.toFixed(2)}`}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="text.secondary">Shipping</Typography>
                        <Typography color="text.primary">
                          {shippingRatesMutation.isPending
                            ? "Calculating..."
                            : shippingRate !== null
                            ? `$${shippingRate.toFixed(2)}`
                            : "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography color="text.secondary">Tax (8%)</Typography>
                        <Typography color="text.primary">{`$${tax.toFixed(
                          2
                        )}`}</Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontWeight: 600,
                          mt: 2,
                          mb: 2,
                        }}
                      >
                        <Typography color="text.primary">Total</Typography>
                        <Typography color="text.primary">
                          {shippingRatesMutation.isPending
                            ? "Calculating..."
                            : `$${total.toFixed(2)}`}
                        </Typography>
                      </Box>
                      <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => {
                          handlePlaceOrder();
                        }}
                        disabled={
                          paypalCreateOrderMutation.isPending ||
                          !formState.isValid ||
                          shippingRatesMutation.isPending ||
                          shippingRate === null
                        }
                        sx={{ mt: 2 }}
                      >
                        Place Order
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </form>
        </Paper>
      </Container>
      {/* PayPal Dialog - only opens after Place Order */}
      <Dialog
        open={paypalDialogOpen}
        onClose={() => setPaypalDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Complete Payment
          </Typography>
          {paypalCreateOrderMutation.isPending && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 120,
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {!!paypalCreateOrderMutation.error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {paypalCreateOrderMutation.error.message}
            </Typography>
          )}

          <PayPalCardFieldsProvider
            createOrder={handlePaypalCreateOrder}
            onApprove={() => Promise.resolve()}
            onError={(err) => {
              // Handle PayPal card field errors here
              console.error("PayPal CardFields error:", err);
            }}
            style={{
              input: {
                "font-size": "16px",
                "font-family": "courier, monospace",
                "font-weight": "lighter",
                color: "#ccc",
              },
              ".invalid": { color: "purple" },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                alignItems: "center",
              }}
            >
              <PayPalButtons
                style={{ disableMaxWidth: true }}
                onApprove={async (data) => {
                  console.log("PayPal button clicked", data);
                }}
                createOrder={handlePaypalCreateOrder}
                onCancel={() => {
                  console.log("PayPal order cancelled");
                }}
                onError={(err) => {
                  console.error("PayPal button error:", err);
                }}
              />
            </Box>
            <Box sx={{ my: 2, textAlign: "center" }}>
              <Typography variant="body1" color="text.secondary">
                — OR —
              </Typography>
            </Box>
            {/* Use the extracted PayPalCardFieldsForm here */}
            <PayPalCardFieldsForm
              loading={
                paypalCreateOrderMutation.isPending ||
                paypalCreateOrderMutation.isPending
              }
            />
          </PayPalCardFieldsProvider>
        </Box>
      </Dialog>
    </FormProvider>
  );
}
