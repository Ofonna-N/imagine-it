import { TextField, MenuItem, Box } from "@mui/material";
import type { ProductFilterOptions } from "../types";

interface ProductFilterProps {
  category: string;
  onCategoryChange: (category: ProductFilterOptions["category"]) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({
  category,
  onCategoryChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onCategoryChange(event.target.value as ProductFilterOptions["category"]);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        select
        label="Category"
        value={category}
        onChange={handleChange}
        sx={{ minWidth: 200 }}
      >
        <MenuItem value="">All Categories</MenuItem>
        <MenuItem value="clothing">Clothing</MenuItem>
        <MenuItem value="accessories">Accessories</MenuItem>
        <MenuItem value="art">Art</MenuItem>
      </TextField>
    </Box>
  );
};
