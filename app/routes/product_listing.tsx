import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  TextField,
  Pagination,
  Stack,
  InputAdornment,
  Paper,
  debounce,
  IconButton,
} from "@mui/material";
import { ProductGrid } from "~/features/product/components/ProductGrid";
import useQueryCatalogProducts from "~/features/product/hooks/useCatalogProducts";
import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function ProductListing() {
  // Pagination and search state
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ITEMS_PER_PAGE = 12;

  // Create a debounced search handler using MUI's debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
      setPage(1); // Reset to first page when search changes
    }, 500),
    []
  );

  // Update the debounced value when search term changes
  useEffect(() => {
    debouncedSearchHandler(searchTerm);
    // No cleanup needed as MUI's debounce handles cancelation
  }, [searchTerm, debouncedSearchHandler]);

  // Fetch products with pagination and search
  const { data, isLoading, isError, error } = useQueryCatalogProducts({
    params: {
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      search: debouncedSearch || undefined,
    },
    options: {
      staleTime: 40 * 60 * 1000, // 10 minutes
    },
  });

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear search function
  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // Get total pages based on API response
  const totalPages = data?.paging
    ? Math.ceil(data.paging.total / ITEMS_PER_PAGE)
    : 0;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        All Products
      </Typography>

      <Typography variant="body1" gutterBottom align="center" sx={{ mb: 2 }}>
        Browse our collection of customizable products
      </Typography>

      {/* Search Input */}
      <Paper sx={{ p: 2, mb: 4, maxWidth: "600px", mx: "auto" }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
              endAdornment: searchTerm ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={handleClearSearch}
                    edge="end"
                    size="small"
                  >
                    <FiX />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />
      </Paper>

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error?.message ?? "Failed to load products"}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : data?.products && data.products.length > 0 ? (
        <>
          <ProductGrid catalogProducts={data.products} />

          {/* Pagination controls */}
          {totalPages > 1 && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
              <Typography variant="body2" color="text.secondary">
                Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(page * ITEMS_PER_PAGE, data.paging.total)} of{" "}
                {data.paging.total} products
              </Typography>
            </Stack>
          )}
        </>
      ) : (
        <Alert severity="info">
          {debouncedSearch
            ? "No products match your search"
            : "No products found"}
        </Alert>
      )}
    </Box>
  );
}
