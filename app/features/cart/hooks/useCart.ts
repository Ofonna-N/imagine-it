import { useReducer, useCallback } from "react";

import { mockCartItems, calculateCartTotals } from "../api/mockData";
import type { Cart, CartAction, CartItem } from "../types";
import type { Product } from "~/features/product/types";

// Initial cart state with mock data
const initialCartState: Cart = {
  items: mockCartItems,
  ...calculateCartTotals(mockCartItems),
};

// Cart reducer function
function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, design, quantity } = action.payload;

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.product.id === product.id && item.design === design
      );

      let newItems: CartItem[];

      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newId =
          state.items.length > 0
            ? Math.max(...state.items.map((item) => item.id)) + 1
            : 1;

        newItems = [...state.items, { id: newId, product, design, quantity }];
      }

      return {
        ...state,
        items: newItems,
        ...calculateCartTotals(newItems),
      };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        items: newItems,
        ...calculateCartTotals(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return cartReducer(state, { type: "REMOVE_ITEM", payload: { id } });
      }

      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );

      return {
        ...state,
        items: newItems,
        ...calculateCartTotals(newItems),
      };
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        ...calculateCartTotals([]),
      };

    default:
      return state;
  }
}

// Custom hook for cart functionality
export const useCart = () => {
  const [cart, dispatch] = useReducer(cartReducer, initialCartState);

  const addItem = useCallback(
    (product: Product, design?: string, quantity: number = 1) => {
      dispatch({ type: "ADD_ITEM", payload: { product, design, quantity } });
    },
    []
  );

  const removeItem = useCallback((id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};
