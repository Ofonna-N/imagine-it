import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Link, useLocation } from "react-router";
import ROUTE_PATHS from "~/constants/route_paths";

/**
 * Thank You page after successful checkout/order
 */
export default function CheckoutThankYou() {
  // Optionally, get order info from location state
  const location = useLocation();
  const order = location.state?.order;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Thank You for Your Order!
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your order has been placed successfully. We appreciate your business.
        </Typography>
        {order && (
          <Box sx={{ my: 2 }}>
            <Typography variant="subtitle1">
              <strong>Order ID:</strong> {order.orderId}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Status:</strong> {order.status}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Total:</strong> ${order.total}
            </Typography>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={ROUTE_PATHS.ORDERS}
          sx={{ mt: 2 }}
        >
          View My Orders
        </Button>
        <Button
          variant="text"
          color="secondary"
          component={Link}
          to={ROUTE_PATHS.HOME}
          sx={{ mt: 2, ml: 2 }}
        >
          Back to Home
        </Button>
      </Paper>
    </Container>
  );
}
