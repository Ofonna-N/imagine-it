import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { FiTrash2, FiEdit } from "react-icons/fi";
import { Link } from "react-router";
import { type CartItem as CartItemType } from "../types/index";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const { id, product, design, quantity } = item;
  const itemTotal = product.price * quantity;

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      onUpdateQuantity(id, newQuantity);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <CardMedia
          component="img"
          sx={{ width: 100, height: 100, objectFit: "contain" }}
          image={product.image}
          alt={product.name}
        />

        <CardContent sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              {product.name}
            </Typography>
            <Typography variant="h6" component="div">
              ${itemTotal.toFixed(2)}
            </Typography>
          </Box>

          {design && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Design: {design}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
              type="number"
              size="small"
              label="Qty"
              value={quantity}
              onChange={handleQuantityChange}
              InputProps={{ inputProps: { min: 1 } }}
              sx={{ width: "80px" }}
            />

            <Box sx={{ ml: 2 }}>
              <IconButton
                component={Link}
                to={`/design-playground?productId=${product.id}`}
                color="primary"
                aria-label="edit design"
              >
                <FiEdit />
              </IconButton>

              <IconButton
                color="error"
                aria-label="remove item"
                onClick={() => onRemoveItem(id)}
              >
                <FiTrash2 />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};
