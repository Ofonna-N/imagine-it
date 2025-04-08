import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  getAllDesigns,
  getDesignById,
  getDesignsByProductId,
  getPublicDesigns,
} from "../api/mock_data";
import type { Design } from "../types";

/**
 * Interface for designs query parameters
 */
interface DesignsQueryParams {
  productId?: string;
  publicOnly?: boolean;
}

/**
 * Interface for designs query response
 */
interface DesignsQueryResponse {
  designs: Design[];
}

/**
 * Hook for fetching designs using TanStack Query
 *
 * @param params - Query parameters for filtering designs
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with designs data, loading state, error state, etc.
 */
export function useQueryDesigns({
  params = {},
  options,
}: {
  params?: DesignsQueryParams;
  options?: Partial<
    UseQueryOptions<
      DesignsQueryResponse,
      Error,
      DesignsQueryResponse,
      ["designs", DesignsQueryParams]
    >
  >;
} = {}) {
  const { productId, publicOnly } = params;

  return useQuery({
    queryKey: ["designs", params],
    queryFn: async () => {
      // Simulate API call
      return new Promise<DesignsQueryResponse>((resolve) => {
        setTimeout(() => {
          let designs: Design[];

          if (productId) {
            designs = getDesignsByProductId(productId);
          } else if (publicOnly) {
            designs = getPublicDesigns();
          } else {
            designs = getAllDesigns();
          }

          resolve({ designs });
        }, 500);
      });
    },
    ...options,
  });
}

/**
 * Interface for single design query parameters
 */
interface DesignQueryParams {
  designId: string;
}

/**
 * Interface for single design query response
 */
interface DesignQueryResponse {
  design: Design | null;
}

/**
 * Hook for fetching a single design by ID using TanStack Query
 *
 * @param params - Query parameters containing the design ID
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with design data, loading state, error state, etc.
 */
export function useQueryDesign({
  params,
  options,
}: {
  params: DesignQueryParams;
  options?: Partial<
    UseQueryOptions<
      DesignQueryResponse,
      Error,
      DesignQueryResponse,
      ["design", DesignQueryParams]
    >
  >;
}) {
  const { designId } = params;

  return useQuery({
    queryKey: ["design", params],
    queryFn: async () => {
      // Simulate API call
      return new Promise<DesignQueryResponse>((resolve) => {
        setTimeout(() => {
          const design = getDesignById(designId);
          resolve({ design: design || null });
        }, 300);
      });
    },
    enabled: !!designId,
    ...options,
  });
}
