import React from "react";
import {
  useQueryUserDesigns,
  type UserDesign,
} from "../hooks/use_query_user_designs";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { FiCheck } from "react-icons/fi";
import { useNavigate } from "react-router";

interface DesignsGalleryProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  variantId: string;
}

export const DesignsGallery: React.FC<DesignsGalleryProps> = ({
  open,
  onClose,
  productId,
  variantId,
}) => {
  const navigate = useNavigate();
  const { data: designs = [], isLoading, isError } = useQueryUserDesigns();

  const handleSelect = (design: UserDesign) => {
    onClose();
    // Navigate to design playground with selected design
    navigate(
      `/design-playground?productId=${productId}&variantId=${variantId}&designId=${design.id}`
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Choose a Saved Design</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography color="error">Unable to load your designs.</Typography>
        ) : designs.length === 0 ? (
          <Typography>You have no saved designs.</Typography>
        ) : (
          <Grid container spacing={2}>
            {designs.map((design) => (
              <Grid key={design.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={design.image_url}
                    alt={design.name}
                  />
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<FiCheck />}
                      onClick={() => handleSelect(design)}
                    >
                      Select
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};
