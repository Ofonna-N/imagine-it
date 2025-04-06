import { Link } from "react-router";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import type { Product } from "~/types/printful";

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  featured = false,
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transform: "scale(1)",
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
    >
      <CardActionArea component={Link} to={`/products/${product.id}`}>
        <CardMedia
          component="img"
          height={featured ? "200" : "180"}
          image={product.thumbnail_url}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h3">
            {product.name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              ${Number(product.variants?.[0].price).toFixed(2)}
            </Typography>
            <Chip
              label={product.category}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
