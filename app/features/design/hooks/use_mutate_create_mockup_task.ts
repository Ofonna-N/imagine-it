import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type {
  PrintfulV2BaseResponse,
  PrintfulV2MockupGeneratorTask,
  PrintfulV2MockupGeneratorTaskRequest,
  PrintfulErrorResponse,
} from "~/types/printful";
import { API_ROUTES } from "~/constants/route_paths";

/**
 * Utility function to create Printful mockup tasks via the API proxy.
 * Note: The API might return an array of tasks even if only one product is specified.
 *
 * @param body The request body for the mockup task(s).
 * @returns The API response containing the initial task details (potentially an array).
 */
const createMockupTasks = async (
  body: PrintfulV2MockupGeneratorTaskRequest
): Promise<PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>> => {
  const response = await fetch(API_ROUTES.MOCKUP_TASKS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let errorData: PrintfulErrorResponse | { error: string };
    try {
      errorData = await response.json();
    } catch (parseError) {
      // If parsing fails, create a generic error message
      console.error("Failed to parse error response:", parseError); // Log the parsing error
      errorData = { error: `HTTP error! status: ${response.status}` };
    }
    const errorMessage =
      (errorData as PrintfulErrorResponse)?.error?.message ??
      (errorData as { error: string })?.error ??
      "Failed to create mockup task";
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Custom hook to create Printful mockup tasks using TanStack Query mutation.
 *
 * @param options Optional TanStack Query mutation options.
 */
export const useMutateCreateMockupTask = (
  options?: UseMutationOptions<
    PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>, // Success response type is an array
    Error, // Error type
    PrintfulV2MockupGeneratorTaskRequest // Variables type (mutation function input)
  >
) => {
  return useMutation<
    PrintfulV2BaseResponse<PrintfulV2MockupGeneratorTask[]>, // Return type is an array
    Error,
    PrintfulV2MockupGeneratorTaskRequest
  >({
    mutationKey: ["createMockupTask"], // Adding a mutation key for identification
    mutationFn: createMockupTasks,
    ...options,
  });
};
