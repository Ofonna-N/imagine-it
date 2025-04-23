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
  Card,
  CardMedia,
  Paper,
  Stack,
  Skeleton,
} from "@mui/material";
import { FiX, FiImage, FiCheck } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import type {
  PrintfulV2CatalogProduct,
  PrintfulV2CatalogVariant,
  PrintfulV2MockupStyleGroup,
  PrintfulV2MockupGeneratorTaskRequest,
  ProductOption,
  PrintfulV2MockupStyle,
} from "~/types/printful";
import { useQueryProductMockupStyles } from "../hooks/use_query_product_mockup_styles";
import { useMutateCreateMockupTask } from "../hooks/use_mutate_create_mockup_task";
import { useQueryMockupTaskResult } from "../hooks/use_query_mockup_task_result";
import ImageGenerator from "./image_generator";
import { DesignsGallery } from "./designs_gallery";

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
  // Single placement selection
  const [selectedPlacement, setSelectedPlacement] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [generatedTaskIds, setGeneratedTaskIds] = useState<number[] | null>(
    null
  );
  const [generatedMockupUrl, setGeneratedMockupUrl] = useState<string | null>(
    null
  );
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);

  // --- State for product option selection --- //
  const [selectedCatalogOptionName, setSelectedCatalogOptionName] =
    useState<string>("");

  // --- State for selected product options --- //
  // Keep selected options as an array of ProductOption objects
  const [productOptions, setProductOptions] = useState<ProductOption[]>([]);

  // Selected mockup style IDs (multiple)
  const [selectedMockupStyleIds, setSelectedMockupStyleIds] = useState<
    number[]
  >([]);

  // console.log("Product Options:", productOptions);
  // --- Helper: Get required product options (excluding 'notes') --- //
  const requiredProductOptions = useMemo(() => {
    return (product.product_options || []).filter(
      (opt) => opt.name !== "notes"
    );
  }, [product.product_options]);

  // --- Hooks --- //

  // Fetch mockup style groups, API filter by the raw placement identifier
  // placementKey will be derived below from selectedPlacementGroup
  const { data: mockupStyleGroups, isLoading: isLoadingStyles } =
    useQueryProductMockupStyles(
      open ? product.id.toString() : undefined,
      undefined,
      { enabled: open }
    );

  // Mutation hook to create a mockup task
  const {
    mutate: createMockupTask,
    isPending: isCreatingTask,
    reset: resetCreateMutation,
  } = useMutateCreateMockupTask({
    onSuccess: (response) => {
      // The API returns an array, use the first task's ID
      const tasks = response.data;
      if (tasks && tasks.length > 0) {
        // console.log("Mockup task created, ID:", tasks);
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
  const { data: taskResultResponse } = useQueryMockupTaskResult(
    generatedTaskIds,
    {
      enabled: !!generatedTaskIds,
    }
  );
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
      setSelectedPlacement("");
      setGeneratedTaskIds(null);
      setGeneratedMockupUrl(null);
      resetCreateMutation();
    }
  }, [open, resetCreateMutation]);

  // console.log("requiredProductOptions", requiredProductOptions);
  // Default select the first product option when dialog opens
  useEffect(() => {
    if (open && requiredProductOptions.length > 0) {
      const firstOpt = requiredProductOptions[0];

      setSelectedCatalogOptionName(firstOpt.name);
      const firstValue = Array.isArray(firstOpt.values)
        ? firstOpt.values[0]
        : (Object.values(firstOpt.values)[0] as any)?.toLowerCase();

      setProductOptions([
        { name: firstOpt.name, value: firstValue } as ProductOption,
      ]);
    }
  }, [open, requiredProductOptions]);

  // --- Memoized Values --- //

  // Composite key for placement uniqueness
  const getPlacementKey = (group: PrintfulV2MockupStyleGroup) =>
    `${group.placement}|${group.print_area_width}|${group.print_area_height}`;

  // Available placement groups filtered by technique and variant compatibility
  const availablePlacements = useMemo<PrintfulV2MockupStyleGroup[]>(() => {
    if (!mockupStyleGroups || !selectedTechnique) return [];
    return mockupStyleGroups
      .filter(
        (group) =>
          group.technique.toLowerCase() === selectedTechnique.toLowerCase()
      )
      .filter((group) =>
        (group.mockup_styles ?? []).every(
          (style) =>
            !style.restricted_to_variants ||
            style.restricted_to_variants.includes(selectedVariant.id)
        )
      );
  }, [mockupStyleGroups, selectedTechnique, selectedVariant.id]);

  // Find the selected placement group by composite key
  const selectedPlacementGroup = useMemo<
    PrintfulV2MockupStyleGroup | undefined
  >(
    () =>
      availablePlacements.find(
        (group) => getPlacementKey(group) === selectedPlacement
      ),
    [availablePlacements, selectedPlacement]
  );

  // Available mockup styles from the selected placement group
  const availableMockupStyles = useMemo<PrintfulV2MockupStyle[]>(() => {
    if (!selectedPlacementGroup) return [];
    return (selectedPlacementGroup.mockup_styles ?? []).filter(
      (style) =>
        !style.restricted_to_variants ||
        style.restricted_to_variants.includes(selectedVariant.id)
    );
  }, [selectedPlacementGroup, selectedVariant.id]);

  // Auto-select a default mockup style when the placement group changes
  useEffect(() => {
    if (selectedPlacementGroup) {
      // Try to match a style whose view_name matches the placement name (case-insensitive)
      const match = (selectedPlacementGroup.mockup_styles ?? []).find(
        (style) =>
          style.view_name.toLowerCase() ===
          selectedPlacementGroup.placement.toLowerCase()
      );
      const defaultStyle = match || selectedPlacementGroup.mockup_styles?.[0];
      if (defaultStyle) {
        setSelectedMockupStyleIds([defaultStyle.id]);
      }
    } else {
      // Clear selection if no placement
      setSelectedMockupStyleIds([]);
    }
  }, [selectedPlacementGroup]);

  // Derive the actual placement key (e.g., "front") from the selected group
  const placementKey = useMemo(
    () => selectedPlacementGroup?.placement,
    [selectedPlacementGroup]
  );
  // Refetch styles when placement changes
  useEffect(() => {
    if (placementKey) {
      // Trigger React Query refetch for mockup styles with the new placement filter
      // Note: useQueryProductMockupStyles internally listens to the placements key
    }
  }, [placementKey]);

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
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [availablePlacements]);

  // --- Event Handlers --- //

  const handlePlacementChange = (value: string) => {
    setSelectedPlacement(value);
  };

  const handleGeneratePreview = () => {
    if (
      !selectedTechnique ||
      !selectedPlacement ||
      selectedMockupStyleIds.length === 0 ||
      !imageUrl
    ) {
      console.error("Missing required fields for mockup generation.");
      return;
    }
    const styleGroup = selectedPlacementGroup;
    if (!styleGroup) {
      console.error("Could not determine style group for placement.");
      return;
    }

    // Determine if unlimited_color should be included
    const includeUnlimitedColor =
      selectedTechnique === "embroidery" &&
      product.placements.some((p) =>
        p.placement_options?.some((o) => o.name === "unlimited_color")
      );
    const requestBody: PrintfulV2MockupGeneratorTaskRequest = {
      format: "png",
      products: [
        {
          source: "catalog",
          catalog_product_id: product.id,
          catalog_variant_ids: [selectedVariant.id],
          mockup_style_ids: selectedMockupStyleIds,
          placements: [
            {
              placement: placementKey!,
              technique: selectedTechnique,
              layers: [{ type: "file", url: imageUrl }],
              placement_options: includeUnlimitedColor
                ? [{ name: "unlimited_color", value: true }]
                : [],
            },
          ],
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
  // --- Saved Designs Gallery State & Handlers --- //
  const [openDesignsGallery, setOpenDesignsGallery] = useState(false);
  const handleDesignSelected = (url: string) => {
    setImageUrl(url);
    setOpenDesignsGallery(false);
  };

  // --- AI Image Handler ---
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
                  border: 1,
                  borderColor: "divider",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setGalleryInitialIndex(idx);
                  setIsGalleryOpen(true);
                }}
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
  // console.log("selectedVariant", selectedVariant);
  // console.log("selectedplacementGroup", selectedPlacementGroup);
  // console.log("selectedplacementGroup", selectedPlacementGroup);
  // console.log("mockupStyleGroups", mockupStyleGroups);
  // console.log("allavalablePlacements", availablePlacements);
  // console.log("availableMockupStyles", availableMockupStyles);
  // console.log("selectedmockupStyleIds", selectedMockupStyleIds);
  // console.log("placement", selectedPlacement);
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
        {/* Feedback for variants without placement options */}
        {availablePlacements.length === 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            This variant doesn’t support custom design placements for the
            selected technique.
          </Alert>
        )}

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
                  value={selectedPlacement}
                  label="Placement"
                  onChange={(e) => handlePlacementChange(e.target.value)}
                  disabled={!availablePlacements.length} // Disable when no placements
                  renderValue={(selected) => {
                    const group = availablePlacements.find(
                      (g) => getPlacementKey(g) === selected
                    );
                    if (!group) return "Select Placement";
                    const key = `${group.display_name}|${group.print_area_type}`;
                    const count = placementLabelCounts.get(key) ?? 0;
                    return count > 1
                      ? `${group.display_name} (${
                          group.print_area_type
                        }, ${group.print_area_width.toFixed(
                          2
                        )}×${group.print_area_height.toFixed(2)})`
                      : `${group.display_name} (${group.print_area_type})`;
                  }}
                >
                  {availablePlacements.map((p) => {
                    const keyLabel = `${p.display_name}|${p.print_area_type}`;
                    const count = placementLabelCounts.get(keyLabel) ?? 0;
                    const label =
                      count > 1
                        ? `${p.display_name} (${
                            p.print_area_type
                          }, ${p.print_area_width.toFixed(
                            2
                          )}×${p.print_area_height.toFixed(2)})`
                        : `${p.display_name} (${p.print_area_type})`;
                    return (
                      <MenuItem
                        key={getPlacementKey(p)}
                        value={getPlacementKey(p)}
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
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Image Preview */}
                <Card
                  sx={{
                    width: 100,
                    height: 100,
                    boxShadow: 3,
                    border: imageUrl ? 2 : 1,
                    borderColor: imageUrl ? "primary.main" : "divider",
                  }}
                >
                  {imageUrl ? (
                    <CardMedia
                      component="img"
                      image={imageUrl}
                      alt="AI Design Preview"
                      sx={{
                        objectFit: "contain",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.paper",
                      }}
                    >
                      <FiImage size={48} color="grey" />
                    </Box>
                  )}
                </Card>
                {/* Action Buttons */}
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FiImage />}
                    onClick={() => setOpenImageGen(true)}
                    sx={{ minWidth: 120 }}
                  >
                    {imageUrl ? "Change Image" : "Generate AI Image"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<FiCheck />}
                    onClick={() => setOpenDesignsGallery(true)}
                    sx={{ minWidth: 120 }}
                  >
                    Choose from My Designs
                  </Button>
                </Stack>
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
                          : e.target.value;
                      setSelectedMockupStyleIds(Array.from(new Set(raw)));
                    }}
                    renderValue={(selected) =>
                      selected
                        .map((id) => {
                          const style = availableMockupStyles.find(
                            (s) => s.id === id
                          );
                          return (
                            style?.category_name + " - " + style?.view_name
                          );
                        })
                        .join(", ")
                    }
                  >
                    <MenuItem value={""} disabled>
                      <em>Select Style</em>
                    </MenuItem>
                    {availableMockupStyles?.map((style) => (
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
                      const name = e.target.value;
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
                {imageUrl ? (
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
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 300,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "background.paper",
                    }}
                  >
                    <FiImage size={64} color="grey" />
                  </Box>
                )}
              </Card>
              <Button
                variant="contained"
                size="large"
                onClick={handleGeneratePreview}
                disabled={
                  isLoadingStyles ||
                  !selectedTechnique ||
                  !selectedPlacement ||
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
              {/* Add to Cart button appears directly under the Generate Product Preview button */}
              {generatedMockupUrl && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 2, minWidth: 200, fontWeight: 600 }}
                  // TODO: Connect to cart logic
                  onClick={() => {
                    // Placeholder: implement add to cart logic here
                    // e.g., call a mutation or context function
                    alert("Added to cart! (implement logic)");
                  }}
                >
                  Add to Cart
                </Button>
              )}
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
      {/* Saved Designs Gallery Modal */}
      <DesignsGallery
        open={openDesignsGallery}
        onClose={() => setOpenDesignsGallery(false)}
        productId={product.id.toString()}
        variantId={selectedVariant.id.toString()}
        onDesignSelect={(design) => handleDesignSelected(design.imageUrl)}
      />
      {/* Full-screen gallery modal */}
      <Dialog
        fullScreen
        open={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      >
        <IconButton
          onClick={() => setIsGalleryOpen(false)}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            color: "white",
          }}
        >
          <FiX size={32} />
        </IconButton>
        <DialogContent sx={{ bgcolor: "black", p: 0 }}>
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            initialSlide={galleryInitialIndex}
            style={{ height: "100vh" }}
          >
            {galleryImages.map((img, i) => (
              <SwiperSlide key={img.mockup_url + i}>
                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <motion.img
                    src={img.mockup_url}
                    alt={img.display_name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ maxWidth: "90%", maxHeight: "90%" }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ProductDesigner;
