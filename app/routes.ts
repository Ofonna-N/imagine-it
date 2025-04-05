import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("products", "routes/product_listing.tsx"),
    route("products/:productId", "routes/product_detail.tsx"),
    route("design-playground", "routes/image_gen_playground.tsx"),
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),
    route("my-designs", "routes/my_designs.tsx"),
    route("orders", "routes/orders.tsx"),
  ]),
] satisfies RouteConfig;
