import { Chip } from "@mui/material";
import { getOrderStatusLabel, getOrderStatusColor } from "../api/mockData";
import type { OrderStatus } from "../types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
}) => {
  const label = getOrderStatusLabel(status);
  const color = getOrderStatusColor(status) as
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";

  return <Chip label={label} color={color} size="small" variant="outlined" />;
};
