import { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Slider,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardMedia,
  Tooltip,
  Chip,
  Stack,
  keyframes,
  Fade,
  Zoom,
  Divider,
  Alert,
} from "@mui/material";
import {
  FiPlay,
  FiSave,
  FiShoppingCart,
  FiZap,
  FiImage,
  FiArrowLeft,
  FiTag,
} from "react-icons/fi";
import { Link, useLoaderData, useSearchParams } from "react-router";
import { fetchCatalogProductById } from "../services/printful/printful_api";
import type {
  PrintfulV2CatalogProductResponse,
  PrintfulV2CatalogVariant,
} from "../types/printful";
import type { Route } from "./+types/image_gen_playground";

// Define animations for a more engaging UI
const sparkleAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.3; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

// Add loader to fetch product details if product ID is provided
export async function loader({ request }: Route.LoaderArgs) {
  // Get product ID and variant ID from URL
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");

  // If there's no product ID, return null (we'll handle this case in the component)
  if (!productId) {
    return { product: null, variants: [] };
  }

  try {
    // Fetch product details
    const productData = await fetchCatalogProductById(productId);
    return productData;
  } catch (error) {
    console.error("Error loading product:", error);
    return { product: null, variants: [] };
  }
}

export default function ImageGenPlayground() {
  // Get search params for variantId
  const [searchParams] = useSearchParams();
  const variantIdParam = searchParams.get("variantId");

  // Get product details from loader data
  const productData = useLoaderData<
    typeof loader
  >() as PrintfulV2CatalogProductResponse;
  const hasProduct = productData?.data != null;
  const product = hasProduct ? productData.data : null;
  const variants: PrintfulV2CatalogVariant[] = []; // We'll need to load variants separately in V2 API

  // Extend PrintfulV2CatalogVariant with a temporary price property for our UI
  type ExtendedVariant = PrintfulV2CatalogVariant & { price?: string };

  // Find the selected variant
  const [selectedVariant, setSelectedVariant] =
    useState<PrintfulV2CatalogVariant | null>(null);

  // Form state
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [style, setStyle] = useState("realistic");
  const [complexity, setComplexity] = useState(50);
  const [promptSuggestion, setPromptSuggestion] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  // Example prompt suggestions
  const suggestions = [
    "Cosmic owl librarian with glasses",
    "Underwater city at sunset with floating lanterns",
    "Mountain landscape with rainbow waterfalls",
    "Robot DJ in neon jungle",
    "Steampunk dragon mechanical heart",
  ];

  // Set up the selected variant based on variant ID
  useEffect(() => {
    if (variants.length > 0) {
      if (variantIdParam) {
        // If a specific variant ID was provided, find it
        const parsedVariantId = parseInt(variantIdParam);
        const variant = variants.find(
          (v: PrintfulV2CatalogVariant) => v.id === parsedVariantId
        );
        if (variant) {
          setSelectedVariant(variant);
        } else {
          // If not found, default to first variant
          setSelectedVariant(variants[0]);
        }
      } else {
        // If no variant ID was provided, use first variant
        setSelectedVariant(variants[0]);
      }
    }
  }, [variants, variantIdParam]);

  // Set a random suggestion on component mount
  useEffect(() => {
    setPromptSuggestion(
      suggestions[Math.floor(Math.random() * suggestions.length)]
    );

    // If a product is selected, create product-specific suggestion
    if (product) {
      setPrompt(`${product.name} with creative design`);
    }
  }, [product]);

  // Generate images based on prompt
  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setLoading(true);

    // Reset selected image when generating new ones
    setSelectedImageIndex(null);

    // Simulate image generation with a delay
    setTimeout(() => {
      // Generate placeholder images with product context if available
      const productContext = product ? `for ${product.name}` : "";
      const newImages = [
        `https://placehold.co/512x512/random/fff?text=${encodeURIComponent(
          prompt.substring(0, 20) + productContext
        )}`,
        `https://placehold.co/512x512/random/fff?text=${encodeURIComponent(
          prompt.substring(0, 15) + productContext
        )}`,
        `https://placehold.co/512x512/random/fff?text=${encodeURIComponent(
          prompt.substring(0, 10) + productContext
        )}`,
      ];

      setGeneratedImages(newImages);
      setLoading(false);
    }, 2000);
  };

  const handleSuggestionClick = () => {
    setPrompt(promptSuggestion);
  };

  const handleImageSelect = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleAddToCart = () => {
    if (selectedImageIndex === null || !product || !selectedVariant) return;

    // Here we would implement the actual "add to cart" functionality
    // For now, just navigate to cart as an example
    window.location.href = "/cart";
  };

  // Build the page title dynamically based on context
  const pageTitle = product
    ? `Design Your ${product.name}`
    : "Design Playground";

  return (
    <Box sx={{ mt: 4 }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ mb: 4 }}>
          {/* Back button and navigation if we're in product context */}
          {product && (
            <Box sx={{ mb: 2 }}>
              <Button
                component={Link}
                to={`/products/${product.id}`}
                startIcon={<FiArrowLeft />}
                sx={{ mb: 2 }}
                variant="text"
              >
                Back to {product.name}
              </Button>
            </Box>
          )}

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              backgroundImage: "linear-gradient(90deg, #5E6AD2, #FF8A47)",
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            {pageTitle}
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto", textAlign: "center" }}
          >
            {product
              ? `Create custom designs for your ${product.name} and bring your ideas to life!`
              : "Unleash your creativity! Describe what you imagine, and our AI will bring it to life on your products."}
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        {/* Left Column: Design Input */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Zoom in={true} style={{ transitionDelay: "200ms" }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  mb: 3,
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    p: 1,
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: "8px",
                  }}
                >
                  <FiZap />
                </Box>
                Create Your {product ? "Design" : "Image"}
              </Typography>

              {/* Product preview if we're in product context */}
              {product && selectedVariant && (
                <Box sx={{ mb: 3 }}>
                  <Card
                    elevation={0}
                    sx={{ bgcolor: "background.default", mb: 2 }}
                  >
                    <CardMedia
                      component="img"
                      image={selectedVariant.image}
                      alt={product.name}
                      sx={{
                        height: 180,
                        objectFit: "contain",
                        borderRadius: 2,
                        bgcolor: "background.paper",
                      }}
                    />
                  </Card>
                  <Typography variant="subtitle2" gutterBottom>
                    {product.name} - {selectedVariant.color},{" "}
                    {selectedVariant.size}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {/* Using a mock price since PrintfulV2CatalogVariant doesn't have price */}
                    $19.99
                  </Typography>
                  <Chip
                    icon={<FiTag size={14} />}
                    label={product.type}
                    size="small"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}

              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Describe your idea:
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`E.g., "${promptSuggestion}"`}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: "1rem",
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 3px rgba(94, 106, 210, 0.2)",
                    },
                  },
                }}
              />

              <Button
                variant="text"
                onClick={handleSuggestionClick}
                sx={{ mb: 3 }}
              >
                Need inspiration? Try: "{promptSuggestion}"
              </Button>

              <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                Choose Art Style:
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="realistic">Realistic</MenuItem>
                  <MenuItem value="cartoon">Cartoon</MenuItem>
                  <MenuItem value="watercolor">Watercolor</MenuItem>
                  <MenuItem value="sketch">Sketch</MenuItem>
                  <MenuItem value="abstract">Abstract</MenuItem>
                  <MenuItem value="pixel">Pixel Art</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                Complexity:
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={complexity}
                  onChange={(_, newValue) => setComplexity(newValue)}
                  valueLabelDisplay="auto"
                  sx={{
                    mb: 4,
                    color: "secondary.main",
                    "& .MuiSlider-thumb": {
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0 0 0 8px rgba(255, 138, 71, 0.16)",
                      },
                    },
                  }}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FiPlay />
                  )
                }
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 4px 14px rgba(94, 106, 210, 0.4)",
                }}
              >
                {loading ? "Creating Magic..." : "Generate Image"}
              </Button>

              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    animation: `${sparkleAnimation} 2s infinite`,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ fontStyle: "italic" }}
                  >
                    Your creativity is being transformed...
                  </Typography>
                </Box>
              )}
            </Paper>
          </Zoom>
        </Grid>

        {/* Right Column: Generated Images and Product Preview */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Generated Images Section */}
          <Zoom in={true} style={{ transitionDelay: "400ms" }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
                mb: 4,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  mb: 3,
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    p: 1,
                    bgcolor: "secondary.main",
                    color: "white",
                    borderRadius: "8px",
                  }}
                >
                  <FiImage />
                </Box>
                Your Creations
              </Typography>

              {generatedImages.length === 0 && !loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                    bgcolor: (alpha) =>
                      alpha.palette.mode === "light"
                        ? "rgba(94, 106, 210, 0.05)"
                        : "rgba(94, 106, 210, 0.1)",
                    borderRadius: 3,
                    p: 4,
                    gap: 2,
                    animation: `${floatAnimation} 6s infinite ease-in-out`,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "60px",
                      color: "primary.light",
                      mb: 2,
                    }}
                  >
                    <FiZap />
                  </Box>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Your magical creations will appear here
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", maxWidth: "500px" }}
                  >
                    Type a description on the left, choose a style, and click
                    "Generate" to see AI create amazing images just for you!
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "300px",
                        gap: 3,
                      }}
                    >
                      <CircularProgress
                        size={60}
                        sx={{ color: "secondary.main" }}
                      />
                      <Typography variant="h6" color="secondary.main">
                        Creating your masterpiece...
                      </Typography>
                    </Box>
                  ) : (
                    generatedImages.map((image, index) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            border:
                              selectedImageIndex === index
                                ? "3px solid"
                                : "none",
                            borderColor: "primary.main",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                            },
                            cursor: "pointer",
                          }}
                          onClick={() => handleImageSelect(index)}
                        >
                          <CardMedia
                            component="img"
                            height="200"
                            image={image}
                            alt={`Generated image ${index + 1}`}
                          />
                          <Box
                            sx={{
                              p: 2,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={`Design ${index + 1}`}
                              size="small"
                              color={
                                selectedImageIndex === index
                                  ? "primary"
                                  : "default"
                              }
                            />

                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Save to My Designs">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{ minWidth: "36px", p: 1 }}
                                >
                                  <FiSave size={16} />
                                </Button>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}

              {/* Add to Cart Section */}
              {generatedImages.length > 0 &&
                selectedImageIndex !== null &&
                hasProduct && (
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 3 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Ready to Purchase Your Design?
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product?.name} with your custom design will be
                          printed and shipped directly to you.
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="large"
                        color="secondary"
                        startIcon={<FiShoppingCart />}
                        onClick={handleAddToCart}
                        sx={{
                          py: 1.5,
                          px: 3,
                          fontWeight: 600,
                          fontSize: "1rem",
                          borderRadius: 2,
                        }}
                      >
                        Add to Cart - $19.99
                      </Button>
                    </Box>
                  </Box>
                )}

              {/* Product Selection Prompt when no product */}
              {generatedImages.length > 0 &&
                selectedImageIndex !== null &&
                !hasProduct && (
                  <Box sx={{ mt: 4 }}>
                    <Divider sx={{ mb: 3 }} />
                    <Alert severity="info" sx={{ borderRadius: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Choose a product to apply this design to:
                      </Typography>
                      <Button
                        variant="contained"
                        component={Link}
                        to={`/products?design=${selectedImageIndex}`}
                        startIcon={<FiShoppingCart />}
                        sx={{ mt: 1 }}
                      >
                        Browse Products
                      </Button>
                    </Alert>
                  </Box>
                )}
            </Paper>
          </Zoom>

          {/* Product Preview with Design Applied when in product context */}
          {hasProduct &&
            selectedImageIndex !== null &&
            generatedImages.length > 0 && (
              <Zoom in={true} style={{ transitionDelay: "600ms" }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 600,
                      mb: 3,
                      gap: 1,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        display: "flex",
                        p: 1,
                        bgcolor: "primary.main",
                        color: "white",
                        borderRadius: "8px",
                      }}
                    >
                      <FiShoppingCart />
                    </Box>
                    Preview on Product
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 8 }}>
                      {/* This is where you would show a realistic mockup of the product with the design */}
                      {/* For now we'll use a placeholder */}
                      <Box
                        sx={{
                          position: "relative",
                          height: "300px",
                          width: "100%",
                          overflow: "hidden",
                          borderRadius: 2,
                          bgcolor: "background.paper",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            opacity: 0.2,
                            backgroundImage: `url(${selectedVariant?.image})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            filter: "blur(2px)",
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            width: "60%",
                            height: "60%",
                            backgroundImage: `url(${generatedImages[selectedImageIndex]})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            zIndex: 2,
                          }}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <Typography variant="h6" gutterBottom>
                        {product?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Your custom design applied to this{" "}
                        {product?.type.toLowerCase()}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Color:</strong> {selectedVariant?.color}
                        <br />
                        <strong>Size:</strong> {selectedVariant?.size}
                        <br />
                        <strong>Price:</strong> $19.99
                      </Typography>

                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<FiShoppingCart />}
                        onClick={handleAddToCart}
                        sx={{ mt: 2 }}
                      >
                        Add to Cart
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Zoom>
            )}
        </Grid>
      </Grid>
    </Box>
  );
}
