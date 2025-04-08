import { useState } from "react";
import { Button, Divider, Typography, Box } from "@mui/material";
import { FcGoogle } from "react-icons/fc";
import { useOAuthMutation } from "../hooks/use_auth_mutations";
import type { OAuthProvider } from "../hooks/use_auth_mutations";

/**
 * Component that provides social sign-in options
 */
export function SocialSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const oauthMutation = useOAuthMutation();

  const handleSocialSignIn = async (provider: OAuthProvider) => {
    setIsLoading(true);
    try {
      const result = await oauthMutation.mutateAsync(provider);
      // Redirect to the OAuth provider's consent screen
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Social sign-in error:", error);
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 2, mb: 3 }}>
      <Divider sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          OR
        </Typography>
      </Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<FcGoogle />}
        onClick={() => handleSocialSignIn("google")}
        disabled={isLoading}
        sx={{
          borderColor: "rgba(0,0,0,0.23)",
          "&:hover": {
            borderColor: "rgba(0,0,0,0.87)",
          },
          color: "text.primary",
          textTransform: "none",
          py: 1,
        }}
      >
        Continue with Google
      </Button>
    </Box>
  );
}
