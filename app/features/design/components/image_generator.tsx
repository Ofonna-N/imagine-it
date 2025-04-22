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

  // Mutation hook for generating images via API
  const {
    mutate: generateImages,
    isPending: isGenerating,
    isError,
    error: generateError,
  } = useMutateGenerateImage({
    onSuccess: (data) => {
      setImages(data.images);
    },
  });

  const { mutate: saveDesign, isPending: isSaving } = useMutateSaveDesign({
    onSuccess: () => {
      console.log("Design saved");
    },
    onError: (err) => {
      console.error("Error saving design:", err);
    },
  });

  // Handler to invoke the image generation mutation
  const handleGenerate = () => {
    generateImages({ prompt });
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
        {/* Upload from computer */}
        {!file ? (
          <Button variant="outlined" component="label">
            Upload Image
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
                  {onImageSelect && (
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
                        <IconButton
                          onClick={() => handleSelect(url)}
                          sx={{ color: "common.white" }}
                        >
                          <FiCheck />
                        </IconButton>
                        <Tooltip title={isSaving ? "Saving..." : "Save Design"}>
                          <span>
                            <IconButton
                              disabled={isSaving}
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
                  )}
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
