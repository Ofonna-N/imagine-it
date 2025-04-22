import React from "react";
import { Box, Typography, Grid, Paper } from "@mui/material";
import ImageGenerator from "../features/design/components/image_generator";

/**
 * Route: /image-generation
 * Dedicated page for AI image generation and gallery management.
 */
const ImageGenerationPage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Image Generation
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Enter a prompt to generate images with AI. Save your favorites for use
        in product designs.
      </Typography>
      <Paper sx={{ p: 3 }}>
        <ImageGenerator singleSelect={false} />
      </Paper>
    </Box>
  );
};

export default ImageGenerationPage;
