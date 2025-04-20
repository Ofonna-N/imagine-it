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
  Popover,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Collapse,
  ListItemIcon,
  Button,
} from "@mui/material";
import { ProductGrid } from "~/features/product/components/product_grid";
import useQueryCatalogProducts from "~/features/product/hooks/use_catalog_products";
import useQueryCatalogCategories from "~/features/product/hooks/use_catalog_categories";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FiSearch,
  FiX,
  FiFilter,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import type { PrintfulV2Category } from "~/types/printful";

// Helper type for nested categories
interface NestedCategory extends PrintfulV2Category {
  children: NestedCategory[];
}

// Helper function to build category tree
const buildCategoryTree = (
  categories: PrintfulV2Category[]
): NestedCategory[] => {
  const categoryMap: Record<number, NestedCategory> = {};
  const rootCategories: NestedCategory[] = [];

  // Initialize map and add children array
  categories.forEach((category) => {
    categoryMap[category.id] = { ...category, children: [] };
  });

  // Build the tree structure
  categories.forEach((category) => {
    const nestedCategory = categoryMap[category.id];
    if (category.parent_id && categoryMap[category.parent_id]) {
      categoryMap[category.parent_id].children.push(nestedCategory);
    } else {
      rootCategories.push(nestedCategory);
    }
  });

  // Sort children alphabetically
  Object.values(categoryMap).forEach((category) => {
    category.children.sort((a, b) => a.title.localeCompare(b.title));
  });
  // Sort root categories alphabetically
  rootCategories.sort((a, b) => a.title.localeCompare(b.title));

  return rootCategories;
};

// Recursive component to render category list items
const CategoryListItem: React.FC<{
  category: NestedCategory;
  selectedCategories: number[];
  onCategoryToggle: (categoryId: number) => void;
  level: number;
}> = ({ category, selectedCategories, onCategoryToggle, level }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = category.children.length > 0;

  const handleToggle = () => {
    if (hasChildren) {
      setOpen(!open);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onCategoryToggle(category.id);
  };

  // Determine icon based on open state and children
  let icon = null;
  if (hasChildren) {
    icon = open ? <FiChevronDown /> : <FiChevronRight />;
  }

  return (
    <>
      <ListItem
        onClick={handleToggle} // Keep onClick for toggling collapse
        sx={{ pl: 2 + level * 2, cursor: hasChildren ? "pointer" : "default" }} // Add pointer cursor only if it has children
      >
        <ListItemIcon sx={{ minWidth: "auto", mr: 1 }}>
          <Checkbox
            edge="start"
            checked={selectedCategories.includes(category.id)}
            onChange={handleCheckboxChange}
            tabIndex={-1}
            disableRipple
            size="small"
          />
        </ListItemIcon>
        <ListItemText primary={category.title} />
        {icon} {/* Use the determined icon */}
      </ListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {category.children.map((child) => (
              <CategoryListItem
                key={child.id}
                category={child}
                selectedCategories={selectedCategories}
                onCategoryToggle={onCategoryToggle}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

// Extracted Category Filter Popover Component
interface CategoryFilterPopoverProps {
  id: string | undefined;
  open: boolean;
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  categoriesLoading: boolean;
  categoriesError: boolean;
  categoryTree: NestedCategory[];
  selectedCategories: number[];
  onCategoryToggle: (categoryId: number) => void;
  onClearFilters: () => void;
}

const CategoryFilterPopover: React.FC<CategoryFilterPopoverProps> = ({
  id,
  open,
  anchorEl,
  onClose,
  categoriesLoading,
  categoriesError,
  categoryTree,
  selectedCategories,
  onCategoryToggle,
  onClearFilters,
}) => {
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      slotProps={{
        // Replaced MenuListProps with slotProps.paper
        paper: {
          sx: {
            width: 350,
            maxHeight: 400,
            overflowY: "auto",
            borderRadius: 2,
            mt: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Categories
        </Typography>
        <Button
          size="small"
          onClick={onClearFilters}
          disabled={selectedCategories.length === 0}
        >
          Clear All
        </Button>
      </Box>
      {categoriesLoading && (
        <Box sx={{ p: 3, textAlign: "center" }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {categoriesError && (
        <Alert severity="error" sx={{ m: 2 }}>
          Could not load categories.
        </Alert>
      )}
      {!categoriesLoading && !categoriesError && categoryTree.length > 0 && (
        <List dense component="nav" aria-labelledby="nested-list-subheader">
          {categoryTree.map((category) => (
            <CategoryListItem
              key={category.id}
              category={category}
              selectedCategories={selectedCategories}
              onCategoryToggle={onCategoryToggle}
              level={0}
            />
          ))}
        </List>
      )}
      {!categoriesLoading && !categoriesError && categoryTree.length === 0 && (
        <Typography sx={{ p: 2, color: "text.secondary" }}>
          No categories available.
        </Typography>
      )}
    </Popover>
  );
};

export default function ProductListing() {
  // ... existing state ...
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ITEMS_PER_PAGE = 12;
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [filterAnchorEl, setFilterAnchorEl] =
    useState<HTMLButtonElement | null>(null);

  // ... existing handlers and effects ...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearchHandler = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
      setPage(1); // Reset to first page when search changes
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearchHandler(searchTerm);
  }, [searchTerm, debouncedSearchHandler]);

  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQueryCatalogCategories();

  const categoryTree = useMemo(() => {
    return categoriesData ? buildCategoryTree(categoriesData) : [];
  }, [categoriesData]);

  const { data, isLoading, isError, error } = useQueryCatalogProducts({
    params: {
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
      search: debouncedSearch || undefined,
      categoryIds: selectedCategories.join(",") || undefined,
    },
    options: {
      staleTime: 10 * 60 * 1000,
      enabled: !categoriesLoading,
    },
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Changed event type to HTMLDivElement
    setFilterAnchorEl(event.currentTarget as unknown as HTMLButtonElement); // Cast might be needed depending on strictness
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(categoryId)
        ? prevSelected.filter((id) => id !== categoryId)
        : [...prevSelected, categoryId]
    );
    setPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPage(1);
    handleFilterClose();
  };

  const openFilter = Boolean(filterAnchorEl);
  const filterId = openFilter ? "category-filter-popover" : undefined;

  const totalPages = data?.paging
    ? Math.ceil(data.paging.total / ITEMS_PER_PAGE)
    : 0;

  const isProductLoading = isLoading || categoriesLoading;

  // Simplified filter label construction
  const filterLabel =
    selectedCategories.length > 0
      ? `Filters (${selectedCategories.length})`
      : "Filters";

  // Determine loading/error/data state for products
  const showLoading = isProductLoading;
  const showError = isError || categoriesError;
  const showData =
    !isProductLoading &&
    !showError &&
    data?.products &&
    data.products.length > 0;
  const showNoResults =
    !isProductLoading &&
    !showError &&
    (!data?.products || data.products.length === 0);

  return (
    <Box sx={{ mt: 4 }}>
      <Fade in={true} timeout={800}>
        {/* ... existing header ... */}
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
              slotProps={{
                // Replaced InputProps with slotProps.input
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch color="#5E6AD2" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchTerm && (
                        <IconButton
                          aria-label="clear search"
                          onClick={handleClearSearch}
                          edge="end"
                          size="small"
                          sx={{ color: "text.secondary", mr: 0.5 }}
                        >
                          <FiX />
                        </IconButton>
                      )}
                      <Chip
                        aria-describedby={filterId}
                        icon={<FiFilter size={14} />}
                        label={filterLabel} // Use simplified label
                        size="small"
                        variant={
                          selectedCategories.length > 0 ? "filled" : "outlined"
                        }
                        color={
                          selectedCategories.length > 0 ? "primary" : "default"
                        }
                        onClick={handleFilterClick} // Type should now match
                        sx={{
                          mr: 1,
                          borderRadius: 2,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                // Styles moved from InputProps to sx or slotProps.input
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
          {/* Category Filter Popover Component Usage */}
          <CategoryFilterPopover
            id={filterId}
            open={openFilter}
            anchorEl={filterAnchorEl}
            onClose={handleFilterClose}
            categoriesLoading={categoriesLoading}
            categoriesError={!!categoriesError} // Pass boolean
            categoryTree={categoryTree}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            onClearFilters={handleClearFilters}
          />
        </Box>
      </Fade>

      {/* Conditional Rendering Logic Refactored */}
      {showError && (
        <Alert
          severity="error"
          sx={{
            mb: 4,
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(255, 82, 82, 0.1)",
          }}
        >
          {error?.message ?? "Failed to load products or categories"}
        </Alert>
      )}

      {showLoading && (
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
      )}

      {showData && data && (
        <Fade in={true} timeout={1000}>
          <Box>
            <ProductGrid catalogProducts={data.products} />
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
      )}

      {showNoResults && (
        <Alert
          severity="info"
          sx={{
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography color="text.secondary">
            {debouncedSearch || selectedCategories.length > 0
              ? "Try adjusting your search or filters."
              : "No products available at the moment."}
          </Typography>
        </Alert>
      )}
    </Box>
  );
}
