import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./ThemeProvider";
import type { ReactNode } from "react";

interface MuiProviderProps {
  children: ReactNode;
}

/**
 * MuiProvider handles all Material-UI related providers
 * Currently includes ThemeProvider and CssBaseline
 */
export function MuiProvider({ children }: MuiProviderProps) {
  return (
    <ThemeProvider>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
