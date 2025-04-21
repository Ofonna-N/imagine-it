import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import { API_ROUTES } from "~/constants/route_paths";

type SaveDesignInput = {
  name: string;
  image_url: string;
  preview_url?: string;
  canvas_data?: string;
  product_id?: string;
};

/**
 * Mutation hook for saving a design
 */
export function useMutateSaveDesign(
  options?: UseMutationOptions<{ design: any }, Error, SaveDesignInput>
) {
  return useMutation({
    mutationFn: async (input: SaveDesignInput) => {
      const formData = new FormData();
      formData.append("name", input.name);
      formData.append("image_url", input.image_url);
      if (input.preview_url) formData.append("preview_url", input.preview_url);
      if (input.product_id) formData.append("product_id", input.product_id);
      if (input.canvas_data) {
        formData.append("canvas_data", JSON.stringify(input.canvas_data));
      }

      const res = await fetch(API_ROUTES.DESIGNS, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to save design");
      }
      return res.json();
    },
    ...options,
  });
}
