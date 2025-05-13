import { API_ROUTES } from "~/constants/route_paths";
import { useMutation, type UseMutationOptions } from "@tanstack/react-query";

/**
 * PATCH /api/theme
 * Utility: Persists the user's theme mode (light/dark) in a cookie session
 */
export type ThemeMode = "light" | "dark";

export type UpdateThemeModePayload = {
  mode: ThemeMode;
};

export type UpdateThemeModeResponse = {
  success: boolean;
  mode: ThemeMode;
};

export const useMutateThemeMode = (
  options?: UseMutationOptions<
    UpdateThemeModeResponse,
    Error,
    UpdateThemeModePayload
  >
) => {
  return useMutation({
    mutationKey: ["themeMode"],
    mutationFn: async (payload: UpdateThemeModePayload) => {
      const res = await fetch(API_ROUTES.THEME, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Failed to update theme mode");
      }
      return res.json();
    },
    ...options,
  });
};
