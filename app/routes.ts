import { type RouteConfig, route, layout } from "@react-router/dev/routes";

export default [
  // Public authentication routes (accessible when not logged in)
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),

  // Main application layout - conditionally shows landing or protected content
  layout("routes/layout.tsx", [
    // Home route is now at the root with ID for loader data access
    route("/", "routes/home.tsx", { id: "home" }),

    // Product related routes
    route("products", "routes/product_listing.tsx"),
    route("products/:productId", "routes/product_detail.tsx"),

    // Design and creation routes
    route("design-playground", "routes/image_gen_playground.tsx"),

    // Shopping cart and checkout
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),

    // User account routes
    route("my-designs", "routes/my_designs.tsx"),
    route("orders", "routes/orders.tsx"),
    route("account", "routes/account.tsx"),
  ]),

  // API routes
  route("api/products/featured", "routes_api/api.featured-products.ts"),
  route("api/catalog-products", "routes_api/api.catalog-products.ts"),

  // Auth resource routes
  route("api/auth/login", "routes_api/api.auth.login.ts"),
  route("api/auth/signup", "routes_api/api.auth.signup.ts"),
  route("api/auth/signout", "routes_api/api.auth.signout.ts"),
  route("api/auth/session", "routes_api/api.auth.session.ts"),
] satisfies RouteConfig;
