import { createTheme, type PaletteMode, alpha } from "@mui/material";

// Create a theme instance for each mode
export const getTheme = (mode: PaletteMode) => {
  // Define colors based on mode
  const primaryMain = mode === "light" ? "#7928CA" : "#B665FF";
  const primaryLight = mode === "light" ? "#9F5BD8" : "#D299FF";
  const primaryDark = mode === "light" ? "#5B1B99" : "#9347CF";

  const secondaryMain = mode === "light" ? "#FF0080" : "#FF3399";
  const secondaryLight = mode === "light" ? "#FF4DA0" : "#FF66B2";
  const secondaryDark = mode === "light" ? "#CC0066" : "#CC2976";

  // Create the theme
  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryMain,
        light: primaryLight,
        dark: primaryDark,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: secondaryMain,
        light: secondaryLight,
        dark: secondaryDark,
        contrastText: "#FFFFFF",
      },
      success: {
        main: mode === "light" ? "#0CCE6B" : "#00E676",
        light: mode === "light" ? "#4FDC94" : "#66FFAD",
        dark: mode === "light" ? "#09A354" : "#00B257",
      },
      error: {
        main: mode === "light" ? "#FF4D4D" : "#FF5252",
        light: mode === "light" ? "#FF7C7C" : "#FF8080",
        dark: mode === "light" ? "#E43535" : "#CC4141",
      },
      warning: {
        main: mode === "light" ? "#FF9900" : "#FFAB00",
        light: mode === "light" ? "#FFB84D" : "#FFC24D",
        dark: mode === "light" ? "#CC7A00" : "#CC8800",
      },
      info: {
        main: mode === "light" ? "#00B7FF" : "#29B6F6",
        light: mode === "light" ? "#4DCAFF" : "#73C8F8",
        dark: mode === "light" ? "#0093CC" : "#0288D1",
      },
      background: {
        default: mode === "light" ? "#FAFAFA" : "#111111",
        paper: mode === "light" ? "#FFFFFF" : "#1A1A1A",
      },
      text: {
        primary: mode === "light" ? "#111111" : "#FFFFFF",
        secondary: mode === "light" ? "#666666" : "#BBBBBB",
      },
      divider: mode === "light" ? "#EEEEEE" : "#333333",
      action: {
        active: primaryMain,
        hover: alpha(primaryMain, mode === "light" ? 0.05 : 0.1),
        selected: alpha(primaryMain, mode === "light" ? 0.1 : 0.2),
        disabled: mode === "light" ? "#CCCCCC" : "#666666",
        disabledBackground: mode === "light" ? "#F5F5F5" : "#333333",
      },
    },
    typography: {
      fontFamily:
        '"Plus Jakarta Sans", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: "2.5rem",
        letterSpacing: "-0.025em",
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 700,
        fontSize: "2rem",
        letterSpacing: "-0.02em",
        lineHeight: 1.2,
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.5rem",
        letterSpacing: "-0.015em",
        lineHeight: 1.3,
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.25rem",
        letterSpacing: "-0.01em",
        lineHeight: 1.3,
      },
      h5: {
        fontWeight: 600,
        fontSize: "1.1rem",
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: "0.95rem",
        lineHeight: 1.4,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
        fontSize: "0.875rem",
        letterSpacing: "0.01em",
      },
      body1: {
        fontSize: "0.95rem",
        lineHeight: 1.6,
        letterSpacing: "0.01em",
      },
      body2: {
        fontSize: "0.85rem",
        lineHeight: 1.6,
      },
      subtitle1: {
        fontSize: "1rem",
        fontWeight: 500,
        letterSpacing: "0.005em",
      },
      subtitle2: {
        fontSize: "0.85rem",
        fontWeight: 500,
      },
      caption: {
        fontSize: "0.75rem",
        letterSpacing: "0.02em",
      },
      overline: {
        fontSize: "0.7rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      },
    },
    shape: {
      borderRadius: 2, // Reduced from 4 to 2px for more Material-like appearance
    },
    spacing: (factor: number) => `${factor * 8}px`,
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          body {
            transition: background-color 0.3s, color 0.3s;
            scroll-behavior: smooth;
            overflow-x: hidden;
          }
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: ${mode === "light" ? "#DDDDDD" : "#444444"};
            border-radius: 4px;
          }
          ::-webkit-scrollbar-track {
            background: ${mode === "light" ? "#F5F5F5" : "#222222"};
          }
        `,
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: "2px", // More squared-off buttons for Material Design
            padding: "8px 16px",
            transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
            fontWeight: 600,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
        },
        variants: [
          {
            props: { variant: "contained", color: "primary" },
            style: {
              background: `linear-gradient(45deg, ${primaryMain}, ${primaryLight})`,
              "&:hover": {
                background: `linear-gradient(45deg, ${primaryDark}, ${primaryMain})`,
                boxShadow: `0 6px 20px ${alpha(primaryMain, 0.3)}`,
              },
            },
          },
          {
            props: { variant: "contained", color: "secondary" },
            style: {
              background: `linear-gradient(45deg, ${secondaryMain}, ${secondaryLight})`,
              "&:hover": {
                background: `linear-gradient(45deg, ${secondaryDark}, ${secondaryMain})`,
                boxShadow: `0 6px 20px ${alpha(secondaryMain, 0.3)}`,
              },
            },
          },
          {
            props: { variant: "outlined" },
            style: {
              borderWidth: "1.5px",
              "&:hover": {
                borderWidth: "1.5px",
              },
            },
          },
        ],
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "2px", // More squared-off cards
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "none",
            boxShadow:
              mode === "light"
                ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)"
                : "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.26)",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow:
                mode === "light"
                  ? "0 6px 10px rgba(0,0,0,0.1), 0 3px 5px rgba(0,0,0,0.08)"
                  : "0 6px 10px rgba(0,0,0,0.3), 0 3px 5px rgba(0,0,0,0.22)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
          },
          rounded: {
            borderRadius: "2px", // More squared-off papers
          },
        },
        variants: [
          {
            props: { elevation: 1 },
            style: {
              boxShadow:
                mode === "light"
                  ? "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)"
                  : "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.22)",
            },
          },
          {
            props: { elevation: 2 },
            style: {
              boxShadow:
                mode === "light"
                  ? "0 3px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.12)"
                  : "0 3px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.26)",
            },
          },
        ],
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: "4px", // Less pill-shaped chips, more rectangular
            fontSize: "0.75rem",
            height: "24px",
            "&:hover": {
              transform: "translateY(-1px)",
            },
          },
        },
        variants: [
          {
            props: { color: "primary" },
            style: {
              backgroundColor: alpha(primaryMain, 0.1),
            },
          },
          {
            props: { color: "secondary" },
            style: {
              background: `linear-gradient(45deg, ${alpha(
                secondaryMain,
                0.1
              )}, ${alpha(secondaryLight, 0.1)})`,
            },
          },
        ],
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "0 1px 3px rgba(0,0,0,0.1)"
                : "0 1px 3px rgba(0,0,0,0.2)",
            borderBottom: "none",
            borderColor:
              mode === "light" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)",
            backgroundColor:
              mode === "light"
                ? "rgba(255,255,255,0.98)"
                : "rgba(17,17,17,0.98)",
            backdropFilter: "blur(10px)",
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            background: `linear-gradient(45deg, ${primaryMain}, ${secondaryMain})`,
            fontWeight: 700,
            border: "2px solid",
            borderColor: mode === "light" ? "#FFFFFF" : "#1A1A1A",
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Remove rounded corners completely for menu items
            borderLeft: "3px solid transparent", // Add left border for selected indicator
            paddingTop: 10,
            paddingBottom: 10,
            transition: "all 0.2s ease",
            "&.Mui-selected": {
              backgroundColor:
                mode === "light"
                  ? "rgba(0,0,0,0.04)"
                  : "rgba(255,255,255,0.08)",
              borderLeftColor: primaryMain, // Show colored border when selected
              "&:hover": {
                backgroundColor:
                  mode === "light"
                    ? "rgba(0,0,0,0.08)"
                    : "rgba(255,255,255,0.12)",
              },
            },
            "&:hover": {
              backgroundColor:
                mode === "light"
                  ? "rgba(0,0,0,0.04)"
                  : "rgba(255,255,255,0.08)",
              borderLeftColor: alpha(primaryMain, 0.5), // Subtle indication on hover
            },
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Ensure list items have no rounded corners
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: 0, // Make menu items completely rectangular
            "&:hover": {
              backgroundColor:
                mode === "light"
                  ? "rgba(0,0,0,0.04)"
                  : "rgba(255,255,255,0.08)",
            },
            "&.Mui-selected": {
              backgroundColor: alpha(
                primaryMain,
                mode === "light" ? 0.08 : 0.16
              ),
              "&:hover": {
                backgroundColor: alpha(
                  primaryMain,
                  mode === "light" ? 0.12 : 0.24
                ),
              },
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRadius: 0, // Ensure drawer has no rounded corners
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            "&.menu-button": {
              borderRadius: 0, // Apply to button variants used in navigation
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            // Make icon buttons slightly larger in navigation
            padding: 8, // Increased from default
            // Add these sizes for IconButtons in navigation
            "&.navigation-action": {
              width: 42, // Larger click target
              height: 42, // Larger click target
              color:
                mode === "light"
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                backgroundColor: alpha(primaryMain, 0.08),
                color: primaryMain,
              },
            },
          },
          sizeSmall: {
            // When used with size="small" prop
            padding: 6, // Increased from default
            "&.navigation-action": {
              width: 36, // Smaller but still large enough
              height: 36,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            height: 3,
            borderRadius: "3px 3px 0 0",
            background: `linear-gradient(45deg, ${primaryMain}, ${secondaryMain})`,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            "&.Mui-selected": {
              color: primaryMain,
            },
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor:
              mode === "light" ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.98)",
            color: mode === "light" ? "#FFFFFF" : "#111111",
            padding: "8px 12px",
            fontSize: "0.75rem",
            fontWeight: 500,
            borderRadius: "6px",
          },
        },
      },
    },
  });
};
