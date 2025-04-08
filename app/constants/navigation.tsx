import {
  FiHome,
  FiShoppingBag,
  FiEdit,
  FiImage,
  FiShoppingCart,
  FiFileText,
} from "react-icons/fi";
import { APP_ROUTES } from "./route_paths";

// Navigation items for the main menu/drawer
export const NAV_ITEMS = [
  { text: "Home", path: APP_ROUTES.HOME, icon: <FiHome /> },
  { text: "Products", path: APP_ROUTES.PRODUCTS, icon: <FiShoppingBag /> },
  {
    text: "Design Playground",
    path: APP_ROUTES.DESIGN_PLAYGROUND,
    icon: <FiEdit />,
  },
  { text: "My Designs", path: APP_ROUTES.MY_DESIGNS, icon: <FiImage /> },
  { text: "Cart", path: APP_ROUTES.CART, icon: <FiShoppingCart /> },
  { text: "Orders", path: APP_ROUTES.ORDERS, icon: <FiFileText /> },
];

// Re-export route constants for backward compatibility
export { APP_ROUTES as PATHS } from "./route_paths";
