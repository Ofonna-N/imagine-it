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
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import React, { useState } from "react";
import {
  FiEdit,
  FiTrash2,
  FiShoppingCart,
  FiEye,
  FiUploadCloud,
  FiSave,
  FiPlus,
} from "react-icons/fi";
import { Link } from "react-router";
import { APP_ROUTES } from "~/constants/route_paths";
import {
  useQueryUserDesigns,
  type UserDesign,
} from "~/features/design/hooks/use_query_user_designs";
import { useMutateDeleteDesign } from "~/features/design/hooks/use_mutate_delete_design";
import { useQueryClient } from "@tanstack/react-query";
import { useMutateSaveDesign } from "~/features/design/hooks/use_mutate_save_design";
import { useQueryUserFeatures } from "~/features/user/hooks/use_query_user_features";
import { ComingSoonPage } from "~/components/coming_soon_page";

export default function MyDesigns() {
  const { data: userFeatures } = useQueryUserFeatures();

  // If My Designs page is not enabled, show coming soon
  if (!userFeatures?.flags.enableMyDesignsPage) {
    return (
      <ComingSoonPage
        featureName="My Designs"
        description="Save and manage your custom designs in one place. This feature will be available soon!"
        estimatedLaunch="Coming in our next release"
        onNotifyMe={() => {
          // TODO: Implement notify me functionality
          console.log("User wants to be notified about My Designs feature");
        }}
      />
    );
  }

  const { data: myDesigns = [], isLoading, isError } = useQueryUserDesigns();
  const [selectedDesign, setSelectedDesign] = useState<null | UserDesign>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const queryClient = useQueryClient();

  // State for "Add Design" menu
  const [anchorElAddMenu, setAnchorElAddMenu] =
    React.useState<null | HTMLElement>(null);
  const openAddMenu = Boolean(anchorElAddMenu);

  // State for Upload Dialog
  const [openUploadDialog, setOpenUploadDialog] = useState(false);

  // State for file upload (will be used within Upload Dialog)
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");

  const deleteMutation = useMutateDeleteDesign({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["designs", "user"] });
    },
    onError: () => {
      // Optionally, add error handling like a toast notification here
    },
  });

  const {
    mutate: saveDesign,
    isPending: isSaving,
    isSuccess: isSaved,
    reset: resetSaveDesign,
    error: saveDesignError,
  } = useMutateSaveDesign({
    onSuccess: () => {
      setFile(null);
      setFilePreview("");
      queryClient.invalidateQueries({ queryKey: ["designs", "user"] });
      // Close dialog on success
      setOpenUploadDialog(false);
    },
    onError: (err) => {
      // Error will be displayed in the dialog
    },
  });

  const handleOpenViewDialog = (design: UserDesign) => {
    setSelectedDesign(design);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleDelete = (design: UserDesign) => {
    deleteMutation.mutate({ designId: design.id, imageUrl: design.imageUrl });
  };

  // "Add Design" Menu Handlers
  const handleOpenAddMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAddMenu(event.currentTarget);
  };
  const handleCloseAddMenu = () => {
    setAnchorElAddMenu(null);
  };

  // Upload Dialog Handlers
  const handleOpenUploadDialog = () => {
    setOpenUploadDialog(true);
    handleCloseAddMenu(); // Close the menu when dialog opens
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setFile(null); // Reset file states on close
    setFilePreview("");
    resetSaveDesign(); // Reset mutation state
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setFile(f);
      setFilePreview(URL.createObjectURL(f));
      resetSaveDesign(); // Reset save state if a new file is selected
    }
  };

  const handleSaveFile = () => {
    if (file) {
      saveDesign({ name: file.name, file });
    }
  };

  React.useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

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
          startIcon={<FiPlus />}
          onClick={handleOpenAddMenu}
        >
          Add Design
        </Button>
        <Menu
          anchorEl={anchorElAddMenu}
          open={openAddMenu}
          onClose={handleCloseAddMenu}
        >
          <MenuItem
            component={Link}
            to={APP_ROUTES.IMAGE_GENERATION}
            onClick={handleCloseAddMenu}
          >
            <FiEdit style={{ marginRight: 8 }} /> Create with AI
          </MenuItem>
          <MenuItem onClick={handleOpenUploadDialog}>
            <FiUploadCloud style={{ marginRight: 8 }} /> Upload Image
          </MenuItem>
        </Menu>
      </Box>

      {/* Upload Image Dialog */}
      <Dialog
        open={openUploadDialog}
        onClose={handleCloseUploadDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Upload Your Image</DialogTitle>
        <DialogContent>
          {saveDesignError && (
            <Alert
              severity="error"
              onClose={() => resetSaveDesign()}
              sx={{ mb: 2 }}
            >
              {saveDesignError instanceof Error
                ? saveDesignError.message
                : "Failed to save design"}
            </Alert>
          )}
          {isSaved && !isSaving && !saveDesignError && (
            <Alert
              severity="success"
              onClose={() => resetSaveDesign()}
              sx={{ mb: 2 }}
            >
              Design uploaded and saved successfully!
            </Alert>
          )}
          {!file ? (
            <Button
              variant="outlined"
              component="label"
              startIcon={<FiUploadCloud />}
              fullWidth
              sx={{ mt: 1 }}
            >
              <span>Choose Image</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleFileChange}
                key={filePreview || "file-input-dialog"}
              />
            </Button>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Preview:
              </Typography>
              <Box
                component="img"
                src={filePreview}
                alt={file.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: 300,
                  objectFit: "contain",
                  my: 2,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: "16px 24px" }}>
          <Button onClick={handleCloseUploadDialog} color="inherit">
            Cancel
          </Button>
          {file && (
            <Button
              variant="contained"
              startIcon={<FiSave />}
              onClick={handleSaveFile}
              disabled={isSaving || (isSaved && !saveDesignError)}
              sx={{ ml: 1 }}
            >
              {isSaving ? <CircularProgress size={24} /> : "Save Design"}
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* View Design Dialog (previously openDialog) */}
      <Dialog
        open={openViewDialog}
        onClose={handleCloseViewDialog}
        maxWidth="md"
      >
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
              <Button onClick={handleCloseViewDialog}>Close</Button>
              <Button
                component={Link}
                to={APP_ROUTES.IMAGE_GENERATION} // Consider passing design state for editing
                startIcon={<FiEdit />}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                component={Link}
                to={APP_ROUTES.PRODUCTS} // Consider passing design info
                startIcon={<FiShoppingCart />}
                onClick={handleCloseViewDialog}
              >
                Use Design
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Designs Grid */}
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
                  onClick={() => handleOpenViewDialog(design)}
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
                    onClick={() => handleOpenViewDialog(design)}
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
    </Box>
  );
}
