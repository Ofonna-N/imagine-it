import {
  useQuery,
  type UseQueryOptions,
  keepPreviousData,
  type Query,
} from "@tanstack/react-query";
import type {
  PrintfulV2BaseResponse,
  PrintfulV2MockupGeneratorTask,
  PrintfulErrorResponse,
} from "~/types/printful";
import { API_ROUTES } from "~/constants/route_paths";

/**
 * Utility function to fetch the status/result of a Printful mockup task.
 * Note: The API might return an array containing the single requested task.
 *
 * @param taskId The ID of the mockup task.
 * @returns The API response containing the task details (potentially in an array).
 */
const fetchMockupTaskResult = async (
  taskIds: number[] | string[] | undefined
): Promise<PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>> => {
  // Expect an array
  const url = `${API_ROUTES.MOCKUP_TASKS}?id=${taskIds?.join(",")}`; // Use the constant for the API path
  const response = await fetch(url);

  if (!response.ok) {
    let errorData: PrintfulErrorResponse | { error: string };
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: `HTTP error! status: ${response.status}` };
      console.error("Error parsing response:", e);
    }
    const errorMessage =
      (errorData as PrintfulErrorResponse)?.error?.message ??
      (errorData as { error: string })?.error ??
      "Failed to fetch mockup task result";
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Define the specific QueryKey type
 */
type MockupTaskResultQueryKey = ["mockupTaskResult", string | undefined];

/**
 * Custom hook to poll for Printful mockup task results using TanStack Query.
 *
 * @param taskId The ID of the mockup task to poll. Disabled if taskId is null/undefined.
 * @param options Optional TanStack Query options.
 */
export const useQueryMockupTaskResult = (
  taskIds: number[] | null | undefined,
  options?: Omit<
    UseQueryOptions<
      PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>, // Expect array
      Error,
      PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>, // Expect array
      MockupTaskResultQueryKey
    >,
    "queryKey" | "queryFn" | "placeholderData"
  >
) => {
  const enabled = options?.enabled ?? !!taskIds?.length; // Enable if taskIds is provided and not empty

  const refetchInterval = (
    query: Query<
      PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>, // Expect array
      Error,
      PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>, // Expect array
      MockupTaskResultQueryKey
    >
  ): number | false => {
    // Default polling logic: Check status of the first task in the array
    const tasks = query.state.data?.data;
    if (tasks?.every((task) => task.status !== "pending")) {
      return false; // Stop polling
    }
    return 6000; // Poll every 6 seconds
  };

  const taskIdsString = taskIds?.map((id) => id.toString()).join(",") ?? "";
  return useQuery({
    queryKey: ["mockupTaskResult", taskIdsString], // Use taskIds as part of the query key
    queryFn: () => {
      if (!taskIds?.length) {
        return Promise.reject(new Error("Task IDDs are required."));
      }
      console.log("Fetching mockup task result for taskIds:", taskIds);
      return fetchMockupTaskResult(taskIds);
    },
    ...options,
    enabled: enabled,
    refetchInterval: refetchInterval,
    placeholderData: keepPreviousData,
  });
};
