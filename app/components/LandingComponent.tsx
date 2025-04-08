import React from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Stack,
  useTheme,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router";
import {
  FiArrowRight,
  FiLogIn,
  FiUserPlus,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import { useColorScheme } from "~/context/theme_provider";

export function LandingComponent() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Add AppBar with theme toggle */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Imagine It
          </Typography>

          {/* Theme Toggle Button */}
          <Tooltip
            title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
          >
            <IconButton
              color="inherit"
              onClick={toggleColorMode}
              sx={{ mr: 2 }}
              aria-label="toggle theme"
            >
              {mode === "light" ? <FiMoon /> : <FiSun />}
            </IconButton>
          </Tooltip>

          <Button
            variant="outlined"
            startIcon={<FiLogIn />}
            onClick={handleLogin}
            sx={{ mr: 2 }}
          >
            Log In
          </Button>
          <Button
            variant="contained"
            startIcon={<FiUserPlus />}
            onClick={handleSignup}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 6, md: 10 },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Turn Your Ideas into Unique Products with AI
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mb: 4,
              px: 2,
            }}
          >
            Instantly generate stunning AI images and get them printed on
            high-quality mugs, apparel, and more. No design skills needed!
          </Typography>

          {/* Hero Visual */}
          <Box
            sx={{
              width: "100%",
              height: { xs: "200px", md: "300px" },
              bgcolor: "primary.light",
              mb: 4,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h6" color="white">
              Hero Visual Placeholder
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSignup}
              startIcon={<FiUserPlus />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={handleLogin}
              startIcon={<FiLogIn />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
              }}
            >
              Log In
            </Button>
          </Stack>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* How It Works Section */}
        <Box sx={{ py: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Create in 3 Simple Steps
          </Typography>

          <Grid container spacing={4}>
            {/* Step 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.light",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" color="white">
                    1
                  </Typography>
                </Box>

                <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                  Choose Your Item
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Select from our range of high-quality products.
                </Typography>
              </Paper>
            </Grid>

            {/* Step 2 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "secondary.light",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" color="white">
                    2
                  </Typography>
                </Box>

                <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                  Create Your Design
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Generate amazing AI artwork with a simple text prompt.
                </Typography>
              </Paper>
            </Grid>

            {/* Step 3 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "success.light",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h5" color="white">
                    3
                  </Typography>
                </Box>

                <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                  Receive Your Creation
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  We'll print and ship your custom item directly to you.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Product Showcase / Examples Section */}
        <Box sx={{ py: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            See What's Possible
          </Typography>

          <Grid container spacing={3}>
            {/* Example Cards */}
            {[
              {
                title: "T-Shirt",
                prompt: "Cosmic Owl Librarian",
              },
              {
                title: "Mug",
                prompt: "Underwater City at Sunset",
              },
              {
                title: "Hoodie",
                prompt: "Robot DJ in Neon Jungle",
              },
              {
                title: "Tote Bag",
                prompt: "Surreal Floating Islands with Waterfalls",
              },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 200,
                      bgcolor: "grey.300",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Image Placeholder
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prompt: "{item.prompt}"
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Secondary CTA Section */}
        <Box
          sx={{
            py: 8,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 4,
            mt: 6,
            border: "1px solid",
            borderColor: "divider",
            mb: 6,
          }}
        >
          <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
            Ready to Create?
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleSignup}
            startIcon={<FiArrowRight />}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: "1.1rem",
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          py: 3,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Imagine It. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
