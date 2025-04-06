import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  // Public routes outside the authenticated layout
  index("routes/landing.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),

  // Main application layout (requires authentication)
  layout("routes/layout.tsx", [
    route("/home", "routes/home.tsx"), // This becomes /home when accessed directly
    route("products", "routes/product_listing.tsx"),
    route("products/:productId", "routes/product_detail.tsx"),
    route("design-playground", "routes/image_gen_playground.tsx"),
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),
    route("my-designs", "routes/my_designs.tsx"),
    route("orders", "routes/orders.tsx"),
  ]),

  route("api/products/featured", "routes_api/api.featured-products.ts"),
] satisfies RouteConfig;
