import { useState, useCallback } from "react";

import { getProductById, filterProductsByCategory } from "../api/mockData";
import type { Product, ProductFilterOptions } from "../types";

export const useProducts = () => {
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({
    category: "",
  });

  const products = filterProductsByCategory(filterOptions.category);

  const setCategory = useCallback((category: string) => {
    setFilterOptions((prev) => ({
      ...prev,
      category,
    }));
  }, []);

  const getProduct = useCallback((id: string): Product => {
    return getProductById(id);
  }, []);

  return {
    products,
    filterOptions,
    setCategory,
    getProduct,
  };
};
