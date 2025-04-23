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
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { FiEdit, FiTrash2, FiShoppingCart, FiEye } from "react-icons/fi";
import { Link } from "react-router";
import { APP_ROUTES } from "~/constants/route_paths";
import {
  useQueryUserDesigns,
  type UserDesign,
} from "~/features/design/hooks/use_query_user_designs";

export default function MyDesigns() {
  const { data: myDesigns = [], isLoading, isError } = useQueryUserDesigns();
  const [selectedDesign, setSelectedDesign] = useState<null | UserDesign>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (design: UserDesign) => {
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
          to={APP_ROUTES.IMAGE_GENERATION}
          startIcon={<FiEdit />}
        >
          Create New Design
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : isError ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography color="error">Failed to load designs.</Typography>
        </Box>
      ) : myDesigns.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" gutterBottom>
            You haven't created any designs yet
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to={APP_ROUTES.IMAGE_GENERATION}
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
                  image={design.imageUrl}
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
                      Created:{" "}
                      {design.createdAt
                        ? new Date(design.createdAt).toLocaleDateString()
                        : "Unknown"}
                    </Typography>
                    <Chip
                      label={design.productId ? "Used in products" : "Unused"}
                      size="small"
                      color={design.productId ? "success" : "default"}
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
                    to={APP_ROUTES.IMAGE_GENERATION}
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
                    to={APP_ROUTES.PRODUCTS}
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
                src={selectedDesign.imageUrl}
                alt={selectedDesign.name}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Created:{" "}
                {selectedDesign.createdAt
                  ? new Date(selectedDesign.createdAt).toLocaleDateString()
                  : "Unknown"}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button
                component={Link}
                to={APP_ROUTES.IMAGE_GENERATION}
                startIcon={<FiEdit />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                component={Link}
                to={APP_ROUTES.PRODUCTS}
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
