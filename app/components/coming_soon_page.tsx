import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
} from "@mui/material";
import { FiClock, FiBell } from "react-icons/fi";

interface ComingSoonPageProps {
  featureName: string;
  description: string;
  estimatedLaunch?: string;
  onNotifyMe?: () => void;
}

export const ComingSoonPage: React.FC<ComingSoonPageProps> = ({
  featureName,
  description,
  estimatedLaunch,
  onNotifyMe,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, textAlign: "center" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <FiClock size={48} color="primary.main" />
          </Box>

          <Chip
            label="Coming Soon"
            color="primary"
            variant="outlined"
            sx={{ mb: 2 }}
          />

          <Typography variant="h4" gutterBottom>
            {featureName}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {description}
          </Typography>

          {estimatedLaunch && (
            <Typography variant="body2" sx={{ mb: 3 }}>
              Expected launch: <strong>{estimatedLaunch}</strong>
            </Typography>
          )}

          <Stack spacing={2} direction="row" justifyContent="center">
            <Button
              variant="contained"
              startIcon={<FiBell />}
              onClick={onNotifyMe}
            >
              Notify Me
            </Button>
            <Button variant="outlined" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};
