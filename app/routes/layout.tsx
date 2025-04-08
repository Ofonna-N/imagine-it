import { useState } from "react";
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
  useLoaderData,
} from "react-router";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Container,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  FiMenu,
  FiUser,
  FiLogOut,
  FiShoppingCart,
  FiSun,
  FiMoon,
  FiImage,
} from "react-icons/fi";
import { NAV_ITEMS, PATHS } from "~/constants/navigation";
import { useAuth } from "~/context/auth_provider";
import { useColorScheme } from "~/context/theme_provider";
import { LandingComponent } from "~/components/landing_component";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth_redirects";
import type { Route } from "./+types/layout";

const drawerWidth = 240;

export async function loader({ request }: Route.LoaderArgs) {
  // Use the utility function but don't redirect either way
  return await checkAuthAndRedirect(request, null, null);
}

export default function Layout() {
  // Get authentication status from loader data
  const { isAuthenticated, user } = useLoaderData<typeof loader>();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();
  // Only signOut is needed from auth context now
  const { signOut } = useAuth();
  const { mode, setMode } = useColorScheme();
  const cartItemsCount = 0; // Placeholder for cart items count

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleSignOut = async () => {
    handleUserMenuClose();
    await signOut();
    navigate("/");
  };

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  // If not authenticated, show landing page
  // No need to check loading state anymore as we rely on server authentication
  if (!isAuthenticated) {
    return <LandingComponent />;
  }

  const drawer = (
    <div>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 2,
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              p: 1,
              bgcolor: "primary.main",
              color: "white",
              borderRadius: "12px",
            }}
          >
            <FiImage />
          </Box>
          Imagine It
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, py: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path))
              }
              sx={{
                borderRadius: "12px",
                py: 1.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.dark",
                  },
                  "& .MuiListItemText-primary": {
                    fontWeight: 600,
                    color: "primary.dark",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" }, color: "text.primary" }}
          >
            <FiMenu />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              color: "text.primary",
              display: { sm: "none" },
              fontWeight: 600,
            }}
          >
            Imagine It
          </Typography>

          {/* Action Buttons - Right-aligned */}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* Theme toggle button */}
            <IconButton onClick={toggleColorMode} size="small" sx={{ ml: 1 }}>
              {mode === "light" ? <FiMoon /> : <FiSun />}
            </IconButton>

            {/* Shopping cart button */}
            <IconButton
              component={Link}
              to={PATHS.CART}
              size="small"
              sx={{ position: "relative" }}
            >
              <FiShoppingCart />
              {cartItemsCount > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    bgcolor: "secondary.main",
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.6rem",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  {cartItemsCount}
                </Box>
              )}
            </IconButton>

            {/* User menu button */}
            <IconButton size="small" onClick={handleUserMenuOpen}>
              <Avatar
                sx={{ width: 32, height: 32 }}
                alt={user?.email?.charAt(0).toUpperCase() ?? "U"}
                src={user?.user_metadata?.avatar_url}
              >
                {user?.email?.charAt(0).toUpperCase() ?? "U"}
              </Avatar>
            </IconButton>
          </Stack>

          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            slotProps={{
              paper: {
                elevation: 3,
                sx: { minWidth: 180 },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              component={Link}
              to="/account"
              onClick={handleUserMenuClose}
            >
              <ListItemIcon>
                <FiUser fontSize="small" />
              </ListItemIcon>
              My Account
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <FiLogOut fontSize="small" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: "64px",
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
