import { Box } from "@mui/material";
import { ProductCard } from "./Product_card";
import type { PrintfulCatalogProductsList } from "~/types/printful";
import { motion } from "framer-motion";

// Animation variants for container and items
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

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
      component={motion.div}
      variants={container}
      initial="hidden"
      animate="show"
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 3,
      }}
    >
      {catalogProducts.length > 0 &&
        catalogProducts.map((product) => (
          <Box
            component={motion.div}
            key={product.id.toString()}
            variants={item}
          >
            <ProductCard
              id={product.id}
              name={product.title}
              thumbnailUrl={product.image}
              featured={featured}
            />
          </Box>
        ))}
    </Box>
  );
};
