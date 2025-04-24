import { Box, Typography, Paper, CircularProgress } from "@mui/material";

export default function Orders() {
  const { orders, loading } = {
    orders: [], // Replace with your actual data fetching logic
    loading: false, // Replace with your actual loading state
  };

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>

      <Paper sx={{ p: 3 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {!loading && orders.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
            You haven't placed any orders yet.
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
