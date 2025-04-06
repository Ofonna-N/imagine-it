// Common response type for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Pagination types for API responses with multiple items
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
}

// Common form field validation
export interface ValidationError {
  field: string;
  message: string;
}
