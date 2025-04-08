import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  Grid,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { useAuth } from "~/context/auth_provider";
import { FiUser, FiMail, FiCalendar, FiSave } from "react-icons/fi";

export default function Account() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Initialize display name from user metadata if available
    if (user?.user_metadata?.display_name) {
      setDisplayName(user.user_metadata.display_name);
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSuccess(false);

    // In a real app, this would update the user profile in Supabase
    // For now, we'll just simulate a save
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSaving(false);
    setIsEditing(false);
    setSuccess(true);

    // Remove success message after 3 seconds
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Account
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FiUser size={24} style={{ marginRight: 8 }} />
              <Typography variant="h6">Profile Information</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {isEditing ? (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveProfile();
                }}
              >
                <TextField
                  fullWidth
                  label="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  margin="normal"
                  disabled={isSaving}
                />

                <Box
                  sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    onClick={() => setIsEditing(false)}
                    sx={{ mr: 2 }}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={isSaving}
                    startIcon={
                      isSaving ? <CircularProgress size={20} /> : <FiSave />
                    }
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </Box>
              </Box>
            ) : (
              <>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Display Name
                    </Typography>
                    <Typography variant="body1">
                      {displayName || "Not set"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{user?.email}</Typography>
                  </Grid>
                </Grid>

                <Button
                  variant="outlined"
                  sx={{ mt: 3 }}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FiMail size={24} style={{ marginRight: 8 }} />
              <Typography variant="h6">Email Preferences</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Typography variant="body2">
              Manage your email notification preferences here.
            </Typography>

            <Typography variant="body2" color="text.secondary">
              This feature is coming soon.
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <FiCalendar size={24} style={{ marginRight: 8 }} />
              <Typography variant="h6">Account Activity</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Last Sign In
                </Typography>
                <Typography variant="body1">
                  {user?.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleString()
                    : "No recent activity"}
                </Typography>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Account Created
                </Typography>
                <Typography variant="body1">
                  {user?.created_at
                    ? new Date(user.created_at).toLocaleString()
                    : "Unknown"}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
