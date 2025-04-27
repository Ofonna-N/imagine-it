import { Box, Grid, Paper, Typography, Container } from "@mui/material";
import { CartList } from "../features/cart/components/cart_list";
import { CartSummary } from "../features/cart/components/cart_summary";
import { useQueryCart } from "../features/cart/hooks/use_query_cart";
import { useMutateRemoveCartItem } from "../features/cart/hooks/use_mutate_remove_cart_item";
import { useMutateClearCart } from "../features/cart/hooks/use_mutate_clear_cart";
import { useMutateUpdateCartItemQuantity } from "../features/cart/hooks/use_mutate_update_cart_item_quantity";
import { useCartItemsWithPrices } from "../features/cart/hooks/use_cart_items_with_prices";

export default function Cart() {
  const { data: cartItems = [] } = useQueryCart();
  const { mutate: removeItem } = useMutateRemoveCartItem();
  const { mutate: clearCart } = useMutateClearCart();
  const { mutate: updateQuantity } = useMutateUpdateCartItemQuantity();

  const { itemsWithPrices, subtotal } = useCartItemsWithPrices(cartItems);

  const cart = {
    items: itemsWithPrices.map(({ item, total }) => ({
      ...item,
      calculatedTotal: total,
    })),
    subtotal,
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
