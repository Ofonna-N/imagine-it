import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useQueryCart } from "~/features/cart/hooks/use_query_cart";
import { useMutateShippingRates } from "~/features/order/hooks/use_query_shipping_rates";
import { API_ROUTES } from "~/constants/route_paths";
import { useEffect, useMemo } from "react";
import { useCartItemsWithPrices } from "~/features/cart/hooks/use_cart_items_with_prices";
import { CartSummaryItem } from "~/features/cart/components/cart_summary_item";

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
    tax_number: z.string().optional(),
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
      <Typography variant="h6" gutterBottom>
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            id="tax_number"
            label="Tax Number"
            fullWidth
            {...register("shipping.tax_number")}
            error={!!errors.shipping?.tax_number}
            helperText={errors.shipping?.tax_number?.message ?? ""}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

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
        tax_number: "",
      },
    },
    mode: "onChange",
  });

  const { handleSubmit, watch } = shippingForm;
  console.log("shippingForm", shippingForm.formState.errors);
  const { data: cartItems = [] } = useQueryCart();
  const {
    itemsWithPrices,
    subtotal,
    isLoading: isSubtotalLoading,
  } = useCartItemsWithPrices(cartItems);
  const shippingAddress = watch("shipping");

  // Determine if shipping address is valid (basic check for required fields)
  const isShippingAddressValid =
    !!shippingAddress?.name &&
    !!shippingAddress?.address1 &&
    !!shippingAddress?.city &&
    !!shippingAddress?.country_code &&
    !!shippingAddress?.zip;

  // Prepare shipping rates mutation
  const shippingRatesMutation = useMutateShippingRates();

  // Helper to trigger shipping rates fetch
  const fetchShippingRates = () => {
    if (!isShippingAddressValid || cartItems.length === 0) return;
    const order_items = cartItems.map(
      ({ mockup_urls, ...remainingItems }) => remainingItems.item_data
    );
    shippingRatesMutation.mutate({
      recipient: shippingAddress,
      order_items,
    });
  };

  // Fetch shipping rates when address or cart changes
  useEffect(() => {
    async function handleShippingRatesResponse() {
      const shouldFetchRates =
        (await shippingForm.trigger()) && shippingForm.formState.isDirty;
      console.log("valida", await shippingForm.trigger());
      console.log("dirty", shippingForm.formState.isDirty);
      console.log("valid", shippingForm.formState.isValid);

      if (shouldFetchRates) {
        console.log("Fetching shipping rates...");
        // fetchShippingRates();
        shippingForm.setValue("shipping", shippingAddress, {
          shouldDirty: false,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    handleShippingRatesResponse();
  }, [isShippingAddressValid, cartItems]);

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              {/* Left: Shipping info */}
              <Grid size={{ xs: 12, md: 7 }}>
                <ShippingForm />
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}
                >
                  <Button type="submit" variant="contained" color="primary">
                    Place Order
                  </Button>
                </Box>
              </Grid>
              {/* Right: Payment buttons and summary */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Box sx={{ mb: 2 }}>
                  <PayPalButtons disabled />
                </Box>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  {itemsWithPrices.map(({ item, total }) => (
                    <CartSummaryItem key={item.id} item={item} total={total} />
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
                    sx={{ display: "flex", justifyContent: "space-between" }}
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
            </Grid>
          </form>
        </Paper>
      </Container>
    </FormProvider>
  );
}
