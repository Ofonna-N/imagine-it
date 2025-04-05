import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./theme_provider";
import type { ReactNode } from "react";

interface MuiProviderProps {
  children: ReactNode;
}

/**
 * MuiProvider handles all Material-UI related providers
 * Currently includes ThemeProvider and CssBaseline
 */
export function MuiProvider({ children }: Readonly<MuiProviderProps>) {
  return (
    <ThemeProvider>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
