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
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { FiEdit, FiTrash2, FiShoppingCart, FiEye } from "react-icons/fi";
import { Link } from "react-router";
import { APP_ROUTES } from "~/constants/route_paths";
import {
  useQueryUserDesigns,
  type UserDesign,
} from "~/features/design/hooks/use_query_user_designs";
import { useMutateDeleteDesign } from "~/features/design/hooks/use_mutate_delete_design";
import { useQueryClient } from "@tanstack/react-query";

export default function MyDesigns() {
  const { data: myDesigns = [], isLoading, isError } = useQueryUserDesigns();
  const [selectedDesign, setSelectedDesign] = useState<null | UserDesign>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const queryClient = useQueryClient();
  const deleteMutation = useMutateDeleteDesign({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs", "user"] });
    },
    onError: () => {
      // Optionally, add error handling like a toast notification here
    },
  });

  const handleOpenDialog = (design: UserDesign) => {
    setSelectedDesign(design);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDelete = (design: UserDesign) => {
    deleteMutation.mutate({ designId: design.id, imageUrl: design.imageUrl });
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
                  ...(deleteMutation.isPending &&
                    deleteMutation.variables?.designId === design.id && {
                    opacity: 0.5,
                    pointerEvents: "none",
                  }),
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
                  <Tooltip title={design.name} placement="top" arrow>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal",
                        minHeight: "3em",
                        cursor: "pointer",
                      }}
                    >
                      {design.name}
                    </Typography>
                  </Tooltip>
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
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(design)}
                    disabled={
                      deleteMutation.isPending &&
                      deleteMutation.variables?.designId === design.id
                    }
                  >
                    {deleteMutation.isPending &&
                    deleteMutation.variables?.designId === design.id ? (
                      <CircularProgress size={18} />
                    ) : (
                      <FiTrash2 />
                    )}
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
