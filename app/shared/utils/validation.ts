import type { ValidationError } from "../types";

/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Required field validation
 */
export const isRequired = (value: any): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
};

/**
 * Min/max length validation
 */
export const isValidLength = (
  value: string,
  min: number = 0,
  max: number = Infinity
): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};

/**
 * Password strength validation
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate a form field and return a validation error if invalid
 */
export const validateField = (
  fieldName: string,
  value: any,
  rules: { [key: string]: any }
): ValidationError | null => {
  if (rules.required && !isRequired(value)) {
    return {
      field: fieldName,
      message: rules.requiredMessage || "This field is required",
    };
  }

  if (rules.email && !isValidEmail(value)) {
    return {
      field: fieldName,
      message: rules.emailMessage || "Invalid email address",
    };
  }

  if (rules.minLength && !isValidLength(value, rules.minLength)) {
    return {
      field: fieldName,
      message:
        rules.minLengthMessage ||
        `Must be at least ${rules.minLength} characters`,
    };
  }

  if (rules.maxLength && !isValidLength(value, 0, rules.maxLength)) {
    return {
      field: fieldName,
      message:
        rules.maxLengthMessage ||
        `Must be no more than ${rules.maxLength} characters`,
    };
  }

  if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
    return {
      field: fieldName,
      message: rules.patternMessage || "Invalid format",
    };
  }

  return null;
};

/**
 * Validate multiple fields at once, returning an array of validation errors
 */
export const validateFields = (
  values: { [key: string]: any },
  validationRules: { [key: string]: any }
): ValidationError[] => {
  const errors: ValidationError[] = [];

  Object.keys(validationRules).forEach((fieldName) => {
    const value = values[fieldName];
    const rules = validationRules[fieldName];
    const error = validateField(fieldName, value, rules);

    if (error) {
      errors.push(error);
    }
  });

  return errors;
};
