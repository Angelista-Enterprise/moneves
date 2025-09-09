"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSession } from "next-auth/react";
import {
  FormattingConfig,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercentage,
  getDefaultFormattingConfig,
  validateFormattingConfig,
} from "@/lib/formatting";

interface FormattingContextType {
  // Formatting functions
  formatCurrency: (amount: number) => string;
  formatDate: (date: Date | string) => string;
  formatDateTime: (date: Date | string) => string;
  formatNumber: (number: number) => string;
  formatPercentage: (value: number) => string;

  // Config
  config: FormattingConfig;
  isLoading: boolean;
  error: Error | null;
}

const FormattingContext = createContext<FormattingContextType | undefined>(
  undefined
);

interface FormattingProviderProps {
  children: React.ReactNode;
}

export const FormattingProvider: React.FC<FormattingProviderProps> = ({
  children,
}) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "";

  const { settings, isLoading, error } = useUserSettings(userId);

  // Create formatting config from user settings
  const config = useMemo(() => {
    if (!settings) {
      return getDefaultFormattingConfig();
    }

    return validateFormattingConfig({
      currency: settings.currency,
      locale: settings.locale,
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
      numberFormat: settings.numberFormat,
    });
  }, [settings]);

  // Create formatting functions that use the current config
  const formattingFunctions = useMemo(
    () => ({
      formatCurrency: (amount: number) => formatCurrency(amount, config),
      formatDate: (date: Date | string) => formatDate(date, config),
      formatDateTime: (date: Date | string) => formatDateTime(date, config),
      formatNumber: (number: number) => formatNumber(number, config),
      formatPercentage: (value: number) => formatPercentage(value, config),
    }),
    [config]
  );

  const contextValue = useMemo(
    () => ({
      ...formattingFunctions,
      config,
      isLoading,
      error,
    }),
    [formattingFunctions, config, isLoading, error]
  );

  return (
    <FormattingContext.Provider value={contextValue}>
      {children}
    </FormattingContext.Provider>
  );
};

/**
 * Hook to use formatting functions throughout the app
 */
export const useFormatting = (): FormattingContextType => {
  const context = useContext(FormattingContext);

  if (context === undefined) {
    throw new Error("useFormatting must be used within a FormattingProvider");
  }

  return context;
};

/**
 * Hook to get just the formatting config
 */
export const useFormattingConfig = (): FormattingConfig => {
  const { config } = useFormatting();
  return config;
};
