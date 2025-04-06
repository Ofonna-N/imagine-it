import { Box } from "@mui/material";
import { ProductCard } from "./ProductCard";
import type { PrintfulCatalogProductsList } from "~/types/printful";

interface ProductGridProps {
  catalogProducts?: PrintfulCatalogProductsList;
  featured?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  catalogProducts = [],
  featured = false,
}) => {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 3,
      }}
    >
      {/* Handle new format (PrintfulCatalogProductsList) */}
      {catalogProducts.length > 0 &&
        catalogProducts.map((product) => (
          <ProductCard
            key={product.id.toString()}
            id={product.id}
            name={product.title}
            thumbnailUrl={product.image}
            variantCount={product.variant_count}
            category={product.main_category_id.toString()}
            featured={featured}
          />
        ))}
    </Box>
  );
};
