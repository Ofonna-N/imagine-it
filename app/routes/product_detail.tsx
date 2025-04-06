import { Grid, Box, Paper } from "@mui/material";
import { useParams } from "react-router";
import { ProductDetails } from "../features/product/components/ProductDetails";
import { useProducts } from "../features/product/hooks/useProducts";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const { getProduct } = useProducts();

  // Find the product using our hook
  const product = getProduct(productId ?? "");

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2}>
            <Box
              component="img"
              sx={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
              }}
              src={product.image}
              alt={product.name}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ProductDetails product={product} />
        </Grid>
      </Grid>
    </Box>
  );
}
