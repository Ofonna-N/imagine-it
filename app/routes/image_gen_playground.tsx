import { useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Card,
  CardMedia,
} from "@mui/material";
import { FiPlay, FiSave, FiShoppingCart } from "react-icons/fi";
import { Link } from "react-router";

export default function ImageGenPlayground() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setLoading(true);

    // Simulate image generation with a delay
    setTimeout(() => {
      // Generate placeholder images
      const newImages = [
        `https://placehold.co/512x512/random/fff?text=${encodeURIComponent(
          prompt.substring(0, 20)
        )}`,
        `https://placehold.co/512x512/random/fff?text=${encodeURIComponent(
          prompt.substring(0, 15)
        )}`,
        `https://placehold.co/512x512/random/fff?text=${encodeURIComponent(
          prompt.substring(0, 10)
        )}`,
      ];

      setGeneratedImages(newImages);
      setLoading(false);
    }, 2000);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Design Playground
      </Typography>
      <Typography variant="body1" paragraph>
        Create unique designs with AI to put on your custom merchandise
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generate Image
            </Typography>

            <TextField
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              sx={{ mb: 3 }}
            />

            <Typography gutterBottom>Art Style</Typography>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <Select defaultValue="realistic">
                <MenuItem value="realistic">Realistic</MenuItem>
                <MenuItem value="cartoon">Cartoon</MenuItem>
                <MenuItem value="watercolor">Watercolor</MenuItem>
                <MenuItem value="sketch">Sketch</MenuItem>
              </Select>
            </FormControl>

            <Typography gutterBottom>Complexity</Typography>
            <Slider defaultValue={50} valueLabelDisplay="auto" sx={{ mb: 3 }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={
                loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FiPlay />
                )
              }
              onClick={handleGenerate}
              disabled={!prompt.trim() || loading}
            >
              {loading ? "Generating..." : "Generate"}
            </Button>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Generated Designs
            </Typography>

            {generatedImages.length === 0 && !loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "300px",
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Your generated designs will appear here
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {loading ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                      height: "300px",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  generatedImages.map((image, index) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          height="200"
                          image={image}
                          alt={`Generated image ${index + 1}`}
                        />
                        <Box
                          sx={{
                            p: 1,
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Button size="small" startIcon={<FiSave />}>
                            Save
                          </Button>
                          <Button size="small" startIcon={<FiShoppingCart />}>
                            Use
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))
                )}
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
