import { Grid, Box, Paper } from "@mui/material";
import { useLoaderData } from "react-router";
import { ProductDetails } from "../features/product/components/ProductDetails";
import { fetchCatalogProductById } from "../services/printful/printful-api";
import type { PrintfulCatalogProductResponse } from "../types/printful";

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

  // Product image from the first variant or product
  const productImage =
    catalogProductResponse.result.variants[0]?.image ||
    catalogProductResponse.result.product.image;

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
                p: 2,
              }}
              src={productImage}
              alt={catalogProductResponse.result.product.title}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ProductDetails catalogProductResponse={catalogProductResponse} />
        </Grid>
      </Grid>
    </Box>
  );
}
