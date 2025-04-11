import { Box, Grid, Typography } from "@mui/material";
import { ProductCard } from "./product_card";
import { motion } from "framer-motion";
import type { PrintfulV2CatalogProduct } from "~/types/printful";

interface ProductGridProps {
  catalogProducts: PrintfulV2CatalogProduct[];
  featured?: boolean;
}

// Create a MotionGrid component
const MotionGrid = motion(Grid);

export function ProductGrid({
  catalogProducts,
  featured = false,
}: Readonly<ProductGridProps>) {
  if (!catalogProducts || catalogProducts.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No products found
        </Typography>
      </Box>
    );
  }

  // Add a small introduction paragraph for non-featured product grids
  const introSection = !featured ? (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ maxWidth: "800px", mx: "auto", mb: 2 }}
      >
        Select any product below to customize it with your own designs or
        AI-generated art. Each item can be personalized and purchased with your
        unique creation.
      </Typography>
    </Box>
  ) : null;

  // Animation variants for staggered item appearance
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
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      {introSection}
      <Grid
        container
        spacing={4}
        component={motion.div}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {catalogProducts.map((product) => (
          <MotionGrid
            size={{ xs: 12, sm: 6, md: featured ? 4 : 3 }}
            key={product.id}
            variants={item}
          >
            <ProductCard product={product} featured={featured} />
          </MotionGrid>
        ))}
      </Grid>
    </>
  );
}
