import { useState, useEffect } from "react";
import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
  useRouteLoaderData,
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
  CircularProgress,
} from "@mui/material";
import { FiMenu, FiUser, FiLogOut, FiShoppingCart } from "react-icons/fi";
import { NAV_ITEMS, PATHS } from "~/constants/navigation";
import { useAuth } from "~/context/auth_provider";
import { LandingComponent } from "~/components/LandingComponent";

const drawerWidth = 240;

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const location = useLocation();
  const navigate = useNavigate();
  const { user, session, loading, signOut } = useAuth();

  // Always call hooks at the top level, even if we don't always use the result
  const homeLoaderData = useRouteLoaderData("home") as {
    isAuthenticated?: boolean;
  } | null;

  // Use state to track authentication from the home route
  const [homeIsAuthenticated, setHomeIsAuthenticated] = useState<
    boolean | undefined
  >(undefined);

  // Update homeIsAuthenticated when either location or homeLoaderData changes
  useEffect(() => {
    if (location.pathname === "/" && homeLoaderData) {
      setHomeIsAuthenticated(homeLoaderData.isAuthenticated);
    } else {
      setHomeIsAuthenticated(undefined);
    }
  }, [location.pathname, homeLoaderData]);

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
    navigate("/login");
  };

  // If still loading auth state, show loading spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // For root path, check authentication from loader data
  // For other paths, check from session
  const isAuthenticated =
    location.pathname === "/" ? homeIsAuthenticated : !!session;

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return <LandingComponent />;
  }

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Imagine It
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={
                location.pathname === item.path ||
                (item.path !== "/" && location.pathname.startsWith(item.path))
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
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
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <FiMenu />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Imagine It
          </Typography>

          {/* Shopping Cart Button */}
          <IconButton
            color="inherit"
            component={Link}
            to={PATHS.CART}
            sx={{ mr: 1 }}
          >
            <FiShoppingCart />
          </IconButton>

          {/* User Menu */}
          <IconButton
            color="inherit"
            onClick={handleUserMenuOpen}
            sx={{ p: 0, ml: 1 }}
          >
            <Avatar
              alt={user?.email?.charAt(0).toUpperCase() ?? "U"}
              src={user?.user_metadata?.avatar_url}
              sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
            >
              {user?.email?.charAt(0).toUpperCase() ?? "U"}
            </Avatar>
          </IconButton>

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
