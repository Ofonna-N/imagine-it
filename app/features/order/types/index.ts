import type { CartItem } from "~/features/cart/types";

// Order status types
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

// Address type
export interface Address {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

// Payment information type
export interface PaymentInfo {
  method: "credit_card" | "paypal";
  cardLast4?: string;
  expiryDate?: string;
}

// Order type
export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  shippedAt?: string;
  deliveredAt?: string;
  shippingAddress: Address;
  billingAddress: Address;
  paymentInfo: PaymentInfo;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  trackingNumber?: string;
}
