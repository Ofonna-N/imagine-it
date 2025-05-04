import React from "react";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { FiStar, FiLogIn, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router";
import { AUTH_ROUTES } from "~/constants/route_paths";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const handleLogin = () => navigate(AUTH_ROUTES.LOGIN);
  const handleSignup = () => navigate(AUTH_ROUTES.SIGNUP);

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid", borderColor: "divider" }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              p: 1.2,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <FiStar />
          </Box>
          Imagine It
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FiLogIn />}
          onClick={handleLogin}
          sx={{ mr: 2 }}
        >
          Log In
        </Button>
        <Button
          variant="contained"
          startIcon={<FiUserPlus />}
          onClick={handleSignup}
        >
          Sign Up
        </Button>
      </Toolbar>
    </AppBar>
  );
}
