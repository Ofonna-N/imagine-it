import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress, // Import for loading state
  Alert, // Import for error state
} from "@mui/material";
import { FiX } from "react-icons/fi";
import type {
  PrintfulV2CatalogProduct,
  PrintfulV2CatalogVariant,
  // PrintfulV2MockupStyleGroup, // Type is now inferred from the hook
} from "~/types/printful";
import { useQueryProductMockupStyles } from "../hooks/use_query_product_mockup_styles"; // Import the custom hook

interface ProductDesignerProps {
  open: boolean;
  onClose: () => void;
  product: PrintfulV2CatalogProduct;
  selectedVariant: PrintfulV2CatalogVariant;
}

/**
 * Component for the Product Designer UI.
 * Fetches mockup styles and will contain controls for generating mockups.
 */
const ProductDesigner: React.FC<ProductDesignerProps> = ({
  open,
  onClose,
  product,
  selectedVariant,
}) => {
  // Fetch mockup styles using the custom hook
  // The query is enabled only when the dialog is open and product.id is available
  const {
    data: mockupStyles,
    isLoading,
    isError,
    error,
  } = useQueryProductMockupStyles(open ? product.id.toString() : undefined);

  // TODO: Implement actual designer UI
  // - Image upload/selection
  // - Text input
  // - Placement selection (based on product.placements)
  // - Mockup style selection (based on mockupStyles)
  // - Call to createPrintfulMockupTask
  // - Polling for mockup result
  // - Displaying generated mockup

  const renderContent = () => {
    if (isLoading) {
      return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      );
    }

    if (isError) {
      return (
        <Alert severity="error">
          Error fetching mockup styles: {error?.message || "Unknown error"}
        </Alert>
      );
    }

    if (!mockupStyles) {
      return (
        <Alert severity="info">
          No mockup styles available for this product.
        </Alert>
      );
    }

    // Main designer content when data is loaded
    return (
      <>
        <Typography gutterBottom>
          Selected Variant ID: {selectedVariant.id} ({selectedVariant.color} /
          {selectedVariant.size})
        </Typography>
        <Typography gutterBottom>
          Available Mockup Style Groups: {mockupStyles.length}
        </Typography>
        {/* TODO: Add dropdown or list to select a mockup style group/placement */}
        <Box sx={{ mt: 2, p: 2, border: "1px dashed grey", minHeight: 200 }}>
          <Typography color="textSecondary">
            (Designer controls will go here - e.g., image upload, text tool,
            placement selection based on available styles)
          </Typography>
          {/* Example: Display placement names from fetched styles */}
          {mockupStyles.length > 0 && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption">Available Placements:</Typography>
              <ul>
                {mockupStyles.map((group) => (
                  <li key={group.placement}>{group.display_name}</li>
                ))}
              </ul>
            </Box>
          )}
        </Box>
      </>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Design: {product.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FiX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={() => {
            /* TODO: Implement Generate Mockup */
          }}
          disabled={
            isLoading || isError || !mockupStyles || mockupStyles.length === 0
          }
        >
          Generate Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDesigner;
