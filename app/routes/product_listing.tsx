import { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Box,
  Chip,
  TextField,
  MenuItem,
} from "@mui/material";
import { Link } from "react-router";

// Mock product data
const products = [
  {
    id: "1",
    name: "T-Shirt",
    price: 24.99,
    category: "clothing",
    image: "https://placehold.co/300x300/e66/fff?text=T-Shirt",
  },
  {
    id: "2",
    name: "Hoodie",
    price: 39.99,
    category: "clothing",
    image: "https://placehold.co/300x300/6e6/fff?text=Hoodie",
  },
  {
    id: "3",
    name: "Mug",
    price: 14.99,
    category: "accessories",
    image: "https://placehold.co/300x300/66e/fff?text=Mug",
  },
  {
    id: "4",
    name: "Tote Bag",
    price: 19.99,
    category: "accessories",
    image: "https://placehold.co/300x300/e6e/fff?text=Tote+Bag",
  },
  {
    id: "5",
    name: "Phone Case",
    price: 17.99,
    category: "accessories",
    image: "https://placehold.co/300x300/ee6/fff?text=Phone+Case",
  },
  {
    id: "6",
    name: "Poster",
    price: 12.99,
    category: "art",
    image: "https://placehold.co/300x300/6ee/fff?text=Poster",
  },
];

export default function ProductListing() {
  const [category, setCategory] = useState("");

  const filteredProducts = category
    ? products.filter((product) => product.category === category)
    : products;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      <Typography variant="body1" component="p" sx={{ mb: 2 }}>
        Choose a product to customize with your designs
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="clothing">Clothing</MenuItem>
          <MenuItem value="accessories">Accessories</MenuItem>
          <MenuItem value="art">Art</MenuItem>
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {filteredProducts.map((product) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardActionArea component={Link} to={`/products/${product.id}`}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="h2">
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
                      ${product.price.toFixed(2)}
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
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
