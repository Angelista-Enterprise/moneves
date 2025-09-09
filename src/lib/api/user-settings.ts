import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export interface UserSettings {
  // User preferences
  currency: string;
  locale: string;
  timezone: string;
  dateFormat: string;
  numberFormat: string;

  // Notification preferences
  emailNotifications: boolean;
  budgetAlerts: boolean;
  goalReminders: boolean;
  weeklyReports: boolean;

  // Privacy settings
  dataSharing: boolean;
  analyticsOptIn: boolean;

  // Bunq API settings
  bunqApiKey?: string;
  bunqApiUrl: string;
  bunqTransactionLimit: number;

  // Subscription settings
  subscriptionTier: string;
  subscriptionStatus: string;
  // Setup flag
  setupCompleted: boolean;
}

export const getUserSettings = async (
  userId: string
): Promise<UserSettings | null> => {
  try {
    const user = await db
      .select({
        currency: users.currency,
        locale: users.locale,
        timezone: users.timezone,
        dateFormat: users.dateFormat,
        numberFormat: users.numberFormat,
        emailNotifications: users.emailNotifications,
        budgetAlerts: users.budgetAlerts,
        goalReminders: users.goalReminders,
        weeklyReports: users.weeklyReports,
        dataSharing: users.dataSharing,
        analyticsOptIn: users.analyticsOptIn,
        bunqApiKey: users.bunqApiKey,
        bunqApiUrl: users.bunqApiUrl,
        bunqTransactionLimit: users.bunqTransactionLimit,
        subscriptionTier: users.subscriptionTier,
        subscriptionStatus: users.subscriptionStatus,
        setupCompleted: users.setupCompleted,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0] as UserSettings;
  } catch (error) {
    console.error("[getUserSettings]: Error fetching user settings:", error);
    return null;
  }
};

export const updateUserSettings = async (
  userId: string,
  settings: Partial<UserSettings>
): Promise<boolean> => {
  try {
    await db
      .update(users)
      .set({
        ...settings,
        // Don't update subscription fields unless explicitly provided
        ...(settings.subscriptionTier
          ? { subscriptionTier: settings.subscriptionTier }
          : {}),
        ...(settings.subscriptionStatus
          ? { subscriptionStatus: settings.subscriptionStatus }
          : {}),
        ...(settings.setupCompleted !== undefined
          ? { setupCompleted: settings.setupCompleted }
          : {}),
      })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("[updateUserSettings]: Error updating user settings:", error);
    return false;
  }
};

export const updateBunqApiKey = async (
  userId: string,
  apiKey: string
): Promise<boolean> => {
  try {
    await db
      .update(users)
      .set({ bunqApiKey: apiKey })
      .where(eq(users.id, userId));

    return true;
  } catch (error) {
    console.error("[updateBunqApiKey]: Error updating Bunq API key:", error);
    return false;
  }
};

export const getBunqApiKey = async (userId: string): Promise<string | null> => {
  try {
    const user = await db
      .select({ bunqApiKey: users.bunqApiKey })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      return null;
    }

    return user[0].bunqApiKey || null;
  } catch (error) {
    console.error("[getBunqApiKey]: Error fetching Bunq API key:", error);
    return null;
  }
};
