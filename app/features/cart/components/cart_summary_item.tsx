import { Box, Typography } from "@mui/material";
import type { CartItem as CartItemType } from "~/db/schema/carts";

/**
 * Displays a single cart item with calculated price.
 * @param item - The cart item
 * @param total - The calculated total price for the item
 */
export function CartSummaryItem({
  item,
  total,
}: {
  item: CartItemType;
  total: number;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography>
        {item.item_data.name} x{item.item_data.quantity ?? 1}
      </Typography>
      <Typography>${total.toFixed(2)}</Typography>
    </Box>
  );
}
