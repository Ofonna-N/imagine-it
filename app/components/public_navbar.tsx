import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";
import { FiStar, FiLogIn, FiUserPlus, FiSun, FiMoon } from "react-icons/fi";
import { useNavigate } from "react-router";
import { AUTH_ROUTES, APP_ROUTES } from "~/constants/route_paths";
import { useColorScheme } from "~/context/theme_provider";

export default function PublicNavbar() {
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();
  const handleLogin = () => navigate(AUTH_ROUTES.LOGIN);
  const handleSignup = () => navigate(AUTH_ROUTES.SIGNUP);
  const toggleColorMode = () => setMode(mode === "light" ? "dark" : "light");
  const handleLogoClick = () => navigate(APP_ROUTES.HOME);

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
          onClick={handleLogoClick}
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            transition: "color 0.2s",
            "&:hover": { color: "primary.main" },
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
          sx={{ mr: 2 }}
        >
          Sign Up
        </Button>
        <IconButton onClick={toggleColorMode} size="small" color="inherit">
          {mode === "light" ? <FiMoon /> : <FiSun />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
