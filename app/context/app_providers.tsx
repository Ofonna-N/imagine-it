import type { ReactNode } from "react";
import { QueryProvider } from "./query_provider";
import { AuthProvider } from "./auth_provider";
import { SnackbarProvider } from "notistack";
import PaypalProvider from "./paypal_provider";
import { MUiThemeProvider } from "./mui_theme_provider";

interface AppProvidersProps {
  children: ReactNode;
  providerProps: {
    themeProviderProps?: {
      initialMode?: "light" | "dark";
    };
  };
}

/**
 * AppProviders is the top-level provider component that composes all application providers
 * Add additional providers here as your application grows (auth, data fetching, etc.)
 */
export function AppProviders({
  children,
  providerProps,
}: Readonly<AppProvidersProps>) {
  return (
    <QueryProvider>
      <AuthProvider>
        <MUiThemeProvider
          initialMode={providerProps?.themeProviderProps?.initialMode}
        >
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
          >
            <PaypalProvider>{children}</PaypalProvider>
          </SnackbarProvider>
        </MUiThemeProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
