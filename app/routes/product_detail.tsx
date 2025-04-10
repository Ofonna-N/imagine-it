import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Breadcrumbs,
  Link as MuiLink,
  Zoom,
  Divider,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useLoaderData, Link, isRouteErrorResponse } from "react-router";
import { fetchCatalogProductById } from "../services/printful/printful_api";
import type {
  PrintfulCatalogProductResponse,
  PrintfulErrorResponse,
} from "../types/printful";
import {
  FiZap,
  FiInfo,
  FiChevronDown,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { APP_ROUTES } from "../constants/route_paths";
import type { Route } from "./+types/product_detail";

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
  const selectedVariant = variants[selectedVariantIndex];

  // Extract unique colors and their color codes for the color selector
  const uniqueColorsWithCodes = Array.from(
    new Set(variants.map((variant) => variant.color))
  ).map((color) => {
    // Find the first variant with this color to get its color code
    const variantWithColor = variants.find((v) => v.color === color);
    return {
      color,
      colorCode: variantWithColor?.color_code ?? "",
    };
  });

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
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 4, px: 1 }}>
        <MuiLink
          component={Link}
          to="/"
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            fontSize: "0.9rem",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <Box component="span" sx={{ display: "flex", mr: 0.5 }}>
            <FiArrowLeft size={14} />
          </Box>
          Home
        </MuiLink>
        <MuiLink
          component={Link}
          to="/products"
          underline="hover"
          sx={{
            display: "flex",
            alignItems: "center",
            color: "text.secondary",
            fontSize: "0.9rem",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          <Box component="span" sx={{ display: "flex", mr: 0.5 }}>
            <FiShoppingBag size={14} />
          </Box>
          Products
        </MuiLink>
        <Typography
          color="text.primary"
          sx={{ fontSize: "0.9rem", fontWeight: 500 }}
        >
          {product.title}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Left Column - Product Images and Mockups */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Zoom in={true} timeout={500}>
            <Box>
              {/* Main Product Image */}
              <Paper
                elevation={2}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  mb: 4,
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                }}
              >
                <Box
                  component={motion.img}
                  layoutId={`product-${product.id}-image`}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    p: 4,
                    bgcolor: "background.default",
                    transition: "all 0.3s ease",
                  }}
                  src={selectedVariant.image}
                  alt={product.title}
                />
              </Paper>

              {/* Removed mockup examples section */}
            </Box>
          </Zoom>
        </Grid>

        {/* Right Column - Product Details and Customization */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Fade in={true} timeout={700}>
            <Box>
              {/* Product Title and Brand */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  {product.title}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <Chip
                    label={product.type_name}
                    color="primary"
                    variant="outlined"
                    sx={{ borderRadius: 2, fontWeight: 500 }}
                  />
                  {product.brand && (
                    <Chip
                      label={product.brand}
                      color="secondary"
                      variant="outlined"
                      sx={{ borderRadius: 2, fontWeight: 500 }}
                    />
                  )}
                </Stack>
                <Typography
                  variant="h4"
                  color="primary"
                  fontWeight="bold"
                  sx={{
                    display: "inline-block",
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: "rgba(94, 106, 210, 0.08)",
                  }}
                >
                  ${parseFloat(selectedVariant.price).toFixed(2)}
                </Typography>
              </Box>

              {/* Color and Size Selection */}
              <Paper
                elevation={1}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  bgcolor: "background.default",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Color: {selectedVariant.color}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  {uniqueColorsWithCodes.map(({ color, colorCode }) => (
                    <Box
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      sx={{
                        width: 36,
                        height: 36,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor:
                          color === "White"
                            ? "#ffffff"
                            : color === "Black"
                            ? "#000000"
                            : colorCode,
                        border: "2px solid",
                        borderColor:
                          color === selectedVariant.color
                            ? "primary.main"
                            : "grey.300",
                        borderRadius: "50%",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        outline:
                          color === selectedVariant.color
                            ? "2px solid rgba(94, 106, 210, 0.3)"
                            : "none",
                        outlineOffset: 2,
                        "&:hover": {
                          transform: "scale(1.1)",
                          boxShadow: "0 0 0 4px rgba(94, 106, 210, 0.2)",
                        },
                      }}
                    />
                  ))}
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Size: {selectedVariant.size}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1.5,
                  }}
                >
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
                        borderRadius: 2,
                        fontWeight: size === selectedVariant.size ? 600 : 400,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Region Availability Section */}
              <Accordion
                elevation={1}
                sx={{
                  mb: 4,
                  borderRadius: "12px !important",
                  overflow: "hidden",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  sx={{
                    "&.Mui-expanded": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <FiInfo style={{ marginRight: 12, color: "#5E6AD2" }} />
                      <Typography
                        variant="subtitle1"
                        fontWeight="medium"
                        color="text.primary"
                      >
                        Shipping Availability
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {/* Display availability message */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {selectedVariant.in_stock
                        ? "This item is available for purchase in the following regions:"
                        : "This item has limited availability in the following regions:"}
                    </Typography>
                  </Box>

                  {/* Region status list */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {Object.entries(selectedVariant.availability_regions).map(
                      ([regionCode, regionName]) => {
                        // Find the status for this region
                        const regionStatus =
                          selectedVariant.availability_status.find(
                            (status) => status.region === regionCode
                          );

                        // Get the display status
                        const status = regionStatus?.status ?? "unknown";
                        const isInStock = status === "in_stock";

                        // Get a readable region code equivalent
                        const readableRegion = (() => {
                          switch (regionCode) {
                            case "US":
                              return "United States";
                            case "UK":
                              return "United Kingdom";
                            case "EU":
                              return "Europe";
                            case "CA":
                              return "Canada";
                            case "AU":
                              return "Australia/New Zealand";
                            case "JP":
                              return "Japan";
                            case "BR":
                              return "Brazil";
                            case "EFTA":
                              return "EFTA States";
                            case "WW":
                              return "Worldwide";
                            default:
                              return regionName;
                          }
                        })();

                        return (
                          <Box
                            key={regionCode}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              p: 1,
                              borderRadius: 1,
                              bgcolor: "transparent",
                              border: "none",
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 400,
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              {readableRegion}
                            </Typography>
                            <Chip
                              label={isInStock ? "In Stock" : "Limited Stock"}
                              size="small"
                              color={isInStock ? "success" : "warning"}
                              variant="outlined"
                              sx={{
                                height: 24,
                                fontWeight: 400,
                                fontSize: "0.75rem",
                              }}
                            />
                          </Box>
                        );
                      }
                    )}
                  </Box>

                  {/* Printful shipping regions explanation */}
                  <Box
                    sx={{
                      mt: 3,
                      pt: 2,
                      borderTop: "1px dashed",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Imagine it has 9 shipping regions: United States, Europe,
                      United Kingdom, EFTA states (Iceland, Liechtenstein,
                      Norway, Switzerland), Canada, Australia/New Zealand,
                      Japan, Brazil, and Worldwide.
                    </Typography>
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Call to Action Buttons */}
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      p: 1,
                      borderRadius: "8px",
                      bgcolor: "secondary.light",
                      color: "secondary.dark",
                      display: "flex",
                    }}
                  >
                    <FiShoppingBag size={16} />
                  </Box>
                  Purchase Options
                </Typography>

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<FiZap />}
                    component={Link}
                    to={`${APP_ROUTES.DESIGN_PLAYGROUND}?productId=${product.id}&variantId=${selectedVariant.id}`}
                    fullWidth
                    sx={{
                      py: 1.8,
                      borderRadius: 2,
                      fontWeight: 600,
                      boxShadow: "0 6px 16px rgba(94, 106, 210, 0.4)",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: "0 8px 20px rgba(94, 106, 210, 0.5)",
                      },
                    }}
                  >
                    Customize with AI Designer
                  </Button>

                  {/* Add a new direct purchase button */}
                  <Box sx={{ position: "relative", mt: 1 }}>
                    <Divider sx={{ my: 2 }} />

                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<FiShoppingBag />}
                      fullWidth
                      sx={{
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: 600,
                      }}
                    >
                      Add to Cart (Standard Design)
                    </Button>
                  </Box>
                </Stack>
              </Box>

              {/* Product Details Accordion */}
              <Accordion
                elevation={1}
                sx={{
                  mb: 2,
                  borderRadius: "12px !important",
                  overflow: "hidden",
                  "&:before": {
                    display: "none",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  sx={{
                    "&.Mui-expanded": {
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FiInfo style={{ marginRight: 12, color: "#5E6AD2" }} />
                    <Typography
                      variant="subtitle1"
                      fontWeight="medium"
                      color="text.primary"
                    >
                      Product Details
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box
                    component="pre"
                    sx={{
                      mb: 3,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                      fontFamily: "inherit",
                      fontSize: "0.875rem",
                      m: 0,
                      p: 0,
                      color: "text.secondary",
                      lineHeight: 1.6,
                    }}
                  >
                    {product.description}
                  </Box>

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                      mb: 1,
                    }}
                  >
                    Product Specifications
                  </Typography>
                  <Box
                    component="ul"
                    sx={{
                      pl: 2,
                      mt: 1,
                      color: "text.secondary",
                      "& li": {
                        mb: 0.5,
                      },
                    }}
                  >
                    {product.brand && <li>Brand: {product.brand}</li>}
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

/**
 * Error boundary component for product detail page
 * Handles different types of errors that may occur during data loading
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  // Check if it's a route error response (including thrown Response objects)
  if (isRouteErrorResponse(error)) {
    return (
      <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
        <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {error.status} {error.statusText || "Error"}
          </Typography>
          <Typography>{error.data}</Typography>
        </Alert>

        <Button
          component={Link}
          to={APP_ROUTES.PRODUCTS}
          startIcon={<FiArrowLeft />}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  // Check if it's a Printful API error response
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    "error" in error
  ) {
    const printfulError = error as unknown as PrintfulErrorResponse;
    return (
      <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
        <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            Product API Error (Code: {printfulError.code})
          </Typography>
          <Typography sx={{ mb: 2 }}>{printfulError.result}</Typography>
          {printfulError.error && (
            <Box
              component="div"
              sx={{ mt: 2, p: 2, bgcolor: "rgba(0,0,0,0.1)", borderRadius: 1 }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                Reason: {printfulError.error.reason}
              </Typography>
              <Typography variant="body2">
                {printfulError.error.message}
              </Typography>
            </Box>
          )}
        </Alert>

        <Button
          component={Link}
          to={APP_ROUTES.PRODUCTS}
          startIcon={<FiArrowLeft />}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  // Handle standard JS Error objects
  if (error instanceof Error) {
    return (
      <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
        <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            Unexpected Error
          </Typography>
          <Typography sx={{ mb: 2 }}>{error.message}</Typography>
          {process.env.NODE_ENV === "development" && (
            <Box
              component="pre"
              sx={{
                p: 2,
                mt: 2,
                bgcolor: "rgba(0,0,0,0.1)",
                color: "error.contrastText",
                borderRadius: 1,
                fontSize: "0.75rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                maxHeight: "200px",
                overflow: "auto",
              }}
            >
              {error.stack}
            </Box>
          )}
        </Alert>

        <Button
          component={Link}
          to={APP_ROUTES.PRODUCTS}
          startIcon={<FiArrowLeft />}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  // Handle unknown errors
  return (
    <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
      <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
        <Typography variant="h6" component="div" sx={{ mb: 1 }}>
          Unknown Error
        </Typography>
        <Typography>
          An unexpected error occurred while loading the product. Please try
          again later.
        </Typography>
      </Alert>

      <Button
        component={Link}
        to={APP_ROUTES.PRODUCTS}
        startIcon={<FiArrowLeft />}
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        Back to Products
      </Button>
    </Box>
  );
}
