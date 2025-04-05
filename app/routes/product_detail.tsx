import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Divider,
  Chip,
} from "@mui/material";
import { FiEdit, FiShoppingCart } from "react-icons/fi";

// Define a type for the product structure
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  details: Record<string, string>;
}

// Mock product data with proper type annotation
const products: { [key: string]: Product } = {
  "1": {
    id: "1",
    name: "T-Shirt",
    price: 24.99,
    category: "clothing",
    image: "https://placehold.co/500x500/e66/fff?text=T-Shirt",
    description:
      "100% cotton t-shirt, perfect for custom designs. Available in multiple sizes.",
    details: {
      material: "100% Cotton",
      weight: "180 gsm",
      sizes: "S, M, L, XL, XXL",
      care: "Machine wash cold, tumble dry low",
    },
  },
  "2": {
    id: "2",
    name: "Hoodie",
    price: 39.99,
    category: "clothing",
    image: "https://placehold.co/500x500/6e6/fff?text=Hoodie",
    description:
      "Cozy hoodie with kangaroo pocket. Perfect for cool weather and custom designs.",
    details: {
      material: "80% Cotton, 20% Polyester",
      weight: "320 gsm",
      sizes: "S, M, L, XL, XXL",
      care: "Machine wash cold, tumble dry low",
    },
  },
};

// Default product for when product is not found
const defaultProduct: Product = {
  id: "0",
  name: "Product Not Found",
  price: 0,
  category: "none",
  image: "https://placehold.co/500x500/ddd/999?text=Not+Found",
  description: "This product could not be found.",
  details: {},
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const [tabValue, setTabValue] = useState(0);

  // Find the product or use a default if not found
  const product =
    productId && productId in products ? products[productId] : defaultProduct;

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
              }}
              src={product.image}
              alt={product.name}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Chip
              label={product.category}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mt: 3, mb: 3 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<FiEdit />}
                component={Link}
                to="/design-playground"
                sx={{ mr: 2 }}
              >
                Customize Design
              </Button>

              <Button
                variant="outlined"
                startIcon={<FiShoppingCart />}
                component={Link}
                to="/cart"
              >
                Add to Cart
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ width: "100%" }}>
            <Tabs value={tabValue} onChange={handleChangeTab}>
              <Tab label="Details" />
              <Tab label="Shipping" />
            </Tabs>

            <Box sx={{ p: 2 }}>
              {tabValue === 0 && (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableBody>
                      {Object.entries(product.details).map(([key, value]) => (
                        <TableRow key={key}>
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </TableCell>
                          <TableCell>{value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
              {tabValue === 1 && (
                <Typography variant="body1">
                  Shipping typically takes 3-5 business days after production.
                  Custom products require 2-3 business days for production.
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
