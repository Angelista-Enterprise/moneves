// API types for user settings and subscriptions

// User settings types
export interface UserSettings {
  currency: string;
  locale: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  emailNotifications: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklyReports: boolean;
  dataSharing: boolean;
  analyticsOptIn: boolean;
}

// Subscription types
export interface Subscription {
  tier: string;
  status: string;
  startDate?: string;
  endDate?: string;
}