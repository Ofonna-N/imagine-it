import { Grid } from "@mui/material";
import { ProductCard } from "./ProductCard";
import type { Product } from "../types";

interface ProductGridProps {
  products: Product[];
  featured?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  featured = false,
}) => {
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
          <ProductCard product={product} featured={featured} />
        </Grid>
      ))}
    </Grid>
  );
};
