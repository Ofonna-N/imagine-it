import React, { useState } from "react";
import { useMutateGenerateImage } from "~/features/design/hooks/use_mutate_generate_image";
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
} from "@mui/material";
import { FiSearch, FiCheck, FiSave } from "react-icons/fi";
import { useMutateSaveDesign } from "../hooks/use_mutate_save_design";

/**
 * Props for ImageGenerator component
 * @param onImageSelect Optional callback when an image is selected (for modal usage)
 * @param singleSelect If true, clicking an image selects it and calls onImageSelect
 */
interface ImageGeneratorProps {
  onImageSelect?: (url: string) => void;
  singleSelect?: boolean;
}

/**
 * ImageGenerator component
 * Allows users to enter a prompt, generate images, and view/save results.
 * Intended for reuse in both the dedicated image generation page and product designer.
 */
const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  onImageSelect,
  singleSelect = false,
}) => {
  // State for prompt and generated images
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  // State for selected orientation
  const [orientation, setOrientation] = useState<
    "square" | "landscape" | "portrait"
  >("square");
  // State for selected art style
  const [artStyle, setArtStyle] = useState<string>("bokeh");
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

  const [saveError, setSaveError] = useState<string | null>(null);

  // Mutation hook for generating images via API
  const { mutate: generateImages, isPending: isGenerating } =
    useMutateGenerateImage({
      onSuccess: (data) => {
        setImages(data.images);
      },
    });

  const {
    mutate: saveDesign,
    isPending: isSaving,
    isSuccess: isSaved,
    reset: resetSaveDesign,
  } = useMutateSaveDesign({
    onSuccess: () => {
      setSaveError(null);
      console.log("Design saved");
    },
    onError: (err) => {
      console.error("Error saving design:", err);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save design"
      );
    },
  });

  // Handler to invoke the image generation mutation
  const handleGenerate = () => {
    if (!prompt.trim()) return;
    resetSaveDesign();
    let finalPrompt = prompt;
    if (artStyle) {
      finalPrompt = `${prompt}. art style must be (${artStyle})`;
    }
    generateImages({ prompt: finalPrompt, orientation });
  };

  // Handler for selecting an image
  const handleSelect = (url: string) => {
    if (onImageSelect) {
      onImageSelect(url);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
    }
  };

  const handleSaveFile = () => {
    if (file) {
      saveDesign({ name: file.name, file });
      setFile(null);
      setFilePreview("");
    }
  };

  React.useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Stack spacing={3}>
        {/* Error Alert for Save Design */}
        {saveError && (
          <Alert severity="error" onClose={() => setSaveError(null)}>
            {saveError}
          </Alert>
        )}

        {/* Upload from computer */}
        {!file ? (
          <Button variant="outlined" component="label">
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        ) : (
          <Box>
            <Typography variant="subtitle1">Preview uploaded image:</Typography>
            <Box
              component="img"
              src={filePreview}
              alt={file.name}
              sx={{ maxWidth: "100%", mt: 1, mb: 1 }}
            />
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                startIcon={<FiSave />}
                onClick={handleSaveFile}
                disabled={isSaving}
              >
                Save Uploaded Image
              </Button>
              <Button
                onClick={() => {
                  setFile(null);
                  setFilePreview("");
                }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        )}

        {/* Prompt Input */}
        <TextField
          fullWidth
          placeholder="e.g. A sunset over mountains"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isGenerating}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
            },
          }}
        />

        {/* Art Style Selector */}
        <FormControl fullWidth disabled={isGenerating} sx={{ mt: 1 }}>
          <InputLabel id="art-style-select-label">Art Style</InputLabel>
          <Select
            labelId="art-style-select-label"
            value={artStyle}
            label="Art Style"
            onChange={(e) => setArtStyle(e.target.value)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {artStyleOptions.map((style) => (
              <MenuItem key={style} value={style}>
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Orientation Selector */}
        <FormControl fullWidth disabled={isGenerating}>
          <InputLabel id="orientation-select-label">Orientation</InputLabel>
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
            <MenuItem value="square">Square</MenuItem>
            <MenuItem value="landscape">Landscape</MenuItem>
            <MenuItem value="portrait">Portrait</MenuItem>
          </Select>
        </FormControl>

        {/* Generate Button */}
        <Button
          variant="contained"
          size="large"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          startIcon={isGenerating ? <CircularProgress size={20} /> : null}
        >
          Generate
        </Button>

        {/* Images Grid */}
        {isGenerating ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : images.length > 0 ? (
          <ImageList variant="masonry" cols={3} gap={8} sx={{ m: 0 }}>
            {images.map((url, idx) => (
              <ImageListItem key={url}>
                <Card
                  sx={{
                    position: "relative",
                    cursor: onImageSelect ? "pointer" : "default",
                  }}
                  onClick={singleSelect ? () => handleSelect(url) : undefined}
                >
                  <CardMedia
                    component="img"
                    image={url}
                    alt={`AI Image ${idx + 1}`}
                    sx={{ width: "100%", display: "block" }}
                  />
                  {
                    <Box
                      className="overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: "rgba(0,0,0,0.4)",
                        opacity: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "opacity 0.3s",
                        "&:hover": { opacity: 1 },
                      }}
                    >
                      <Stack direction="row" spacing={1}>
                        {onImageSelect && (
                          <IconButton
                            onClick={() => handleSelect(url)}
                            sx={{ color: "common.white" }}
                          >
                            <FiCheck />
                          </IconButton>
                        )}
                        <Tooltip
                          title={
                            isSaving
                              ? "Saving..."
                              : isSaved
                              ? "Design Saved"
                              : "Save Design"
                          }
                        >
                          <span>
                            <IconButton
                              disabled={isSaving || isSaved}
                              loading={isSaving}
                              onClick={() =>
                                saveDesign({ name: prompt, image_url: url })
                              }
                              sx={{ color: "common.white" }}
                            >
                              <FiSave />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </Box>
                  }
                </Card>
              </ImageListItem>
            ))}
          </ImageList>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            Enter a prompt and click Generate to create images.
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};

export default ImageGenerator;
