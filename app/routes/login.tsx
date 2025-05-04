import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
  Link as MuiLink,
  CircularProgress,
  Paper,
  Fade,
} from "@mui/material";
import { useNavigate, Link } from "react-router";
import { FiLogIn, FiArrowRight } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  useLoginMutation,
  type LoginFormValues,
} from "~/features/auth/hooks/use_auth_mutations";
import { SocialSignIn } from "~/features/auth/components/social_signin";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth_redirects";
import type { Route } from "./+types/login";
import { APP_ROUTES, AUTH_ROUTES } from "~/constants/route_paths"; // Import route constants

// Add loader function that checks if user is already authenticated
export async function loader({ request }: Route.LoaderArgs) {
  // Redirect to home if already authenticated
  return await checkAuthAndRedirect(request, APP_ROUTES.HOME);
}

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useLoginMutation();

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
        navigate(APP_ROUTES.HOME);
      },
    });
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

            {/* Use the SocialSignIn component for OAuth functionality */}
            <SocialSignIn />

            {/* Links */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <MuiLink
                  component={Link}
                  to={AUTH_ROUTES.SIGNUP} // Use AUTH_ROUTES
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
