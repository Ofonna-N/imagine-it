import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { FiEdit, FiTrash2, FiShoppingCart, FiEye } from "react-icons/fi";
import { Link } from "react-router";

// Mock designs data
const myDesigns = [
  {
    id: 1,
    name: "Mountain Landscape",
    created: "2023-10-15",
    image: "https://placehold.co/400x400/random/fff?text=Mountain+Design",
    used: true,
  },
  {
    id: 2,
    name: "Abstract Pattern",
    created: "2023-10-22",
    image: "https://placehold.co/400x400/random/fff?text=Abstract+Pattern",
    used: true,
  },
  {
    id: 3,
    name: "Space Explorer",
    created: "2023-11-05",
    image: "https://placehold.co/400x400/random/fff?text=Space+Explorer",
    used: false,
  },
  {
    id: 4,
    name: "Ocean Waves",
    created: "2023-11-12",
    image: "https://placehold.co/400x400/random/fff?text=Ocean+Waves",
    used: false,
  },
];

export default function MyDesigns() {
  const [selectedDesign, setSelectedDesign] = useState<
    null | (typeof myDesigns)[0]
  >(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (design: (typeof myDesigns)[0]) => {
    setSelectedDesign(design);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" component="h1">
          My Designs
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/design-playground"
          startIcon={<FiEdit />}
        >
          Create New Design
        </Button>
      </Box>

      {myDesigns.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" gutterBottom>
            You haven't created any designs yet
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/design-playground"
            startIcon={<FiEdit />}
            sx={{ mt: 2 }}
          >
            Create Your First Design
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {myDesigns.map((design) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={design.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={design.image}
                  alt={design.name}
                  onClick={() => handleOpenDialog(design)}
                  sx={{ cursor: "pointer" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {design.name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(design.created).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={design.used ? "Used in products" : "Unused"}
                      size="small"
                      color={design.used ? "success" : "default"}
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenDialog(design)}
                  >
                    <FiEye />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    component={Link}
                    to="/design-playground"
                  >
                    <FiEdit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <FiTrash2 />
                  </IconButton>
                  <Button
                    size="small"
                    color="primary"
                    component={Link}
                    to="/products"
                    startIcon={<FiShoppingCart />}
                    sx={{ ml: "auto" }}
                  >
                    Use Design
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
        {selectedDesign && (
          <>
            <DialogTitle>{selectedDesign.name}</DialogTitle>
            <DialogContent>
              <Box
                component="img"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "70vh",
                  objectFit: "contain",
                }}
                src={selectedDesign.image}
                alt={selectedDesign.name}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Created: {new Date(selectedDesign.created).toLocaleDateString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                component={Link}
                to="/design-playground"
                startIcon={<FiEdit />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/products"
                startIcon={<FiShoppingCart />}
                onClick={handleCloseDialog}
              >
                Use Design
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
