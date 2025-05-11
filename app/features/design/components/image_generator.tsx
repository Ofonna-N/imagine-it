import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm, Controller, type SubmitHandler } from "react-hook-form"; // Corrected SubmitHandler import
import { zodResolver } from "@hookform/resolvers/zod";
import {
  imageGenerationSchema,
  type ImageGenerationFormValues,
  artStyleOptions as artStyleValues,
  artStyleEnhancements,
  type ArtStyleUnion,
} from "../schemas/image_generation_schema";
import {
  useMutateGenerateImage,
  type GenerateImageResponse,
} from "~/features/design/hooks/use_mutate_generate_image";
import {
  Box,
  Button,
  TextField,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
  IconButton,
  ImageList,
  ImageListItem,
  Paper,
  Stack,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Switch,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Autocomplete,
} from "@mui/material";
import {
  FiCheck,
  FiSave,
  FiZap,
  FiStar,
  FiImage,
  FiChevronDown,
  FiSettings,
} from "react-icons/fi";
import { useMutateSaveDesign } from "../hooks/use_mutate_save_design";
import type { ModelKey } from "~/services/image_generation/model_registry";
import type { GenerateImageInputPayload } from "~/services/image_generation/image_generation_types";
import CreditsBalance from "~/features/user/components/credits_balance";
import PurchaseCreditsDialog from "~/features/user/components/purchase_credits_dialog";
import useQueryUserProfile from "~/features/user/hooks/use_query_user_profile";
import { createFilterOptions } from "@mui/material/Autocomplete";

/**
 * Props for ImageGenerator component
 * @param onImageSelect Optional callback when an image is selected (for modal usage)
 * @param singleSelect If true, clicking an image selects it and calls onImageSelect
 */
interface ImageGeneratorProps {
  onImageSelect?: (url: string) => void;
  singleSelect?: boolean;
}

// Transform the imported artStyleValues into the { value, label } format
const artStyleOptions: { value: ArtStyleUnion; label: string }[] =
  artStyleValues.map((style) => ({
    value: style,
    label:
      style === ""
        ? "None (Default)"
        : style
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
  }));

// Model credit costs (sync with backend)
const MODEL_CREDIT_COSTS: Record<string, number> = {
  "prunaai-fast": 2,
  "gpt-image-1": 13,
  "dall-e-3": 8,
  "new-model": 1,
};

// Memoize filterOptions for performance with large lists
const artStyleFilterOptions = createFilterOptions<{
  value: ArtStyleUnion;
  label: string;
}>({
  matchFrom: "any",
  stringify: (option) => `${option.label} ${option.value}`,
  // limit: 50, // Only show top 50 matches for performance
});

/**
 * ImageGenerator component
 * Allows users to enter a prompt, generate images, and view/save results.
 */
const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  onImageSelect,
  singleSelect = false,
}) => {
  const queryClient = useQueryClient();

  console.log("ImageGenerator component rendered");
  const {
    data: userProfileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchUserProfile,
  } = useQueryUserProfile();
  console.log("userProfileData", userProfileData);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ImageGenerationFormValues>({
    resolver: zodResolver(imageGenerationSchema),
    defaultValues: {
      prompt: "",
      selectedModel: "advanced",
      isTransparent: false,
      artStyle: [], // Now an array
      orientation: "square",
    },
  });

  const selectedModel = watch("selectedModel");

  const imageGenerationMutation = useMutateGenerateImage({
    onSuccess: (data: GenerateImageResponse) => {
      queryClient.setQueryData(["lastGeneratedImageData"], data);
      refetchUserProfile();
    },
  });

  const { mutate: saveDesign, ...saveDesignState } = useMutateSaveDesign({
    onSuccess: () => {
      console.log("Design saved");
    },
  });

  const [purchaseDialogOpen, setPurchaseDialogOpen] = React.useState(false);

  const onSubmit: SubmitHandler<ImageGenerationFormValues> = (data) => {
    saveDesignState.reset();
    let finalPrompt = data.prompt;
    if (data.artStyle && data.artStyle.length > 0) {
      const enhancements = data.artStyle
        .map((style) => artStyleEnhancements[style] || style)
        .join("; ");
      const styleList = data.artStyle.join(", ");
      finalPrompt = `${data.prompt}. Art style: ${styleList}. ${enhancements}`;
    }

    const modelKey: ModelKey =
      data.selectedModel === "advanced" ? "gpt-image-1" : "prunaai-fast";

    const payload: GenerateImageInputPayload = {
      prompt: finalPrompt,
      orientation: data.orientation,
      model: modelKey,
    };

    if (data.selectedModel === "advanced") {
      // isTransparent is optional in the schema, provide a default if undefined
      payload.transparent = data.isTransparent ?? false;
    }

    imageGenerationMutation.mutate(payload);
  };

  const handleSelect = (url: string) => {
    if (onImageSelect) {
      onImageSelect(url);
    }
  };

  const currentGeneratedImages =
    queryClient.getQueryData<GenerateImageResponse>([
      "lastGeneratedImageData",
    ])?.images;

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, background: "transparent" }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {saveDesignState.error && (
            <Alert severity="error" onClose={() => saveDesignState.reset()}>
              {saveDesignState.error instanceof Error
                ? saveDesignState.error.message
                : "Failed to save design"}
            </Alert>
          )}

          <Grid container spacing={3} alignItems="flex-start">
            {/* Left Column: Prompt Input (Emphasized) & Main Action */}
            <Grid size={{ xs: 12, md: 7 }}>
              {" "}
              {/* Corrected Grid usage for MUI v7 */}
              <Stack spacing={2.5}>
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Describe Your Vision
                </Typography>
                <Controller
                  name="prompt"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Your Prompt"
                      placeholder="e.g. A cosmic owl librarian in a vibrant, neon-lit jungle, detailed illustration"
                      disabled={
                        isSubmitting || imageGenerationMutation.isPending
                      }
                      multiline
                      rows={6} // Increased rows for emphasis
                      error={!!errors.prompt}
                      helperText={errors.prompt?.message}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          fontSize: "1.1rem", // Larger font for prompt
                          "& fieldset": {
                            borderWidth: "2px", // Thicker border
                            borderColor: errors.prompt
                              ? "error.main"
                              : "primary.light",
                          },
                          "&:hover fieldset": {
                            borderColor: "primary.main",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "primary.main",
                          },
                        },
                      }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={
                    isSubmitting ||
                    imageGenerationMutation.isPending ||
                    !userProfileData?.credits
                  }
                  startIcon={
                    isSubmitting || imageGenerationMutation.isPending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <FiZap />
                    )
                  }
                  fullWidth
                  sx={{ py: 1.5, fontSize: "1.1rem", mt: 1 }} // Emphasized button
                >
                  Generate Image
                  {(isSubmitting || imageGenerationMutation.isPending) &&
                    "s..."}
                  {(!userProfileData?.credits ||
                    userProfileData.credits < 2) && (
                    <Typography variant="caption" sx={{ ml: 2 }}>
                      (Insufficient credits)
                    </Typography>
                  )}
                </Button>
              </Stack>
            </Grid>

            {/* Right Column: Advanced Settings & Controls */}
            <Grid size={{ xs: 12, md: 5 }}>
              {" "}
              {/* Corrected Grid usage for MUI v7 */}
              <Accordion
                defaultExpanded={true} // Start expanded by default
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  boxShadow: "none",
                  "&:before": { display: "none" }, // Remove default top border
                }}
              >
                <AccordionSummary
                  expandIcon={<FiChevronDown />}
                  aria-controls="advanced-settings-content"
                  id="advanced-settings-header"
                  sx={{
                    minHeight: 48,
                    "&.Mui-expanded": { minHeight: 48 },
                    "& .MuiAccordionSummary-content": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                >
                  <FiSettings />
                  <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                    Customization Options
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={2.5}>
                    <FormControl fullWidth error={!!errors.selectedModel}>
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        sx={{ fontWeight: "medium" }}
                      >
                        Model
                      </Typography>
                      <Controller
                        name="selectedModel"
                        control={control}
                        render={({ field }) => (
                          <Box sx={{ width: "100%" }}>
                            <ToggleButtonGroup
                              {...field}
                              exclusive
                              onChange={(event, newValue) => {
                                if (newValue !== null) {
                                  field.onChange(newValue);
                                  if (newValue === "basic") {
                                    setValue("isTransparent", false);
                                  }
                                }
                              }}
                              aria-label="Image generation model"
                              fullWidth
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                width: "100%",
                              }}
                              disabled={
                                isSubmitting ||
                                imageGenerationMutation.isPending
                              }
                            >
                              <ToggleButton
                                value="basic"
                                aria-label="Basic model"
                                sx={{
                                  flex: "1 1 0",
                                  minWidth: 0,
                                  justifyContent: "center",
                                  p: 1.5,
                                }}
                              >
                                <Stack
                                  direction="column"
                                  alignItems="center"
                                  spacing={0.5}
                                  width="100%"
                                >
                                  <FiZap size={22} />
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Basic
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {MODEL_CREDIT_COSTS["prunaai-fast"]} credits
                                  </Typography>
                                </Stack>
                              </ToggleButton>
                              <ToggleButton
                                value="advanced"
                                aria-label="Advanced model"
                                sx={{
                                  flex: "1 1 0",
                                  minWidth: 0,
                                  justifyContent: "center",
                                  p: 1.5,
                                }}
                              >
                                <Stack
                                  direction="column"
                                  alignItems="center"
                                  spacing={0.5}
                                  width="100%"
                                >
                                  <FiStar size={22} />
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    Advanced
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {MODEL_CREDIT_COSTS["gpt-image-1"]} credits
                                  </Typography>
                                </Stack>
                              </ToggleButton>
                            </ToggleButtonGroup>
                          </Box>
                        )}
                      />
                      {errors.selectedModel && (
                        <Typography
                          color="error"
                          variant="caption"
                          sx={{ mt: 0.5 }}
                        >
                          {errors.selectedModel.message}
                        </Typography>
                      )}
                    </FormControl>

                    {/* Show credits and buy button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <CreditsBalance
                        credits={userProfileData?.credits}
                        isLoading={isProfileLoading}
                        error={profileError}
                      />
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPurchaseDialogOpen(true)}
                      >
                        Buy Credits
                      </Button>
                    </Box>
                    <PurchaseCreditsDialog
                      open={purchaseDialogOpen}
                      onClose={() => setPurchaseDialogOpen(false)}
                      onPurchaseSuccess={() => {
                        queryClient.invalidateQueries({
                          queryKey: ["userProfile"],
                        });
                        refetchUserProfile();
                      }}
                    />

                    {selectedModel === "advanced" && (
                      <Controller
                        name="isTransparent"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                {...field}
                                checked={field.value ?? false} // Ensure checked is always boolean
                                disabled={
                                  isSubmitting ||
                                  imageGenerationMutation.isPending
                                }
                              />
                            }
                            label="Transparent Background (PNG)"
                          />
                        )}
                      />
                    )}

                    <Controller
                      name="artStyle"
                      control={control}
                      render={({ field }) => (
                        <Autocomplete
                          multiple
                          options={artStyleOptions}
                          getOptionLabel={(option: {
                            value: ArtStyleUnion;
                            label: string;
                          }) => option.label}
                          value={
                            Array.isArray(field.value)
                              ? artStyleOptions.filter((o) =>
                                  (field.value ?? []).includes(o.value)
                                )
                              : []
                          }
                          onChange={(
                            _,
                            newValue: {
                              value: ArtStyleUnion;
                              label: string;
                            }[] = []
                          ) => field.onChange(newValue.map((v) => v.value))}
                          isOptionEqualToValue={(
                            option: { value: ArtStyleUnion },
                            val: { value: ArtStyleUnion }
                          ) => option.value === val.value}
                          disabled={
                            isSubmitting || imageGenerationMutation.isPending
                          }
                          filterOptions={artStyleFilterOptions}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Art Style (Optional)"
                              error={!!errors.artStyle}
                              helperText={errors.artStyle?.message}
                            />
                          )}
                          renderOption={(
                            props: React.HTMLAttributes<HTMLLIElement>,
                            option: { value: ArtStyleUnion; label: string },
                            state: { selected: boolean }
                          ) => (
                            <li
                              {...props}
                              key={option.value}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              {state.selected && (
                                <FiCheck
                                  style={{ marginRight: 8, color: "#1976d2" }}
                                />
                              )}
                              {option.label}
                            </li>
                          )}
                          clearOnEscape
                          fullWidth
                        />
                      )}
                    />

                    <Controller
                      name="orientation"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          disabled={
                            isSubmitting || imageGenerationMutation.isPending
                          }
                          error={!!errors.orientation}
                        >
                          <InputLabel id="orientation-select-label">
                            Orientation
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="orientation-select-label"
                            label="Orientation"
                          >
                            <MenuItem value="square">Square (1:1)</MenuItem>
                            <MenuItem value="landscape">
                              Landscape (16:9)
                            </MenuItem>
                            <MenuItem value="portrait">
                              Portrait (9:16)
                            </MenuItem>
                          </Select>
                          {errors.orientation && (
                            <Typography
                              color="error"
                              variant="caption"
                              sx={{ mt: 0.5 }}
                            >
                              {errors.orientation.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </Grid>
          </Grid>

          {/* Image Results Section - Remains largely the same, but uses mutation state */}
          <Box sx={{ mt: 4 }}>
            {" "}
            {/* Added margin top for separation */}
            {imageGenerationMutation.isPending ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  minHeight: 300,
                }}
              >
                <CircularProgress />
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mt: 2 }}
                >
                  Generating your masterpiece...
                </Typography>
              </Box>
            ) : currentGeneratedImages && currentGeneratedImages.length > 0 ? (
              <ImageList
                variant="masonry"
                cols={
                  singleSelect ? 1 : currentGeneratedImages.length > 1 ? 2 : 1
                }
                gap={12}
                sx={{ m: 0, overflow: "hidden" }}
              >
                {currentGeneratedImages.map((url, idx) => (
                  <ImageListItem
                    key={url + idx}
                    sx={{
                      borderRadius: 1.5,
                      overflow: "hidden",
                      boxShadow: 3,
                    }}
                  >
                    <Card
                      sx={{
                        position: "relative",
                        cursor: onImageSelect ? "pointer" : "default",
                        "&:hover .overlay": { opacity: 1 },
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                      onClick={
                        singleSelect ? () => handleSelect(url) : undefined
                      }
                      elevation={0}
                    >
                      <CardMedia
                        component="img"
                        image={url}
                        alt={`AI Image ${idx + 1}`}
                        sx={{
                          width: "100%",
                          objectFit: "cover",
                          display: "block",
                          flexGrow: 1,
                        }}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: "absolute",
                          inset: 0,
                          bgcolor: "rgba(0,0,0,0.5)",
                          opacity: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "opacity 0.3s",
                        }}
                      >
                        <Stack direction="row" spacing={1}>
                          {onImageSelect && !singleSelect && (
                            <Tooltip title="Select Image">
                              <IconButton
                                onClick={() => handleSelect(url)}
                                sx={{
                                  color: "common.white",
                                  "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.1)",
                                  },
                                }}
                              >
                                <FiCheck />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip
                            title={
                              saveDesignState.isPending
                                ? "Saving..."
                                : saveDesignState.isSuccess
                                ? "Design Saved!"
                                : "Save Design"
                            }
                          >
                            <span>
                              <IconButton
                                disabled={
                                  saveDesignState.isPending ||
                                  (saveDesignState.isSuccess &&
                                    saveDesignState.variables?.image_url ===
                                      url)
                                }
                                onClick={() =>
                                  saveDesign({
                                    name:
                                      watch("prompt") || `AI Design ${idx + 1}`,
                                    image_url: url,
                                  })
                                }
                                sx={{
                                  color: "common.white",
                                  "&:hover": {
                                    bgcolor: "rgba(255,255,255,0.1)",
                                  },
                                }}
                              >
                                {saveDesignState.isPending &&
                                saveDesignState.variables?.image_url === url ? (
                                  <CircularProgress size={24} color="inherit" />
                                ) : (
                                  <FiSave />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </Stack>
                      </Box>
                    </Card>
                  </ImageListItem>
                ))}
              </ImageList>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                  border: "1px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  minHeight: 300,
                  textAlign: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  <FiImage
                    size={64}
                    style={{ marginBottom: 16, opacity: 0.5 }}
                  />
                  <Typography variant="body1">
                    Your generated images will appear here.
                  </Typography>
                  <Typography variant="caption">
                    Enter a prompt and click "Generate Images".
                  </Typography>
                </Box>
                {imageGenerationMutation.error &&
                  /Insufficient credits/i.test(
                    imageGenerationMutation.error.message
                  ) && (
                    <Alert severity="warning" sx={{ mt: 2 }}>
                      {imageGenerationMutation.error.message}
                      <Button
                        size="small"
                        sx={{ ml: 2 }}
                        onClick={() => setPurchaseDialogOpen(true)}
                      >
                        Buy Credits
                      </Button>
                    </Alert>
                  )}
                {imageGenerationMutation.error &&
                  !/Insufficient credits/i.test(
                    imageGenerationMutation.error.message
                  ) && (
                    <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                      {imageGenerationMutation.error instanceof Error
                        ? imageGenerationMutation.error.message
                        : "Failed to generate images. Please try again."}
                    </Alert>
                  )}
              </Box>
            )}
          </Box>
        </Stack>
      </form>
    </Paper>
  );
};

export default ImageGenerator;
