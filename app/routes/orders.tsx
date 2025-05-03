import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Button,
} from "@mui/material";
import { useQueryUserOrders } from "~/features/order/hooks/use_query_user_orders";
import { useNavigate } from "react-router";
import ROUTE_PATHS from "~/constants/route_paths";
import { getUserOrderStatus } from "~/features/order/utils/order_status";

export default function Orders() {
  const { data, isLoading, isError } = useQueryUserOrders();
  const orders = data?.orders ?? [];
  const navigate = useNavigate();
  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Orders
      </Typography>
      <Paper sx={{ p: 3 }}>
        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {isError && (
          <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
            Failed to load orders. Please try again later.
          </Typography>
        )}
        {!isLoading && !isError && orders.length === 0 && (
          <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
            You haven't placed any orders yet.
          </Typography>
        )}
        {!isLoading && !isError && orders.length > 0 && (
          <Box>
            {orders.map((order) => {
              const orderDate = new Date(order.created_at).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }
              );
              const itemCount = order.order_items.reduce(
                (count, item) => count + (item.quantity || 0),
                0
              );
              return (
                <Paper key={order.id} variant="outlined" sx={{ mb: 3, p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 8 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1 }}
                      >
                        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                          Order #{order.id}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          {getUserOrderStatus(order.status)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.secondary",
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2">
                          Ordered on {orderDate}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {itemCount} {itemCount === 1 ? "item" : "items"} • $
                        {order.costs?.total ?? "-"}
                      </Typography>
                    </Grid>
                    <Grid
                      size={{ xs: 12, sm: 4 }}
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "flex-start", sm: "flex-end" },
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{ minWidth: 120 }}
                        onClick={() => {
                          navigate(`${ROUTE_PATHS.ORDERS}/${order.id}`, {
                            state: { order },
                          });
                        }}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
