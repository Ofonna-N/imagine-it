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
} from "@mui/material";
import { useNavigate, Link, useLoaderData } from "react-router";
import { FiLogIn } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  useLoginMutation,
  type LoginFormValues,
} from "~/features/auth/hooks/useAuthMutations";
import { SocialSignIn } from "~/features/auth/components/SocialSignIn";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth-redirects";
import type { Route } from "./+types/layout";

// Add loader function that checks if user is already authenticated
export async function loader({ request }: Route.LoaderArgs) {
  // Redirect to home if already authenticated
  return await checkAuthAndRedirect(request, "/");
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
        // Successfully logged in, redirect to home
        navigate("/");
      },
    });
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <FiLogIn size={36} color="#fff" />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>

        {login.error && (
          <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
            {login.error.message || "Failed to sign in. Please try again."}
          </Alert>
        )}

        {/* Regular email/password login form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1, width: "100%" }}
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            disabled={login.isPending}
            startIcon={login.isPending ? <CircularProgress size={20} /> : null}
          >
            {login.isPending ? "Signing in..." : "Sign In"}
          </Button>
        </Box>

        {/* Add social sign-in options */}
        <SocialSignIn />

        {/* Links */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <MuiLink component={Link} to="/signup">
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
