import {
  Typography,
  Box,
  Alert,
  Skeleton,
  Grid,
  Button,
  Fade,
  keyframes,
  Paper,
  Container,
  Stack,
  Zoom,
  Divider,
} from "@mui/material";
import { ProductGrid } from "~/features/product/components/product_grid";
import { useQueryClient, useIsFetching } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa";
import {
  FiShoppingBag,
  FiStar,
  FiZap,
  FiDollarSign,
  FiTruck,
  FiShuffle,
  FiRefreshCw,
} from "react-icons/fi";
import { Link, useRevalidator, useLoaderData } from "react-router";
import { queryClient } from "~/context/query_provider";
import { motion, AnimatePresence } from "framer-motion";
import { APP_ROUTES, API_ROUTES } from "~/constants/route_paths"; // Import route constants

// Define the pulse animation using MUI's keyframes
const pulseAnimation = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// React Router client loader using the Query Client
export async function clientLoader() {
  // Use the query client to fetch and cache the data with 1-hour stale time
  const products = await queryClient.fetchQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const response = await fetch(API_ROUTES.FEATURED_PRODUCTS); // Use constant
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return { products };
}

export function HydrateFallback() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 6, textAlign: "center" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              animation: `${pulseAnimation} 1.5s infinite`,
              color: "primary.main",
              fontSize: "2rem",
            }}
          >
            <FaStar />
          </Box>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Discovering Lucky Products
          </Typography>
        </Box>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mb: 6, maxWidth: "700px", mx: "auto" }}
        >
          Hold tight while we curate a special selection just for you!
        </Typography>

        <Grid container spacing={4}>
          {Array.from(new Array(6)).map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Paper
                elevation={1}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={220}
                  animation="wave"
                />
                <Box sx={{ p: 2 }}>
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={32}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default function Home() {
  // Use loader data directly instead of props
  const { products } = useLoaderData<typeof clientLoader>();
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  // Use TanStack Query's useIsFetching to accurately track the loading state
  const isFetching = useIsFetching({ queryKey: ["featuredProducts"] }) > 0;

  // Function to manually refresh products
  const handleRefresh = async () => {
    // Invalidate and refetch
    await queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });

    // Force a fresh fetch from the server
    revalidator.revalidate();
  };

  return (
    <Box sx={{ mt: 6 }}>
      {/* Welcome and Creative Prompt Banner */}
      <Fade in={true} timeout={800}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            borderRadius: 4,
            mb: 8,
            background:
              "linear-gradient(135deg, rgba(94, 106, 210, 0.05) 0%, rgba(255, 138, 71, 0.05) 100%)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: "50%",
              bgcolor: "primary.light",
              opacity: 0.2,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              bgcolor: "secondary.light",
              opacity: 0.2,
            }}
          />

          <Typography
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 700,
              position: "relative",
              zIndex: 1,
              mb: 2,
            }}
          >
            Design & Purchase Custom Products
          </Typography>

          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 800,
              mb: 4,
              position: "relative",
              zIndex: 1,
            }}
          >
            Create unique designs with AI, apply them to high-quality products,
            and get them delivered to your door. From concept to creation to
            delivery - all in one place!
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ position: "relative", zIndex: 1 }}
          >
            <Button
              variant="contained"
              size="large"
              component={Link}
              to={APP_ROUTES.IMAGE_GENERATION}
              startIcon={<FiZap />}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                boxShadow: "0 6px 16px rgba(94, 106, 210, 0.4)",
              }}
            >
              Create & Buy Your Design
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to={APP_ROUTES.PRODUCTS}
              startIcon={<FiShoppingBag />}
              sx={{
                py: 1.5,
                px: 3,
                borderRadius: 2,
                fontSize: "1rem",
                fontWeight: 600,
                borderWidth: 2,
                "&:hover": {
                  borderWidth: 2,
                },
              }}
            >
              Shop Customizable Products
            </Button>
          </Stack>
        </Paper>
      </Fade>

      {/* Lucky Products Section */}
      <Box sx={{ mb: 8 }}>
        <Fade in={true} timeout={800}>
          <Box>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              align="center"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                mb: 2,
              }}
            >
              <Box
                component={motion.div}
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                }}
                sx={{
                  display: "flex",
                  mr: 2,
                  color: "secondary.main",
                }}
              >
                <FiStar size={28} />
              </Box>
              Popular Products to Customize
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="center"
              sx={{ mb: 4, maxWidth: 700, mx: "auto", color: "text.secondary" }}
            >
              Browse our most popular items that customers love to personalize.
              Each product is ready to be customized with your unique designs
              and delivered to your door.
            </Typography>

            <Box
              sx={{ display: "flex", justifyContent: "center", mb: 6, gap: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleRefresh}
                startIcon={
                  <Box
                    component={motion.div}
                    animate={
                      isFetching
                        ? {
                            rotate: 360,
                            transition: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                            },
                          }
                        : {}
                    }
                  >
                    <FiShuffle size={18} />
                  </Box>
                }
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                  borderWidth: 2,
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    borderWidth: 2,
                    "& svg": {
                      transform: "rotate(45deg)",
                      transition: "transform 0.3s ease",
                    },
                  },
                  "&::after": isFetching
                    ? {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: (theme) =>
                          `linear-gradient(90deg, transparent, ${theme.palette.action.hover}, transparent)`,
                        animation: `${keyframes`
                      0% {
                        transform: translateX(-100%);
                      }
                      100% {
                        transform: translateX(100%);
                      }
                    `} 1.5s infinite`,
                      }
                    : {},
                }}
                disabled={isFetching}
              >
                {isFetching ? "Shuffling Products..." : "Shuffle Products"}
              </Button>
              <Button
                variant="contained"
                component={Link}
                to={APP_ROUTES.PRODUCTS}
                startIcon={<FiShoppingBag />}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 2,
                }}
              >
                View All Products
              </Button>
            </Box>
          </Box>
        </Fade>

        {/* Show loading state when fetching */}
        {isFetching ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{ width: "100%" }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Box
                component={motion.div}
                animate={{
                  rotate: 360,
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
                sx={{
                  color: "primary.main",
                  fontSize: "2rem",
                  display: "flex",
                }}
              >
                <FiRefreshCw size={40} />
              </Box>
            </Box>

            <Typography
              variant="h6"
              align="center"
              color="primary"
              sx={{ mb: 4 }}
            >
              Shuffling products for you...
            </Typography>

            <Grid container spacing={4}>
              {Array.from(new Array(6)).map((_, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.5,
                      },
                    }}
                    sx={{ height: "100%" }}
                  >
                    <Paper
                      elevation={1}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        height: "100%",
                        position: "relative",
                        background: (theme) =>
                          `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
                      }}
                    >
                      <Box
                        sx={{
                          height: 220,
                          width: "100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          background: "rgba(94, 106, 210, 0.04)",
                        }}
                      >
                        <Box
                          component={motion.div}
                          animate={{
                            scale: [1, 1.05, 1],
                            opacity: [0.7, 1, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <FiShuffle size={40} color="#5E6AD2" opacity={0.5} />
                        </Box>
                      </Box>
                      <Box sx={{ p: 2 }}>
                        <Box
                          component={motion.div}
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2,
                          }}
                          sx={{
                            height: 24,
                            width: "70%",
                            mb: 1,
                            borderRadius: 1,
                            background: "rgba(94, 106, 210, 0.1)",
                          }}
                        />
                        <Box
                          component={motion.div}
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.2 + 0.2,
                          }}
                          sx={{
                            height: 16,
                            width: "40%",
                            borderRadius: 1,
                            background: "rgba(94, 106, 210, 0.1)",
                          }}
                        />
                      </Box>
                    </Paper>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : products && products.length > 0 ? (
          <AnimatePresence mode="wait">
            <Box
              component={motion.div}
              key="product-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ProductGrid catalogProducts={products} featured />
            </Box>
          </AnimatePresence>
        ) : (
          <Alert
            severity="info"
            sx={{
              borderRadius: 2,
              p: 3,
              boxShadow: "0 4px 12px rgba(100, 181, 246, 0.1)",
            }}
          >
            No lucky products found. Please try again later!
          </Alert>
        )}
      </Box>

      {/* How it works section - updated to emphasize purchasing */}
      <Zoom in={true} timeout={1000}>
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            From Imagination to Your Doorstep
          </Typography>

          <Typography
            variant="body1"
            component="p"
            align="center"
            sx={{ mb: 5, maxWidth: 700, mx: "auto", color: "text.secondary" }}
          >
            Our simple three-step process turns your creative ideas into real
            products you can hold, wear, and enjoy.
          </Typography>

          <Grid container spacing={4}>
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
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "primary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 6px 12px rgba(94, 106, 210, 0.3)",
                  }}
                >
                  <FiZap size={30} color="white" />
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Design Your Product
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Use our AI to generate custom designs or upload your own
                  artwork. Apply your design to the product of your choice.
                </Typography>
              </Paper>
            </Grid>

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
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "secondary.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 6px 12px rgba(255, 138, 71, 0.3)",
                  }}
                >
                  <FiDollarSign size={30} color="white" />
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Order & Purchase
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Add your custom product to cart, select your size and shipping
                  options, and complete your purchase securely.
                </Typography>
              </Paper>
            </Grid>

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
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    bgcolor: "success.main",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    boxShadow: "0 6px 12px rgba(76, 175, 80, 0.3)",
                  }}
                >
                  <FiTruck size={30} color="white" />
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Receive Your Creation
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  We'll produce your unique item with professional quality and
                  ship it directly to your doorstep. Wear and enjoy your custom
                  creation!
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Added testimonial/social proof */}
          <Box sx={{ mt: 5, textAlign: "center" }}>
            <Divider sx={{ maxWidth: "200px", mx: "auto", mb: 4 }} />
            <Typography
              variant="h6"
              component="p"
              sx={{
                fontStyle: "italic",
                maxWidth: "800px",
                mx: "auto",
                color: "text.secondary",
              }}
            >
              "I created an amazing t-shirt with my own AI-generated design. The
              quality is fantastic and shipping was fast. Can't wait to order
              more custom products!"
            </Typography>
            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
              — Sarah K., Happy Customer
            </Typography>
          </Box>
        </Box>
      </Zoom>
    </Box>
  );
}
