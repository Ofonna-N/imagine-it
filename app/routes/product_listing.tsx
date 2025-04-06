import { Typography, Box } from "@mui/material";
import { ProductGrid } from "../features/product/components/ProductGrid";
import useQueryFeaturedProducts from "~/features/product/hooks/useFeaturedProducts";

export default function ProductListing() {
  const { data: products, error, isLoading } = useQueryFeaturedProducts();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      <Typography variant="body1" component="p" sx={{ mb: 2 }}>
        Choose a product to customize with your designs
      </Typography>

      <ProductGrid catalogProductResponses={products ?? []} featured />
    </Box>
  );
}
