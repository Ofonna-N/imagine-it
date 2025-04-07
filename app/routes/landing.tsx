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
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { FiArrowRight, FiLogIn, FiUserPlus } from "react-icons/fi";

export default function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Simple navbar for landing page */}
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

          {/* TODO: Insert Hero Visual (Image/Animation/Carousel) here */}
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
                {/* TODO: Insert Icon for Step 1 here (e.g., <ProductIcon />) */}
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
                {/* TODO: Insert Icon for Step 2 here (e.g., <AiIcon />) */}
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
                {/* TODO: Insert Icon for Step 3 here (e.g., <ShippingIcon />) */}
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

          {/* TODO: Setup SwiperJS Carousel here */}
          <Grid container spacing={3}>
            {/* Example Card 1 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    T-Shirt
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prompt: "Cosmic Owl Librarian"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Example Card 2 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    Mug
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prompt: "Underwater City at Sunset"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Example Card 3 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    Hoodie
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prompt: "Robot DJ in Neon Jungle"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Example Card 4 */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
                    Tote Bag
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Prompt: "Surreal Floating Islands with Waterfalls"
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Benefits Section */}
        <Box sx={{ py: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            textAlign="center"
            sx={{ mb: 6 }}
          >
            Why You'll Love It
          </Typography>

          <Grid container spacing={4}>
            {/* Benefit 1 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* TODO: Insert Benefit Icon 1 here */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "primary.light",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                />

                <Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    Truly Unique
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Generate one-of-a-kind designs that reflect your style. Each
                    creation is as unique as you are.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Benefit 2 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* TODO: Insert Benefit Icon 2 here */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "secondary.light",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                />

                <Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    Effortlessly Simple
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No design skills needed. Just describe what you want, and
                    our AI does the creative heavy lifting.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Benefit 3 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* TODO: Insert Benefit Icon 3 here */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "success.light",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                />

                <Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    Premium Quality
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    All our products are made with high-quality materials that
                    ensure your designs look vibrant and last long.
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            {/* Benefit 4 */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* TODO: Insert Benefit Icon 4 here */}
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: "warning.light",
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                />

                <Box>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    Perfect Gifts
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create personalized gifts that will impress your friends and
                    family with thoughtfulness and creativity.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
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
