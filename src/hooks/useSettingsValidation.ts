"use client";

import { useState, useCallback, useMemo } from "react";
import {
  validateCurrency,
  validateLocale,
  validateTimezone,
  validateDateFormat,
  validateNumberFormat,
  validateBunqApiUrl,
  validateBunqApiKey,
  validateTransactionLimit,
  validateAllSettings,
  ValidationResult,
} from "@/lib/validation/settings";

export interface SettingsValidationState {
  currency: ValidationResult;
  locale: ValidationResult;
  timezone: ValidationResult;
  dateFormat: ValidationResult;
  numberFormat: ValidationResult;
  bunqApiUrl: ValidationResult;
  bunqApiKey: ValidationResult;
  bunqTransactionLimit: ValidationResult;
}

export interface UseSettingsValidationReturn {
  validationState: SettingsValidationState;
  validateField: (
    field: keyof SettingsValidationState,
    value: string | number
  ) => void;
  validateAll: (settings: Record<string, unknown>) => {
    isValid: boolean;
    errors: Record<string, string>;
  };
  clearValidation: (field?: keyof SettingsValidationState) => void;
  hasErrors: boolean;
  errorCount: number;
}

const initialValidationState: SettingsValidationState = {
  currency: { isValid: true },
  locale: { isValid: true },
  timezone: { isValid: true },
  dateFormat: { isValid: true },
  numberFormat: { isValid: true },
  bunqApiUrl: { isValid: true },
  bunqApiKey: { isValid: true },
  bunqTransactionLimit: { isValid: true },
};

export const useSettingsValidation = (): UseSettingsValidationReturn => {
  const [validationState, setValidationState] =
    useState<SettingsValidationState>(initialValidationState);

  const validateField = useCallback(
    (field: keyof SettingsValidationState, value: string | number) => {
      let result: ValidationResult;

      switch (field) {
        case "currency":
          result = validateCurrency(value as string);
          break;
        case "locale":
          result = validateLocale(value as string);
          break;
        case "timezone":
          result = validateTimezone(value as string);
          break;
        case "dateFormat":
          result = validateDateFormat(value as string);
          break;
        case "numberFormat":
          result = validateNumberFormat(value as string);
          break;
        case "bunqApiUrl":
          result = validateBunqApiUrl(value as string);
          break;
        case "bunqApiKey":
          result = validateBunqApiKey(value as string);
          break;
        case "bunqTransactionLimit":
          result = validateTransactionLimit(value as number);
          break;
        default:
          result = { isValid: true };
      }

      setValidationState((prev) => ({
        ...prev,
        [field]: result,
      }));
    },
    []
  );

  const validateAll = useCallback((settings: Record<string, unknown>) => {
    const result = validateAllSettings(settings);

    // Update validation state with all errors
    const newValidationState: SettingsValidationState = {
      ...initialValidationState,
    };

    Object.entries(result.errors).forEach(([field, error]) => {
      if (field in newValidationState) {
        (newValidationState as unknown as Record<string, ValidationResult>)[
          field
        ] = { isValid: false, error };
      }
    });

    setValidationState(newValidationState);

    return result;
  }, []);

  const clearValidation = useCallback(
    (field?: keyof SettingsValidationState) => {
      if (field) {
        setValidationState((prev) => ({
          ...prev,
          [field]: { isValid: true },
        }));
      } else {
        setValidationState(initialValidationState);
      }
    },
    []
  );

  const hasErrors = useMemo(() => {
    return Object.values(validationState).some((result) => !result.isValid);
  }, [validationState]);

  const errorCount = useMemo(() => {
    return Object.values(validationState).filter((result) => !result.isValid)
      .length;
  }, [validationState]);

  return {
    validationState,
    validateField,
    validateAll,
    clearValidation,
    hasErrors,
    errorCount,
  };
};
