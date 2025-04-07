import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type ReactNode, useState, useEffect, lazy, Suspense } from "react";

// Create a lazy-loaded version of the devtools for production
const ReactQueryDevtoolsProduction = lazy(() =>
  import("@tanstack/react-query-devtools/production").then((d) => ({
    default: d.ReactQueryDevtools,
  }))
);

interface QueryProviderProps {
  children: ReactNode;
}

export const queryClient = new QueryClient();

export function QueryProvider({ children }: Readonly<QueryProviderProps>) {
  // Create a client
  const [showDevtools, setShowDevtools] = useState(false);

  useEffect(() => {
    // Add the toggle function to the window object for easy access in production
    // @ts-expect-error - window.toggleDevtools is not in the Window interface
    window.toggleDevtools = () => setShowDevtools((prev) => !prev);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Always include the DevTools in development */}
      <ReactQueryDevtools initialIsOpen={false} />

      {/* Show production DevTools when toggled */}
      {showDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
