import { useParams, Link, useLocation } from "react-router";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Grid,
  Divider,
  Button,
} from "@mui/material";
import { useQueryUserOrders } from "~/features/order/hooks/use_query_user_orders";
import ROUTE_PATHS from "~/constants/route_paths";
import type { PrintfulV2GetOrderResponse } from "~/types/printful/order_types";
import { getUserOrderStatus } from "~/features/order/utils/order_status";

export default function OrderDetail() {
  const { orderId } = useParams();
  const location = useLocation();
  // Try to get the order from navigation state first for optimal UX
  const orderFromState = location.state?.order;
  const { data, isLoading, isError } = useQueryUserOrders({
    enabled: !orderFromState, // Only fetch if not in state
  });
  const orders = data?.orders ?? [];
  // Fallback: find the order in the fetched list if not in state (e.g. direct link)
  const order: PrintfulV2GetOrderResponse["data"] =
    orderFromState ?? orders.find((o) => String(o.id) === String(orderId));

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError || !order) {
    return (
      <Box sx={{ my: 4 }}>
        <Typography variant="h5" color="error" align="center">
          Order not found or failed to load.
        </Typography>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button component={Link} to={ROUTE_PATHS.ORDERS} variant="outlined">
            Back to Orders
          </Button>
        </Box>
      </Box>
    );
  }
  const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Box sx={{ my: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order #{order.id}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {getUserOrderStatus(order.status)} | Ordered on {orderDate}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Shipping To
        </Typography>
        <Typography variant="body2">{order.recipient.name}</Typography>
        <Typography variant="body2">
          {order.recipient.address1}
          {order.recipient.address2 ? `, ${order.recipient.address2}` : ""}
        </Typography>
        <Typography variant="body2">
          {order.recipient.city},{" "}
          {order.recipient.state_code ?? order.recipient.state_name}{" "}
          {order.recipient.zip}
        </Typography>
        <Typography variant="body2">
          {order.recipient.country_name ?? order.recipient.country_code}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Items
        </Typography>
        <Grid container spacing={2}>
          {order.order_items.map((item) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">{item.name}</Typography>
                <Typography variant="body2">Qty: {item.quantity}</Typography>
                <Typography variant="body2">Price: ${item.price}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Order Total
        </Typography>
        <Typography variant="body1">${order.costs?.total ?? "-"}</Typography>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button component={Link} to={ROUTE_PATHS.ORDERS} variant="outlined">
            Back to Orders
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
