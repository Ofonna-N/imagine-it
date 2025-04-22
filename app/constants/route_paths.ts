/**
 * This file defines all application route paths as constants.
 * Always use these constants instead of hardcoded strings for routes.
 */

// Authentication and public routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  SIGNUP: "/signup",
  OAUTH_CALLBACK: "/api/auth/oauth/callback",
};

// Main application routes
export const APP_ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  MY_DESIGNS: "/my-designs",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ACCOUNT: "/account",
  IMAGE_GENERATION: "/image-generation", // Added for AI image generation route
};

// API endpoint routes
export const API_ROUTES = {
  FEATURED_PRODUCTS: "/api/products/featured",
  CATALOG_PRODUCTS: "/api/catalog-products",
  CATALOG_CATEGORIES: "/api/catalog-categories", // Added category route
  CATALOG_PRODUCT_AVAILABILITY: (id: string) =>
    `/api/catalog-products/${id}/availability`,
  USER_PROFILE: "/api/user/profile",
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP: "/api/auth/signup",
    SIGNOUT: "/api/auth/signout",
    SESSION: "/api/auth/session",
    OAUTH: (provider: string) => `/api/auth/oauth/${provider}`,
  },
  MOCKUP_TASKS: "/api/mockup-tasks",
  MOCK_UP_STYLES: (id: string) => `/api/catalog-products/${id}/mockup-styles`,
  CATALOG_PRODUCT_PRICES: (id: string) => `/api/catalog-products/${id}/prices`,
  CATALOG_VARIANT_PRICES: (id: string) => `/api/catalog-variants/${id}/prices`, // Added for variant pricing endpoint
  CATALOG_VARIANT_AVAILABILITY: (id: string) => `/api/catalog-variants/${id}/availability`, // Added for variant availability endpoint
  /**
   * POST /api/generate-image
   * Resource route for AI image generation
   */
  GENERATE_IMAGE: "/api/generate-image",
  /**
   * GET, POST /api/designs
   * Resource routes for user designs
   */
  DESIGNS: "/api/designs",
};

// A flattened version combining all routes for easier imports
export const ROUTE_PATHS = {
  ...AUTH_ROUTES,
  ...APP_ROUTES,
  API: API_ROUTES,
  GENERATE_IMAGE: API_ROUTES.GENERATE_IMAGE,
};

// Export default for easier importing
export default ROUTE_PATHS;
