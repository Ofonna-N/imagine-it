import { Button, Typography, Box, Divider } from "@mui/material";
import { FcGoogle } from "react-icons/fc";

export function SocialSignIn() {
  const handleGoogleSignIn = () => {
    // Implement Google sign-in functionality
    console.log("Google sign-in clicked");
  };

  return (
    <Box sx={{ width: "100%", mt: 3 }}>
      <Divider
        sx={{
          my: 2,
          position: "relative",
          "&::before": {
            content: '"or"',
            display: "inline-block",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "0 16px",
            bgcolor: "background.paper",
            color: "text.secondary",
            fontSize: "0.875rem",
          },
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 2 }}
      >
        Continue with social accounts
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<FcGoogle />}
        onClick={handleGoogleSignIn}
        sx={{
          py: 1.5,
          borderRadius: 2,
          borderColor: "divider",
          color: "text.primary",
          fontWeight: 600,
          "&:hover": {
            borderColor: "primary.main",
            bgcolor: "rgba(94, 106, 210, 0.04)",
          },
        }}
      >
        Continue with Google
      </Button>
    </Box>
  );
}
