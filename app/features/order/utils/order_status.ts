// Utility to map Printful order status codes to user-friendly strings
// Used in order detail, orders list, and thank you routes
export function getUserOrderStatus(status: string): string {
  switch (status) {
    case "draft":
      return "Processing";
    case "pending":
      return "Pending";
    case "failed":
      return "Failed";
    case "canceled":
      return "Canceled";
    case "inprocess":
      return "In Fulfillment";
    case "onhold":
      return "On Hold";
    case "partial":
      return "Partially Fulfilled";
    case "fulfilled":
      return "Fulfilled";
    default:
      return status;
  }
}
