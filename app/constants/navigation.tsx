import {
  FiHome,
  FiShoppingBag,
  FiImage,
  FiShoppingCart,
  FiFileText,
} from "react-icons/fi";
import { APP_ROUTES } from "./route_paths";

// Navigation items for the main menu/drawer with feature flag requirements
export interface NavigationItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  featureFlag?: keyof import("../config/feature_flags").FeatureFlags;
}

export const NAV_ITEMS: NavigationItem[] = [
  { text: "Home", path: APP_ROUTES.HOME, icon: <FiHome /> },
  { text: "Products", path: APP_ROUTES.PRODUCTS, icon: <FiShoppingBag /> },
  {
    text: "Image Generation",
    path: APP_ROUTES.IMAGE_GENERATION,
    icon: <FiImage />,
    featureFlag: "enableDesignPlayground",
  },
  {
    text: "My Designs",
    path: APP_ROUTES.MY_DESIGNS,
    icon: <FiImage />,
    featureFlag: "enableMyDesignsPage",
  },
  { text: "Cart", path: APP_ROUTES.CART, icon: <FiShoppingCart /> },
  { text: "Orders", path: APP_ROUTES.ORDERS, icon: <FiFileText /> },
];

// Re-export route constants for backward compatibility
export { APP_ROUTES as PATHS } from "./route_paths";
