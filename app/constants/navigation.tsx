import {
  FiHome,
  FiShoppingBag,
  FiEdit,
  FiImage,
  FiShoppingCart,
  FiFileText,
} from "react-icons/fi";

// Define path constants for use throughout the application
export const PATHS = {
  HOME: "/",
  PRODUCTS: "/products",
  DESIGN_PLAYGROUND: "/design-playground",
  MY_DESIGNS: "/my-designs",
  CART: "/cart",
  ORDERS: "/orders",
  CHECKOUT: "/checkout",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  LOGIN: "/login",
  SIGNUP: "/signup",
};

// Navigation items for the main menu/drawer
export const NAV_ITEMS = [
  { text: "Home", path: PATHS.HOME, icon: <FiHome /> },
  { text: "Products", path: PATHS.PRODUCTS, icon: <FiShoppingBag /> },
  {
    text: "Design Playground",
    path: PATHS.DESIGN_PLAYGROUND,
    icon: <FiEdit />,
  },
  { text: "My Designs", path: PATHS.MY_DESIGNS, icon: <FiImage /> },
  { text: "Cart", path: PATHS.CART, icon: <FiShoppingCart /> },
  { text: "Orders", path: PATHS.ORDERS, icon: <FiFileText /> },
];
