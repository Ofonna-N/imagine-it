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
import { Link, useNavigate } from "react-router";
import { FiUserPlus } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  signupSchema,
  useSignupMutation,
  type SignupFormValues,
} from "~/features/auth/hooks/useAuthMutations";

export default function SignUp() {
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const signup = useSignupMutation();

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
        onSuccess: (result) => {
          // Success message - with Supabase, users need to confirm their email
          setSuccess(
            "Account created! Please check your email to confirm your account."
          );

          // Optionally redirect after a delay
          setTimeout(() => {
            navigate("/");
          }, 5000);
        },
      }
    );
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
          <FiUserPlus size={36} color="#1976d2" style={{ marginBottom: 16 }} />

          <Typography component="h1" variant="h4" gutterBottom>
            Create an Account
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Join us to create and customize your own designs
          </Typography>

          {signup.error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {signup.error.message}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 3 }}>
              {success}
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
              disabled={signup.isPending || !!success}
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
              autoComplete="new-password"
              disabled={signup.isPending || !!success}
              {...register("password")}
              error={!!errors.password}
              helperText={
                errors.password?.message ?? "Must be at least 6 characters"
              }
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              disabled={signup.isPending || !!success}
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={signup.isPending || !!success}
              startIcon={
                signup.isPending ? <CircularProgress size={20} /> : null
              }
            >
              {signup.isPending ? "Creating Account..." : "Sign Up"}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <MuiLink component={Link} to="/login">
                  Log in
                </MuiLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
