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
  Fade,
  Chip,
} from "@mui/material";
import { ProductGrid } from "~/features/product/components/product_grid";
import useQueryCatalogProducts from "~/features/product/hooks/use_catalog_products";
import { useState, useEffect, useCallback } from "react";
import { FiSearch, FiX, FiFilter } from "react-icons/fi";

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
      <Fade in={true} timeout={800}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              backgroundImage: "linear-gradient(90deg, #5E6AD2, #FF8A47)",
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Explore Products
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto", mb: 4 }}
          >
            Browse our collection of customizable products ready for your
            creative designs
          </Typography>

          {/* Enhanced Search Input */}
          <Paper
            elevation={2}
            sx={{
              p: 1,
              mb: 5,
              maxWidth: "700px",
              mx: "auto",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            }}
          >
            <TextField
              fullWidth
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FiSearch color="#5E6AD2" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                      sx={{ color: "text.secondary" }}
                    >
                      <FiX />
                    </IconButton>
                  </InputAdornment>
                ) : (
                  <Chip
                    icon={<FiFilter size={14} />}
                    label="Filters"
                    size="small"
                    variant="outlined"
                    onClick={() => console.log("Filter clicked")}
                    sx={{
                      mr: 1,
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  />
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  pr: 1,
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "transparent",
                  },
                  "&:hover fieldset": {
                    borderColor: "transparent",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "transparent",
                  },
                },
                "& .MuiInputBase-input": {
                  py: 1.5,
                },
              }}
            />
          </Paper>
        </Box>
      </Fade>

      {isError && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(255, 82, 82, 0.1)",
          }}
        >
          {error?.message ?? "Failed to load products"}
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 8,
            gap: 3,
          }}
        >
          <CircularProgress size={60} sx={{ color: "secondary.main" }} />
          <Typography variant="h6" color="text.secondary">
            Loading amazing products...
          </Typography>
        </Box>
      ) : data?.products && data.products.length > 0 ? (
        <Fade in={true} timeout={1000}>
          <Box>
            <ProductGrid catalogProducts={data.products} />

            {/* Pagination controls */}
            {totalPages > 1 && (
              <Stack spacing={2} alignItems="center" sx={{ mt: 6, mb: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      borderRadius: 2,
                      fontWeight: 600,
                      mx: 0.5,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Showing {(page - 1) * ITEMS_PER_PAGE + 1} to{" "}
                  {Math.min(page * ITEMS_PER_PAGE, data.paging.total)} of{" "}
                  {data.paging.total} products
                </Typography>
              </Stack>
            )}
          </Box>
        </Fade>
      ) : (
        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            p: 3,
            boxShadow: "0 4px 12px rgba(100, 181, 246, 0.1)",
          }}
        >
          {debouncedSearch
            ? "No products match your search criteria. Try something else!"
            : "No products available at the moment. Check back soon!"}
        </Alert>
      )}
    </Box>
  );
}
