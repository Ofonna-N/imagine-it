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
  Paper,
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
import ImageGenerator from "./image_generator";

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
  console.log("mockupStyleGroups", mockupStyleGroups);
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

  // Default select the first product option when dialog opens
  useEffect(() => {
    if (open && requiredProductOptions.length > 0) {
      const firstOpt = requiredProductOptions[0];
      setSelectedCatalogOptionName(firstOpt.name);
      setProductOptions([
        { name: firstOpt.name, value: firstOpt.values[0] } as ProductOption,
      ]);
    }
  }, [open, requiredProductOptions]);

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

  console.log("selectedmockupStyleIds", selectedMockupStyleIds);
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

  // --- Memoized placement label counts to determine when to show dimensions --- //
  const placementLabelCounts = useMemo(() => {
    const counts = new Map<string, number>();
    availablePlacements.forEach((p) => {
      const key = `${p.display_name}|${p.print_area_type}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [availablePlacements]);

  // --- Event Handlers --- //

  console.log("placement", selectedPlacements);
  const handlePlacementChange = (placements: string[]) => {
    setSelectedPlacements(placements);

    // For each selected placement, pick one mockup style whose view_name matches (case-insensitive)
    const autoStyleIds = placements
      .map((p) => {
        const placementKey = (() => {
          try {
            return JSON.parse(p).placement.toLowerCase();
          } catch {
            return p.toLowerCase();
          }
        })();
        // Find the style group matching this placement
        const group = (mockupStyleGroups ?? []).find(
          (g) => g.placement.toLowerCase() === placementKey
        );
        if (!group) return null;
        // Find a style whose view_name matches, else fallback to first style
        const style = (group.mockup_styles ?? []).find(
          (s) => s.view_name.toLowerCase() === placementKey
        );
        return style?.id ?? group.mockup_styles?.[0]?.id ?? null;
      })
      .filter((id): id is number => id !== null);

    // Remove duplicate style IDs
    setSelectedMockupStyleIds(Array.from(new Set(autoStyleIds)));
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

  // --- Collapsible for secondary controls --- //
  const [showAdvanced, setShowAdvanced] = useState(false);

  // --- AI Image Modal State & Handlers --- //
  const [openImageGen, setOpenImageGen] = useState(false);
  const handleImageGenerated = (url: string) => {
    setImageUrl(url);
    setOpenImageGen(false);
  };

  // --- Render Generated Previews Gallery --- //
  const renderPreviewGallery = () => {
    if (!galleryImages.length) return null;
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Generated Previews
        </Typography>
        <Grid container spacing={2}>
          {galleryImages.map((img, idx) => (
            <Grid key={img.mockup_url + idx} size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{
                  border: selectedPreviewMockupUrl === img.mockup_url ? 2 : 1,
                  borderColor:
                    selectedPreviewMockupUrl === img.mockup_url
                      ? "primary.main"
                      : "divider",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedPreviewMockupUrl(img.mockup_url)}
              >
                <CardMedia
                  component="img"
                  image={img.mockup_url}
                  alt={img.display_name}
                  sx={{
                    objectFit: "contain",
                    height: 120,
                    bgcolor: "background.paper",
                  }}
                />
                <Box sx={{ p: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {img.display_name}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  // --- Redesigned UI --- //
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, fontWeight: 700 }}>
        Design Your Product
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
      <DialogContent dividers sx={{ bgcolor: "background.default" }}>
        <Grid container spacing={4}>
          {/* Main Controls: Placement & AI Image */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                1. Select Placement
              </Typography>
              <FormControl fullWidth required>
                <InputLabel id="placement-select-label">Placement</InputLabel>
                <Select
                  labelId="placement-select-label"
                  value={selectedPlacements[0] || ""}
                  label="Placement"
                  onChange={(e) =>
                    handlePlacementChange([e.target.value as string])
                  }
                  renderValue={(selected) => {
                    try {
                      const p = JSON.parse(
                        selected as string
                      ) as Partial<PrintfulV2MockupStyleGroup>;
                      const key = `${p.display_name}|${p.print_area_type}`;
                      const count = placementLabelCounts.get(key) ?? 0;
                      return count > 1
                        ? `${p.display_name} (${
                            p.print_area_type
                          }, ${p.print_area_width?.toFixed(
                            2
                          )}×${p.print_area_height?.toFixed(2)})`
                        : `${p.display_name} (${p.print_area_type})`;
                    } catch {
                      return "Select Placement";
                    }
                  }}
                >
                  {availablePlacements.map((p) => {
                    const key = `${p.display_name}|${p.print_area_type}`;
                    const count = placementLabelCounts.get(key) ?? 0;
                    const label =
                      count > 1
                        ? `${p.display_name} (${
                            p.print_area_type
                          }, ${p.print_area_width?.toFixed(
                            2
                          )}×${p.print_area_height?.toFixed(2)})`
                        : `${p.display_name} (${p.print_area_type})`;
                    return (
                      <MenuItem
                        key={`${p.placement}-${p.print_area_type}-${p.print_area_width}-${p.print_area_height}`}
                        value={JSON.stringify(p)}
                      >
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Paper>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                2. AI Image
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Card
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 2,
                    boxShadow: 3,
                    border: imageUrl ? 2 : 1,
                    borderColor: imageUrl ? "primary.main" : "divider",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt="AI Design Preview"
                    sx={{ objectFit: "contain", width: "100%", height: "100%" }}
                  />
                </Card>
                <Button
                  variant="outlined"
                  startIcon={<FiImage />}
                  onClick={() => setOpenImageGen(true)}
                  sx={{ minWidth: 120 }}
                >
                  {imageUrl ? "Change Image" : "Generate AI Image"}
                </Button>
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 1, display: "block" }}
              >
                The selected image will be applied to your product.
              </Typography>
            </Paper>
            <Button
              variant="text"
              size="small"
              sx={{ mt: 2, textTransform: "none" }}
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? "Hide" : "Show"} Advanced Options
            </Button>
            {showAdvanced && (
              <Paper elevation={1} sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Advanced Options
                </Typography>
                {/* Preview Style Selector */}
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="mockup-style-select-label">
                    Preview Style
                  </InputLabel>
                  <Select
                    labelId="mockup-style-select-label"
                    multiple
                    value={selectedMockupStyleIds}
                    label="Preview Style"
                    onChange={(e) => {
                      const raw =
                        typeof e.target.value === "string"
                          ? [Number(e.target.value)]
                          : (e.target.value as number[]);
                      setSelectedMockupStyleIds(Array.from(new Set(raw)));
                    }}
                    renderValue={(selected) =>
                      (selected as number[])
                        .map(
                          (id) =>
                            availableMockupStyles.find(
                              (style) => style.id === id
                            )?.category_name +
                            " - " +
                            availableMockupStyles.find(
                              (style) => style.id === id
                            )?.view_name
                        )
                        .join(", ")
                    }
                  >
                    <MenuItem value={""} disabled>
                      <em>Select Style</em>
                    </MenuItem>
                    {availableMockupStyles.map((style) => (
                      <MenuItem key={style.id} value={style.id}>
                        {style.category_name} - {style.view_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {/* Product Option Selector */}
                <FormControl fullWidth>
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
                      setProductOptions((prev) => [
                        ...prev.filter((o) => o.name !== name),
                        { name, value: true } as ProductOption,
                      ]);
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
              </Paper>
            )}
          </Grid>
          {/* Right Side: Large Preview & Action */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                minHeight: 420,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Preview
              </Typography>
              <Card sx={{ maxWidth: 350, width: "100%", mb: 2, boxShadow: 6 }}>
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt="Product Preview"
                  sx={{
                    objectFit: "contain",
                    maxHeight: 300,
                    bgcolor: "background.paper",
                  }}
                />
              </Card>
              <Button
                variant="contained"
                size="large"
                onClick={handleGeneratePreview}
                disabled={
                  isLoadingStyles ||
                  !selectedTechnique ||
                  selectedPlacements.length === 0 ||
                  selectedMockupStyleIds.length === 0 ||
                  !imageUrl ||
                  isCreatingTask ||
                  !!generatedTaskIds
                }
                startIcon={
                  isCreatingTask ? <CircularProgress size={20} /> : null
                }
                sx={{ mt: 2, minWidth: 200 }}
              >
                {generatedTaskIds
                  ? "Generating..."
                  : "Generate Product Preview"}
              </Button>
              {generatedMockupUrl && (
                <Alert severity="success" sx={{ mt: 3 }}>
                  Mockup generated! Scroll down to see your preview.
                </Alert>
              )}
            </Paper>
            {/* Gallery of generated previews */}
            {renderPreviewGallery()}
          </Grid>
        </Grid>
      </DialogContent>
      {/* AI Image Generation Modal */}
      <Dialog
        open={openImageGen}
        onClose={() => setOpenImageGen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Generate AI Image</DialogTitle>
        <DialogContent>
          <ImageGenerator onImageSelect={handleImageGenerated} singleSelect />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageGen(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ProductDesigner;
