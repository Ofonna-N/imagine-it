import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Paper,
  Alert,
  Link as MuiLink,
  CircularProgress,
  keyframes,
  Fade,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { FiUserPlus, FiArrowRight } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  signupSchema,
  useSignupMutation,
  type SignupFormValues,
} from "~/features/auth/hooks/use_auth_mutations";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth_redirects";
import { SocialSignIn } from "~/features/auth/components/social_signin";
import { useSnackbar } from "notistack";
import type { Route } from "./+types/layout";

// Add animation for visual feedback
const iconPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// Add loader function that checks if user is already authenticated
export async function loader({ request }: Route.LoaderArgs) {
  // Redirect to home if already authenticated
  return await checkAuthAndRedirect(request, "/");
}

export default function SignupPage() {
  const navigate = useNavigate();
  const signup = useSignupMutation();
  const { enqueueSnackbar } = useSnackbar();

  // Initialize react-hook-form with zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    const { email, password } = data;

    signup.mutate(
      { email, password },
      {
        onSuccess: () => {
          enqueueSnackbar(
            "Account created! Please check your email to confirm your account.",
            {
              variant: "success",
              autoHideDuration: 5000,
            }
          );

          // Redirect after a delay
          setTimeout(() => navigate("/"), 5000);
        },
      }
    );
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
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
                animation: !signup.isSuccess
                  ? `${iconPulse} 2s infinite`
                  : "none",
                boxShadow: "0 8px 16px rgba(94, 106, 210, 0.3)",
              }}
            >
              <FiUserPlus size={32} />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: "text.primary",
                textAlign: "center",
              }}
            >
              Join Imagine It
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 4, textAlign: "center" }}
            >
              Create an account to start designing your own custom products
            </Typography>

            {signup.isError && (
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {signup.error.message}
              </Alert>
            )}

            {signup.isSuccess && (
              <Alert
                severity="success"
                sx={{
                  width: "100%",
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-icon": {
                    animation: `${iconPulse} 2s infinite`,
                  },
                }}
              >
                Account created! Please check your email to confirm your
                account.
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
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
                disabled={signup.isPending || signup.isSuccess}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                sx={{
                  borderRadius: 2,
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
                autoComplete="new-password"
                disabled={signup.isPending || signup.isSuccess}
                {...register("password")}
                error={!!errors.password}
                helperText={
                  errors.password?.message ?? "Must be at least 6 characters"
                }
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
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                disabled={signup.isPending || signup.isSuccess}
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
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
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(94, 106, 210, 0.4)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(94, 106, 210, 0.6)",
                  },
                }}
                disabled={signup.isPending || signup.isSuccess}
                startIcon={
                  signup.isPending ? (
                    <CircularProgress size={20} />
                  ) : (
                    <FiArrowRight />
                  )
                }
              >
                {signup.isPending ? "Creating Account..." : "Create Account"}
              </Button>

              <SocialSignIn />

              <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <MuiLink
                    component={Link}
                    to="/login"
                    sx={{
                      fontWeight: 600,
                      "&:hover": {
                        textDecoration: "none",
                      },
                    }}
                  >
                    Log in
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Box>
    </Container>
  );
}
