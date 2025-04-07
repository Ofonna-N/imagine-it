import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

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

// Login mutation
export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginFormValues) => {
      const response = await fetch("/api/auth/login", {
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

// Signup mutation
export function useSignupMutation() {
  return useMutation({
    mutationFn: async (
      { email, password }: Omit<SignupFormValues, "confirmPassword">,
      metadata?: Record<string, any>
    ) => {
      const response = await fetch("/api/auth/signup", {
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

// Signout mutation
export function useSignoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/signout", {
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
