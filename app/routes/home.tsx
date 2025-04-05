import { Typography, Box, Grid, Paper, Button } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router";

export default function Home() {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ mb: 6, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Imagine It
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
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
            <Typography paragraph>
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
            <Typography paragraph>
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
            <Typography paragraph>
              Get your custom merchandise delivered right to your doorstep with
              our fast shipping.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
