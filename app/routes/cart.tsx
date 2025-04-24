import { Box, Grid, Paper, Typography, Container } from "@mui/material";
import { CartList } from "../features/cart/components/cart_list";
import { CartSummary } from "../features/cart/components/cart_summary";
import { useQueryCart } from "../features/cart/hooks/use_query_cart";
import { useMutateRemoveCartItem } from "../features/cart/hooks/use_mutate_remove_cart_item";
import { useMutateClearCart } from "../features/cart/hooks/use_mutate_clear_cart";
import { useMutateUpdateCartItemQuantity } from "../features/cart/hooks/use_mutate_update_cart_item_quantity";
import type { PrintfulV2OrderItem } from "~/types/printful";
import { useState, useCallback } from "react";

export default function Cart() {
  const { data: cartItems = [], isLoading } = useQueryCart();
  const { mutate: removeItem } = useMutateRemoveCartItem();
  const { mutate: clearCart } = useMutateClearCart();
  const { mutate: updateQuantity } = useMutateUpdateCartItemQuantity();

  // State to track calculated prices for each cart item
  const [itemPrices, setItemPrices] = useState<Record<number, number>>({});

  // Callback to update the price for a specific cart item
  const setItemPrice = useCallback((itemId: number, price: number) => {
    setItemPrices((prev) => ({ ...prev, [itemId]: price }));
  }, []);

  // Calculate subtotal from lifted item prices
  const subtotal = cartItems.reduce((sum, item) => {
    const price = itemPrices[item.id] ?? 0;
    const item_data = (item.item_data ?? {}) as { quantity?: number };
    const quantity = item_data.quantity ?? 1;
    return sum + price * quantity;
  }, 0);

  const cart = {
    items: cartItems,
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
                setItemPrice={setItemPrice}
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
