import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import { ProductGrid } from "~/features/product/components/ProductGrid";
import useQueryFeaturedProducts from "~/features/product/hooks/useFeaturedProducts";

export default function Home() {
  // Use our custom hook to fetch featured products
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQueryFeaturedProducts();

  // Determine the source of data and if the request was successful
  const source = products?.length ? "api" : "mock";
  const ok = !isError && !!products;

  return (
    <Box sx={{ mt: 4 }}>
      {/* Featured Products Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Products
        </Typography>
        <Typography variant="body1" component="p" align="center" sx={{ mb: 4 }}>
          Browse our most popular items ready for your creative designs
        </Typography>

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error?.message ?? "Failed to load products"}
          </Alert>
        )}

        {source === "mock" && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Using sample data. Connect to Printful API for live products.
          </Alert>
        )}

        {!isLoading && products && products.length > 0 ? (
          <ProductGrid catalogProducts={products} featured />
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
}
