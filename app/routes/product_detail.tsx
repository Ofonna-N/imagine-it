import { useState, useMemo } from "react"; // Added useMemo
import { useLoaderData, Link, isRouteErrorResponse } from "react-router";
import {
  fetchCatalogProductById,
  fetchCatalogVariantsByProductId,
} from "../services/printful/printful_api";
import type {
  PrintfulErrorResponse,
  PrintfulV2CatalogVariant,
} from "../types/printful";
import {
  FiZap,
  FiInfo,
  FiChevronDown,
  FiArrowLeft,
  FiShoppingBag,
  FiTag,
  FiBox,
  FiUser,
  FiGlobe,
  FiAlertCircle,
  FiCheck,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { APP_ROUTES } from "../constants/route_paths";
import type { Route } from "./+types/product_detail";
import useQueryCatalogVariantsAvailability from "~/features/product/hooks/use_query_catalog_variants_availability";
import { useQueryVariantPrices } from "~/features/product/hooks/use_query_variant_prices"; // Import variant pricing hook
import ProductDesigner from "~/features/design/components/product_designer"; // Import the new component
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
  Skeleton,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
} from "@mui/material";

export async function loader({ params }: { params: { productId: string } }) {
  if (!params.productId) {
    throw new Response("Product ID is required", { status: 400 });
  }

  const productIdStr = String(params.productId); // Convert once

  try {
    // Fetch product details and variants in parallel
    // Mockup styles will be fetched client-side in the designer component
    const [productResponse, variantsResponse] = await Promise.all([
      fetchCatalogProductById(productIdStr),
      fetchCatalogVariantsByProductId(productIdStr),
      // fetchCatalogProductMockupStyles(productIdStr), // Removed: Fetch mockup styles client-side
    ]);

    // Return product and variant responses
    return {
      productResponse,
      variantsResponse,
      // mockupStylesResponse, // Removed
    };
  } catch (error) {
    console.error("Error loading product data:", error); // Log the specific error
    // Rethrow or handle specific errors if needed
    throw new Response("Error loading product data", {
      status: 500,
      statusText: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export default function ProductDetail() {
  const { productResponse, variantsResponse } = useLoaderData<typeof loader>();

  const product = productResponse.data;
  const variants = variantsResponse.data;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedTechnique, setSelectedTechnique] = useState<string>(
    product.techniques[0]?.key || ""
  );
  const selectedVariant = variants[selectedVariantIndex];
  // Fetch pricing data for the selected variant

  const {
    data: variantPriceData,
    isLoading: variantPriceLoading,
    error: variantPriceError,
  } = useQueryVariantPrices(selectedVariant?.id?.toString());
  // Find technique-specific pricing for display
  const techniquePricing = useMemo(() => {
    return variantPriceData?.variant.techniques.find(
      (tech) => tech.technique_key === selectedTechnique
    );
  }, [variantPriceData, selectedTechnique]);

  // Get product availability data using our custom hook
  const {
    data: availabilityResponse,
    isLoading: availabilityLoading,
    error: availabilityError,
  } = useQueryCatalogVariantsAvailability({
    variantId: selectedVariant.id?.toString() ?? null,
    techniques: [selectedTechnique],
  });
  const availabilityDataArray = availabilityResponse?.data ? [availabilityResponse.data] : [];

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

  // Get available sizes for the currently selected color
  const getAvailableSizesForColor = (color: string) => {
    return Array.from(
      new Set(
        variants
          .filter((variant) => variant.color === color)
          .map((variant) => variant.size)
      )
    );
  };

  // Get sizes available for the current color
  const availableSizesForSelectedColor = getAvailableSizesForColor(
    selectedVariant.color
  );

  // Handle color selection
  const handleColorSelect = (color: string) => {
    // First check if the current size is available in the new color
    const variantWithCurrentSize = variants.findIndex(
      (v) => v.color === color && v.size === selectedVariant.size
    );

    if (variantWithCurrentSize >= 0) {
      // Current size is available in the new color
      setSelectedVariantIndex(variantWithCurrentSize);
    } else {
      // Current size is not available in the new color, select the first available size
      const firstVariantWithColor = variants.findIndex(
        (v) => v.color === color
      );
      if (firstVariantWithColor >= 0) {
        setSelectedVariantIndex(firstVariantWithColor);
      }
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

  // Function to determine if a variant is in stock based on availability data
  const isInStock = (variant: PrintfulV2CatalogVariant) => {
    if (availabilityDataArray.length === 0) {
      return true;
    }
    const variantAvailability = availabilityDataArray.find(
      (item) => item.catalog_variant_id === variant.id
    );
    return (
      variantAvailability?.techniques.some((technique) =>
        technique.selling_regions.some(
          (region) => region.availability === "in stock"
        )
      ) ?? true
    );
  };

  // Dialog state for the designer
  const [designerOpen, setDesignerOpen] = useState(false);

  const handleOpenDesigner = () => {
    setDesignerOpen(true);
  };

  const handleCloseDesigner = () => {
    setDesignerOpen(false);
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
          {product.name}
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
                  alt={product.name}
                />
              </Paper>

              {/* Product metadata badges */}
              <Box sx={{ mb: 3 }}>
                <Stack
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  sx={{
                    mb: 2,
                    "& > *": {
                      mb: 1,
                    },
                  }}
                >
                  <Chip
                    icon={<FiBox size={14} />}
                    label={`Type: ${product.type}`}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ borderRadius: 2 }}
                  />
                  {product.brand && (
                    <Chip
                      icon={<FiTag size={14} />}
                      label={`Brand: ${product.brand}`}
                      variant="outlined"
                      color="secondary"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                  {product.model && (
                    <Chip
                      icon={<FiUser size={14} />}
                      label={`Model: ${product.model}`}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                </Stack>
              </Box>
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
                  {product.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                  <Chip
                    label={product.type}
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
                {/* Note: Pricing for the selected variant technique */}
                {variantPriceLoading ? (
                  <Skeleton variant="text" width={100} height={50} />
                ) : variantPriceError ? (
                  <Alert severity="error">Error loading price</Alert>
                ) : (
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
                    {variantPriceData?.currency}{" "}
                    {techniquePricing?.discounted_price ??
                      techniquePricing?.price}
                  </Typography>
                )}
              </Box>

              {/* Technique Picker above Color/Size */}
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
                  Technique
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={selectedTechnique}
                  onChange={(_, val) => val && setSelectedTechnique(val)}
                  sx={{ mb: 3 }}
                  color="primary"
                >
                  {product.techniques.map((tech) => (
                    <ToggleButton
                      key={tech.key}
                      value={tech.key}
                      sx={{
                        color:
                          selectedTechnique === tech.key
                            ? "primary"
                            : "text.primary",
                        fontWeight: selectedTechnique === tech.key ? 700 : 400,
                      }}
                    >
                      {tech.display_name}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>

                {/* Color and Size Selection */}
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
                  {availableSizesForSelectedColor.map((size) => (
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
                        fontWeight: size === selectedVariant.size ? 700 : 400,
                        padding:
                          size === selectedVariant.size ? "4px 8px" : "3px 6px",
                        backgroundColor:
                          size === selectedVariant.size
                            ? "primary.main"
                            : "transparent",
                        color:
                          size === selectedVariant.size
                            ? "white"
                            : "text.primary",
                        border: "2px solid",
                        borderColor:
                          size === selectedVariant.size
                            ? "primary.main"
                            : "grey.300",
                        boxShadow:
                          size === selectedVariant.size
                            ? "0 4px 8px rgba(94, 106, 210, 0.4)"
                            : "none",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
                          backgroundColor:
                            size === selectedVariant.size
                              ? "primary.main"
                              : "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    />
                  ))}
                </Box>
              </Paper>

              {/* Call to Action Buttons - MOVED BEFORE shipping availability */}
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
                    onClick={handleOpenDesigner} // Add onClick handler
                    disabled={!selectedTechnique}
                  >
                    Design Product
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

              {/* Region Availability Section - MOVED AFTER action buttons */}
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
                      <FiGlobe style={{ marginRight: 12, color: "#5E6AD2" }} />
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
                  {/* Display loading state */}
                  {availabilityLoading && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", p: 2 }}
                    >
                      <CircularProgress
                        size={24}
                        sx={{ color: "secondary.main" }}
                      />
                    </Box>
                  )}

                  {/* Display error state */}
                  {availabilityError && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        Could not fetch availability information. Please try
                        again later or contact customer support.
                      </Typography>
                    </Alert>
                  )}

                  {/* Display availability data */}
                  {!availabilityLoading &&
                    !availabilityError &&
                    availabilityDataArray.length > 0 && (
                      <>
                        {/* Display general availability message */}
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {isInStock(selectedVariant)
                              ? "This item is available for purchase in supported regions."
                              : "This item has limited availability in some regions."}
                          </Typography>
                        </Box>

                        <AvailabilitySection
                          availabilityData={{ data: availabilityDataArray }}
                        />
                      </>
                    )}

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
                    <li>Type: {product.type}</li>
                    {product.model && <li>Model: {product.model}</li>}
                    <li>Available Colors: {product.colors.join(", ")}</li>
                    <li>Available Sizes: {product.sizes.join(", ")}</li>

                    {/* Additional metadata from v2 API */}
                    {product.placements && (
                      <li>
                        Available Placements:{" "}
                        {product.placements.map((p) => p.placement).join(", ")}
                      </li>
                    )}

                    {product.techniques && (
                      <li>
                        Printing Techniques:{" "}
                        {product.techniques
                          .map((t) => t.display_name)
                          .join(", ")}
                      </li>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
          </Fade>
        </Grid>
      </Grid>

      {/* Render the ProductDesigner component when designerOpen is true */}
      <ProductDesigner
        open={designerOpen}
        onClose={handleCloseDesigner}
        product={product}
        selectedVariant={selectedVariant}
        selectedTechnique={selectedTechnique}
      />
    </Box>
  );
}

/**
 * Component to display product availability data with deduplication
 */
const AvailabilitySection = ({
  availabilityData,
}: {
  availabilityData: any;
}) => {
  // Create a unique key for each availability item to prevent duplicates
  const getUniqueKey = (
    region: string,
    technique: string,
    availability: string
  ) => {
    return `${region}-${technique}-${availability}`;
  };

  // Process and deduplicate availability data
  const processAvailabilityData = () => {
    if (!availabilityData?.data || availabilityData.data.length === 0) {
      return [];
    }

    // Map to store unique region-technique-availability combinations
    const uniqueAvailability = new Map();

    availabilityData.data.forEach((item: any) => {
      item.techniques.forEach((tech: any) => {
        tech.selling_regions.forEach((region: any) => {
          const key = getUniqueKey(
            region.name,
            tech.technique,
            region.availability
          );

          if (!uniqueAvailability.has(key)) {
            uniqueAvailability.set(key, {
              regionName: region.name,
              technique: tech.technique,
              availability: region.availability,
            });
          }
        });
      });
    });

    return Array.from(uniqueAvailability.values());
  };

  const uniqueAvailabilityItems = processAvailabilityData();

  // Group by region for better UI organization
  const availabilityByRegion = uniqueAvailabilityItems.reduce(
    (acc: any, item) => {
      if (!acc[item.regionName]) {
        acc[item.regionName] = [];
      }
      acc[item.regionName].push(item);
      return acc;
    },
    {}
  );

  return (
    <Box>
      {Object.keys(availabilityByRegion).length > 0 ? (
        Object.entries(availabilityByRegion).map(
          ([region, items]: [string, any]) => (
            <Box key={region} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 600,
                  mb: 1,
                  color: "text.primary",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FiGlobe style={{ marginRight: 8, fontSize: 14 }} />
                {region}
              </Typography>

              <Box sx={{ pl: 2 }}>
                {items.map((item: any, idx: number) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 0.5,
                    }}
                  >
                    {item.availability === "in stock" ? (
                      <Box
                        component={FiCheck}
                        sx={{
                          mr: 1,
                          color: "success.main",
                          fontSize: "1rem",
                        }}
                      />
                    ) : (
                      <Box
                        component={FiAlertCircle}
                        sx={{
                          mr: 1,
                          color: "warning.main",
                          fontSize: "1rem",
                        }}
                      />
                    )}
                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          color:
                            item.availability === "in stock"
                              ? "text.primary"
                              : "text.secondary",
                        }}
                      >
                        <Box component={"span"} style={{ fontWeight: 500 }}>
                          {item.technique === "dtg"
                            ? "DTG printing"
                            : item.technique === "embroidery"
                            ? "Embroidery"
                            : item.technique}
                        </Box>
                        <Box component={"span"} sx={{ mx: 1 }}>
                          —
                        </Box>
                        <Box component={"span"}>
                          {item.availability === "in stock"
                            ? "In Stock"
                            : "Limited Stock"}
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          )
        )
      ) : (
        <Typography variant="body2" color="text.secondary">
          No availability information found for this product.
        </Typography>
      )}
    </Box>
  );
};

export function ErrorBoundary({ error }: Readonly<Route.ErrorBoundaryProps>) {
  // Check if it's a route error response (including thrown Response objects)
  if (isRouteErrorResponse(error)) {
    return (
      <Box sx={{ p: 4, maxWidth: "800px", mx: "auto" }}>
        <Alert severity="error" variant="filled" sx={{ mb: 3 }}>
          <Typography variant="h6" component="div" sx={{ mb: 1 }}>
            {error.status} {error.statusText ?? "Error"}
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
