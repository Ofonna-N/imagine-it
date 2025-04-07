import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getOrdersByCustomerId, getOrderById } from "../api/mockData";
import type { Order } from "../types";

/**
 * Interface for order query parameters
 */
interface OrdersQueryParams {
  customerId?: string;
}

/**
 * Interface for orders query response
 */
interface OrdersQueryResponse {
  orders: Order[];
}

/**
 * Hook for fetching customer orders using TanStack Query
 *
 * @param params - Query parameters for filtering orders
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with orders data, loading state, error state, etc.
 */
export function useQueryOrders({
  params = {},
  options,
}: {
  params?: OrdersQueryParams;
  options?: Partial<
    UseQueryOptions<
      OrdersQueryResponse,
      Error,
      OrdersQueryResponse,
      ["orders", OrdersQueryParams]
    >
  >;
} = {}) {
  const { customerId = "CUST-12345" } = params;

  return useQuery({
    queryKey: ["orders", params],
    queryFn: async () => {
      // Simulate API call with delay
      return new Promise<OrdersQueryResponse>((resolve) => {
        setTimeout(() => {
          const orders = getOrdersByCustomerId(customerId);
          resolve({ orders });
        }, 500);
      });
    },
    ...options,
  });
}

/**
 * Interface for single order query parameters
 */
interface OrderQueryParams {
  orderId: string;
}

/**
 * Interface for single order query response
 */
interface OrderQueryResponse {
  order: Order | null;
}

/**
 * Hook for fetching a single order by ID using TanStack Query
 *
 * @param params - Query parameters containing the order ID
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with order data, loading state, error state, etc.
 */
export function useQueryOrder({
  params,
  options,
}: {
  params: OrderQueryParams;
  options?: Partial<
    UseQueryOptions<
      OrderQueryResponse,
      Error,
      OrderQueryResponse,
      ["order", OrderQueryParams]
    >
  >;
}) {
  const { orderId } = params;

  return useQuery({
    queryKey: ["order", params],
    queryFn: async () => {
      // Simulate API call with delay
      return new Promise<OrderQueryResponse>((resolve) => {
        setTimeout(() => {
          const order = getOrderById(orderId);
          resolve({ order: order || null });
        }, 300);
      });
    },
    enabled: !!orderId,
    ...options,
  });
}
