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

// Define a simpler interface with only the needed properties
interface ProductCardProps {
  id: string | number;
  name: string;
  thumbnailUrl: string;
  price: string | number;
  category: string;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  thumbnailUrl,
  price,
  category,
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
      <CardActionArea component={Link} to={`/products/${id}`}>
        <CardMedia
          component="img"
          // height={featured ? "200" : "180"}
          image={thumbnailUrl}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" component="h3">
            {name}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              $
              {price === null || price === undefined
                ? "0.00"
                : typeof price === "string"
                ? Number(price).toFixed(2)
                : price.toFixed(2)}
            </Typography>
            <Chip
              label={category}
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
