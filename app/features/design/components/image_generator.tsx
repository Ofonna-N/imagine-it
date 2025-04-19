import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CircularProgress,
  Typography,
} from "@mui/material";

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
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Handler for generating images (placeholder logic)
  const handleGenerate = async () => {
    setIsLoading(true);
    // TODO: Replace with actual API call to Replicate
    setTimeout(() => {
      setImages([
        "https://placehold.co/400x400/5e6ad2/fff?text=AI+Image+1",
        "https://placehold.co/400x400/ff8a47/fff?text=AI+Image+2",
      ]);
      setIsLoading(false);
    }, 1500);
  };

  // Handler for selecting an image
  const handleSelect = (url: string) => {
    if (onImageSelect) {
      onImageSelect(url);
    }
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid size={{ xs: 12, md: 8 }}>
          <TextField
            fullWidth
            label="Describe your image"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleGenerate}
            disabled={!prompt.trim() || isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : "Generate Image"}
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={2}>
          {images.map((url, idx) => (
            <Grid key={url} size={{ xs: 6, sm: 4, md: 3 }}>
              <Card
                sx={{ cursor: onImageSelect ? "pointer" : undefined }}
                onClick={singleSelect ? () => handleSelect(url) : undefined}
              >
                <CardMedia
                  component="img"
                  image={url}
                  alt={`AI Image ${idx + 1}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
        {!isLoading && images.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            No images generated yet.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ImageGenerator;
