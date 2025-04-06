import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Card,
  CardMedia,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData, Link } from "react-router";
import { fetchCatalogProductById } from "../services/printful/printful-api";
import type { PrintfulCatalogProductResponse } from "../types/printful";
import { FiEdit, FiUpload, FiZap, FiInfo, FiChevronDown } from "react-icons/fi";

export async function loader({ params }: { params: { productId: string } }) {
  if (!params.productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  try {
    return await fetchCatalogProductById(params.productId);
  } catch (error) {
    console.error("Error loading product:", error);
    throw new Response("Error loading product", {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default function ProductDetail() {
  const catalogProductResponse = useLoaderData<
    typeof loader
  >() as PrintfulCatalogProductResponse;

  const { product, variants } = catalogProductResponse.result;
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  const selectedVariant = variants[selectedVariantIndex];

  // Extract unique colors for the color selector
  const uniqueColors = Array.from(
    new Set(variants.map((variant) => variant.color))
  );

  // Extract unique sizes for the size selector
  const uniqueSizes = Array.from(
    new Set(variants.map((variant) => variant.size))
  );

  // Handle color selection
  const handleColorSelect = (color: string) => {
    const variantIndex = variants.findIndex(
      (v) => v.color === color && v.size === selectedVariant.size
    );
    if (variantIndex >= 0) {
      setSelectedVariantIndex(variantIndex);
    }
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    const variantIndex = variants.findIndex(
      (v) => v.size === size && v.color === selectedVariant.color
    );
    if (variantIndex >= 0) {
      setSelectedVariantIndex(variantIndex);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Product Images and Mockups */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Fade in={true} timeout={500}>
            <Box>
              {/* Main Product Image */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  mb: 3,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  component="img"
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    p: 2,
                    transition: "all 0.3s ease",
                  }}
                  src={selectedVariant.image}
                  alt={product.title}
                />
              </Paper>

              {/* Mockup Examples */}
              <Typography variant="h6" gutterBottom>
                See Your Art on This Product
              </Typography>
              <Grid container spacing={2}>
                {[1, 2, 3].map((item) => (
                  <Grid size={{ xs: 4 }} key={item}>
                    <Card
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        "&:hover": {
                          boxShadow: 6,
                          transform: "translateY(-4px)",
                          transition: "all 0.2s ease",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={`https://placehold.co/300x300/eee/999?text=Mockup+${item}`}
                        alt={`Product mockup ${item}`}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        </Grid>

        {/* Right Column - Product Details and Customization */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Fade in={true} timeout={700}>
            <Box>
              {/* Product Title and Brand */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                  {product.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={product.type_name}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={product.brand}
                    color="secondary"
                    variant="outlined"
                  />
                </Stack>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${parseFloat(selectedVariant.price).toFixed(2)}
                </Typography>
              </Box>

              {/* Color and Size Selection */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Color: {selectedVariant.color}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  {uniqueColors.map((color) => (
                    <Box
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      sx={{
                        width: 36,
                        height: 36,
                        backgroundColor:
                          color === "White"
                            ? "#ffffff"
                            : color === "Black"
                            ? "#000000"
                            : selectedVariant.color_code,
                        border: "2px solid",
                        borderColor:
                          color === selectedVariant.color
                            ? "primary.main"
                            : "grey.300",
                        borderRadius: "50%",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.1)",
                        },
                      }}
                    />
                  ))}
                </Stack>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Size: {selectedVariant.size}
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {uniqueSizes.map((size) => (
                    <Chip
                      key={size}
                      label={size}
                      onClick={() => handleSizeSelect(size)}
                      variant={
                        size === selectedVariant.size ? "filled" : "outlined"
                      }
                      color={
                        size === selectedVariant.size ? "primary" : "default"
                      }
                      sx={{
                        cursor: "pointer",
                        mb: 1,
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Call to Action Buttons */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Customize with Your Art
                </Typography>

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<FiZap />}
                    component={Link}
                    to={`/design-playground?productId=${product.id}&variantId=${selectedVariant.id}`}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Generate AI Art
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<FiUpload />}
                    component={Link}
                    to={`/design-playground?productId=${product.id}&variantId=${selectedVariant.id}&upload=true`}
                    fullWidth
                    sx={{ py: 1.5 }}
                  >
                    Upload Your Design
                  </Button>

                  <Button
                    variant="text"
                    startIcon={<FiEdit />}
                    component={Link}
                    to={`/design-playground?productId=${product.id}&variantId=${selectedVariant.id}&advanced=true`}
                    sx={{ py: 1 }}
                  >
                    Advanced Editor
                  </Button>
                </Stack>
              </Box>

              {/* Product Details Accordion */}
              <Accordion sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<FiChevronDown />}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FiInfo style={{ marginRight: 8 }} />
                    <Typography variant="subtitle1" fontWeight="medium">
                      Product Details
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    component="pre"
                    sx={{
                      mb: 2,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      m: 0,
                      p: 0,
                    }}
                  >
                    {product.description}
                  </Box>

                  <Typography variant="subtitle2" fontWeight="bold">
                    Product Specifications
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                    <li>Brand: {product.brand}</li>
                    <li>Type: {product.type_name}</li>
                    <li>Origin: {product.origin_country}</li>
                    <li>
                      Fulfillment Time: {product.avg_fulfillment_time} days
                    </li>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}
