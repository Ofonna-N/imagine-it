import { createTheme, type PaletteMode } from "@mui/material";

// Common typography settings
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
};

// Create a theme instance for each mode
export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Light mode palette
            primary: {
              main: "#3f51b5",
            },
            secondary: {
              main: "#f50057",
            },
            background: {
              default: "#f5f5f5",
              paper: "#ffffff",
            },
          }
        : {
            // Dark mode palette
            primary: {
              main: "#90caf9",
            },
            secondary: {
              main: "#f48fb1",
            },
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }),
    },
    typography,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 0.3s, color 0.3s",
          },
        },
      },
    },
  });
