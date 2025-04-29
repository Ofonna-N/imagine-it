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
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useQueryCart } from "~/features/cart/hooks/use_query_cart";
import { useMutateShippingRates } from "~/features/order/hooks/use_query_shipping_rates";
import { useEffect, useState } from "react";
import { useCartItemsWithPrices } from "~/features/cart/hooks/use_cart_items_with_prices";
import { CartSummaryItem } from "~/features/cart/components/cart_summary_item";
import { useQueryRecipient } from "~/features/cart/hooks/use_query_recipient";
import { useMutateRecipient } from "~/features/cart/hooks/use_mutate_recipient";

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

interface CartItem {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

const ShippingForm = () => {
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
        <Grid size={{ xs: 12 }}>
          <TextField
            required
            id="name"
            label="Full Name"
            fullWidth
            autoComplete="name"
            {...register("shipping.name", {
              required: "Name is required",
            })}
            error={!!errors.shipping?.name}
            helperText={errors.shipping?.name?.message ?? ""}
          />
        </Grid>
        {/* <Grid size={{ xs: 12 }}>
          <TextField
            id="company"
            label="Company"
            fullWidth
            autoComplete="organization"
            {...register("shipping.company")}
            error={!!errors.shipping?.company}
            helperText={errors.shipping?.company?.message ?? ""}
          />
        </Grid> */}
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
            {...register("shipping.city", {
              required: "City is required",
            })}
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
            {...register("shipping.zip", {
              required: "Zip code is required",
            })}
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
};

const steps = ["Shipping Address", "Payment", "Review Order"];

export default function Checkout() {
  // Only need shipping form and payment buttons/summary, so remove stepper and step logic
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

  const { handleSubmit, watch } = shippingForm;
  console.log(
    "shippingForm",
    JSON.stringify(shippingForm.getValues().shipping)
  );

  const { data: cartItems = [] } = useQueryCart();
  const {
    itemsWithPrices,
    subtotal,
    isLoading: isSubtotalLoading,
  } = useCartItemsWithPrices(cartItems);
  const shippingAddress = watch("shipping");

  const { data: recipientData, isLoading: isRecipientLoading } =
    useQueryRecipient();
  console.log("recipient data", JSON.stringify(recipientData?.recipient_data));
  console.log(
    "shipping address is equal to recipient data",
    JSON.stringify(recipientData?.recipient_data) ===
      JSON.stringify(shippingForm.getValues().shipping)
  );
  const mutateRecipient = useMutateRecipient();
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  const [shippingRatesRequested, setShippingRatesRequested] = useState(false);
  const formState = useFormState({ control: shippingForm.control });
  const [activeStep, setActiveStep] = useState(0);

  // Step navigation handlers
  const handleNext = async () => {
    if (activeStep === 0) {
      // Validate shipping address before moving to payment
      const valid = await shippingForm.trigger("shipping");
      if (!valid) return;
    }
    setActiveStep((prev) => prev + 1);
  };
  const handleBack = () => setActiveStep((prev) => prev - 1);

  // Allow users to click on step numbers to navigate
  const handleStepClick = async (step: number) => {
    // Only allow going to a previous step or the current step without validation
    if (step < activeStep) {
      setActiveStep(step);
      return;
    }
    // If moving forward, validate as needed
    if (step === 1 && activeStep === 0) {
      const valid = await shippingForm.trigger("shipping");
      if (!valid) return;
      setActiveStep(step);
      return;
    }
    if (step === 2 && activeStep < 2) {
      // Validate shipping before review
      const valid = await shippingForm.trigger("shipping");
      if (!valid) return;
      setActiveStep(step);
      return;
    }
  };

  // Pre-fill form with recipient info on mount
  useEffect(() => {
    if (recipientData?.recipient_data) {
      shippingForm.setValue("shipping", recipientData.recipient_data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipientData]);

  // Save recipient automatically if toggle is true and form is valid
  useEffect(() => {
    async function maybeSaveRecipient() {
      if (saveAsDefault && formState.isValid) {
        mutateRecipient.mutate({
          recipient: shippingForm.getValues().shipping,
        });
      }
    }
    maybeSaveRecipient();
    // Only run when saveAsDefault or form validity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAsDefault, formState.isValid]);

  // Handler for fetching shipping rates
  const handleFetchShippingRates = async () => {
    const valid = await shippingForm.trigger("shipping");
    if (valid && cartItems.length > 0) {
      setShippingRatesRequested(true);
      fetchShippingRates();
    }
  };

  // Prepare shipping rates mutation
  const shippingRatesMutation = useMutateShippingRates();

  // Helper to trigger shipping rates fetch
  const fetchShippingRates = () => {
    if (!shippingAddress || cartItems.length === 0) return;
    const order_items = cartItems.map(
      ({ mockup_urls, ...remainingItems }) => remainingItems.item_data
    );
    shippingRatesMutation.mutate({
      recipient: shippingAddress,
      order_items,
    });
  };

  const onSubmit = (data: CheckoutFormData) => {
    // Handle order submission
    console.log("Order submitted:", data);
  };

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
                    ":hover": {
                      cursor: "pointer",
                    },
                    "&:hover svg": {
                      boxShadow: "0 0 12px 4px rgba(25, 118, 210, 0.4)",
                      filter: "brightness(1.15)",
                      borderRadius: "50%", // Keep border radius on hover
                    },
                  }}
                  slotProps={{
                    label: {
                      sx: {
                        ":hover": {
                          color: (theme) =>
                            alpha(theme.palette.text.primary, 0.35), // Add alpha to text color
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              {/* Step 1: Shipping Address */}
              {activeStep === 0 && (
                <Grid size={12}>
                  <ShippingForm />
                  <Box
                    sx={{
                      alignItems: "center",
                      mt: 2,
                      display: shippingForm.formState.isValid ? "flex" : "none",
                    }}
                  >
                    <Checkbox
                      checked={
                        JSON.stringify(recipientData?.recipient_data) ===
                        JSON.stringify(shippingForm.getValues().shipping)
                      }
                      onChange={(e) => setSaveAsDefault(e.target.checked)}
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
              {/* Step 2: Payment */}
              {activeStep === 1 && (
                <Grid size={12}>
                  <Box sx={{ mb: 2 }}>
                    <PayPalButtons disabled />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Button onClick={handleBack}>Back</Button>
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
              {/* Step 3: Review Order */}
              {activeStep === 2 && (
                <>
                  <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="h6" gutterBottom>
                      Review Order
                    </Typography>
                    {/* Display summary of shipping, payment, and cart */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">
                        Shipping Address
                      </Typography>
                      <pre
                        style={{
                          padding: 8,
                          borderRadius: 4,
                        }}
                      >
                        {JSON.stringify(
                          shippingForm.getValues().shipping,
                          null,
                          2
                        )}
                      </pre>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">Order Items</Typography>
                      {itemsWithPrices.map(({ item, total }) => (
                        <CartSummaryItem
                          key={item.id}
                          item={item}
                          total={total}
                        />
                      ))}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                      }}
                    >
                      <Button onClick={handleBack}>Back</Button>
                      <Button type="submit" variant="contained" color="primary">
                        Place Order
                      </Button>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 5 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order Summary
                      </Typography>
                      {itemsWithPrices.map(({ item, total }) => (
                        <CartSummaryItem
                          key={item.id}
                          item={item}
                          total={total}
                        />
                      ))}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mt: 2,
                        }}
                      >
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography>
                          {isSubtotalLoading
                            ? "Calculating..."
                            : subtotal.toFixed(2)}
                        </Typography>
                      </Box>
                      {/* Shipping rates display */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography color="text.secondary">Shipping</Typography>
                        <Typography>
                          {shippingRatesMutation.isPending && "Calculating..."}
                          {shippingRatesMutation.data?.data?.[0]?.rate
                            ? `$${Number(
                                shippingRatesMutation.data.data[0].rate
                              ).toFixed(2)}`
                            : !shippingRatesMutation.isPending && "N/A"}
                        </Typography>
                      </Box>
                      {/* ...existing tax and total display... */}
                    </Box>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </Paper>
      </Container>
    </FormProvider>
  );
}
