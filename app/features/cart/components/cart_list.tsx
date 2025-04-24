import { Box, Typography, Button } from "@mui/material";
import { CartItem } from "./cart_item";
import type { CartItem as DBCartItem } from "~/db/schema/carts";

interface CartListProps {
  cart: { items: DBCartItem[] };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClearCart: () => void;
  setItemPrice: (itemId: number, price: number) => void;
}

export const CartList: React.FC<CartListProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  setItemPrice,
}) => {
  if (cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Typography variant="h6" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add some products to your cart to see them here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">
          Shopping Cart ({cart.items.length}{" "}
          {cart.items.length === 1 ? "item" : "items"})
        </Typography>
        <Button variant="text" color="error" size="small" onClick={onClearCart}>
          Clear Cart
        </Button>
      </Box>

      {cart.items.map((item: DBCartItem) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          setItemPrice={setItemPrice}
        />
      ))}
    </Box>
  );
};
