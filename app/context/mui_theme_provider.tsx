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
import { useMutateThemeMode } from "../features/theme/hooks/use_mutate_theme";

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
export function MUiThemeProvider({
  children,
  initialMode,
}: Readonly<{ children: React.ReactNode; initialMode?: PaletteMode }>) {
  // Get initial theme from cookie (SSR) or local storage (CSR)
  const [mode, setMode] = useState<PaletteMode>(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("themeMode") as PaletteMode | null;
      return savedMode ?? initialMode ?? "light";
    }
    return initialMode ?? "light";
  });

  // Persist theme mode to cookie via mutation
  const themeMutation = useMutateThemeMode();

  // Toggle between light and dark modes
  const toggleTheme = useCallback(() => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("themeMode", newMode);
      }
      themeMutation.mutate({ mode: newMode });
      return newMode;
    });
  }, [themeMutation]);

  // Direct mode setter function
  const setThemeMode = useCallback(
    (newMode: PaletteMode) => {
      setMode(newMode);
      if (typeof window !== "undefined") {
        localStorage.setItem("themeMode", newMode);
      }
      themeMutation.mutate({ mode: newMode });
    },
    [themeMutation]
  );

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
