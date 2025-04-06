import { Box, Grid, Paper, Typography, Container } from "@mui/material";
import { CartList } from "../features/cart/components/CartList";
import { CartSummary } from "../features/cart/components/CartSummary";
import { useCart } from "../features/cart/hooks/useCart";

export default function Cart() {
  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Shopping Cart
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3 }}>
              <CartList
                cart={cart}
                onRemoveItem={removeItem}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
              />
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <CartSummary cart={cart} />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
