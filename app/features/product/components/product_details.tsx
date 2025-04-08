import { useState } from "react";
import { Link } from "react-router";
import {
  Typography,
  Box,
  Paper,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  Chip,
  Stack,
} from "@mui/material";
import { FiEdit, FiShoppingCart } from "react-icons/fi";
import type { PrintfulCatalogProductResponse } from "~/types/printful";

interface ProductDetailsProps {
  catalogProductResponse: PrintfulCatalogProductResponse;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  catalogProductResponse: {
    result: { product, variants },
  },
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  const selectedVariant = variants[selectedVariantIndex];

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Extract unique colors from variants for the color selector
  const uniqueColors = [...new Set(variants.map((variant) => variant.color))];

  // Extract unique sizes from variants for the size selector
  const uniqueSizes = [...new Set(variants.map((variant) => variant.size))];

  // Handle variant selection when a color is chosen
  const handleColorSelect = (color: string) => {
    const variantIndex = variants.findIndex(
      (v) => v.color === color && v.size === selectedVariant.size
    );
    if (variantIndex >= 0) {
      setSelectedVariantIndex(variantIndex);
    }
  };

  // Handle variant selection when a size is chosen
  const handleSizeSelect = (size: string) => {
    const variantIndex = variants.findIndex(
      (v) => v.size === size && v.color === selectedVariant.color
    );
    if (variantIndex >= 0) {
      setSelectedVariantIndex(variantIndex);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {product.title}
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={product.type_name} color="primary" variant="outlined" />
        <Chip label={product.brand} color="secondary" variant="outlined" />
      </Stack>

      <Typography variant="h5" color="primary" gutterBottom>
        ${parseFloat(selectedVariant.price).toFixed(2)}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {product.description}
      </Typography>

      {/* Color selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Color: {selectedVariant.color}
        </Typography>
        <Stack direction="row" spacing={1}>
          {uniqueColors.map((color) => (
            <Box
              key={color}
              onClick={() => handleColorSelect(color)}
              sx={{
                width: 40,
                height: 40,
                backgroundColor:
                  color === "White"
                    ? "#ffffff"
                    : color === "Black"
                    ? "#000000"
                    : selectedVariant.color_code,
                border: "2px solid",
                borderColor:
                  color === selectedVariant.color ? "primary.main" : "grey.300",
                borderRadius: "50%",
                cursor: "pointer",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Size selection */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Size: {selectedVariant.size}
        </Typography>
        <Stack direction="row" spacing={1}>
          {uniqueSizes.map((size) => (
            <Chip
              key={size}
              label={size}
              onClick={() => handleSizeSelect(size)}
              variant={size === selectedVariant.size ? "filled" : "outlined"}
              color={size === selectedVariant.size ? "primary" : "default"}
              sx={{ cursor: "pointer" }}
            />
          ))}
        </Stack>
      </Box>

      <Box sx={{ mt: 3, mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiEdit />}
          component={Link}
          to={`/design-playground?productId=${product.id}&variantId=${selectedVariant.id}`}
          sx={{ mr: 2 }}
        >
          Customize Design
        </Button>

        <Button
          variant="outlined"
          startIcon={<FiShoppingCart />}
          component={Link}
          to="/cart"
        >
          Add to Cart
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ width: "100%" }}>
        <Tabs value={tabValue} onChange={handleChangeTab}>
          <Tab label="Details" />
          <Tab label="Shipping" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          {tabValue === 0 && (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      Brand
                    </TableCell>
                    <TableCell>{product.brand}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      Model
                    </TableCell>
                    <TableCell>{product.model}</TableCell>
                  </TableRow>
                  {selectedVariant.material && (
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontWeight: "bold" }}
                      >
                        Material
                      </TableCell>
                      <TableCell>
                        {selectedVariant.material
                          .map((m) => `${m.name} ${m.percentage}%`)
                          .join(", ")}
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      Origin
                    </TableCell>
                    <TableCell>{product.origin_country}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {tabValue === 1 && (
            <Box>
              <Typography variant="body1" paragraph>
                Shipping typically takes 3-5 business days after production.
                Custom products require 2-3 business days for production.
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold">
                Average fulfillment time: {product.avg_fulfillment_time} days
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>
                Availability:
              </Typography>

              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{ mt: 1 }}
              >
                <Table size="small">
                  <TableBody>
                    {selectedVariant.availability_status.map((status) => (
                      <TableRow key={status.region}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ fontWeight: "bold" }}
                        >
                          {status.region}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={status.status.replace("_", " ")}
                            color={
                              status.status === "in_stock"
                                ? "success"
                                : "warning"
                            }
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
