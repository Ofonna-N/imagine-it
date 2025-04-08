import {
  Typography,
  Box,
  Alert,
  Skeleton,
  Grid,
  Button,
  Fade,
  keyframes,
} from "@mui/material";
import { ProductGrid } from "~/features/product/components/Product_grid";
import { useQueryClient } from "@tanstack/react-query";
import { FaStar, FaMagic } from "react-icons/fa";
import { FiShoppingBag } from "react-icons/fi";
import { Link, useRevalidator, useLoaderData } from "react-router";
import { queryClient } from "~/context/query_provider";

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

// React Router client loader using the Query Client
export async function clientLoader() {
  // Use the query client to fetch and cache the data with 1-hour stale time
  const products = await queryClient.fetchQuery({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      const response = await fetch("/api/products/featured");
      return response.json();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return { products };
}

export function HydrateFallback() {
  return (
    <Box sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        <FaStar
          style={{
            marginRight: "8px",
            animation: `${pulseAnimation} 1.5s infinite`,
          }}
        />
        Discovering Lucky Products
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Hold tight while we curate a special selection just for you!
      </Typography>

      <Grid container spacing={3}>
        {Array.from(new Array(6)).map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Box sx={{ width: "100%", my: 1 }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={200}
                sx={{ mb: 1 }}
              />
              <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1 }} />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default function Home() {
  // Use loader data directly instead of props
  const { products } = useLoaderData<typeof clientLoader>();
  const queryClient = useQueryClient();
  const revalidator = useRevalidator();

  // Function to manually refresh products
  const handleRefresh = async () => {
    // Invalidate and refetch
    await queryClient.invalidateQueries({ queryKey: ["featuredProducts"] });

    // Force a fresh fetch from the server
    revalidator.revalidate();
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Lucky Products Section */}
      <Box sx={{ mb: 4 }}>
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
              }}
            >
              <FaMagic
                style={{
                  marginRight: "8px",
                  color: "#1976d2", // primary color
                  animation: `${pulseAnimation} 2.5s infinite`,
                }}
              />
              Today's Lucky Finds
            </Typography>
            <Typography
              variant="body1"
              component="p"
              align="center"
              sx={{ mb: 2 }}
            >
              We've randomly selected these gems for your inspiration!
            </Typography>

            {/* Action buttons */}
            <Box
              sx={{ display: "flex", justifyContent: "center", mb: 4, gap: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleRefresh}
                startIcon={<FaStar />}
                sx={{
                  "&:hover svg": {
                    animation: `${pulseAnimation} 1s`,
                  },
                }}
              >
                Shuffle New Lucky Products
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/products"
                startIcon={<FiShoppingBag />}
              >
                View All Products
              </Button>
            </Box>
          </Box>
        </Fade>

        {products && products.length > 0 ? (
          <ProductGrid catalogProducts={products} featured />
        ) : (
          <Alert severity="info" sx={{ mb: 2 }}>
            No lucky products found. Please try again later!
          </Alert>
        )}
      </Box>
    </Box>
  );
}
