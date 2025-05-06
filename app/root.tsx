import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import { Container, Box, Typography, Paper } from "@mui/material";
import { AppProviders } from "./context/app_providers";
import { getThemeSession } from "~/utils/theme_session.server";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
];

export async function loader({ request }: Route.LoaderArgs) {
  // Get theme mode from cookie session
  const session = await getThemeSession(request);
  const theme = session.get("mode") ?? "light";
  return { theme };
}

export function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { theme } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Imagine It</title>
        <meta name="description" content="Imagine It - Design Playground" />
        <Meta />
        <Links />
      </head>
      <body>
        <AppProviders
          providerProps={{
            themeProviderProps: {
              initialMode: theme,
            },
          }}
        >
          {children}
        </AppProviders>
        <ScrollRestoration />
        <InitColorSchemeScript attribute="class" />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Readonly<Route.ErrorBoundaryProps>) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <Container sx={{ pt: 8, p: 2, maxWidth: "lg" }}>
      <Typography variant="h4">{message}</Typography>
      <Typography variant="body1">{details}</Typography>
      {stack && (
        <Paper
          variant="outlined"
          sx={{ width: "100%", p: 2, mt: 2, overflow: "auto" }}
        >
          <Box
            component="code"
            sx={{ display: "block", whiteSpace: "pre-wrap" }}
          >
            {stack}
          </Box>
        </Paper>
      )}
    </Container>
  );
}
