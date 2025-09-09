"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUserSettings } from "@/hooks";
import { useSettingsValidation } from "@/hooks/useSettingsValidation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Bell,
  Shield,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  Check,
  DollarSign,
  AlertCircle,
} from "lucide-react";

// Utility function for className merging
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};

// Button component
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
}

const ButtonComponent: React.FC<ButtonProps> = ({
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
  className,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const sizeClasses = svgOnly ? sizes[1][size] : sizes[0][size];
  const variantClasses = types[variant];
  const shapeClasses = shapes[shape][size];
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      className={cn(
        baseClasses,
        sizeClasses,
        variantClasses,
        shapeClasses,
        widthClasses,
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      )}
      {prefix && <span className="mr-2">{prefix}</span>}
      {!svgOnly && children}
      {suffix && <span className="ml-2">{suffix}</span>}
    </button>
  );
};

// Toggle component
interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </div>
        {description && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
          checked ? "bg-indigo-600" : "bg-gray-200 dark:bg-gray-700"
        )}
        onClick={() => onChange(!checked)}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};

// Form Input component
interface FormInputProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  description,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  error,
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

// Select component
interface SelectProps {
  label: string;
  description?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  error?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  description,
  value,
  onChange,
  options,
  required = false,
  error,
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500"
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500 flex items-center">
          <AlertCircle className="w-3 h-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

// Setup steps configuration
const setupSteps = [
  {
    id: "financial",
    title: "Financial Settings",
    description: "Configure currency, locale, and formatting",
    icon: <DollarSign className="w-6 h-6" />,
    color: "text-green-500",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Choose how you want to be notified",
    icon: <Bell className="w-6 h-6" />,
    color: "text-yellow-500",
  },
  {
    id: "privacy",
    title: "Privacy & Data",
    description: "Control your data sharing preferences",
    icon: <Shield className="w-6 h-6" />,
    color: "text-purple-500",
  },
  {
    id: "api",
    title: "API Integration",
    description: "Connect your Bunq account (optional)",
    icon: <CreditCard className="w-6 h-6" />,
    color: "text-orange-500",
  },
];

export default function SetupWizard() {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user?.id;

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Settings state
  const [currency, setCurrency] = useState("USD");
  const [locale, setLocale] = useState("en-US");
  const [timezone, setTimezone] = useState("UTC");
  const [dateFormat, setDateFormat] = useState("MM/dd/yyyy");
  const [numberFormat, setNumberFormat] = useState("US");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [goalReminders, setGoalReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [dataSharing, setDataSharing] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(true);
  const [bunqApiKey, setBunqApiKey] = useState("");
  const [bunqApiUrl, setBunqApiUrl] = useState("http://localhost:8000");

  // Hooks
  const {
    settings,
    updateSettings,
    isLoading: settingsLoading,
  } = useUserSettings(userId || "");
  const { validateAll, validationState } = useSettingsValidation();

  // Load existing settings if available
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
    }
  }, [settings]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!session && !settingsLoading) {
      router.push("/auth/signin");
    }
  }, [session, settingsLoading, router]);

  const handleNext = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepComplete = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
  };

  const handleSaveAndContinue = async () => {
    setIsLoading(true);
    setError("");

    try {
      const settingsData = {
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
        bunqApiKey: bunqApiKey || undefined,
        bunqApiUrl,
        bunqTransactionLimit: 100,
      };

      // Validate settings
      const validation = validateAll(settingsData);
      if (!validation.isValid) {
        setError("Please fix the validation errors before continuing.");
        return;
      }

      // Update settings including setup completion
      const finalSettingsData = {
        ...settingsData,
        setupCompleted: currentStep === setupSteps.length - 1, // Mark as completed on last step
      };

      await updateSettings(finalSettingsData);

      // Mark step as completed
      handleStepComplete();

      // Move to next step or finish
      if (currentStep < setupSteps.length - 1) {
        handleNext();
      } else {
        // Setup complete, redirect to dashboard
        router.push("/?setup=complete");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    // If skipping the last step, mark setup as completed
    if (currentStep === setupSteps.length - 1) {
      try {
        await updateSettings({ setupCompleted: true });
      } catch (error) {
        console.error("Error marking setup as completed:", error);
      }
    }

    handleStepComplete();
    if (currentStep < setupSteps.length - 1) {
      handleNext();
    } else {
      router.push("/?setup=complete");
    }
  };

  const renderStepContent = () => {
    const step = setupSteps[currentStep];

    switch (step.id) {
      case "financial":
        return (
          <div className="space-y-6">
            <Select
              label="Currency"
              description="Select your primary currency for transactions"
              value={currency}
              onChange={setCurrency}
              options={[
                { value: "USD", label: "US Dollar (USD)" },
                { value: "EUR", label: "Euro (EUR)" },
                { value: "GBP", label: "British Pound (GBP)" },
                { value: "JPY", label: "Japanese Yen (JPY)" },
                { value: "CAD", label: "Canadian Dollar (CAD)" },
                { value: "AUD", label: "Australian Dollar (AUD)" },
              ]}
              required
              error={
                validationState.currency.isValid
                  ? undefined
                  : validationState.currency.error
              }
            />
            <Select
              label="Locale"
              description="Select your language and region"
              value={locale}
              onChange={setLocale}
              options={[
                { value: "en-US", label: "English (United States)" },
                { value: "en-GB", label: "English (United Kingdom)" },
                { value: "en-CA", label: "English (Canada)" },
                { value: "en-AU", label: "English (Australia)" },
                { value: "de-DE", label: "Deutsch (Deutschland)" },
                { value: "fr-FR", label: "Français (France)" },
                { value: "es-ES", label: "Español (España)" },
              ]}
              required
              error={
                validationState.locale.isValid
                  ? undefined
                  : validationState.locale.error
              }
            />
            <Select
              label="Timezone"
              description="Select your timezone for accurate time display"
              value={timezone}
              onChange={setTimezone}
              options={[
                { value: "UTC", label: "UTC" },
                { value: "America/New_York", label: "Eastern Time (ET)" },
                { value: "America/Chicago", label: "Central Time (CT)" },
                { value: "America/Denver", label: "Mountain Time (MT)" },
                { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
                { value: "Europe/London", label: "London (GMT)" },
                { value: "Europe/Paris", label: "Paris (CET)" },
                { value: "Asia/Tokyo", label: "Tokyo (JST)" },
              ]}
              required
              error={
                validationState.timezone.isValid
                  ? undefined
                  : validationState.timezone.error
              }
            />
            <Select
              label="Date Format"
              description="How dates should be displayed"
              value={dateFormat}
              onChange={setDateFormat}
              options={[
                { value: "MM/dd/yyyy", label: "MM/DD/YYYY (US)" },
                { value: "dd/MM/yyyy", label: "DD/MM/YYYY (EU)" },
                { value: "yyyy-MM-dd", label: "YYYY-MM-DD (ISO)" },
              ]}
              required
              error={
                validationState.dateFormat.isValid
                  ? undefined
                  : validationState.dateFormat.error
              }
            />
            <Select
              label="Number Format"
              description="How numbers should be displayed"
              value={numberFormat}
              onChange={setNumberFormat}
              options={[
                { value: "US", label: "US (1,234.56)" },
                { value: "EU", label: "EU (1.234,56)" },
                { value: "IN", label: "India (1,23,456.78)" },
              ]}
              required
              error={
                validationState.numberFormat.isValid
                  ? undefined
                  : validationState.numberFormat.error
              }
            />
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
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
              description="Receive reminders about your savings goals"
              checked={goalReminders}
              onChange={setGoalReminders}
            />
            <Toggle
              label="Weekly Reports"
              description="Get weekly financial summary reports"
              checked={weeklyReports}
              onChange={setWeeklyReports}
            />
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <Toggle
              label="Data Sharing"
              description="Allow anonymous usage data to help improve the app"
              checked={dataSharing}
              onChange={setDataSharing}
            />
            <Toggle
              label="Analytics"
              description="Help us understand how you use the app"
              checked={analyticsOptIn}
              onChange={setAnalyticsOptIn}
            />
          </div>
        );

      case "api":
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Bunq API Integration
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Connect your Bunq account to automatically import
                    transactions. You can skip this step and set it up later in
                    settings.
                  </p>
                </div>
              </div>
            </div>
            <FormInput
              label="Bunq API Key"
              description="Your Bunq API key for authentication"
              value={bunqApiKey}
              onChange={setBunqApiKey}
              type="password"
              placeholder="Enter your Bunq API key"
              error={
                validationState.bunqApiKey.isValid
                  ? undefined
                  : validationState.bunqApiKey.error
              }
            />
            <FormInput
              label="Bunq API URL"
              description="The URL of your Bunq API server"
              value={bunqApiUrl}
              onChange={setBunqApiUrl}
              placeholder="http://localhost:8000"
              error={
                validationState.bunqApiUrl.isValid
                  ? undefined
                  : validationState.bunqApiUrl.error
              }
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Moneves! 🎉
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Let&apos;s set up your account to get you started
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {setupSteps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    completedSteps.has(index)
                      ? "bg-green-500 text-white"
                      : index === currentStep
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  )}
                >
                  {completedSteps.has(index) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < setupSteps.length - 1 && (
                  <div
                    className={cn(
                      "w-16 h-1 mx-2 transition-colors",
                      completedSteps.has(index)
                        ? "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep + 1} of {setupSteps.length}
            </span>
          </div>
        </div>

        {/* Current Step */}
        <Card className="p-8">
          <div className="flex items-center mb-6">
            <div
              className={cn(
                "p-3 rounded-lg mr-4",
                setupSteps[currentStep].color
                  .replace("text-", "bg-")
                  .replace("-500", "-100 dark:bg-")
                  .replace("dark:bg-", "dark:bg-")
              )}
            >
              <div className={setupSteps[currentStep].color}>
                {setupSteps[currentStep].icon}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {setupSteps[currentStep].title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {setupSteps[currentStep].description}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">{renderStepContent()}</div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <ButtonComponent
              variant="tertiary"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              prefix={<ArrowLeft className="w-4 h-4" />}
            >
              Previous
            </ButtonComponent>

            <div className="flex items-center space-x-3">
              {currentStep === setupSteps.length - 1 ? (
                <ButtonComponent
                  variant="secondary"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  Skip for now
                </ButtonComponent>
              ) : (
                <ButtonComponent
                  variant="tertiary"
                  onClick={handleSkip}
                  disabled={isLoading}
                >
                  Skip
                </ButtonComponent>
              )}
              <ButtonComponent
                variant="primary"
                onClick={handleSaveAndContinue}
                loading={isLoading}
                suffix={<ArrowRight className="w-4 h-4" />}
              >
                {currentStep === setupSteps.length - 1
                  ? "Complete Setup"
                  : "Save & Continue"}
              </ButtonComponent>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
