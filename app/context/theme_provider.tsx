import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ThemeProvider as MuiThemeProvider,
  type PaletteMode,
  CssBaseline,
} from "@mui/material";
import { getTheme } from "../config/theme";

// Create a context for theme management
type ThemeContextType = {
  mode: PaletteMode;
  toggleTheme: () => void;
  setMode: (mode: PaletteMode) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleTheme: () => {},
  setMode: () => {},
});

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Alias for useTheme to match the naming expected by layout.tsx
export const useColorScheme = () => {
  const { mode, toggleTheme, setMode } = useContext(ThemeContext);
  return { mode, toggleColorMode: toggleTheme, setMode };
};

// Theme provider component
export function ThemeProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Get initial theme from local storage or default to light
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
      return savedMode ?? "light";
    }
    return "light";
  });

  // Toggle between light and dark modes
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("themeMode", newMode);
      }
      return newMode;
    });
  }, []);

  // Direct mode setter function
  const setThemeMode = useCallback((newMode: PaletteMode) => {
    setMode(newMode);
    if (typeof window !== "undefined") {
      localStorage.setItem("themeMode", newMode);
    }
  }, []);

  // Create the current theme based on mode
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Context value
  const contextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode: setThemeMode,
    }),
    [mode, toggleTheme, setThemeMode]
  );

  // Effect to handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const userPreference = localStorage.getItem("themeMode");
      if (!userPreference) {
        setMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
