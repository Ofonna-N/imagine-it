import { useState } from "react";
import {
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Divider,
} from "@mui/material";
import { FiArrowLeft, FiArrowRight, FiCheck } from "react-icons/fi";
import { Link } from "react-router";

const steps = ["Shipping Information", "Payment Method", "Review Order"];

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <ShippingForm />;
      case 1:
        return <PaymentForm />;
      case 2:
        return <ReviewOrder />;
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3 }}>
        {activeStep === steps.length ? (
          <Box sx={{ textAlign: "center" }}>
            <FiCheck size={60} color="green" style={{ margin: "20px auto" }} />
            <Typography variant="h5" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography variant="body1">
              Your order number is #2001539. We have emailed your order
              confirmation, and will send you an update when your order has
              shipped.
            </Typography>
            <Button variant="contained" sx={{ mt: 3 }} href="/">
              Return to Home
            </Button>
          </Box>
        ) : (
          <>
            {getStepContent(activeStep)}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              {activeStep !== 0 && (
                <Button
                  startIcon={<FiArrowLeft />}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
              )}
              <Button
                variant="contained"
                endIcon={
                  activeStep === steps.length - 1 ? (
                    <FiCheck />
                  ) : (
                    <FiArrowRight />
                  )
                }
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Place Order" : "Next"}
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}

function ShippingForm() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          id="firstName"
          name="firstName"
          label="First name"
          fullWidth
          autoComplete="given-name"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          id="lastName"
          name="lastName"
          label="Last name"
          fullWidth
          autoComplete="family-name"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          required
          id="address1"
          name="address1"
          label="Address line 1"
          fullWidth
          autoComplete="shipping address-line1"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          id="address2"
          name="address2"
          label="Address line 2"
          fullWidth
          autoComplete="shipping address-line2"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          id="city"
          name="city"
          label="City"
          fullWidth
          autoComplete="shipping address-level2"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          id="state"
          name="state"
          label="State/Province/Region"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          id="zip"
          name="zip"
          label="Zip / Postal code"
          fullWidth
          autoComplete="shipping postal-code"
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          required
          id="country"
          name="country"
          label="Country"
          fullWidth
          autoComplete="shipping country"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={<Checkbox color="primary" name="saveAddress" value="yes" />}
          label="Use this address for payment details"
        />
      </Grid>
    </Grid>
  );
}

function PaymentForm() {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl component="fieldset">
          <FormLabel component="legend">Payment Method</FormLabel>
          <RadioGroup defaultValue="credit">
            <FormControlLabel
              value="credit"
              control={<Radio />}
              label="Credit Card"
            />
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label="PayPal"
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          required
          id="cardName"
          label="Name on card"
          fullWidth
          autoComplete="cc-name"
        />
        <TextField
          required
          id="cardNumber"
          label="Card number"
          fullWidth
          autoComplete="cc-number"
          sx={{ mt: 2 }}
        />
        <Grid container spacing={2} sx={{ mt: 0 }}>
          <Grid size={{ xs: 6 }}>
            <TextField
              required
              id="expDate"
              label="Expiry date"
              fullWidth
              autoComplete="cc-exp"
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              required
              id="cvv"
              label="CVV"
              helperText="Last three digits on signature strip"
              fullWidth
              autoComplete="cc-csc"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={<Checkbox color="primary" name="saveCard" value="yes" />}
          label="Remember credit card details for next time"
        />
      </Grid>
    </Grid>
  );
}

function ReviewOrder() {
  // Mock order summary
  const items = [
    { name: "T-Shirt with Mountain Design", qty: 2, price: 24.99 },
    { name: "Mug with Abstract Pattern", qty: 1, price: 14.99 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 5.99;
  const tax = subtotal * 0.07;
  const total = subtotal + shipping + tax;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" gutterBottom>
            Shipping
          </Typography>
          <Typography variant="body2">
            John Smith
            <br />
            123 Example St
            <br />
            Anytown, AN 12345
            <br />
            USA
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Typography variant="subtitle1" gutterBottom>
            Payment Details
          </Typography>
          <Typography variant="body2">
            Card ending in 1234
            <br />
            Expiry date: 04/2024
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" gutterBottom>
        Order Items
      </Typography>

      {items.map((item, index) => (
        <Box
          key={index}
          sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
        >
          <Typography variant="body1">
            {item.name} x {item.qty}
          </Typography>
          <Typography variant="body1">
            ${(item.price * item.qty).toFixed(2)}
          </Typography>
        </Box>
      ))}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body1">Subtotal</Typography>
        <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body1">Shipping</Typography>
        <Typography variant="body1">${shipping.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body1">Tax</Typography>
        <Typography variant="body1">${tax.toFixed(2)}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">${total.toFixed(2)}</Typography>
      </Box>
    </Box>
  );
}
