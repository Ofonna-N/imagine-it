import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  InputAdornment,
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
} from "@mui/material";
import {
  FiSearch,
  FiCheck,
  FiSave,
  FiZap,
  FiStar,
  FiImage,
} from "react-icons/fi";
import { useMutateSaveDesign } from "../hooks/use_mutate_save_design";
import type { ModelKey } from "~/services/image_generation/model_registry";
import type { GenerateImageInputPayload } from "~/services/image_generation/image_generation_types";

/**
 * Props for ImageGenerator component
 * @param onImageSelect Optional callback when an image is selected (for modal usage)
 * @param singleSelect If true, clicking an image selects it and calls onImageSelect
 */
interface ImageGeneratorProps {
  onImageSelect?: (url: string) => void;
  singleSelect?: boolean;
}

type ModelType = "basic" | "advanced";

/**
 * ImageGenerator component
 * Allows users to enter a prompt, generate images, and view/save results.
 */
const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  onImageSelect,
  singleSelect = false,
}) => {
  const [prompt, setPrompt] = useState("");
  const [orientation, setOrientation] = useState<
    "square" | "landscape" | "portrait"
  >("square");
  const [artStyle, setArtStyle] = useState<string>(""); // Default to no specific art style initially
  const artStyleOptions = [
    "minimalist",
    "abstract",
    "sketchy",
    "photography",
    "painting",
    "3d render",
    "cinematic",
    "graphic design pop art",
    "creative",
    "fashion",
    "graphic design",
    "moody",
    "bokeh",
    "pro b&w photography",
    "pro color photography",
    "pro film photography",
    "sketch black and white",
    "sketch color",
  ];

  const [selectedModel, setSelectedModel] = useState<ModelType>("advanced"); // ADDED: State for model selection
  const [isTransparent, setIsTransparent] = useState(false); // ADDED: State for transparency

  const queryClient = useQueryClient();

  const imageGenerationMutation = useMutateGenerateImage({
    onSuccess: (data: GenerateImageResponse) => {
      // Store data in the query cache under a specific key
      queryClient.setQueryData(["lastGeneratedImageData"], data);
      console.log("Image data stored in query cache:", data);
      // You might also want to trigger other actions here
    },
    // ... other mutation options
  });

  console.log("imageGenerationMutation", imageGenerationMutation);
  const {
    mutate: saveDesign,
    isPending: isSaving,
    isSuccess: isSaved,
    reset: resetSaveDesign,
    variables: saveDesignVariables,
    error: saveDesignError, // Using error property from the hook
  } = useMutateSaveDesign({
    onSuccess: () => {
      console.log("Design saved");
    },
    // onError callback removed, error is handled by saveDesignError
  });

  const handleModelChange = (
    event: React.MouseEvent<HTMLElement>,
    newModel: ModelType | null
  ) => {
    if (newModel !== null) {
      setSelectedModel(newModel);
      if (newModel === "basic") {
        setIsTransparent(false); // Reset transparency if basic model is selected
      }
    }
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    resetSaveDesign();
    let finalPrompt = prompt;
    if (artStyle) {
      finalPrompt = `${prompt}. art style must be (${artStyle})`;
    }

    const modelKey: ModelKey =
      selectedModel === "advanced" ? "gpt-image-1" : "prunaai-fast";
    const payload: GenerateImageInputPayload = {
      // Using 'any' for payload to dynamically add 'transparent'
      prompt: finalPrompt,
      orientation,
      model: modelKey,
    };

    if (selectedModel === "advanced") {
      payload.transparent = isTransparent;
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
  console.log("currentGeneratedImages", currentGeneratedImages);
  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, background: "transparent" }}
    >
      <Stack spacing={3}>
        {saveDesignError && (
          <Alert severity="error" onClose={() => resetSaveDesign()}>
            {saveDesignError instanceof Error
              ? saveDesignError.message
              : "Failed to save design"}
          </Alert>
        )}

        <Grid container spacing={2} alignItems="flex-start">
          {/* Left Column: Controls */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2.5}>
              <Typography
                variant="h6"
                component="div"
                sx={{ fontWeight: "medium" }}
              >
                Create Your Image
              </Typography>

              <FormControl fullWidth>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: "medium" }}
                >
                  Model
                </Typography>
                <ToggleButtonGroup
                  value={selectedModel}
                  exclusive
                  onChange={handleModelChange}
                  aria-label="Image generation model"
                  fullWidth
                >
                  <ToggleButton
                    value="basic"
                    aria-label="Basic model"
                    sx={{ flexGrow: 1 }}
                  >
                    <FiZap style={{ marginRight: 8 }} /> Basic
                  </ToggleButton>
                  <ToggleButton
                    value="advanced"
                    aria-label="Advanced model"
                    sx={{ flexGrow: 1 }}
                  >
                    <FiStar style={{ marginRight: 8 }} /> Advanced
                  </ToggleButton>
                </ToggleButtonGroup>
              </FormControl>

              {selectedModel === "advanced" && (
                <FormControlLabel
                  control={
                    <Switch
                      checked={isTransparent}
                      onChange={(e) => setIsTransparent(e.target.checked)}
                      disabled={imageGenerationMutation.isPending}
                    />
                  }
                  label="Transparent Background (PNG)"
                  sx={{ mt: -1 }} // Adjust margin if needed
                />
              )}

              <TextField
                fullWidth
                label="Your Prompt"
                placeholder="e.g. A sunset over mountains, vibrant colors"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={imageGenerationMutation.isPending}
                multiline
                rows={3}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        sx={{ alignItems: "flex-start", mt: 1.5 }}
                      >
                        <FiSearch />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormControl
                fullWidth
                disabled={imageGenerationMutation.isPending}
              >
                <InputLabel id="art-style-select-label">
                  Art Style (Optional)
                </InputLabel>
                <Select
                  labelId="art-style-select-label"
                  value={artStyle}
                  label="Art Style (Optional)"
                  onChange={(e) => setArtStyle(e.target.value)}
                >
                  <MenuItem value="">
                    <em>None (Default)</em>
                  </MenuItem>
                  {artStyleOptions.map((style) => (
                    <MenuItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                disabled={imageGenerationMutation.isPending}
              >
                <InputLabel id="orientation-select-label">
                  Orientation
                </InputLabel>
                <Select
                  labelId="orientation-select-label"
                  value={orientation}
                  label="Orientation"
                  onChange={(e) =>
                    setOrientation(
                      e.target.value as "square" | "landscape" | "portrait"
                    )
                  }
                >
                  <MenuItem value="square">Square (1:1)</MenuItem>
                  <MenuItem value="landscape">Landscape (16:9)</MenuItem>
                  <MenuItem value="portrait">Portrait (9:16)</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="large"
                onClick={handleGenerate}
                disabled={!prompt.trim() || imageGenerationMutation.isPending}
                startIcon={
                  imageGenerationMutation.isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FiZap />
                  )
                }
                fullWidth
                sx={{ py: 1.5 }}
              >
                Generate Image{imageGenerationMutation.isPending ? "s..." : "s"}
              </Button>
            </Stack>
          </Grid>

          {/* Right Column: Image Results */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ pl: { md: 2 } }}>
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
              ) : currentGeneratedImages &&
                currentGeneratedImages.length > 0 ? (
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
                          display: "flex", // Added for better image fit
                          flexDirection: "column", // Added
                          height: "100%", // Added
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
                            // aspectRatio: '1 / 1', // Maintain aspect ratio, adjust as needed
                            objectFit: "cover", // Ensure image covers the area
                            display: "block",
                            flexGrow: 1, // Added
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
                            {onImageSelect &&
                              !singleSelect && ( // Show check only if onImageSelect is provided and not singleSelect
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
                                isSaving
                                  ? "Saving..."
                                  : isSaved
                                  ? "Design Saved!"
                                  : "Save Design"
                              }
                            >
                              <span>
                                {" "}
                                {/* Span for disabled button tooltip */}
                                <IconButton
                                  disabled={
                                    isSaving ||
                                    (isSaved &&
                                      saveDesignVariables?.image_url === url)
                                  }
                                  onClick={() =>
                                    saveDesign({
                                      name: prompt || `AI Design ${idx + 1}`,
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
                                  {isSaving &&
                                  saveDesignVariables?.image_url === url ? (
                                    <CircularProgress
                                      size={24}
                                      color="inherit"
                                    />
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
                  {imageGenerationMutation.error && (
                    <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                      {imageGenerationMutation.error instanceof Error
                        ? imageGenerationMutation.error.message
                        : "Failed to generate images. Please try again."}
                    </Alert>
                  )}
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Paper>
  );
};

export default ImageGenerator;
