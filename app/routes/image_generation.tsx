import React from "react";
import { Box, Typography } from "@mui/material";
import ImageGenerator from "../features/design/components/image_generator";

/**
 * Route: /image-generation
 * Dedicated page for AI image generation and gallery management.
 */
const ImageGenerationPage: React.FC = () => {
  return (
    <Box
      sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", margin: "auto" }}
    >
      <Box sx={{ textAlign: "center", mb: { xs: 3, md: 5 } }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold" }}
        >
          AI Image Generation Studio
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: "700px", margin: "auto" }}
        >
          Craft unique visuals with the power of AI. Choose your model, describe
          your vision, and watch it come to life.
        </Typography>
      </Box>
      <ImageGenerator singleSelect={false} />
    </Box>
  );
};

export default ImageGenerationPage;
