import {
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
} from "@mui/material";
import { FiEdit, FiShoppingBag } from "react-icons/fi";
import { Link } from "react-router";

// Featured products data (subset of products from product_listing)
const featuredProducts = [
  {
    id: "1",
    name: "T-Shirt",
    price: 24.99,
    category: "clothing",
    image: "https://placehold.co/300x300/e66/fff?text=T-Shirt",
  },
  {
    id: "3",
    name: "Mug",
    price: 14.99,
    category: "accessories",
    image: "https://placehold.co/300x300/66e/fff?text=Mug",
  },
  {
    id: "2",
    name: "Hoodie",
    price: 39.99,
    category: "clothing",
    image: "https://placehold.co/300x300/6e6/fff?text=Hoodie",
  },
];

export default function Home() {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Imagine It
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          component="p"
          sx={{ mb: 2 }}
        >
          Custom merchandise designed with AI - bring your ideas to life
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/design-playground"
          startIcon={<FiEdit />}
          sx={{ mt: 2 }}
        >
          Start Designing
        </Button>
      </Box>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Create
            </Typography>
            <Typography component="p">
              Use our AI-powered design playground to create unique designs for
              your merchandise.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Customize
            </Typography>
            <Typography component="p">
              Apply your designs to a wide range of products - from t-shirts to
              mugs and more.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h5" component="h2" gutterBottom>
              Order
            </Typography>
            <Typography component="p">
              Get your custom merchandise delivered right to your doorstep with
              our fast shipping.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Featured Products Section */}
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Products
        </Typography>
        <Typography variant="body1" component="p" align="center" sx={{ mb: 4 }}>
          Browse our most popular items ready for your creative designs
        </Typography>

        <Grid container spacing={3}>
          {featuredProducts.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transform: "scale(1)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardActionArea component={Link} to={`/products/${product.id}`}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="h3">
                      {product.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body1" color="text.secondary">
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Chip
                        label={product.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="outlined"
            component={Link}
            to="/products"
            startIcon={<FiShoppingBag />}
            size="large"
          >
            View All Products
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
