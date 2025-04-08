import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Link as MuiLink,
  CircularProgress,
  Avatar,
  Paper,
  Fade,
  Divider,
} from "@mui/material";
import { useNavigate, Link } from "react-router";
import { FiLogIn, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  useLoginMutation,
  type LoginFormValues,
} from "~/features/auth/hooks/use_auth_mutations";
import { useOAuthMutation } from "~/features/auth/hooks/use_auth_mutations";
import { SocialSignIn } from "~/features/auth/components/social_signin";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth_redirects";
import { useSnackbar } from "notistack";
import type { Route } from "./+types/layout";

// Add loader function that checks if user is already authenticated
export async function loader({ request }: Route.LoaderArgs) {
  // Redirect to home if already authenticated
  return await checkAuthAndRedirect(request, "/");
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLoginMutation();
  const oauthMutation = useOAuthMutation();
  const { enqueueSnackbar } = useSnackbar();

  // Handle form submission
  const handleGoogleSignIn = () => {
    oauthMutation.mutate("google", {
      // Use the built-in callbacks for side effects
      onSuccess: (data) => {
        enqueueSnackbar("Redirecting to Google authentication...", {
          variant: "info",
          autoHideDuration: 3000,
        });
        // No need to manually redirect as Supabase handles this via the URL in data
      },
      onError: (error) => {
        enqueueSnackbar(error.message || "Failed to connect with Google", {
          variant: "error",
        });
      },
    });
  };

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  // Helper functions to determine button state based on mutation state
  const getGoogleButtonText = () => {
    if (oauthMutation.isPending) {
      return oauthMutation.data
        ? "Redirecting to Google..."
        : "Preparing authentication...";
    }
    if (oauthMutation.isError) return "Retry with Google";
    return "Continue with Google";
  };

  const getGoogleButtonIcon = () => {
    return oauthMutation.isPending ? (
      <CircularProgress size={20} color="inherit" />
    ) : (
      <FcGoogle />
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 8 }}>
        <Fade in={true} timeout={800}>
          <Paper
            elevation={2}
            sx={{
              p: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.07)",
            }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                width: 70,
                height: 70,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
                boxShadow: "0 8px 16px rgba(94, 106, 210, 0.3)",
              }}
            >
              <FiLogIn size={32} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              sx={{ fontWeight: 700, mb: 1 }}
            >
              Welcome Back
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Sign in to your account to continue creating
            </Typography>

            {login.error && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  mb: 3,
                  width: "100%",
                  borderRadius: 2,
                }}
              >
                {login.error.message || "Failed to sign in. Please try again."}
              </Alert>
            )}

            {/* Regular email/password login form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ width: "100%" }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                disabled={login.isPending}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 3px rgba(94, 106, 210, 0.2)",
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                disabled={login.isPending}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused": {
                      boxShadow: "0 0 0 3px rgba(94, 106, 210, 0.2)",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(94, 106, 210, 0.4)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(94, 106, 210, 0.6)",
                  },
                }}
                disabled={login.isPending}
                startIcon={
                  login.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    <FiArrowRight />
                  )
                }
              >
                {login.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Social login buttons with enhanced state feedback */}
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={getGoogleButtonIcon()}
              onClick={handleGoogleSignIn}
              disabled={oauthMutation.isPending}
              sx={{
                mb: 2,
                py: 1.5,
                color: "text.primary",
                borderColor: "divider",
                position: "relative",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "background.paper",
                },
                ...(oauthMutation.data && {
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.primary.main} 25%, transparent 25%, transparent 50%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.main} 75%, transparent 75%, transparent)`,
                  backgroundSize: "40px 40px",
                  animation: "progress-bar-stripes 2s linear infinite",
                }),
              }}
            >
              {getGoogleButtonText()}
            </Button>

            {/* Show specific error messages for OAuth */}
            {oauthMutation.isError && (
              <Alert
                severity="error"
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                }}
                action={
                  <Button
                    color="inherit"
                    size="small"
                    onClick={handleGoogleSignIn}
                  >
                    Retry
                  </Button>
                }
              >
                {oauthMutation.error.message ||
                  "Failed to connect with Google. Please try again."}
              </Alert>
            )}

            {/* Links */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <MuiLink
                  component={Link}
                  to="/signup"
                  sx={{
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "none",
                    },
                  }}
                >
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
}
