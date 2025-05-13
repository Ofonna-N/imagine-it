import { useLoaderData, Outlet } from "react-router";
import PublicNavbar from "~/components/public_navbar";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth_redirects";
import type { Route } from "./+types/public_layout";

export async function loader({ request }: Route.LoaderArgs) {
  // Check authentication without redirect
  return await checkAuthAndRedirect(request, null, null, false);
}

export default function PublicLayout() {
  const { isAuthenticated } = useLoaderData<typeof loader>();
  return (
    <>
      {!isAuthenticated && <PublicNavbar />}
      <Outlet />
    </>
  );
}
