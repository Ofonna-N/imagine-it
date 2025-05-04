import { type RouteConfig, route, layout } from "@react-router/dev/routes";
import { API_ROUTES, APP_ROUTES, AUTH_ROUTES } from "./constants/route_paths";

export default [
  // Public authentication routes (accessible when not logged in)
  route(AUTH_ROUTES.LOGIN.slice(1), "routes/login.tsx"),
  route(AUTH_ROUTES.SIGNUP.slice(1), "routes/signup.tsx"),

  // Main application layout - conditionally shows landing or protected content
  layout("routes/protected_layout.tsx", [
    // Home route is now at the root with ID for loader data access
    route(APP_ROUTES.HOME, "routes/home.tsx", { id: "home" }),

    // Product related routes
    route(APP_ROUTES.PRODUCTS.slice(1), "routes/product_listing.tsx"),
    route(
      `${APP_ROUTES.PRODUCTS.slice(1)}/:productId`,
      "routes/product_detail.tsx"
    ),

    // Shopping cart and checkout
    route(APP_ROUTES.CART.slice(1), "routes/cart.tsx"),
    route(APP_ROUTES.CHECKOUT.slice(1), "routes/checkout.tsx"),
    route(
      APP_ROUTES.CHECKOUT_THANK_YOU.slice(1),
      "routes/checkout_thank_you.tsx"
    ),

    // User account routes
    route(APP_ROUTES.MY_DESIGNS.slice(1), "routes/my_designs.tsx"),
    route(APP_ROUTES.ORDERS.slice(1), "routes/orders.tsx"),
    route(APP_ROUTES.ACCOUNT.slice(1), "routes/account.tsx"),
    route(APP_ROUTES.IMAGE_GENERATION.slice(1), "routes/image_generation.tsx"),
    route(APP_ROUTES.ORDER_DETAIL.slice(1), "routes/order_detail.tsx"),
  ]),

  // API routes
  route(
    API_ROUTES.FEATURED_PRODUCTS.slice(1), // Use constant and slice leading '/'
    "routes_api/api.featured_products.ts"
  ),
  route(
    API_ROUTES.CATALOG_PRODUCTS.slice(1), // Use constant and slice leading '/'
    "routes_api/api.catalog_products.ts"
  ),
  route(
    API_ROUTES.CATALOG_CATEGORIES.slice(1), // Add category route using constant
    "routes_api/api.catalog_categories.ts"
  ),
  route(
    // Use function constant for dynamic path, slice leading '/'
    API_ROUTES.CATALOG_PRODUCT_AVAILABILITY(":id").slice(1),
    "routes_api/api.catalog_products.$id.availability.ts",
    {
      id: "catalog-product-availability", // Keep ID if needed elsewhere
    }
  ),
  route(
    API_ROUTES.USER_PROFILE.slice(1), // Use constant and slice leading '/'
    "routes_api/api.user.profile.ts"
  ),
  route(
    API_ROUTES.MOCKUP_TASKS?.slice
      ? API_ROUTES.MOCKUP_TASKS.slice(1)
      : "api/mockup-tasks",
    "routes_api/api.mockup_tasks.ts"
  ),
  route(
    // Add mockup styles API route for catalog products
    API_ROUTES.MOCK_UP_STYLES(":id").slice(1),
    "routes_api/api.catalog_products.$id.mockup_styles.ts"
  ),
  route(
    API_ROUTES.AUTH.LOGIN.slice(1), // Use constant and slice leading '/'
    "routes_api/api.auth.login.ts"
  ),
  route(
    API_ROUTES.AUTH.SIGNUP.slice(1), // Use constant and slice leading '/'
    "routes_api/api.auth.signup.ts"
  ),
  route(
    API_ROUTES.AUTH.SIGNOUT.slice(1), // Use constant and slice leading '/'
    "routes_api/api.auth.signout.ts"
  ),
  route(
    API_ROUTES.AUTH.SESSION.slice(1), // Use constant and slice leading '/'
    "routes_api/api.auth.session.ts"
  ),
  route(
    // Use function constant for dynamic path, slice leading '/'
    API_ROUTES.AUTH.OAUTH(":provider").slice(1),
    "routes_api/api.auth.oauth.$provider.ts"
  ),
  route(
    API_ROUTES.CATALOG_PRODUCT_PRICES(":id").slice(1), // Use constant and slice leading '/'
    "routes_api/api.catalog_products.$id.prices.ts"
  ),
  route(
    API_ROUTES.CATALOG_VARIANT_PRICES(":id").slice(1), // Use constant and slice leading '/'
    "routes_api/api.catalog_variants.$id.prices.ts"
  ),
  route(
    API_ROUTES.CATALOG_VARIANT_AVAILABILITY(":id").slice(1), // Add variant availability API route
    "routes_api/api.catalog_variants.$id.availability.ts"
  ),
  route(
    AUTH_ROUTES.OAUTH_CALLBACK.slice(1), // Use constant and slice leading '/'
    "routes_api/api.auth.oauth.callback.ts"
  ),
  // Generate image resource route (AI image generation endpoint)
  route(API_ROUTES.GENERATE_IMAGE.slice(1), "routes_api/api.generate_image.ts"),
  route(API_ROUTES.DESIGNS.slice(1), "routes_api/api.designs.ts"),
  route(API_ROUTES.CART.slice(1), "routes_api/api.cart.ts"),
  route(API_ROUTES.RECIPIENT.slice(1), "routes_api/api.recipient.ts"),
  route(API_ROUTES.SHIPPING_RATES.slice(1), "routes_api/api.shipping_rates.ts"),
  route(
    API_ROUTES.PAYPAL_CREATE_ORDER.slice(1),
    "routes_api/api.paypal_create_order.ts"
  ),
  route(
    API_ROUTES.PAYPAL_CAPTURE_ORDER.slice(1),
    "routes_api/api.paypal_capture_order.ts"
  ),
  route(
    API_ROUTES.PRINTFUL_ORDER_CREATE.slice(1),
    "routes_api/api.printful_order.ts"
  ),
  route(API_ROUTES.USER_ORDERS.slice(1), "routes_api/api.user_orders.ts"),
] satisfies RouteConfig;
