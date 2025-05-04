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
  Zoom,
  Fade,
  keyframes,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router";
import {
  FiArrowRight,
  FiLogIn,
  FiUserPlus,
  FiStar,
  FiPackage,
  FiTruck,
} from "react-icons/fi";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
// Import required Swiper modules
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import heroImg1 from "~/assets/hero-img-1.jpg";

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

          {/* Hero Swiper Slider */}
          <Fade in={true} style={{ transitionDelay: "500ms" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: "1000px", // Increased width for more presence
                height: { xs: "400px", md: "550px" }, // Increased height
                mb: 5,
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 15px 40px rgba(94, 106, 210, 0.3)",
              }}
            >
              <Swiper
                effect={"fade"}
                slidesPerView={1}
                spaceBetween={0}
                centeredSlides={true}
                loop={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                style={{ width: "100%", height: "100%" }}
              >
                {/* Slide 1: Using the actual image from assets */}
                <SwiperSlide>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      bgcolor: "background.paper",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={heroImg1}
                      alt="Hero Image 1"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 3,
                        bgcolor: "rgba(0,0,0,0.5)",
                        color: "white",
                        textAlign: "left",
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        Think It
                      </Typography>
                      <Typography variant="body1">
                        From imagination to reality
                      </Typography>
                    </Box>
                  </Box>
                </SwiperSlide>

                {/* Slide 2: Placeholder for AI Generation */}
                <SwiperSlide>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      bgcolor: theme.palette.primary.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ textAlign: "center", color: "white", p: 4 }}>
                      <Typography
                        variant="h3"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        Create It
                      </Typography>
                      <Typography variant="h5">
                        AI transforms your ideas into stunning designs
                      </Typography>
                      <Box
                        sx={{
                          width: "80%",
                          height: "280px",
                          bgcolor: "rgba(255,255,255,0.1)",
                          borderRadius: 2,
                          mt: 3,
                          mx: "auto",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="body1">
                          AI-Generated Design Preview
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </SwiperSlide>

                {/* Slide 3: Placeholder for Products */}
                <SwiperSlide>
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      bgcolor: theme.palette.secondary.dark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ textAlign: "center", color: "white", p: 4 }}>
                      <Typography
                        variant="h3"
                        sx={{ mb: 2, fontWeight: "bold" }}
                      >
                        Buy It
                      </Typography>
                      <Typography variant="h5">
                        Get your custom designs printed on premium products
                      </Typography>
                      <Grid
                        container
                        spacing={2}
                        sx={{ mt: 3, justifyContent: "center" }}
                      >
                        {["T-Shirt", "Mug", "Hoodie", "Tote"].map((item) => (
                          <Grid size={{ xs: 6, sm: 3 }} key={item}>
                            <Box
                              sx={{
                                height: 120,
                                bgcolor: "rgba(255,255,255,0.1)",
                                borderRadius: 2,
                                p: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Typography variant="body2">{item}</Typography>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  </Box>
                </SwiperSlide>
              </Swiper>
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
            {/* Step 1: Imagine */}
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
                <CardMedia
                  component="div" // Use div for placeholder background
                  sx={{
                    width: "100%",
                    height: 180, // Placeholder height
                    bgcolor: "primary.light", // Placeholder color
                    borderRadius: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "primary.contrastText",
                  }}
                >
                  [Step 1 Image: Brainstorm/Idea]
                </CardMedia>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, color: "primary.dark", fontWeight: 700 }}
                >
                  1. Imagine It
                </Typography>
                <Typography variant="body1">
                  Describe your unique idea using simple text prompts. Let your
                  imagination run wild!
                </Typography>
              </Paper>
            </Grid>

            {/* Step 2: Create */}
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
                <CardMedia
                  component="div"
                  sx={{
                    width: "100%",
                    height: 180,
                    bgcolor: "secondary.light", // Placeholder color
                    borderRadius: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "secondary.contrastText",
                  }}
                >
                  [Step 2 Image: AI Generation]
                </CardMedia>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, color: "secondary.dark", fontWeight: 700 }}
                >
                  2. Create with AI
                </Typography>
                <Typography variant="body1">
                  Our AI instantly generates stunning artwork based on your
                  description. Choose your favorite!
                </Typography>
              </Paper>
            </Grid>

            {/* Step 3: Receive */}
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
                <CardMedia
                  component="div"
                  sx={{
                    width: "100%",
                    height: 180,
                    bgcolor: "success.light", // Placeholder color
                    borderRadius: 2,
                    mb: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "success.contrastText",
                  }}
                >
                  [Step 3 Image: Product/Shipping]
                </CardMedia>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{ mb: 2, color: "success.dark", fontWeight: 700 }}
                >
                  3. Get Your Product
                </Typography>
                <Typography variant="body1">
                  Apply your design to a product and we'll print and ship it
                  directly to you.
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
                <CardMedia
                  component="div" // Use div for placeholder
                  sx={{
                    height: 200,
                    bgcolor: "grey.300", // Placeholder background
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  [T-Shirt Mockup Placeholder]
                </CardMedia>
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
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  [Mug Mockup Placeholder]
                </CardMedia>
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
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  [Hoodie Mockup Placeholder]
                </CardMedia>
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
                <CardMedia
                  component="div"
                  sx={{
                    height: 200,
                    bgcolor: "grey.300",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "text.secondary",
                  }}
                >
                  [Tote Bag Mockup Placeholder]
                </CardMedia>
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
