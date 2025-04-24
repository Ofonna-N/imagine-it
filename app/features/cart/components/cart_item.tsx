import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardMedia,
  CardContent,
  Button,
} from "@mui/material";
import { FiTrash2, FiImage } from "react-icons/fi";
import Dialog from "@mui/material/Dialog";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import type { CartItem as CartItemType } from "~/db/schema/carts";
import { useState, useEffect } from "react";
import { useCartItemPrice } from "~/features/cart/hooks/use_cart_item_price";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  setItemPrice: (itemId: number, price: number) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  setItemPrice,
}) => {
  // Type assertions for API-driven cart item
  const item_data = item.item_data ?? {};
  const mockup_urls = item.mockup_urls ?? [];
  const design_meta = item.design_meta;
  const quantity = item_data.quantity ?? 1;

  const designName = design_meta?.designName ?? "(No Design)";
  const previewImage =
    mockup_urls[0] ?? "https://via.placeholder.com/100x100?text=Preview";

  // Use the new price hook
  const { total, isLoading: isPriceLoading } = useCartItemPrice(item);

  // Lift price up
  useEffect(() => {
    setItemPrice(item.id, total);
  }, [item.id, total, setItemPrice]);

  const [galleryOpen, setGalleryOpen] = useState(false);

  const itemTotalDisplay = isPriceLoading ? "..." : `$${total.toFixed(2)}`;

  return (
    <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100, objectFit: "contain" }}
            image={previewImage}
            alt={item_data.name ?? "Product Preview"}
          />
          {mockup_urls.length > 1 && (
            <IconButton
              size="small"
              sx={{
                position: "absolute",
                top: 4,
                right: 4,
                bgcolor: "background.paper",
                boxShadow: 1,
              }}
              onClick={() => setGalleryOpen(true)}
              aria-label="View all mockups"
            >
              <FiImage />
            </IconButton>
          )}
        </Box>
        <CardContent sx={{ flex: 1, ml: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              {item_data.name ?? "Product"}
            </Typography>
            <Typography variant="h6" component="div">
              {itemTotalDisplay}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Design: {designName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
              type="number"
              size="small"
              label="Qty"
              value={quantity}
              onChange={(e) => {
                const newQuantity = parseInt(e.target.value);
                if (!isNaN(newQuantity) && newQuantity >= 1) {
                  onUpdateQuantity(item.id, newQuantity);
                }
              }}
              slotProps={{
                input: {
                  slotProps: {
                    input: {
                      min: 1,
                    },
                  },
                },
              }}
              sx={{ width: "80px" }}
            />
            <Box sx={{ ml: 2 }}>
              <IconButton
                color="error"
                aria-label="remove item"
                onClick={() => onRemoveItem(item.id)}
              >
                <FiTrash2 />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Box>
      {/* Gallery Dialog */}
      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Mockup Gallery
          </Typography>
          <ImageList cols={3} gap={8}>
            {mockup_urls.map((url, idx) => (
              <ImageListItem key={url + idx}>
                <img
                  src={url}
                  alt={`Mockup ${idx + 1}`}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </ImageListItem>
            ))}
          </ImageList>
          <Button
            onClick={() => setGalleryOpen(false)}
            sx={{ mt: 2 }}
            variant="outlined"
            fullWidth
          >
            Close Gallery
          </Button>
        </Box>
      </Dialog>
    </Card>
  );
};
