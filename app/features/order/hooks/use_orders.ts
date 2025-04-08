import { useState, useEffect, useCallback } from "react";
import { getOrdersByCustomerId, getOrderById } from "../api/mock_data";
import type { Order } from "../types";

export const useOrders = (customerId: string = "CUST-12345") => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all orders for a customer
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const customerOrders = getOrdersByCustomerId(customerId);
      setOrders(customerOrders);
      setLoading(false);
    }, 500);
  }, [customerId]);

  // Get a specific order by ID
  const getOrder = useCallback((orderId: string) => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const order = getOrderById(orderId);
      if (order) {
        setSelectedOrder(order);
      }
      setLoading(false);
    }, 300);
  }, []);

  return {
    orders,
    selectedOrder,
    loading,
    getOrder,
  };
};
