import { useState } from "react";
import { Typography, Box } from "@mui/material";
import { ProductGrid, ProductFilter } from "../features/product/components";
import { useProducts } from "../features/product/hooks/useProducts";

export default function ProductListing() {
  const { products, filterOptions, setCategory } = useProducts();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      <Typography variant="body1" component="p" sx={{ mb: 2 }}>
        Choose a product to customize with your designs
      </Typography>

      <ProductFilter
        category={filterOptions.category || ""}
        onCategoryChange={setCategory}
      />

      <ProductGrid products={products} />
    </Box>
  );
}
