import { Box, Grid, Paper, Typography, Container } from "@mui/material";
import { CartList } from "../features/cart/components/cart_list";
import { CartSummary } from "../features/cart/components/cart_summary";
import { useQueryCart } from "../features/cart/hooks/use_query_cart";
import { useMutateRemoveCartItem } from "../features/cart/hooks/use_mutate_remove_cart_item";
import { useMutateClearCart } from "../features/cart/hooks/use_mutate_clear_cart";
import { useMutateUpdateCartItemQuantity } from "../features/cart/hooks/use_mutate_update_cart_item_quantity";
import type { PrintfulV2OrderItem } from "~/types/printful";

export default function Cart() {
  const { data: cartItems = [], isLoading } = useQueryCart();
  const { mutate: removeItem } = useMutateRemoveCartItem();
  const { mutate: clearCart } = useMutateClearCart();
  const { mutate: updateQuantity } = useMutateUpdateCartItemQuantity();

  // Calculate cart summary (subtotal, etc.)
  // The subtotal is now calculated in CartItem, so we sum up item totals here
  // We'll use 0 as a placeholder since CartItem handles price display
  const subtotal = 0;
  const shipping = 5; // Placeholder
  const tax = 0; // Placeholder
  const total = subtotal + shipping + tax;

  const cart = {
    items: cartItems,
    subtotal,
    shipping,
    tax,
    total,
  };

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
                onRemoveItem={(id) => removeItem({ itemId: id })}
                onUpdateQuantity={(id, quantity) =>
                  updateQuantity({ itemId: id, quantity })
                }
                onClearCart={() => clearCart()}
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
