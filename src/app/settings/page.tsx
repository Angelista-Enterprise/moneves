"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { NavigationDock } from "@/components/navigation-dock";
import { useUserSettings, useShowBalance } from "@/hooks";
import { useSettingsValidation } from "@/hooks/useSettingsValidation";
import { PageHeader } from "@/components/ui";
import { useDataExport } from "@/lib/data-export";
import { useDataDeletion } from "@/lib/data-deletion";
import { useAnalytics } from "@/lib/analytics";
import { useSystemInfo } from "@/lib/system-info";
import { useBunqApiTest } from "@/lib/bunq-api-test";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Server,
  Database,
  DollarSign,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
  X,
  Settings as SettingsIcon,
} from "lucide-react";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Button component (same as other pages)
const sizes = [
  {
    tiny: "px-1.5 h-6 text-sm",
    small: "px-1.5 h-8 text-sm",
    medium: "px-2.5 h-10 text-sm",
    large: "px-3.5 h-12 text-base",
  },
  {
    tiny: "w-6 h-6 text-sm",
    small: "w-8 h-8 text-sm",
    medium: "w-10 h-10 text-sm",
    large: "w-12 h-12 text-base",
  },
];

const types = {
  primary:
    "bg-[#171717] dark:bg-[#ededed] hover:bg-[#383838] dark:hover:bg-[#cccccc] text-white dark:text-[#0a0a0a] fill-white dark:fill-[#0a0a0a]",
  secondary:
    "bg-white dark:bg-[#171717] hover:bg-[#00000014] dark:hover:bg-[#ffffff17] text-[#171717] dark:text-[#ededed] fill-[#171717] dark:fill-[#ededed] border border-[#00000014] dark:border-[#ffffff24]",
  tertiary:
    "bg-white dark:bg-[#171717] hover:bg-[#00000014] dark:hover:bg-[#ffffff17] text-[#171717] dark:text-[#ededed] fill-[#171717] dark:fill-[#ededed]",
  error:
    "bg-[#ea001d] dark:bg-[#e2162a] hover:bg-[#ae292f] dark:hover:bg-[#ff565f] text-[#f5f5f5] dark:text-white fill-[#f5f5f5] dark:fill-white",
  warning: "bg-[#ff9300] hover:bg-[#d27504] text-[#0a0a0a] fill-[#0a0a0a]",
  "ghost-blue":
    "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-300 transition-all duration-200",
  "ghost-green":
    "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 hover:text-green-300 transition-all duration-200",
  "ghost-purple":
    "bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 hover:text-purple-300 transition-all duration-200",
  "ghost-orange":
    "bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 hover:text-orange-300 transition-all duration-200",
  "ghost-pink":
    "bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 hover:text-pink-300 transition-all duration-200",
};

const shapes = {
  rounded: {
    tiny: "rounded-md",
    small: "rounded-lg",
    medium: "rounded-lg",
    large: "rounded-xl",
  },
  square: {
    tiny: "rounded-none",
    small: "rounded-none",
    medium: "rounded-none",
    large: "rounded-none",
  },
  circle: {
    tiny: "rounded-full",
    small: "rounded-full",
    medium: "rounded-full",
    large: "rounded-full",
  },
};

interface ButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "prefix" | "suffix"
  > {
  children: React.ReactNode;
  variant?: keyof typeof types;
  size?: keyof (typeof sizes)[0];
  shape?: keyof typeof shapes;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  svgOnly?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  shadow?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  shape = "rounded",
  loading = false,
  disabled = false,
  fullWidth = false,
  svgOnly = false,
  prefix,
  suffix,
  shadow = false,
  onClick,
  className,
  ...rest
}: ButtonProps) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      tabIndex={0}
      className={cn(
        `flex justify-center items-center gap-0.5 duration-150`,
        sizes[+svgOnly][size],
        disabled || loading
          ? "bg-[#f2f2f2] dark:bg-[#1a1a1a] text-[#8f8f8f] fill-[#8f8f8f] border border-[#ebebeb] dark:border-[#2e2e2e] cursor-not-allowed"
          : types[variant],
        shapes[shape][size],
        shadow
          ? "shadow-[0_0_0_1px_#00000014,_0px_2px_2px_#0000000a] border-none"
          : "",
        fullWidth ? "w-full" : "",
        "focus:shadow-[0_0_0_2px_hsla(0,0%,100%,1),0_0_0_4px_oklch(57.61%_0.2508_258.23)]",
        className
      )}
      {...rest}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      ) : (
        prefix
      )}
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap overflow-ellipsis font-sans",
          size === "tiny" ? "" : "px-1.5"
        )}
      >
        {children}
      </span>
      {!loading && suffix}
    </button>
  );
};

// Settings Card Component
interface SettingsCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const SettingsCard = ({
  title,
  description,
  icon,
  children,
  className,
  disabled = false,
}: SettingsCardProps) => {
  return (
    <div
      className={cn(
        "group relative p-6 rounded-xl overflow-hidden transition-all duration-300 border border-gray-800 bg-gray-900/50 hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] hover:-translate-y-0.5 will-change-transform",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-300">
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <div className={cn(disabled && "pointer-events-none")}>{children}</div>
      </div>
    </div>
  );
};

// Form Input Component
interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  showPasswordToggle?: boolean;
}

const FormInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  error,
  helpText,
  showPasswordToggle = false,
}: FormInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200",
            error &&
              "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

// Toggle Switch Component
interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900",
          checked ? "bg-blue-600" : "bg-gray-600",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};

// Select Component
interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
}

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  required = false,
  error,
  helpText,
}: SelectProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 appearance-none pr-8",
            error &&
              "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { settings, updateSettings } = useUserSettings(userId || "");
  const { validationState, validateField, validateAll, hasErrors, errorCount } =
    useSettingsValidation();

  const { showBalance, toggleBalance } = useShowBalance();
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Local state for form inputs
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState("en-US");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  const [numberFormat, setNumberFormat] = useState("US");

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  // Privacy Settings
  const [dataSharing, setDataSharing] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);

  // Bunq API Settings
  const [bunqApiKey, setBunqApiKey] = useState("");
  const [bunqApiUrl, setBunqApiUrl] = useState("http://localhost:8000");
  const [bunqTransactionLimit, setBunqTransactionLimit] = useState(100);

  // Subscription Settings
  const [subscriptionTier, setSubscriptionTier] = useState("free");
  const [subscriptionStatus] = useState("active");

  // Data management state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // System info state
  const [systemInfo, setSystemInfo] = useState<{
    application?: {
      version?: string;
      buildDate?: string;
      environment?: string;
    };
    database?: { type?: string; status?: string; lastBackup?: string };
  } | null>(null);
  const [isLoadingSystemInfo, setIsLoadingSystemInfo] = useState(false);

  // API testing state
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    status: string;
    message: string;
    responseTime?: number;
  } | null>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);

  // Hooks for data management
  const { exportUserData, downloadFile, getExportFilename } = useDataExport();
  const { deleteUserData } = useDataDeletion();
  const { track } = useAnalytics();
  const { getSystemInfo } = useSystemInfo();
  const { testConnection, resetApiErrors } = useBunqApiTest();

  // Load settings when they're available
  useEffect(() => {
    if (settings) {
      setCurrency(settings.currency || "USD");
      setLocale(settings.locale || "en-US");
      setTimezone(settings.timezone || "UTC");
      setDateFormat(settings.dateFormat || "MM/dd/yyyy");
      setNumberFormat(settings.numberFormat || "US");
      setEmailNotifications(settings.emailNotifications ?? true);
      setBudgetAlerts(settings.budgetAlerts ?? true);
      setGoalReminders(settings.goalReminders ?? true);
      setWeeklyReports(settings.weeklyReports ?? false);
      setDataSharing(settings.dataSharing ?? false);
      setAnalyticsOptIn(settings.analyticsOptIn ?? true);
      setBunqApiKey(settings.bunqApiKey || "");
      setBunqApiUrl(settings.bunqApiUrl || "http://localhost:8000");
      setBunqTransactionLimit(settings.bunqTransactionLimit || 100);
      setSubscriptionTier(settings.subscriptionTier || "free");
    }
  }, [settings]);

  // Options for selects
  const currencyOptions = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "JPY", label: "Japanese Yen (¥)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
  ];

  const localeOptions = [
    { value: "en-US", label: "English (US)" },
    { value: "en-GB", label: "English (UK)" },
    { value: "es-ES", label: "Spanish (Spain)" },
    { value: "fr-FR", label: "French (France)" },
    { value: "de-DE", label: "German (Germany)" },
    { value: "it-IT", label: "Italian (Italy)" },
    { value: "pt-PT", label: "Portuguese (Portugal)" },
    { value: "nl-NL", label: "Dutch (Netherlands)" },
  ];

  const timezoneOptions = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "London (GMT/BST)" },
    { value: "Europe/Paris", label: "Paris (CET/CEST)" },
    { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
    { value: "Asia/Tokyo", label: "Tokyo (JST)" },
    { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  ];

  const dateFormatOptions = [
    { value: "MM/dd/yyyy", label: "MM/DD/YYYY (US)" },
    { value: "dd/MM/yyyy", label: "DD/MM/YYYY (EU)" },
    { value: "yyyy-MM-dd", label: "YYYY-MM-DD (ISO)" },
    { value: "dd MMM yyyy", label: "DD MMM YYYY" },
    { value: "MMM dd, yyyy", label: "MMM DD, YYYY" },
  ];

  const numberFormatOptions = [
    { value: "US", label: "US (1,234.56)" },
    { value: "EU", label: "European (1.234,56)" },
    { value: "IN", label: "Indian (1,23,456.78)" },
  ];

  const subscriptionTierOptions = [
    { value: "free", label: "Free" },
    { value: "premium", label: "Premium" },
    { value: "pro", label: "Pro" },
  ];

  // Validation handlers
  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    validateField("currency", value);
  };

  const handleLocaleChange = (value: string) => {
    setLocale(value);
    validateField("locale", value);
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    validateField("timezone", value);
  };

  const handleDateFormatChange = (value: string) => {
    setDateFormat(value);
    validateField("dateFormat", value);
  };

  const handleNumberFormatChange = (value: string) => {
    setNumberFormat(value);
    validateField("numberFormat", value);
  };

  const handleBunqApiUrlChange = (value: string) => {
    setBunqApiUrl(value);
    validateField("bunqApiUrl", value);
  };

  const handleBunqApiKeyChange = (value: string) => {
    setBunqApiKey(value);
    validateField("bunqApiKey", value);
  };

  const handleBunqTransactionLimitChange = (value: string) => {
    const numValue = parseInt(value) || 100;
    setBunqTransactionLimit(numValue);
    validateField("bunqTransactionLimit", numValue);
  };

  const handleSave = async () => {
    if (!userId) {
      console.log("error");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }

    // Validate all settings before saving
    const settingsToSave = {
      currency,
      locale,
      timezone,
      dateFormat,
      numberFormat,
      emailNotifications,
      budgetAlerts,
      goalReminders,
      weeklyReports,
      dataSharing,
      analyticsOptIn,
      bunqApiKey,
      bunqApiUrl,
      bunqTransactionLimit,
      subscriptionTier,
    };

    const validationResult = validateAll(settingsToSave);
    if (!validationResult.isValid) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
      return;
    }

    setIsLoading(true);
    setSaveStatus("saving");

    try {
      await updateSettings(settingsToSave);

      // Track settings change
      track("settings_changed", {
        settings: Object.keys(settingsToSave),
        userId,
      });

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("[SettingsPage]: Error saving settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle data export
  const handleExportData = async (format: "json" | "csv" | "xlsx") => {
    if (!userId || !session?.user) return;

    try {
      const blob = await exportUserData(
        userId,
        session.user.email || "",
        session.user.name || "",
        {
          format,
          includeTransactions: true,
          includeBudgets: true,
          includeGoals: true,
          includeSettings: true,
        }
      );

      const filename = getExportFilename(format, userId);
      downloadFile(blob, filename);

      // Track export action
      track("data_exported", {
        format,
        userId,
      });
    } catch (error) {
      console.error("[SettingsPage]: Error exporting data:", error);
    }
  };

  // Handle data deletion
  const handleDeleteData = async () => {
    if (!userId) return;

    setIsDeleting(true);
    try {
      const result = await deleteUserData(userId, {
        deleteTransactions: true,
        deleteBudgets: true,
        deleteGoals: true,
        deleteSettings: true,
        deleteAccount: true,
        confirmDeletion: true,
      });

      if (result.success) {
        // Track deletion
        track("data_deleted", {
          deletedItems: result.deletedItems,
          userId,
        });

        // Redirect to sign out or home page
        window.location.href = "/auth/signin";
      } else {
        console.error("Deletion failed:", result.errors);
      }
    } catch (error) {
      console.error("[SettingsPage]: Error deleting data:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Handle system info loading
  const handleLoadSystemInfo = async () => {
    setIsLoadingSystemInfo(true);
    try {
      const info = await getSystemInfo();
      setSystemInfo(info);
      track("system_info_loaded", { userId });
    } catch (error) {
      console.error("[SettingsPage]: Error loading system info:", error);
    } finally {
      setIsLoadingSystemInfo(false);
    }
  };

  // Handle API testing
  const handleTestApi = async () => {
    if (!bunqApiUrl) return;

    setIsTestingApi(true);
    try {
      const result = await testConnection(bunqApiUrl, bunqApiKey);
      setApiTestResult(result);

      // Reset API errors on successful connection
      if (result.success) {
        resetApiErrors(bunqApiUrl);
      }

      track("api_tested", {
        apiUrl: bunqApiUrl,
        success: result.success,
        userId,
      });
    } catch (error) {
      console.error("[SettingsPage]: Error testing API:", error);
      setApiTestResult({
        success: false,
        status: "error",
        message: "Failed to test API connection",
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="min-h-screen bg-black/95 backdrop-blur-sm text-white pb-20 xl:pb-0">
      {/* Header */}
      <PageHeader
        title="Settings"
        description="Make Claru yours — preferences, formats, and connections"
        icon={<SettingsIcon className="h-6 w-6 text-white" />}
        showBalance={showBalance}
        onToggleBalance={toggleBalance}
        rightActions={
          <div className="flex items-center gap-3">
            {hasErrors && (
              <div className="text-sm text-red-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {errorCount} validation error{errorCount !== 1 ? "s" : ""}
              </div>
            )}
            <Button
              variant="ghost-green"
              size="medium"
              onClick={handleSave}
              loading={isLoading}
              disabled={hasErrors}
              prefix={<Save size={16} />}
              suffix={
                saveStatus === "saved" ? (
                  <CheckCircle size={16} />
                ) : saveStatus === "error" ? (
                  <X size={16} />
                ) : null
              }
            >
              {saveStatus === "saved"
                ? "Saved"
                : saveStatus === "error"
                ? "Error"
                : hasErrors
                ? "Fix Errors"
                : "Save Changes"}
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-4">
          {/* Settings Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Preferences */}
            <SettingsCard
              title="User Preferences"
              description="Configure your personal preferences and regional settings"
              icon={<User className="w-4 h-4 text-blue-500" />}
            >
              <div className="space-y-4">
                <Select
                  label="Currency"
                  value={currency}
                  onChange={handleCurrencyChange}
                  options={currencyOptions}
                  helpText="This will be used for displaying all monetary values"
                  error={validationState.currency.error}
                />
                <Select
                  label="Language & Region"
                  value={locale}
                  onChange={handleLocaleChange}
                  options={localeOptions}
                  helpText="Affects date, number, and currency formatting"
                  error={validationState.locale.error}
                />
                <Select
                  label="Timezone"
                  value={timezone}
                  onChange={handleTimezoneChange}
                  options={timezoneOptions}
                  helpText="Used for displaying dates and times"
                  error={validationState.timezone.error}
                />
                <Select
                  label="Date Format"
                  value={dateFormat}
                  onChange={handleDateFormatChange}
                  options={dateFormatOptions}
                  helpText="How dates are displayed throughout the application"
                  error={validationState.dateFormat.error}
                />
                <Select
                  label="Number Format"
                  value={numberFormat}
                  onChange={handleNumberFormatChange}
                  options={numberFormatOptions}
                  helpText="How numbers are formatted (decimal separator, thousands separator)"
                  error={validationState.numberFormat.error}
                />
              </div>
            </SettingsCard>

            {/* Notification Settings */}
            <SettingsCard
              title="Notifications"
              description="Control when and how you receive notifications"
              icon={<Bell className="w-4 h-4 text-green-500" />}
              disabled
            >
              <div className="space-y-4">
                <Toggle
                  label="Email Notifications"
                  description="Receive important updates via email"
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <Toggle
                  label="Budget Alerts"
                  description="Get notified when approaching budget limits"
                  checked={budgetAlerts}
                  onChange={setBudgetAlerts}
                />
                <Toggle
                  label="Goal Reminders"
                  description="Reminders for your financial goals"
                  checked={goalReminders}
                  onChange={setGoalReminders}
                />
                <Toggle
                  label="Weekly Reports"
                  description="Receive weekly financial summary reports"
                  checked={weeklyReports}
                  onChange={setWeeklyReports}
                />

                {/* Notification Testing */}
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Test Notifications
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Send test notifications to verify your email settings are
                    working correctly.
                  </p>
                </div>
              </div>
            </SettingsCard>

            {/* Privacy Settings */}
            <SettingsCard
              title="Privacy & Data"
              description="Control your data sharing and privacy preferences"
              icon={<Shield className="w-4 h-4 text-purple-500" />}
              disabled
            >
              <div className="space-y-4">
                <Toggle
                  label="Data Sharing"
                  description="Allow anonymized data to be used for product improvement"
                  checked={dataSharing}
                  onChange={setDataSharing}
                />
                <Toggle
                  label="Analytics"
                  description="Help us improve the app by sharing usage analytics"
                  checked={analyticsOptIn}
                  onChange={setAnalyticsOptIn}
                />

                {/* Data Export Section */}
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Export Your Data
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Download a copy of your financial data in JSON, CSV, or
                    Excel format.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleExportData("json")}
                    >
                      Export JSON
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleExportData("csv")}
                    >
                      Export CSV
                    </Button>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleExportData("xlsx")}
                    >
                      Export Excel
                    </Button>
                  </div>
                </div>

                {/* Data Deletion Section */}
                <div className="p-4 bg-red-900/20 rounded-lg border border-red-700/50">
                  <h4 className="text-sm font-medium text-red-300 mb-3">
                    Delete Your Data
                  </h4>
                  <p className="text-xs text-red-400 mb-3">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                  <Button
                    variant="error"
                    size="small"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete All Data
                  </Button>
                </div>

                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">
                        Data Security
                      </h4>
                      <p className="text-xs text-gray-500">
                        Your financial data is encrypted and stored securely. We
                        never share your personal information with third
                        parties.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Bunq API Settings */}
            <SettingsCard
              title="Bunq API Integration"
              description="Configure your Bunq API connection for real-time data"
              icon={<CreditCard className="w-4 h-4 text-orange-500" />}
              disabled
            >
              <div className="space-y-4">
                <FormInput
                  label="API Key"
                  type="password"
                  value={bunqApiKey}
                  onChange={handleBunqApiKeyChange}
                  placeholder="Enter your Bunq API key"
                  showPasswordToggle
                  helpText="Your Bunq API key for accessing account data"
                  error={validationState.bunqApiKey.error}
                />
                <FormInput
                  label="API URL"
                  type="url"
                  value={bunqApiUrl}
                  onChange={handleBunqApiUrlChange}
                  placeholder="https://api.bunq.com"
                  helpText="Bunq API endpoint URL"
                  error={validationState.bunqApiUrl.error}
                />
                <FormInput
                  label="Transaction Limit"
                  type="number"
                  value={bunqTransactionLimit.toString()}
                  onChange={handleBunqTransactionLimitChange}
                  placeholder="100"
                  helpText="Maximum number of transactions to fetch per request"
                  error={validationState.bunqTransactionLimit.error}
                />
                {/* API Testing Section */}
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Test API Connection
                  </h4>
                  <p className="text-xs text-gray-500 mb-3">
                    Test your Bunq API connection to ensure it&apos;s working
                    correctly.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleTestApi}
                      loading={isTestingApi}
                    >
                      Test Connection
                    </Button>
                    {apiTestResult && (
                      <div className="flex-1">
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            apiTestResult.success
                              ? "bg-green-900/20 text-green-400 border border-green-700/50"
                              : "bg-red-900/20 text-red-400 border border-red-700/50"
                          }`}
                        >
                          {apiTestResult.message}
                          {apiTestResult.responseTime &&
                            ` (${apiTestResult.responseTime}ms)`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-300 mb-1">
                        Production API
                      </h4>
                      <p className="text-xs text-blue-200">
                        This application uses production Bunq API tokens. Make
                        sure your API key has the necessary permissions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Subscription Settings */}
            <SettingsCard
              title="Subscription"
              description="Manage your subscription and billing information"
              icon={<DollarSign className="w-4 h-4 text-yellow-500" />}
              disabled
            >
              <div className="space-y-4">
                <Select
                  label="Subscription Tier"
                  value={subscriptionTier}
                  onChange={setSubscriptionTier}
                  options={subscriptionTierOptions}
                  helpText="Contact support to change your subscription tier"
                />
                <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">
                        Current Plan:{" "}
                        {subscriptionTier.charAt(0).toUpperCase() +
                          subscriptionTier.slice(1)}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        Status: {subscriptionStatus}
                      </p>
                    </div>
                    <Button variant="secondary" size="small">
                      Manage Billing
                    </Button>
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* System Information */}
            <SettingsCard
              title="System Information"
              description="Application version and system details"
              icon={<Server className="w-4 h-4 text-gray-500" />}
              disabled
            >
              <div className="space-y-4">
                {systemInfo ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Version
                        </label>
                        <p className="text-sm text-gray-400 mt-1">
                          {systemInfo.application?.version || "1.0.0"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Build
                        </label>
                        <p className="text-sm text-gray-400 mt-1">
                          {systemInfo.application?.buildDate
                            ? new Date(
                                systemInfo.application.buildDate
                              ).toLocaleDateString()
                            : "2024.12.15"}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Environment
                        </label>
                        <p className="text-sm text-gray-400 mt-1">
                          {systemInfo.application?.environment || "Production"}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-300">
                          Database
                        </label>
                        <p className="text-sm text-gray-400 mt-1">
                          {systemInfo.database?.type || "SQLite"}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                      <div className="flex items-center gap-3">
                        <Database className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-300">
                            Data Storage
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Status: {systemInfo.database?.status || "Unknown"}
                            {systemInfo.database?.lastBackup &&
                              ` • Last backup: ${new Date(
                                systemInfo.database.lastBackup
                              ).toLocaleString()}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">
                      System information not loaded
                    </p>
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={handleLoadSystemInfo}
                      loading={isLoadingSystemInfo}
                    >
                      Load System Info
                    </Button>
                  </div>
                )}
              </div>
            </SettingsCard>
          </div>
        </div>
      </div>

      {/* Data Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl border border-red-700/50 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">
                Delete All Data
              </h3>
            </div>
            <p className="text-gray-300 mb-6">
              This action will permanently delete your account and all
              associated data including:
            </p>
            <ul className="text-sm text-gray-400 mb-6 space-y-1">
              <li>• All transactions and financial records</li>
              <li>• All budgets and spending categories</li>
              <li>• All savings goals and progress</li>
              <li>• All settings and preferences</li>
              <li>• Your account and login information</li>
            </ul>
            <p className="text-red-400 text-sm mb-6 font-medium">
              This action cannot be undone. Are you absolutely sure?
            </p>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="medium"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="error"
                size="medium"
                onClick={handleDeleteData}
                loading={isDeleting}
                className="flex-1"
              >
                {isDeleting ? "Deleting..." : "Delete Everything"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <NavigationDock />
    </div>
  );
}
