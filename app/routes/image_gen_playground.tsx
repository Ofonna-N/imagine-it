import { useState, useEffect } from "react";
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
  Tooltip,
  Chip,
  Stack,
  keyframes,
  Fade,
  Zoom,
} from "@mui/material";
import { FiPlay, FiSave, FiShoppingCart, FiZap, FiImage } from "react-icons/fi";
import { Link } from "react-router";

// Define animations for a more engaging UI
const sparkleAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.3; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function ImageGenPlayground() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [style, setStyle] = useState("realistic");
  const [complexity, setComplexity] = useState(50);
  const [promptSuggestion, setPromptSuggestion] = useState("");

  // Example prompt suggestions
  const suggestions = [
    "Cosmic owl librarian with glasses",
    "Underwater city at sunset with floating lanterns",
    "Mountain landscape with rainbow waterfalls",
    "Robot DJ in neon jungle",
    "Steampunk dragon mechanical heart",
  ];

  useEffect(() => {
    // Set a random suggestion
    setPromptSuggestion(
      suggestions[Math.floor(Math.random() * suggestions.length)]
    );
  }, []);

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

  const handleSuggestionClick = () => {
    setPrompt(promptSuggestion);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Fade in={true} timeout={800}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              backgroundImage: "linear-gradient(90deg, #5E6AD2, #FF8A47)",
              backgroundClip: "text",
              color: "transparent",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Design Playground
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto" }}
          >
            Unleash your creativity! Describe what you imagine, and our AI will
            bring it to life on your products.
          </Typography>
        </Box>
      </Fade>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Zoom in={true} style={{ transitionDelay: "200ms" }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  mb: 3,
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    p: 1,
                    bgcolor: "primary.main",
                    color: "white",
                    borderRadius: "8px",
                  }}
                >
                  <FiZap />
                </Box>
                Create Your Image
              </Typography>

              <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                Describe your idea:
              </Typography>
              <TextField
                multiline
                rows={4}
                fullWidth
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`E.g., "${promptSuggestion}"`}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    fontSize: "1rem",
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 3px rgba(94, 106, 210, 0.2)",
                    },
                  },
                }}
              />

              <Button
                variant="text"
                onClick={handleSuggestionClick}
                sx={{ mb: 3 }}
              >
                Need inspiration? Try: "{promptSuggestion}"
              </Button>

              <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                Choose Art Style:
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <Select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as string)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="realistic">Realistic</MenuItem>
                  <MenuItem value="cartoon">Cartoon</MenuItem>
                  <MenuItem value="watercolor">Watercolor</MenuItem>
                  <MenuItem value="sketch">Sketch</MenuItem>
                  <MenuItem value="abstract">Abstract</MenuItem>
                  <MenuItem value="pixel">Pixel Art</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="body1" gutterBottom sx={{ fontWeight: 500 }}>
                Complexity:
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={complexity}
                  onChange={(_, newValue) => setComplexity(newValue as number)}
                  valueLabelDisplay="auto"
                  sx={{
                    mb: 4,
                    color: "secondary.main",
                    "& .MuiSlider-thumb": {
                      "&:hover, &.Mui-focusVisible": {
                        boxShadow: "0 0 0 8px rgba(255, 138, 71, 0.16)",
                      },
                    },
                  }}
                />
              </Box>

              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FiPlay />
                  )
                }
                onClick={handleGenerate}
                disabled={!prompt.trim() || loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  boxShadow: "0 4px 14px rgba(94, 106, 210, 0.4)",
                }}
              >
                {loading ? "Creating Magic..." : "Generate Image"}
              </Button>

              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 3,
                    animation: `${sparkleAnimation} 2s infinite`,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="primary.main"
                    sx={{ fontStyle: "italic" }}
                  >
                    Your creativity is being transformed...
                  </Typography>
                </Box>
              )}
            </Paper>
          </Zoom>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Zoom in={true} style={{ transitionDelay: "400ms" }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  display: "flex",
                  alignItems: "center",
                  fontWeight: 600,
                  mb: 3,
                  gap: 1,
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    p: 1,
                    bgcolor: "secondary.main",
                    color: "white",
                    borderRadius: "8px",
                  }}
                >
                  <FiImage />
                </Box>
                Your Creations
              </Typography>

              {generatedImages.length === 0 && !loading ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "300px",
                    bgcolor: (alpha) =>
                      alpha.palette.mode === "light"
                        ? "rgba(94, 106, 210, 0.05)"
                        : "rgba(94, 106, 210, 0.1)",
                    borderRadius: 3,
                    p: 4,
                    gap: 2,
                    animation: `${floatAnimation} 6s infinite ease-in-out`,
                  }}
                >
                  <Box
                    sx={{
                      fontSize: "60px",
                      color: "primary.light",
                      mb: 2,
                    }}
                  >
                    <FiZap />
                  </Box>
                  <Typography
                    variant="h6"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    Your magical creations will appear here
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: "center", maxWidth: "500px" }}
                  >
                    Type a description on the left, choose a style, and click
                    "Generate" to see AI create amazing images just for you!
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {loading ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        height: "300px",
                        gap: 3,
                      }}
                    >
                      <CircularProgress
                        size={60}
                        sx={{ color: "secondary.main" }}
                      />
                      <Typography variant="h6" color="secondary.main">
                        Creating your masterpiece...
                      </Typography>
                    </Box>
                  ) : (
                    generatedImages.map((image, index) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                        <Card
                          sx={{
                            borderRadius: 3,
                            overflow: "hidden",
                            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-8px)",
                              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.15)",
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="220"
                            image={image}
                            alt={`Generated image ${index + 1}`}
                          />
                          <Box
                            sx={{
                              p: 2,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Chip
                              label={`Design ${index + 1}`}
                              size="small"
                              color={index === 0 ? "primary" : "default"}
                            />

                            <Stack direction="row" spacing={1}>
                              <Tooltip title="Save to My Designs">
                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{ minWidth: "36px", p: 1 }}
                                >
                                  <FiSave size={18} />
                                </Button>
                              </Tooltip>
                              <Tooltip title="Use on Products">
                                <Button
                                  size="small"
                                  variant="contained"
                                  color="secondary"
                                  sx={{ minWidth: "36px", p: 1 }}
                                >
                                  <FiShoppingCart size={18} />
                                </Button>
                              </Tooltip>
                            </Stack>
                          </Box>
                        </Card>
                      </Grid>
                    ))
                  )}
                </Grid>
              )}
            </Paper>
          </Zoom>
        </Grid>
      </Grid>
    </Box>
  );
}
