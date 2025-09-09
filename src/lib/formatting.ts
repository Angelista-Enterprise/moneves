/**
 * Centralized formatting utilities that use user settings
 * This module provides consistent formatting across the entire application
 */

export interface FormattingConfig {
  currency: string;
  locale: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
}

/**
 * Format currency amount based on user's currency and locale settings
 */
export const formatCurrency = (
  amount: number,
  config: FormattingConfig
): string => {
  try {
    const formatter = new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.currency,
    });
    return formatter.format(amount);
  } catch (error) {
    console.warn(
      `[formatting] Invalid currency/locale: ${config.currency}/${config.locale}`,
      error
    );
    // Fallback to USD
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }
};

/**
 * Format date based on user's date format and timezone settings
 */
export const formatDate = (
  date: Date | string,
  config: FormattingConfig
): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Convert to user's timezone
    const timezoneDate = new Date(
      dateObj.toLocaleString("en-US", { timeZone: config.timezone })
    );

    // Check if date is valid
    if (isNaN(timezoneDate.getTime())) {
      console.warn(`[formatting] Invalid date: ${date}`);
      return "Invalid Date";
    }

    // Format based on user's date format preference
    switch (config.dateFormat) {
      case "MM/dd/yyyy":
        return timezoneDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      case "dd/MM/yyyy":
        return timezoneDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      case "yyyy-MM-dd":
        return timezoneDate.toLocaleDateString("sv-SE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      case "dd MMM yyyy":
        return timezoneDate.toLocaleDateString("en-GB", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        });
      case "MMM dd, yyyy":
        return timezoneDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      default:
        return timezoneDate.toLocaleDateString(config.locale);
    }
  } catch (error) {
    console.warn(
      `[formatting] Invalid date/timezone: ${date}/${config.timezone}`,
      error
    );
    // Fallback to default formatting
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) {
      return "Invalid Date";
    }
    return dateObj.toLocaleDateString("en-US");
  }
};

/**
 * Format date with time based on user's timezone settings
 */
export const formatDateTime = (
  date: Date | string,
  config: FormattingConfig
): string => {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Convert to user's timezone
    const timezoneDate = new Date(
      dateObj.toLocaleString("en-US", { timeZone: config.timezone })
    );

    return timezoneDate.toLocaleString(config.locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.warn(
      `[formatting] Invalid datetime/timezone: ${date}/${config.timezone}`,
      error
    );
    // Fallback to default formatting
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toLocaleString("en-US");
  }
};

/**
 * Format number based on user's number format settings
 */
export const formatNumber = (
  number: number,
  config: FormattingConfig
): string => {
  try {
    // Check if number is valid
    if (isNaN(number) || !isFinite(number)) {
      console.warn(`[formatting] Invalid number: ${number}`);
      return "Invalid Number";
    }

    switch (config.numberFormat) {
      case "US":
        // US format: 1,234.56 (comma as thousands separator, period as decimal)
        return new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(number);
      case "EU":
        // EU format: 1.234,56 (period as thousands separator, comma as decimal)
        return new Intl.NumberFormat("de-DE", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(number);
      case "IN":
        // Indian format: 1,23,456.78 (lakhs and crores system)
        return new Intl.NumberFormat("en-IN", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(number);
      default:
        return new Intl.NumberFormat(config.locale, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(number);
    }
  } catch (error) {
    console.warn(
      `[formatting] Invalid number format: ${config.numberFormat}`,
      error
    );
    // Fallback to default formatting
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  }
};

/**
 * Format percentage based on user's locale settings
 */
export const formatPercentage = (
  value: number,
  config: FormattingConfig
): string => {
  try {
    return new Intl.NumberFormat(config.locale, {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value / 100);
  } catch (error) {
    console.warn(
      `[formatting] Invalid percentage format for locale: ${config.locale}`,
      error
    );
    // Fallback to default formatting
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(value / 100);
  }
};

/**
 * Get default formatting config (fallback)
 */
export const getDefaultFormattingConfig = (): FormattingConfig => ({
  currency: "USD",
  locale: "en-US",
  timezone: "UTC",
  dateFormat: "MM/dd/yyyy",
  numberFormat: "US",
});

/**
 * Validate formatting config
 */
export const validateFormattingConfig = (
  config: Partial<FormattingConfig>
): FormattingConfig => {
  const defaultConfig = getDefaultFormattingConfig();

  return {
    currency: config.currency || defaultConfig.currency,
    locale: config.locale || defaultConfig.locale,
    timezone: config.timezone || defaultConfig.timezone,
    dateFormat: config.dateFormat || defaultConfig.dateFormat,
    numberFormat: config.numberFormat || defaultConfig.numberFormat,
  };
};
