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
} from "@mui/material";
import { useNavigate } from "react-router";
import { Link } from "react-router";
import { FiLogIn } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginSchema,
  useLoginMutation,
  type LoginFormValues,
} from "~/features/auth/hooks/useAuthMutations";

export default function Login() {
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 2,
          }}
        >
          <FiLogIn size={36} color="#1976d2" style={{ marginBottom: 16 }} />

          <Typography component="h1" variant="h4" gutterBottom>
            Log in
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign in to access your designs and orders
          </Typography>

          {login.error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {login.error.message}
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
              startIcon={
                login.isPending ? <CircularProgress size={20} /> : null
              }
            >
              {login.isPending ? "Signing in..." : "Sign In"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Typography variant="body2">
                Don't have an account?{" "}
                <MuiLink component={Link} to="/signup">
                  Sign up
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
