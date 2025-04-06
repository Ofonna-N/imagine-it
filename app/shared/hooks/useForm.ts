import { useState, useCallback } from "react";
import type { ValidationError } from "../types";

interface UseFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validate?: (values: T) => ValidationError[] | Promise<ValidationError[]>;
}

export function useForm<T>({
  initialValues,
  onSubmit,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    setErrors((prev) => prev.filter((error) => error.field !== name));
  }, []);

  const handleSelectChange = useCallback(
    (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
      const name = e.target.name as string;
      const value = e.target.value;

      if (name) {
        setValues((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => prev.filter((error) => error.field !== name));
      }
    },
    []
  );

  const setValue = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => prev.filter((error) => error.field !== name));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        if (validate) {
          const newErrors = await validate(values);
          setErrors(newErrors);

          if (newErrors.length > 0) {
            setIsSubmitting(false);
            return;
          }
        }

        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors([]);
  }, [initialValues]);

  const getError = useCallback(
    (fieldName: string): string | undefined => {
      const error = errors.find((err) => err.field === fieldName);
      return error?.message;
    },
    [errors]
  );

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSelectChange,
    setValue,
    handleSubmit,
    resetForm,
    getError,
  };
}
