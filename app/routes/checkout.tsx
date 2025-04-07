import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Grid,
  Paper,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { z } from "zod";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCart } from "../features/cart/hooks/useCart";

const checkoutSchema = z.object({
  shipping: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    address1: z.string().min(1, "Address is required"),
    address2: z.string().optional(),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(1, "Zip code is required"),
    country: z.string().min(1, "Country is required"),
    saveAddress: z.boolean().optional(),
  }),
  payment: z.object({
    cardName: z.string().min(1, "Name on card is required"),
    cardNumber: z
      .string()
      .min(1, "Card number is required")
      .regex(/^[0-9]{16}$/, "Please enter a valid 16-digit card number"),
    expDate: z
      .string()
      .min(1, "Expiry date is required")
      .regex(
        /^(0[1-9]|1[0-2])\/20[2-9][0-9]$/,
        "Please enter a valid expiry date (MM/YYYY)"
      ),
    cvv: z
      .string()
      .min(1, "CVV is required")
      .regex(/^[0-9]{3,4}$/, "CVV must be 3 or 4 digits"),
    saveCard: z.boolean().optional(),
  }),
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
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            id="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            {...register("shipping.firstName", {
              required: "First name is required",
            })}
            error={!!errors.shipping?.firstName}
            helperText={errors.shipping?.firstName?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            id="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            {...register("shipping.lastName", {
              required: "Last name is required",
            })}
            error={!!errors.shipping?.lastName}
            helperText={errors.shipping?.lastName?.message ?? ""}
          />
        </Grid>
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
            id="state"
            label="State/Province/Region"
            fullWidth
            {...register("shipping.state", {
              required: "State is required",
            })}
            error={!!errors.shipping?.state}
            helperText={errors.shipping?.state?.message ?? ""}
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
            required
            id="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            {...register("shipping.country", {
              required: "Country is required",
            })}
            error={!!errors.shipping?.country}
            helperText={errors.shipping?.country?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                color="secondary"
                {...register("shipping.saveAddress")}
              />
            }
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const PaymentForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            id="cardName"
            label="Name on card"
            fullWidth
            autoComplete="cc-name"
            {...register("payment.cardName", {
              required: "Name on card is required",
            })}
            error={!!errors.payment?.cardName}
            helperText={errors.payment?.cardName?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            id="cardNumber"
            label="Card number"
            fullWidth
            autoComplete="cc-number"
            {...register("payment.cardNumber", {
              required: "Card number is required",
              pattern: {
                value: /^[0-9]{16}$/,
                message: "Card number must be 16 digits",
              },
            })}
            error={!!errors.payment?.cardNumber}
            helperText={errors.payment?.cardNumber?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            {...register("payment.expDate", {
              required: "Expiry date is required",
              pattern: {
                value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                message: "Expiry date must be in MM/YY format",
              },
            })}
            error={!!errors.payment?.expDate}
            helperText={errors.payment?.expDate?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            required
            id="cvv"
            label="CVV"
            fullWidth
            autoComplete="cc-csc"
            {...register("payment.cvv", {
              required: "CVV is required",
              pattern: {
                value: /^[0-9]{3,4}$/,
                message: "CVV must be 3 or 4 digits",
              },
            })}
            error={!!errors.payment?.cvv}
            helperText={errors.payment?.cvv?.message ?? ""}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox color="secondary" {...register("payment.saveCard")} />
            }
            label="Remember credit card details for next time"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

const ReviewOrder = ({ formData }: { formData: CheckoutFormData }) => {
  const { cart } = useCart();
  const typedCartItems = cart.items as unknown as CartItem[];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="h6" gutterBottom>
            Shipping
          </Typography>
          <Typography gutterBottom>
            {formData.shipping.firstName} {formData.shipping.lastName}
          </Typography>
          <Typography gutterBottom>
            {formData.shipping.address1}
            {formData.shipping.address2
              ? `, ${formData.shipping.address2}`
              : ""}
          </Typography>
          <Typography gutterBottom>
            {formData.shipping.city}, {formData.shipping.state}{" "}
            {formData.shipping.zip}
          </Typography>
          <Typography gutterBottom>{formData.shipping.country}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="h6" gutterBottom>
            Payment details
          </Typography>
          <Typography gutterBottom>
            Card holder: {formData.payment.cardName}
          </Typography>
          <Typography gutterBottom>
            Card number: **** **** ****
            {formData.payment.cardNumber.slice(-4)}
          </Typography>
          <Typography gutterBottom>
            Expiry date: {formData.payment.expDate}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h6" gutterBottom>
            Items
          </Typography>
          {typedCartItems.map((item) => (
            <Box
              key={item.id}
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  component="img"
                  src={item.imageUrl}
                  alt={item.name}
                  sx={{ width: 60, height: 60, mr: 2, objectFit: "cover" }}
                />
                <Box>
                  <Typography variant="body1">{item.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1">
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              pt: 2,
              borderTop: "1px solid #eee",
            }}
          >
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">
              $
              {typedCartItems
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const steps = ["Shipping address", "Payment details", "Review your order"];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);

  const methods = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shipping: {
        firstName: "",
        lastName: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        saveAddress: false,
      },
      payment: {
        cardName: "",
        cardNumber: "",
        expDate: "",
        cvv: "",
        saveCard: false,
      },
    },
    mode: "onChange",
  });

  const { handleSubmit, watch, trigger } = methods;
  const formData = watch();

  const handleNext = async () => {
    let isValid = false;

    if (activeStep === 0) {
      isValid = await trigger("shipping");
    } else if (activeStep === 1) {
      isValid = await trigger("payment");
    } else {
      isValid = true;
    }

    if (isValid) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Order submitted:", data);
    setActiveStep(activeStep + 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ShippingForm />;
      case 1:
        return <PaymentForm />;
      case 2:
        return <ReviewOrder formData={formData} />;
      default:
        throw new Error("Unknown step");
    }
  };

  return (
    <FormProvider {...methods}>
      <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </>
          ) : (
            <form
              onSubmit={
                activeStep === steps.length - 1
                  ? handleSubmit(onSubmit)
                  : (e) => e.preventDefault()
              }
            >
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={
                    activeStep === steps.length - 1
                      ? handleSubmit(onSubmit)
                      : handleNext
                  }
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Place order" : "Next"}
                </Button>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
    </FormProvider>
  );
}
