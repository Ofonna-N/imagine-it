import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import { ProductGrid } from "~/features/product/components/ProductGrid";
import useQueryCatalogProducts from "~/features/product/hooks/useCatalogProducts";

export default function ProductListing() {
  const {
    data: products,
    isLoading,
    isError,
    error,
  } = useQueryCatalogProducts();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        All Products
      </Typography>

      <Typography variant="body1" gutterBottom align="center" sx={{ mb: 4 }}>
        Browse our collection of customizable products
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message ?? "Failed to load products"}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : products && products.length > 0 ? (
        <ProductGrid catalogProducts={products} />
      ) : (
        <Alert severity="info">No products found</Alert>
      )}
    </Box>
  );
}
