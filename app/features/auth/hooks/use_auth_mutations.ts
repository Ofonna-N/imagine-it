import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { API_ROUTES } from "~/constants/route_paths"; // Import API_ROUTES

// Schema definitions
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type definitions
export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

// Login mutation - rename to follow convention
export function useMutateAuthLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["login"], // Adding a mutation key for identification
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await fetch(API_ROUTES.AUTH.LOGIN, {
        // Use correct constant
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include", // Critical for cookie handling
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries when login is successful
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// Keep backward compatibility
export const useLoginMutation = useMutateAuthLogin;

// Signup mutation - rename to follow convention
export function useMutateAuthSignup() {
  return useMutation({
    mutationKey: ["signup"], // Adding a mutation key for identification
    mutationFn: async (
      { email, password }: Omit<SignupFormValues, "confirmPassword">,
      metadata?: Record<string, any>
    ) => {
      const response = await fetch(API_ROUTES.AUTH.SIGNUP, {
        // Use correct constant
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, metadata }),
        credentials: "include", // Critical for cookie handling
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      return result;
    },
  });
}

// Keep backward compatibility
export const useSignupMutation = useMutateAuthSignup;

// Signout mutation - rename to follow convention
export function useMutateAuthSignout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["signout"], // Adding a mutation key for identification
    mutationFn: async () => {
      const response = await fetch(API_ROUTES.AUTH.SIGNOUT, {
        // Use correct constant
        method: "POST",
        credentials: "include", // Critical for cookie handling
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error);
      }

      return true;
    },
    onSuccess: () => {
      // Clear user data from cache when signed out
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// Keep backward compatibility
export const useSignoutMutation = useMutateAuthSignout;

// Type for OAuth providers
export type OAuthProvider = "google" | "github" | "facebook" | "twitter";

/**
 * Hook for handling OAuth sign-in with various providers
 */
export function useMutateAuthOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["oauth"], // Adding a mutation key for identification
    mutationFn: async (provider: OAuthProvider) => {
      const response = await fetch(API_ROUTES.AUTH.OAUTH(provider), {
        // Use correct constant
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Critical for cookie handling
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries when login is successful
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

// Keep backward compatibility with existing naming conventions
export const useOAuthMutation = useMutateAuthOAuth;
