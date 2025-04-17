import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  InputAdornment,
  Card,
  CardMedia,
  type SelectChangeEvent,
} from "@mui/material";
import { FiX, FiImage } from "react-icons/fi";
import type {
  PrintfulV2CatalogProduct,
  PrintfulV2CatalogVariant,
  PrintfulV2MockupStyleGroup,
  PrintfulV2MockupStyle,
  PrintfulV2MockupGeneratorTaskRequest,
  ProductOption,
} from "~/types/printful";
import { useQueryProductMockupStyles } from "../hooks/use_query_product_mockup_styles";
import { useMutateCreateMockupTask } from "../hooks/use_mutate_create_mockup_task";
import { useQueryMockupTaskResult } from "../hooks/use_query_mockup_task_result";
import { MOCK_STORAGE_IMAGE_URLS } from "~/constants/mock_storage_image_urls";

interface ProductDesignerProps {
  open: boolean;
  onClose: () => void;
  product: PrintfulV2CatalogProduct;
  selectedVariant: PrintfulV2CatalogVariant;
  selectedTechnique: string;
}

/**
 * Component for the Product Designer UI.
 * Fetches mockup styles and allows users to generate product mockups.
 */
const ProductDesigner: React.FC<ProductDesignerProps> = ({
  open,
  onClose,
  product,
  selectedVariant,
  selectedTechnique,
}) => {
  // --- State --- //
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>([]);
  const [selectedMockupStyleIds, setSelectedMockupStyleIds] = useState<
    number[]
  >([]);
  const [imageUrl, setImageUrl] = useState<string>(
    MOCK_STORAGE_IMAGE_URLS[0] ?? ""
  );
  const [generatedTaskIds, setGeneratedTaskIds] = useState<number[] | null>(
    null
  );
  const [generatedMockupUrl, setGeneratedMockupUrl] = useState<string | null>(
    null
  );
  const [selectedPreviewMockupUrl, setSelectedPreviewMockupUrl] = useState<
    string | null
  >(null);

  // --- State for product option selection --- //
  const [selectedCatalogOptionName, setSelectedCatalogOptionName] =
    useState<string>("");

  // --- State for selected product options --- //
  // Keep selected options as an array of ProductOption objects
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  // console.log("Product Options:", productOptions);
  // --- Helper: Get required product options (excluding 'notes') --- //
  const requiredProductOptions = useMemo(() => {
    return (product.product_options || []).filter(
      (opt) => opt.name !== "notes"
    );
  }, [product.product_options]);

  // --- Handler: selecting an option value --- //
  const handleCatalogOptionValueChange = (e: SelectChangeEvent<string>) => {
    const raw = e.target.value as string;
    const meta = requiredProductOptions.find(
      (o) => o.name === selectedCatalogOptionName
    );
    let value: string | number | boolean = raw;
    if (meta) {
      if (meta.values.includes(true) || meta.values.includes(false)) {
        value = raw === "true";
      } else if (meta.values.some((v) => typeof v === "number")) {
        const num = Number(raw);
        if (!Number.isNaN(num) && meta.values.includes(num)) value = num;
      }
    }
    setProductOptions((prev) =>
      prev.map((opt) =>
        opt.name === selectedCatalogOptionName ? { ...opt, value } : opt
      )
    );
  };

  // --- Hooks --- //

  // Fetch available mockup styles for the product
  // Assuming useQueryProductMockupStyles returns the array directly in its 'data' property
  // (e.g., via a 'select' option in the hook implementation)
  const {
    data: mockupStyleGroups, // Renamed: This should now be the array PrintfulV2MockupStyleGroup[] | undefined
    isLoading: isLoadingStyles,
    isError: isErrorStyles,
    error: errorStyles,
  } = useQueryProductMockupStyles(open ? product.id.toString() : undefined, {
    enabled: open,
  });
  // Removed: const mockupStyleGroups = mockupStyleGroupsResponse?.data;

  // Mutation hook to create a mockup task
  const {
    mutate: createMockupTask,
    isPending: isCreatingTask,
    isError: isErrorCreatingTask,
    error: errorCreatingTask,
    reset: resetCreateMutation,
  } = useMutateCreateMockupTask({
    onSuccess: (response) => {
      // The API returns an array, use the first task's ID
      const tasks = response.data;
      if (tasks && tasks.length > 0) {
        console.log("Mockup task created, ID:", tasks);
        setGeneratedMockupUrl(null); // Clear previous mockup
        setGeneratedTaskIds(tasks.map((t) => t.id)); // Set the current task ID for polling
      } else {
        console.error("Mockup task creation succeeded but no task ID found.");
        setGeneratedTaskIds(null);
        // Optionally: Show an error message to the user
      }
    },
    onError: (error) => {
      console.error("Error creating mockup task:", error);
      setGeneratedTaskIds(null);
    },
  });

  // Query hook to poll for the mockup task result
  const {
    data: taskResultResponse,
    isFetching: isFetchingTaskResult,
    error: errorTaskResult,
  } = useQueryMockupTaskResult(generatedTaskIds, {
    enabled: !!generatedTaskIds,
  });
  const taskResultData = taskResultResponse?.data?.[0];

  // --- Effects --- //

  // Effect to update the generated mockup URL when polling completes
  useEffect(() => {
    if (taskResultData?.status === "completed") {
      const mockups = taskResultData.catalog_variant_mockups;
      // Find the first mockup for the selected variant and style
      let relevantMockupUrl: string | null = null;
      for (const variantMockup of mockups ?? []) {
        if (variantMockup.catalog_variant_id === selectedVariant.id) {
          // Find a mockup whose style_id matches one of the selectedMockupStyleIds
          const found = variantMockup.mockups.find((m) =>
            selectedMockupStyleIds.includes(m.style_id)
          );
          if (found) {
            relevantMockupUrl = found.mockup_url;
            break;
          }
        }
      }
      setGeneratedMockupUrl(relevantMockupUrl ?? null);
      setGeneratedTaskIds(null); // Stop polling
    } else if (taskResultData?.status === "failed") {
      console.error("Mockup task failed:", taskResultData.failure_reasons);
      setGeneratedMockupUrl(null);
      setGeneratedTaskIds(null); // Stop polling
    }
  }, [taskResultData, selectedVariant.id, selectedMockupStyleIds]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedPlacements([]);
      setSelectedMockupStyleIds([]);
      setGeneratedTaskIds(null);
      setGeneratedMockupUrl(null);
      resetCreateMutation();
    }
  }, [open, resetCreateMutation]);

  // --- Memoized Values --- //

  // Get all unique techniques from the mockup style groups
  const availableTechniques = useMemo(() => {
    if (!mockupStyleGroups) return [];
    const techniques = mockupStyleGroups.map((group) => group.technique);
    return Array.from(new Set(techniques));
  }, [mockupStyleGroups]);

  // Get all placements for the selected technique (return objects, not just strings)
  const availablePlacements = useMemo(() => {
    if (!mockupStyleGroups || !selectedTechnique) return [];
    return mockupStyleGroups
      .filter((group) => group.technique === selectedTechnique)
      .map(
        (group) =>
          ({
            placement: group.placement,
            display_name: group.display_name,
            dpi: group.dpi,
            print_area_type: group.print_area_type,
            mockup_styles: group.mockup_styles,
            print_area_height: group.print_area_height,
            print_area_width: group.print_area_width,
            technique: group.technique,
          } as Partial<PrintfulV2MockupStyleGroup>)
      );
  }, [mockupStyleGroups, selectedTechnique]);

  // Get the style groups for the selected placements
  const selectedStyleGroups = useMemo(() => {
    if (!mockupStyleGroups || selectedPlacements.length === 0) return [];
    // selectedPlacements is now string[], so parse each to get the placement value
    const selectedPlacementValues = selectedPlacements.map((p) => {
      try {
        return JSON.parse(p).placement;
      } catch {
        return p;
      }
    });
    return mockupStyleGroups.filter((group) =>
      selectedPlacementValues.includes(group.placement)
    );
  }, [mockupStyleGroups, selectedPlacements]);

  // Get available mockup styles for the first selected placement
  const availableMockupStyles = useMemo(() => {
    if (selectedStyleGroups.length === 0) return [];
    return selectedStyleGroups[0].mockup_styles ?? [];
  }, [selectedStyleGroups]);

  // --- State for preview gallery --- //
  const [selectedPreviewUrl, setSelectedPreviewUrl] = useState<string | null>(
    null
  );

  // --- Memoized gallery images from mockup task response --- //
  const galleryImages = useMemo(() => {
    if (!taskResultResponse?.data) return [];
    if (taskResultResponse.data.length === 0) return [];
    if (taskResultResponse.data[0].status !== "completed") return [];
    // Flatten all mockups for all variants in the completed task
    return (
      taskResultResponse.data[0]?.catalog_variant_mockups?.flatMap(
        (variantMockup) =>
          (variantMockup.mockups || []).map((mockup) => ({
            mockup_url: mockup.mockup_url,
            placement: mockup.placement,
            style_id: mockup.style_id,
            display_name: mockup.display_name,
            technique: mockup.technique,
            catalog_variant_id: variantMockup.catalog_variant_id,
          }))
      ) ?? []
    );
  }, [taskResultResponse]);

  // --- Event Handlers --- //

  const handlePlacementChange = (placements: string[]) => {
    setSelectedPlacements(placements);
    setSelectedMockupStyleIds([]);
  };

  const handleGeneratePreview = () => {
    if (
      !selectedTechnique ||
      selectedPlacements.length === 0 ||
      selectedMockupStyleIds.length === 0 ||
      !imageUrl
    ) {
      console.error("Missing required fields for mockup generation.");
      return;
    }
    // Find the style group for the first selected placement
    const styleGroup = selectedStyleGroups[0];
    if (!styleGroup) {
      console.error("Could not determine style group for placement.");
      return;
    }
    console.log("selectedTechnique", selectedTechnique);
    const requestBody: PrintfulV2MockupGeneratorTaskRequest = {
      format: "png",
      products: [
        {
          source: "catalog",
          catalog_product_id: product.id,
          catalog_variant_ids: [selectedVariant.id],
          mockup_style_ids: selectedMockupStyleIds,
          placements: selectedPlacements.map((placementStr) => {
            const placementObj = JSON.parse(placementStr);
            return {
              placement: placementObj.placement,
              technique: selectedTechnique,
              layers: [{ type: "file", url: imageUrl }],
              placement_options:
                selectedTechnique === "embroidery" &&
                product.placements.some((p) =>
                  p.placement_options?.some((o) => o.name === "unlimited_color")
                )
                  ? [{ name: "unlimited_color", value: true }]
                  : [],
            };
          }),
          product_options: productOptions,
        },
      ],
    };
    console.log("Request Body:", requestBody);
    createMockupTask(requestBody);
  };

  // --- Render Logic --- //

  const renderDesignerControls = () => {
    if (isLoadingStyles) {
      return <CircularProgress />;
    }
    if (isErrorStyles) {
      return (
        <Alert severity="error">
          Error loading design options:{" "}
          {errorStyles?.message || "Unknown error"}
        </Alert>
      );
    }
    if (!mockupStyleGroups || mockupStyleGroups.length === 0) {
      return <Alert severity="info">No design options available.</Alert>;
    }
    return (
      <Grid container spacing={3}>
        {/* Placement Selector (multi-select) */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required disabled={!selectedTechnique}>
            <InputLabel id="placement-select-label">Placement(s)</InputLabel>
            <Select
              labelId="placement-select-label"
              multiple
              value={selectedPlacements} // Stores stringified placement objects
              label="Placement(s)"
              onChange={(e) =>
                handlePlacementChange(e.target.value as string[])
              }
              // Render the selected values in the input field
              renderValue={(selected) =>
                (selected as string[])
                  .map((placementStr) => {
                    try {
                      // Parse the stringified object to access its properties
                      const placementObj = JSON.parse(placementStr);
                      // Display name and print area type for uniqueness
                      return `${placementObj.display_name} (${placementObj.print_area_type})`;
                    } catch (error) {
                      console.error("Error parsing placement JSON:", error);
                      return "Invalid Placement"; // Fallback display
                    }
                  })
                  .join(", ")
              }
            >
              {/* Generate menu items for each available placement */}
              {availablePlacements.map((placementObj) => (
                <MenuItem
                  // Use a composite key for guaranteed uniqueness in React rendering
                  key={`${placementObj.placement}-${placementObj.print_area_type}`}
                  // Store the entire placement object as a JSON string in the value
                  value={JSON.stringify(placementObj)}
                >
                  {/* Display name and print area type in the dropdown list */}
                  {`${placementObj.display_name} (${placementObj.print_area_type})`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Preview Style Selector */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            fullWidth
            required
            disabled={selectedPlacements.length === 0 || !selectedTechnique}
          >
            <InputLabel id="mockup-style-select-label">
              Preview Style
            </InputLabel>
            <Select
              labelId="mockup-style-select-label"
              multiple
              value={selectedMockupStyleIds}
              label="Preview Style"
              onChange={(e) =>
                setSelectedMockupStyleIds(
                  typeof e.target.value === "string"
                    ? [Number(e.target.value)]
                    : (e.target.value as number[])
                )
              }
              renderValue={(selected) =>
                (selected as number[])
                  .map(
                    (id) =>
                      availableMockupStyles.find((style) => style.id === id)
                        ?.category_name +
                      " - " +
                      availableMockupStyles.find((style) => style.id === id)
                        ?.view_name
                  )
                  .join(", ")
              }
            >
              <MenuItem value={""} disabled>
                <em>Select Style</em>
              </MenuItem>
              {availableMockupStyles.map((style: PrintfulV2MockupStyle) => (
                <MenuItem key={style.id} value={style.id}>
                  {style.category_name} - {style.view_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Product Option Selector */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl
            fullWidth
            required
            disabled={requiredProductOptions.length === 0}
          >
            <InputLabel id="catalog-option-select-label">
              Product Option
            </InputLabel>
            <Select
              labelId="catalog-option-select-label"
              value={selectedCatalogOptionName}
              label="Product Option"
              onChange={(e) => {
                const name = e.target.value as string;
                setSelectedCatalogOptionName(name);
                const meta = requiredProductOptions.find(
                  (o) => o.name === name
                );
                if (meta) {
                  // initialize default entry or replace existing
                  const defaultVal = meta.values[0];
                  setProductOptions((prev) => [
                    ...prev.filter((o) => o.name !== name),
                    { name, value: defaultVal } as ProductOption,
                  ]);
                }
              }}
            >
              <MenuItem value="" disabled>
                <em>Select Option</em>
              </MenuItem>
              {requiredProductOptions.map((opt) => (
                <MenuItem key={opt.name} value={opt.name}>
                  {opt.name.replace(/_/g, " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Product Option Value Selector */}
        {selectedCatalogOptionName && (
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth required>
              <InputLabel id="catalog-option-value-select-label">
                Value
              </InputLabel>
              <Select
                labelId="catalog-option-value-select-label"
                value={String(
                  productOptions.find(
                    (o) => o.name === selectedCatalogOptionName
                  )?.value ?? ""
                )}
                label="Value"
                onChange={handleCatalogOptionValueChange}
              >
                {requiredProductOptions
                  .find((o) => o.name === selectedCatalogOptionName)
                  ?.values?.map((val) => (
                    <MenuItem key={String(val)} value={String(val)}>
                      {String(val)}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        {/* Image Input */}
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Image URL (Mock)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            InputProps={{
              readOnly: true,
              startAdornment: (
                <InputAdornment position="start">
                  <FiImage />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            helperText="Using a predefined image URL for this demo."
          />
        </Grid>
      </Grid>
    );
  };

  // --- Preview Gallery UI --- //
  const renderPreviewGallery = () => {
    if (!galleryImages.length) return null;
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Mockup Previews
        </Typography>
        <Grid container spacing={2}>
          {galleryImages.map((img) => (
            <Grid key={img.mockup_url} size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  border: selectedPreviewUrl === img.mockup_url ? 2 : 1,
                  borderColor:
                    selectedPreviewUrl === img.mockup_url
                      ? "primary.main"
                      : "divider",
                  boxShadow: selectedPreviewUrl === img.mockup_url ? 4 : 1,
                  transition: "box-shadow 0.2s, border-color 0.2s",
                }}
                onClick={() => setSelectedPreviewUrl(img.mockup_url)}
              >
                <CardMedia
                  component="img"
                  image={img.mockup_url}
                  alt={img.placement}
                  sx={{ objectFit: "contain", height: 120 }}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
        {/* Large preview display */}
        {selectedPreviewUrl && (
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="subtitle2" gutterBottom>
              Preview
            </Typography>
            <Card sx={{ maxWidth: 500, margin: "auto", boxShadow: 6 }}>
              <CardMedia
                component="img"
                image={selectedPreviewUrl}
                alt="Selected Mockup Preview"
                sx={{
                  objectFit: "contain",
                  maxHeight: 400,
                  bgcolor: "background.paper",
                }}
              />
            </Card>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Design: {product.name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <FiX />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={4}>
          {/* Left Side: Controls */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" gutterBottom>
              Design Options
            </Typography>
            {renderDesignerControls()}
          </Grid>
          {/* Right Side: Gallery */}
          <Grid size={{ xs: 12, md: 7 }}>{renderPreviewGallery()}</Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleGeneratePreview}
          disabled={
            isLoadingStyles ||
            !selectedTechnique ||
            selectedPlacements.length === 0 ||
            selectedMockupStyleIds.length === 0 ||
            !imageUrl || // Also disable if no image URL
            isCreatingTask ||
            !!generatedTaskIds
          }
          startIcon={isCreatingTask ? <CircularProgress size={20} /> : null}
        >
          {generatedTaskIds ? "Generating..." : "Generate Preview"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDesigner;
