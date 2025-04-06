import { useState } from "react";
import { Link } from "react-router";
import {
  Typography,
  Box,
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
import type { Product } from "../types";

interface ProductDetailsProps {
  product: Product;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
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

      <Typography variant="body1">{product.description}</Typography>

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
                  {product.details &&
                    Object.entries(product.details).map(([key, value]) => (
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
    </Box>
  );
};
