import { Box, Typography, Paper, Button, Divider } from "@mui/material";
import { FiShoppingBag, FiCreditCard } from "react-icons/fi";
import { Link } from "react-router";

interface CartSummaryProps {
  cart: {
    items: any[]; // Replace with actual type if available
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
}

export const CartSummary: React.FC<CartSummaryProps> = ({ cart }) => {
  const { subtotal, shipping, tax, total } = cart;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>

      <Box sx={{ my: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography>Subtotal</Typography>
          <Typography>${subtotal.toFixed(2)}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography>Shipping</Typography>
          <Typography>${shipping.toFixed(2)}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Typography>Tax</Typography>
          <Typography>${tax.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Divider />

      <Box sx={{ display: "flex", justifyContent: "space-between", my: 2 }}>
        <Typography variant="h6">Total</Typography>
        <Typography variant="h6">${total.toFixed(2)}</Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        component={Link}
        to="/checkout"
        startIcon={<FiCreditCard />}
        size="large"
        disabled={cart.items.length === 0}
      >
        Proceed to Checkout
      </Button>

      <Button
        variant="text"
        fullWidth
        component={Link}
        to="/products"
        startIcon={<FiShoppingBag />}
        sx={{ mt: 2 }}
      >
        Continue Shopping
      </Button>
    </Paper>
  );
};
