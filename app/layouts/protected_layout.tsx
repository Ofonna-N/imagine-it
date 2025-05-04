import { useLoaderData, Outlet } from "react-router";
import { Box, Container } from "@mui/material";
import ProtectedNavbar from "~/components/protected_navbar";
import { LandingComponent } from "~/components/landing_component";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth_redirects";
import type { Route } from "./+types/protected_layout";

const drawerWidth = 240;

export async function loader({ request }: Route.LoaderArgs) {
  // Use the utility function but don't throw redirects
  return await checkAuthAndRedirect(request, null, null, false);
}

export default function ProtectedLayout() {
  const { isAuthenticated } = useLoaderData<typeof loader>();

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return <LandingComponent />;
  }

  return (
    <>
      <ProtectedNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: "64px",
          ml: { sm: `${drawerWidth}px` }, // Add left margin for permanent drawer
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </>
  );
}
