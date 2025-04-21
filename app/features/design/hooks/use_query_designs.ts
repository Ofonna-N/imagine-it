import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  getAllDesigns,
  getDesignsByProductId,
  getPublicDesigns,
} from "../api/mock_data";
import type { DesignRecord } from "~/db/schema/designs";

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
  designs: DesignRecord[];
}

/**
 * Fetches designs based on query parameters
 *
 * @param params - Query parameters for filtering designs
 * @returns Promise resolving to designs data
 */
async function fetchDesigns(
  params: DesignsQueryParams
): Promise<DesignsQueryResponse> {
  const { productId, publicOnly } = params;

  let designs: DesignRecord[];

  if (productId) {
    designs = getDesignsByProductId(productId);
  } else if (publicOnly) {
    designs = getPublicDesigns();
  } else {
    designs = getAllDesigns();
  }

  return { designs };
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
  return useQuery({
    queryKey: ["designs", params],
    queryFn: () => fetchDesigns(params),
    ...options,
  });
}

// The `useQueryUserDesigns` hook has been moved to `use_query_user_designs.ts`
// The `useQueryDesign` hook has been moved to `use_query_design.ts`
