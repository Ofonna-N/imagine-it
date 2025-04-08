import type { ReactNode } from "react";
import { MuiProvider } from "./mui_provider";
import { QueryProvider } from "./query_provider";
import { AuthProvider } from "./auth_provider";
import { SnackbarProvider } from "notistack";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * AppProviders is the top-level provider component that composes all application providers
 * Add additional providers here as your application grows (auth, data fetching, etc.)
 */
export function AppProviders({ children }: Readonly<AppProvidersProps>) {
  return (
    <QueryProvider>
      <AuthProvider>
        <MuiProvider>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            {children}
          </SnackbarProvider>
        </MuiProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
