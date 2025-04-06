import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Container,
  Link as MuiLink,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { Link, useNavigate } from "react-router";
import { FiUserPlus } from "react-icons/fi";

export default function Signup() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Account details
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Personal details
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const steps = ["Account Details", "Personal Information", "Confirmation"];

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate first step
      if (!email || !password || !confirmPassword) {
        setError("Please fill in all required fields");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    } else if (activeStep === 1) {
      // Validate second step
      if (!firstName || !lastName) {
        setError("Please fill in all required fields");
        return;
      }
    }

    setError("");
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Here you would call your registration API
      // For now, let's simulate a signup with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to the main application home page inside the layout
      navigate("/home");
    } catch (err) {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create an Account
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Join Imagine It and start creating unique designs
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          {activeStep === 0 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

          {activeStep === 1 && (
            <>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}

          {activeStep === 2 && (
            <Box sx={{ my: 2 }}>
              <Typography variant="h6" gutterBottom>
                Review Your Information
              </Typography>
              <Typography>Email: {email}</Typography>
              <Typography>
                Name: {firstName} {lastName}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            {activeStep > 0 && (
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
              >
                Back
              </Button>
            )}

            {activeStep < steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ ml: activeStep === 0 ? "auto" : 0 }}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FiUserPlus />
                  )
                }
                disabled={loading}
                sx={{ ml: "auto" }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            )}
          </Box>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <MuiLink component={Link} to="/login" underline="hover">
                Log in
              </MuiLink>
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              <MuiLink component={Link} to="/" underline="hover">
                Back to landing page
              </MuiLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
