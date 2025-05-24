import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Stack,
  ListItemIcon,
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
import { NAV_ITEMS } from "~/constants/navigation";
import { APP_ROUTES } from "~/constants/route_paths";
import { useAuth } from "~/context/auth_provider";
import { useColorScheme } from "~/context/mui_theme_provider";
import { NavigationItem } from "~/components/navigation_item";
import { useQueryUserFeatures } from "~/features/user/hooks/use_query_user_features";
import useQueryUserProfile from "~/features/user/hooks/use_query_user_profile";
import CreditsBalance from "~/features/user/components/credits_balance";

const drawerWidth = 240;

export default function ProtectedNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { mode, setMode } = useColorScheme();
  const cartItemsCount = 0; // Placeholder for cart items count
  const { data: userFeatures } = useQueryUserFeatures();
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchUserProfile,
  } = useQueryUserProfile();

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
    navigate(APP_ROUTES.HOME);
  };

  const toggleColorMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ display: "flex", justifyContent: "center", py: 2 }}>
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
          Imagine It{" "}
        </Typography>{" "}
      </Toolbar>
      {/* Mobile Credits Display - Enhanced with better visual appeal */}
      <Box
        sx={{
          mx: 2,
          my: 3,
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
          boxShadow: 1,
        }}
      >
        <CreditsBalance
          credits={userProfile?.credits}
          isLoading={isProfileLoading}
          error={profileError}
          onCreditsUpdated={refetchUserProfile}
          variant="compact"
          showLabel={true}
        />
      </Box>

      <Divider sx={{ my: 0, backgroundColor: "divider" }} />
      <List sx={{ px: 2, py: 1 }}>
        {NAV_ITEMS.map((item) => {
          // Check if navigation item should be shown based on feature flags
          const isComingSoon =
            item.featureFlag && !userFeatures?.flags[item.featureFlag];

          return (
            <NavigationItem
              key={item.text}
              to={item.path}
              icon={item.icon}
              text={item.text}
              isComingSoon={isComingSoon}
            />
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
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
          </Typography>{" "}
          <Stack
            direction="row"
            spacing={1}
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            {" "}
            <IconButton onClick={toggleColorMode} size="small" sx={{ ml: 1 }}>
              {mode === "light" ? <FiMoon /> : <FiSun />}
            </IconButton>
            <IconButton
              component={Link}
              to={APP_ROUTES.CART}
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
            <IconButton size="small" onClick={handleUserMenuOpen}>
              <Avatar sx={{ width: 32, height: 32 }} alt="User" />
            </IconButton>
          </Stack>
          <Menu
            anchorEl={userMenuAnchor}
            open={Boolean(userMenuAnchor)}
            onClose={handleUserMenuClose}
            slotProps={{ paper: { elevation: 3, sx: { minWidth: 180 } } }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              component={Link}
              to={APP_ROUTES.ACCOUNT}
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
          ModalProps={{ keepMounted: true }}
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
      {/* Close Box nav and fragment */}
    </>
  );
}
