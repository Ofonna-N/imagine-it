import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
} from "@mui/material";
import { FiPackage, FiClock } from "react-icons/fi";
import { Link } from "react-router";
import type { Order } from "../types/index";
import { OrderStatusBadge } from "./order_status_badge";

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { id, status, createdAt, items, total, trackingNumber } = order;

  // Format date
  const orderDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Count total number of items
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Typography variant="h6" component="div" sx={{ mr: 2 }}>
                {id}
              </Typography>
              <OrderStatusBadge status={status} />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "text.secondary",
                mb: 2,
              }}
            >
              <FiClock size={14} style={{ marginRight: 6 }} />
              <Typography variant="body2">Ordered on {orderDate}</Typography>
            </Box>

            <Typography variant="body2" sx={{ mb: 1 }}>
              {itemCount} {itemCount === 1 ? "item" : "items"} • $
              {total.toFixed(2)}
            </Typography>

            {trackingNumber && (
              <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                <FiPackage size={14} style={{ marginRight: 6 }} />
                <Typography variant="body2">
                  Tracking: {trackingNumber}
                </Typography>
              </Box>
            )}
          </Grid>

          <Grid
            size={{ xs: 12, sm: 4 }}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: { xs: "flex-start", sm: "flex-end" },
            }}
          >
            <Button
              variant="outlined"
              component={Link}
              to={`/orders/${id}`}
              sx={{ minWidth: 120 }}
            >
              View Details
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
