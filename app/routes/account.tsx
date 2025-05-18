import {
  Box,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Grid,
  TextField,
  Badge,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { FiEdit, FiCamera } from "react-icons/fi";
import { useAuth } from "~/context/auth_provider";
import { useNavigate, useLoaderData } from "react-router";
import { checkAuthAndRedirect } from "~/features/auth/utils/auth_redirects";
import { AUTH_ROUTES } from "~/constants/route_paths"; // Import AUTH_ROUTES
import {
  SUBSCRIPTION_TIERS,
  type SubscriptionTier,
} from "~/config/subscription_tiers";
import type { Route } from "./+types/account";
import useQueryUserProfile from "~/features/user/hooks/use_query_user_profile";
import { useMutatePurchaseSubscription } from "~/features/user/hooks/use_mutate_purchase_subscription";
import { useTheme } from "@mui/material/styles";
import { useMutateCancelSubscription } from "~/features/user/hooks/use_mutate_cancel_subscription";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useQueryClient } from "@tanstack/react-query";

// Add loader to get authenticated user data
export async function loader({ request }: Route.LoaderArgs) {
  // Redirect to login if not authenticated
  return await checkAuthAndRedirect(request, null, AUTH_ROUTES.LOGIN);
}

function SubscriptionManagementSection({
  currentTier,
}: Readonly<{ currentTier: SubscriptionTier }>) {
  const queryClient = useQueryClient();
  const [selectedTier, setSelectedTier] =
    useState<SubscriptionTier>(currentTier);
  const tiers = ["free", "creator", "pro"] as const;
  const theme = useTheme();
  const paypalContainerBgColor = theme.palette.background.paper;
  const {
    mutate: purchaseSubscription,
    isPending,
    isSuccess,
    error,
  } = useMutatePurchaseSubscription({
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: ["userProfile"],
        });
        setSelectedTier(data.newTier);
      }
    },
  });
  const {
    mutate: cancelSubscription,
    isPending: isCancelling,
    isSuccess: cancelSuccess,
    error: cancelError,
  } = useMutateCancelSubscription({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setSelectedTier("free");
    },
  });

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Manage Your Subscription
      </Typography>
      <Grid container spacing={3}>
        {tiers.map((tier) => {
          const tierConfig = SUBSCRIPTION_TIERS.find((t) => t.id === tier);
          const features = tierConfig?.features;
          if (!features) return null;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tier}>
              <Paper
                elevation={selectedTier === tier ? 6 : 2}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: selectedTier === tier ? "2px solid" : "1px solid",
                  borderColor:
                    selectedTier === tier ? "primary.main" : "divider",
                  background:
                    selectedTier === tier
                      ? "rgba(94,106,210,0.05)"
                      : "background.paper",
                  cursor: tier === currentTier ? "default" : "pointer",
                  opacity: tier === currentTier ? 1 : 0.95,
                  transition: "all 0.2s",
                }}
                onClick={() => setSelectedTier(tier)}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 1, textTransform: "capitalize" }}
                >
                  {tier === "free"
                    ? "Free"
                    : tier.charAt(0).toUpperCase() + tier.slice(1)}
                </Typography>
                <Typography variant="subtitle1" color="primary" sx={{ mb: 1 }}>
                  {tier === "free"
                    ? "$0/mo"
                    : tier === "creator"
                    ? "$9.99/mo"
                    : "$29.99/mo"}
                </Typography>
                <ul style={{ paddingLeft: 18, marginBottom: 8 }}>
                  <li>{features.artGenCreditsPerMonth} AI art credits/mo</li>
                  <li>
                    {features.savedDesignsLimit ?? "Unlimited"} saved designs
                  </li>
                  <li>{features.uploadsPerMonth ?? "Unlimited"} uploads/mo</li>
                  <li>
                    {features.premiumStyles
                      ? "Premium styles included"
                      : "Basic styles only"}
                  </li>
                  <li>
                    {features.batchGeneration
                      ? "Batch generation enabled"
                      : "No batch generation"}
                  </li>
                  <li>Support: {features.supportLevel}</li>
                </ul>
                {tier !== "free" && tierConfig?.paypalPlanId && (
                  <Paper
                    id="paypal-button-container"
                    component={"div"}
                    sx={{
                      colorScheme: "none",
                      backgroundColor: paypalContainerBgColor,
                      padding: "10px",
                      borderRadius: "5px",
                      overflowX: "hidden",
                    }}
                  >
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "blue",
                      }}
                      createSubscription={(_data, actions) => {
                        return actions.subscription.create({
                          plan_id: tierConfig.paypalPlanId as string,
                        });
                      }}
                      onApprove={async (data, _actions) => {
                        if (!data.subscriptionID) return;
                        purchaseSubscription({
                          tier,
                          paymentId: data.subscriptionID,
                        });
                      }}
                      disabled={selectedTier !== tier || isPending}
                    />
                  </Paper>
                )}
                {tier === "free" && (
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() =>
                      purchaseSubscription({ tier, paymentId: "" })
                    }
                    disabled={selectedTier === tier}
                  >
                    Switch to Free
                  </Button>
                )}
                {isPending && selectedTier === tier && (
                  <Typography color="primary" sx={{ mt: 1 }}>
                    Processing...
                  </Typography>
                )}
                {isSuccess && selectedTier === tier && (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    Plan updated!
                  </Typography>
                )}
                {error && selectedTier === tier && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    {error.message}
                  </Typography>
                )}
                {/* Cancel only on current paid tier */}
                {tier === currentTier && tier !== "free" && (
                  <>
                    <Button
                      variant="outlined"
                      color="error"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => cancelSubscription()}
                      disabled={isCancelling}
                    >
                      {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                    </Button>
                    {cancelSuccess && (
                      <Typography color="success.main" sx={{ mt: 1 }}>
                        Subscription cancelled. You are now on the Free plan.
                      </Typography>
                    )}
                    {cancelError && (
                      <Typography color="error" sx={{ mt: 1 }}>
                        {cancelError.message}
                      </Typography>
                    )}
                  </>
                )}
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default function AccountPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { user } = useLoaderData<typeof loader>();
  const userProfileQuery = useQueryUserProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Example user details - replace with actual user data in a real implementation
  const userDetails = {
    name: user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "User",
    email: user?.email ?? "user@example.com",
    memberSince: new Date(user?.created_at ?? Date.now()).toLocaleDateString(),
    shippingAddress: user?.user_metadata?.shipping_address ?? "None added yet",
    paymentMethods: user?.user_metadata?.payment_methods ?? [],
  };

  const handleLogout = async () => {
    await signOut();
    navigate(AUTH_ROUTES.LOGIN);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // In a real app, implement profile update logic here
    setIsEditing(false);
  };

  // Use activeSubscriptionTier for current plan
  const currentTier = userProfileQuery.data?.activeSubscriptionTier ?? "free";

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Account
      </Typography>

      <Grid container spacing={4}>
        {/* Left column - Account overview */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <IconButton
                    sx={{
                      bgcolor: "primary.main",
                      color: "white",
                      width: 28,
                      height: 28,
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                    aria-label="change profile picture"
                  >
                    <FiCamera size={14} />
                  </IconButton>
                }
              >
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2 }}
                  alt={userDetails.name}
                  src={user?.user_metadata?.avatar_url}
                >
                  {userDetails.name.charAt(0).toUpperCase()}
                </Avatar>
              </Badge>
              <Typography variant="h6">{userDetails.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {userDetails.email}
              </Typography>
            </Box>

            <List disablePadding>
              <ListItem disablePadding>
                <ListItemText
                  primary="Member Since"
                  secondary={userDetails.memberSince}
                />
              </ListItem>
              <Divider sx={{ my: 1.5 }} />
              <ListItem disablePadding>
                <ListItemText
                  primary="Default Shipping Address"
                  secondary={userDetails.shippingAddress}
                />
              </ListItem>
              <Divider sx={{ my: 1.5 }} />
              <ListItem disablePadding>
                <ListItemText
                  primary="Payment Methods"
                  secondary={
                    userDetails.paymentMethods.length > 0
                      ? `${userDetails.paymentMethods.length} saved`
                      : "None added yet"
                  }
                />
              </ListItem>
            </List>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
                sx={{ width: "100%" }}
              >
                Sign Out
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Right column - Account details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 2,
              }}
            >
              <Typography variant="h6">Profile Information</Typography>
              <Button
                startIcon={<FiEdit />}
                onClick={toggleEdit}
                size="small"
                variant={isEditing ? "contained" : "outlined"}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {isEditing ? (
              // Editable profile form
              <Box component="form" noValidate>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      defaultValue={userDetails.name}
                      variant="outlined"
                      margin="normal"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      defaultValue={userDetails.email}
                      variant="outlined"
                      margin="normal"
                      disabled
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Shipping Address"
                      defaultValue={userDetails.shippingAddress}
                      variant="outlined"
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, textAlign: "right" }}>
                  <Button
                    variant="contained"
                    onClick={handleSaveProfile}
                    sx={{ minWidth: 120 }}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              // Profile information display
              <List>
                <ListItem>
                  <ListItemText
                    primary="Full Name"
                    secondary={userDetails.name}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText primary="Email" secondary={userDetails.email} />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                  <ListItemText
                    primary="Shipping Address"
                    secondary={userDetails.shippingAddress}
                  />
                </ListItem>
              </List>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography
              color="text.secondary"
              sx={{ py: 4, textAlign: "center" }}
            >
              No recent orders found.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Move SubscriptionManagementSection below the main grid for full width */}
      <SubscriptionManagementSection currentTier={currentTier} />
    </Box>
  );
}
