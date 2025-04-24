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
import { FiTrash2, FiEdit, FiImage } from "react-icons/fi";
import { Link } from "react-router";
import Dialog from "@mui/material/Dialog";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import type { CartItem as CartItemType } from "~/db/schema/carts";
import { useQueryVariantPrices } from "~/features/product/hooks/use_query_variant_prices";
import type {
  PrintfulV2OrderItem,
  PrintfulV2CatalogVariantPricesPlacementOption,
} from "~/types/printful";
import { useState, useEffect } from "react";

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
  const item_data = (item.item_data as PrintfulV2OrderItem) ?? {};
  const mockup_urls = (item.mockup_urls as string[]) ?? [];
  const design_meta = (item.design_meta as { designName?: string }) ?? {};
  const quantity = item_data.quantity ?? 1;
  const variantId = item_data.catalog_variant_id?.toString() ?? "";
  const designName = design_meta.designName ?? "(No Design)";
  const previewImage =
    mockup_urls[0] ?? "https://via.placeholder.com/100x100?text=Preview";

  // Fetch variant prices
  const { data: variantPrices, isLoading: isPriceLoading } =
    useQueryVariantPrices(variantId);

  // Calculate price: base + sum of selected placement options
  let basePrice = 0;
  let placementOptionsTotal = 0;
  if (variantPrices) {
    // Use the first technique's price as base (or fallback)
    const technique = variantPrices.variant.techniques[0];
    basePrice = parseFloat(technique?.price ?? "0");
    // Sum prices of selected placements (if any)
    if (item_data.placements && Array.isArray(item_data.placements)) {
      for (const placement of item_data.placements) {
        // Find placement option in variantPrices.product.placements
        const placementOption = variantPrices.product.placements.find(
          (p) => p.id === placement.placement
        );
        //disable for now
        // if (placementOption) {
        //   placementOptionsTotal += parseFloat(placementOption.placement_options.find(
        //     (option) => item_data.placements.some((p) => p.placement_options?.find(po => po.name === option.name))
        //   )?.price ?? "0");
        // }
      }
    }
  }
  const itemTotal = (basePrice + placementOptionsTotal) * quantity;

  // Call setItemPrice when itemTotal changes
  useEffect(() => {
    setItemPrice(item.id, basePrice + placementOptionsTotal);
    // Only update when price-relevant data changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id, basePrice, placementOptionsTotal]);

  const [galleryOpen, setGalleryOpen] = useState(false);

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
              {isPriceLoading ? "..." : `$${itemTotal.toFixed(2)}`}
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
              inputProps={{ min: 1 }}
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
