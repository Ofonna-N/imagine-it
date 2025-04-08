import React, { useEffect } from "react";
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
  Zoom,
  Fade,
  keyframes,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import {
  FiArrowRight,
  FiLogIn,
  FiUserPlus,
  FiStar,
  FiPackage,
  FiTruck,
} from "react-icons/fi";

// Define animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(94, 106, 210, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(94, 106, 210, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(94, 106, 210, 0); }
`;

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
      {/* Modern navbar for landing page */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component="span"
              sx={{
                display: "inline-flex",
                p: 1.2,
                bgcolor: "primary.main",
                color: "white",
                borderRadius: "12px",
              }}
            >
              <FiStar />
            </Box>
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
          <Zoom in={true} style={{ transitionDelay: "100ms" }}>
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                backgroundImage: "linear-gradient(90deg, #5E6AD2, #FF8A47)",
                backgroundClip: "text",
                color: "transparent",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Turn Your Ideas into Unique Products with AI
            </Typography>
          </Zoom>

          <Fade in={true} style={{ transitionDelay: "300ms" }}>
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
          </Fade>

          {/* Vibrant Hero Visual */}
          <Fade in={true} style={{ transitionDelay: "500ms" }}>
            <Box
              sx={{
                width: "100%",
                height: { xs: "250px", md: "350px" },
                bgcolor: "primary.light",
                mb: 5,
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 10px 30px rgba(94, 106, 210, 0.2)",
              }}
            >
              {/* Animated elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: "20%",
                  left: "10%",
                  width: "120px",
                  height: "120px",
                  bgcolor: "secondary.main",
                  borderRadius: "20px",
                  animation: `${floatAnimation} 4s ease-in-out infinite`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "32px",
                }}
              >
                <FiStar />
              </Box>

              <Box
                sx={{
                  position: "absolute",
                  bottom: "15%",
                  right: "15%",
                  width: "100px",
                  height: "100px",
                  bgcolor: "primary.dark",
                  borderRadius: "50%",
                  animation: `${floatAnimation} 5s ease-in-out infinite`,
                  animationDelay: "1s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "28px",
                }}
              >
                <FiPackage />
              </Box>

              <Typography variant="h3" color="white" fontWeight="bold">
                Create Something Amazing
              </Typography>
            </Box>
          </Fade>

          <Zoom in={true} style={{ transitionDelay: "700ms" }}>
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
                  animation: `${pulseAnimation} 2s infinite`,
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
          </Zoom>
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* How It Works Section */}
        <Box sx={{ py: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            textAlign="center"
            sx={{ mb: 6, fontWeight: 700 }}
          >
            Create in 3 Simple Steps
          </Typography>

          <Grid container spacing={4}>
            {/* Step 1 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 8px 16px rgba(94, 106, 210, 0.3)",
                  }}
                >
                  <FiPackage style={{ fontSize: "32px", color: "white" }} />
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, color: "primary.dark", fontWeight: 700 }}
                >
                  Choose Your Item
                </Typography>

                <Typography variant="body1">
                  Select from our range of high-quality products like t-shirts,
                  mugs, and more.
                </Typography>
              </Paper>
            </Grid>

            {/* Step 2 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "secondary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 8px 16px rgba(255, 138, 71, 0.3)",
                  }}
                >
                  <FiStar style={{ fontSize: "32px", color: "white" }} />
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, color: "secondary.dark", fontWeight: 700 }}
                >
                  Create Your Design
                </Typography>

                <Typography variant="body1">
                  Generate amazing AI artwork with a simple text prompt. See
                  results instantly!
                </Typography>
              </Paper>
            </Grid>

            {/* Step 3 */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  borderRadius: 4,
                  bgcolor: "background.paper",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 20px rgba(0, 0, 0, 0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: "success.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 8px 16px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <FiTruck style={{ fontSize: "32px", color: "white" }} />
                </Box>

                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, color: "success.dark", fontWeight: 700 }}
                >
                  Receive Your Creation
                </Typography>

                <Typography variant="body1">
                  We'll print and ship your custom item directly to you with
                  care and quality.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

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
                >
                  <FiStar style={{ fontSize: "24px", color: "white" }} />
                </Box>

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
                >
                  <FiPackage style={{ fontSize: "24px", color: "white" }} />
                </Box>

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
                >
                  <FiTruck style={{ fontSize: "24px", color: "white" }} />
                </Box>

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
                >
                  <FiStar style={{ fontSize: "24px", color: "white" }} />
                </Box>

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

        {/* Secondary CTA Section - updated styling */}
        <Box
          sx={{
            py: 8,
            px: 4,
            textAlign: "center",
            bgcolor: "background.paper",
            borderRadius: 4,
            mt: 6,
            mb: 6,
            boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
            backgroundImage:
              "linear-gradient(135deg, rgba(94, 106, 210, 0.05) 0%, rgba(255, 138, 71, 0.05) 100%)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h3"
            component="h2"
            sx={{ mb: 3, fontWeight: 700 }}
          >
            Ready to Create?
          </Typography>

          <Button
            variant="contained"
            size="large"
            onClick={handleSignup}
            startIcon={<FiArrowRight />}
            sx={{
              px: 5,
              py: 1.75,
              fontSize: "1.2rem",
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(94, 106, 210, 0.3)",
            }}
          >
            Get Started Now
          </Button>
        </Box>
      </Container>

      {/* Footer - modern, friendly styling */}
      <Box
        sx={{
          py: 4,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
          textAlign: "center",
        }}
      >
        <Container>
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "primary.main" }}
          >
            Imagine It
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Turn your creative ideas into high-quality custom products with our
            AI-powered design platform.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Imagine It. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
