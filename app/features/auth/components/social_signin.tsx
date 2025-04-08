import { Button, Typography, Box, Divider } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useOAuthMutation } from "../hooks/use_auth_mutations";
import { enqueueSnackbar } from "notistack";

export function SocialSignIn() {
  const oauthMutation = useOAuthMutation();

  const handleGoogleSignIn = () => {
    // Implement Google sign-in functionality
    oauthMutation.mutate("google", {
      // Use the built-in callbacks for side effects
      onSuccess: (data) => {
        enqueueSnackbar("Redirecting to Google authentication...", {
          variant: "info",
          autoHideDuration: 3000,
        });
        // No need to manually redirect as Supabase handles this via the URL in data
        if (data.url) {
          window.location.href = data.url;
        }
      },
      onError: (error) => {
        enqueueSnackbar(error.message || "Failed to connect with Google", {
          variant: "error",
        });
      },
    });
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
