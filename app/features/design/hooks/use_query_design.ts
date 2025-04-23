import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getDesignById } from "../api/mock_data";
import type { DesignRecord } from "~/db/schema/designs";

/**
 * Parameters for single design query
 */
interface DesignQueryParams {
  designId: string;
}

/**
 * Response for single design query
 */
interface DesignQueryResponse {
  design: DesignRecord | null;
}

/**
 * Fetch a single design by ID
 *
 * @param params - Contains designId to fetch
 * @returns Promise resolving to a single design or null
 */
async function fetchDesignById(
  params: DesignQueryParams
): Promise<DesignQueryResponse> {
  const { designId } = params;
  const design = getDesignById(designId);
  return { design: design || null };
}

/**
 * Hook for fetching a single design by ID using TanStack Query
 *
 * @param params - Query parameters containing the design ID
 * @param options - TanStack Query options for customizing query behavior
 * @returns Query result with design data
 */
export function useQueryDesign(
  params: DesignQueryParams,
  options?: Partial<
    UseQueryOptions<
      DesignQueryResponse,
      Error,
      DesignQueryResponse,
      ["design", DesignQueryParams]
    >
  >
) {
  return useQuery({
    queryKey: ["design", params],
    queryFn: async () => await fetchDesignById(params),
    enabled: !!params.designId,
    ...options,
  });
}
