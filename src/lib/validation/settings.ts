/**
 * Settings validation utilities
 * Validates user settings input to ensure data integrity
 */

// ISO 4217 currency codes (commonly used ones)
const VALID_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "CAD",
  "AUD",
  "CHF",
  "CNY",
  "SEK",
  "NZD",
  "MXN",
  "SGD",
  "HKD",
  "NOK",
  "TRY",
  "RUB",
  "INR",
  "BRL",
  "ZAR",
  "KRW",
];

// Common locale strings
const VALID_LOCALES = [
  "en-US",
  "en-GB",
  "es-ES",
  "fr-FR",
  "de-DE",
  "it-IT",
  "pt-PT",
  "nl-NL",
  "sv-SE",
  "da-DK",
  "no-NO",
  "fi-FI",
  "pl-PL",
  "ru-RU",
  "ja-JP",
  "ko-KR",
  "zh-CN",
  "zh-TW",
  "ar-SA",
  "hi-IN",
  "th-TH",
  "vi-VN",
  "tr-TR",
  "pt-BR",
];

// Common timezone strings
const VALID_TIMEZONES = [
  "UTC",
  "GMT",
  "EST",
  "PST",
  "CST",
  "MST",
  "EDT",
  "PDT",
  "CDT",
  "MDT",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Madrid",
  "Europe/Amsterdam",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Asia/Singapore",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
  "Pacific/Honolulu",
];

// Valid date formats
const VALID_DATE_FORMATS = [
  "MM/dd/yyyy",
  "dd/MM/yyyy",
  "yyyy-MM-dd",
  "dd MMM yyyy",
  "MMM dd, yyyy",
];

// Valid number formats
const VALID_NUMBER_FORMATS = ["US", "EU", "IN"];

// Valid subscription tiers
const VALID_SUBSCRIPTION_TIERS = ["free", "premium", "pro"];

// Valid subscription statuses
const VALID_SUBSCRIPTION_STATUSES = [
  "active",
  "cancelled",
  "expired",
  "pending",
];

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate currency code
 */
export const validateCurrency = (currency: string): ValidationResult => {
  if (!currency || typeof currency !== "string") {
    return { isValid: false, error: "Currency is required" };
  }

  if (!VALID_CURRENCIES.includes(currency.toUpperCase())) {
    return {
      isValid: false,
      error: `Invalid currency code. Supported currencies: ${VALID_CURRENCIES.join(
        ", "
      )}`,
    };
  }

  return { isValid: true };
};

/**
 * Validate locale string
 */
export const validateLocale = (locale: string): ValidationResult => {
  if (!locale || typeof locale !== "string") {
    return { isValid: false, error: "Locale is required" };
  }

  if (!VALID_LOCALES.includes(locale)) {
    return {
      isValid: false,
      error: `Invalid locale. Supported locales: ${VALID_LOCALES.slice(
        0,
        10
      ).join(", ")}...`,
    };
  }

  return { isValid: true };
};

/**
 * Validate timezone string
 */
export const validateTimezone = (timezone: string): ValidationResult => {
  if (!timezone || typeof timezone !== "string") {
    return { isValid: false, error: "Timezone is required" };
  }

  if (!VALID_TIMEZONES.includes(timezone)) {
    return {
      isValid: false,
      error: `Invalid timezone. Supported timezones: ${VALID_TIMEZONES.slice(
        0,
        10
      ).join(", ")}...`,
    };
  }

  return { isValid: true };
};

/**
 * Validate date format string
 */
export const validateDateFormat = (dateFormat: string): ValidationResult => {
  if (!dateFormat || typeof dateFormat !== "string") {
    return { isValid: false, error: "Date format is required" };
  }

  if (!VALID_DATE_FORMATS.includes(dateFormat)) {
    return {
      isValid: false,
      error: `Invalid date format. Supported formats: ${VALID_DATE_FORMATS.join(
        ", "
      )}`,
    };
  }

  return { isValid: true };
};

/**
 * Validate number format string
 */
export const validateNumberFormat = (
  numberFormat: string
): ValidationResult => {
  if (!numberFormat || typeof numberFormat !== "string") {
    return { isValid: false, error: "Number format is required" };
  }

  if (!VALID_NUMBER_FORMATS.includes(numberFormat)) {
    return {
      isValid: false,
      error: `Invalid number format. Supported formats: ${VALID_NUMBER_FORMATS.join(
        ", "
      )}`,
    };
  }

  return { isValid: true };
};

/**
 * Validate subscription tier
 */
export const validateSubscriptionTier = (tier: string): ValidationResult => {
  if (!tier || typeof tier !== "string") {
    return { isValid: false, error: "Subscription tier is required" };
  }

  if (!VALID_SUBSCRIPTION_TIERS.includes(tier)) {
    return {
      isValid: false,
      error: `Invalid subscription tier. Supported tiers: ${VALID_SUBSCRIPTION_TIERS.join(
        ", "
      )}`,
    };
  }

  return { isValid: true };
};

/**
 * Validate subscription status
 */
export const validateSubscriptionStatus = (
  status: string
): ValidationResult => {
  if (!status || typeof status !== "string") {
    return { isValid: false, error: "Subscription status is required" };
  }

  if (!VALID_SUBSCRIPTION_STATUSES.includes(status)) {
    return {
      isValid: false,
      error: `Invalid subscription status. Supported statuses: ${VALID_SUBSCRIPTION_STATUSES.join(
        ", "
      )}`,
    };
  }

  return { isValid: true };
};

/**
 * Validate Bunq API URL
 */
export const validateBunqApiUrl = (url: string): ValidationResult => {
  if (!url || typeof url !== "string") {
    return { isValid: false, error: "API URL is required" };
  }

  try {
    const parsedUrl = new URL(url);

    // Check if it's a valid HTTP/HTTPS URL
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return {
        isValid: false,
        error: "API URL must use HTTP or HTTPS protocol",
      };
    }

    // Check for common Bunq API endpoints
    const validHosts = [
      "api.bunq.com",
      "api-sandbox.bunq.com",
      "localhost",
      "127.0.0.1",
    ];

    const hostname = parsedUrl.hostname;
    const isValidHost = validHosts.some(
      (validHost) =>
        hostname === validHost || hostname.endsWith(`.${validHost}`)
    );

    if (!isValidHost) {
      return {
        isValid: false,
        error:
          "Invalid API host. Use api.bunq.com, api-sandbox.bunq.com, or localhost",
      };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: "Invalid URL format" };
  }
};

/**
 * Validate Bunq API key (optional)
 */
export const validateBunqApiKey = (apiKey: string): ValidationResult => {
  // API key is optional, so empty string is valid
  if (!apiKey || typeof apiKey !== "string") {
    return { isValid: true };
  }

  // Bunq API keys are typically long alphanumeric strings
  if (apiKey.length < 20) {
    return { isValid: false, error: "API key appears to be too short" };
  }

  if (apiKey.length > 200) {
    return { isValid: false, error: "API key appears to be too long" };
  }

  // Check for basic alphanumeric pattern (Bunq keys are usually base64-like)
  const alphanumericPattern = /^[a-zA-Z0-9+/=_-]+$/;
  if (!alphanumericPattern.test(apiKey)) {
    return { isValid: false, error: "API key contains invalid characters" };
  }

  return { isValid: true };
};

/**
 * Validate transaction limit
 */
export const validateTransactionLimit = (limit: number): ValidationResult => {
  if (typeof limit !== "number" || isNaN(limit)) {
    return { isValid: false, error: "Transaction limit must be a number" };
  }

  if (limit < 1) {
    return { isValid: false, error: "Transaction limit must be at least 1" };
  }

  if (limit > 10000) {
    return { isValid: false, error: "Transaction limit cannot exceed 10,000" };
  }

  return { isValid: true };
};

/**
 * Validate all settings at once
 */
export const validateAllSettings = (
  settings: Record<string, unknown>
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  // Validate currency
  if (settings.currency && typeof settings.currency === "string") {
    const currencyResult = validateCurrency(settings.currency);
    if (!currencyResult.isValid) {
      errors.currency = currencyResult.error || "Invalid currency";
    }
  }

  // Validate locale
  if (settings.locale && typeof settings.locale === "string") {
    const localeResult = validateLocale(settings.locale);
    if (!localeResult.isValid) {
      errors.locale = localeResult.error || "Invalid locale";
    }
  }

  // Validate timezone
  if (settings.timezone && typeof settings.timezone === "string") {
    const timezoneResult = validateTimezone(settings.timezone);
    if (!timezoneResult.isValid) {
      errors.timezone = timezoneResult.error || "Invalid timezone";
    }
  }

  // Validate date format
  if (settings.dateFormat && typeof settings.dateFormat === "string") {
    const dateFormatResult = validateDateFormat(settings.dateFormat);
    if (!dateFormatResult.isValid) {
      errors.dateFormat = dateFormatResult.error || "Invalid date format";
    }
  }

  // Validate number format
  if (settings.numberFormat && typeof settings.numberFormat === "string") {
    const numberFormatResult = validateNumberFormat(settings.numberFormat);
    if (!numberFormatResult.isValid) {
      errors.numberFormat = numberFormatResult.error || "Invalid number format";
    }
  }

  // Validate subscription tier
  if (
    settings.subscriptionTier &&
    typeof settings.subscriptionTier === "string"
  ) {
    const tierResult = validateSubscriptionTier(settings.subscriptionTier);
    if (!tierResult.isValid) {
      errors.subscriptionTier = tierResult.error || "Invalid subscription tier";
    }
  }

  // Validate Bunq API URL
  if (settings.bunqApiUrl && typeof settings.bunqApiUrl === "string") {
    const urlResult = validateBunqApiUrl(settings.bunqApiUrl);
    if (!urlResult.isValid) {
      errors.bunqApiUrl = urlResult.error || "Invalid API URL";
    }
  }

  // Validate Bunq API key (optional)
  if (settings.bunqApiKey && typeof settings.bunqApiKey === "string") {
    const apiKeyResult = validateBunqApiKey(settings.bunqApiKey);
    if (!apiKeyResult.isValid) {
      errors.bunqApiKey = apiKeyResult.error || "Invalid API key";
    }
  }

  // Validate transaction limit
  if (
    settings.bunqTransactionLimit !== undefined &&
    typeof settings.bunqTransactionLimit === "number"
  ) {
    const limitResult = validateTransactionLimit(settings.bunqTransactionLimit);
    if (!limitResult.isValid) {
      errors.bunqTransactionLimit =
        limitResult.error || "Invalid transaction limit";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
