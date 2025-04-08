import { mockCartItems } from "../../cart/api/mock_data";
import type { Order, OrderStatus } from "../types";

// Mock orders for demonstration
export const mockOrders: Order[] = [
  {
    id: "ORD-123456",
    customerId: "CUST-12345",
    items: mockCartItems,
    status: "shipped",
    createdAt: "2025-03-15T12:30:45Z",
    updatedAt: "2025-03-16T09:15:22Z",
    shippedAt: "2025-03-16T09:15:22Z",
    shippingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "United States",
    },
    billingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "United States",
    },
    paymentInfo: {
      method: "credit_card",
      cardLast4: "4242",
      expiryDate: "04/28",
    },
    subtotal: 64.97,
    shipping: 5.99,
    tax: 4.55,
    total: 75.51,
    trackingNumber: "TRK-987654321",
  },
  {
    id: "ORD-789012",
    customerId: "CUST-12345",
    items: mockCartItems.slice(0, 1),
    status: "delivered",
    createdAt: "2025-02-20T14:22:33Z",
    updatedAt: "2025-02-25T11:30:15Z",
    shippedAt: "2025-02-21T10:45:12Z",
    deliveredAt: "2025-02-25T11:30:15Z",
    shippingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "United States",
    },
    billingAddress: {
      fullName: "John Doe",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "United States",
    },
    paymentInfo: {
      method: "paypal",
    },
    subtotal: 49.98,
    shipping: 5.99,
    tax: 3.5,
    total: 59.47,
    trackingNumber: "TRK-123456789",
  },
];

// Get all orders for a customer
export const getOrdersByCustomerId = (customerId: string): Order[] => {
  return mockOrders.filter((order) => order.customerId === customerId);
};

// Get a specific order by ID
export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find((order) => order.id === orderId);
};

// Get order status label with proper formatting
export const getOrderStatusLabel = (status: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    pending: "Pending",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return statusMap[status] || status;
};

// Get color for order status
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    pending: "warning",
    processing: "info",
    shipped: "primary",
    delivered: "success",
    cancelled: "error",
  };

  return colorMap[status] || "default";
};
