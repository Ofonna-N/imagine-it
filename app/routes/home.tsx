import { Typography, Box, Grid, CircularProgress, Alert } from "@mui/material";
import { useLoaderData } from "react-router";
import { ProductGrid } from "../features/product/components/ProductGrid";
import { type Product } from "../types/printful";

// Loader function to fetch featured products
export async function loader() {
  return new Response(
    JSON.stringify({
      products: [
        {
          id: "1",
          name: "Mock Product 1",
          thumbnail_url: "https://via.placeholder.com/150",
          category: "T-Shirts",
          variants: [{ price: 19.99 }],
        },
        {
          id: "2",
          name: "Mock Product 2",
          thumbnail_url: "https://via.placeholder.com/150",
          category: "Hoodies",
          variants: [{ price: 29.99 }],
        },
      ],
      source: "mock",
      ok: true,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

export default function Home() {
  const { products, source, ok, error } = useLoaderData<{
    products: Product[];
    source: "printful" | "mock" | "error";
    ok: boolean;
    error?: string;
  }>();

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

        {!ok && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error ?? "Failed to load products"}
          </Alert>
        )}

        {source === "mock" && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Using sample data. Connect to Printful API for live products.
          </Alert>
        )}

        {products && products.length > 0 ? (
          <ProductGrid products={products} featured={true} />
        ) : (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
}
