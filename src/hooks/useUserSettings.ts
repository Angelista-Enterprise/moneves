import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

  // Setup completion
  setupCompleted: boolean;
}

// Query keys
export const userSettingsQueryKeys = {
  settings: (userId: string) => ["user", "settings", userId] as const,
  bunqApiKey: (userId: string) => ["user", "bunqApiKey", userId] as const,
};

// API functions
const fetchUserSettings = async (): Promise<UserSettings> => {
  const response = await fetch("/api/user-settings");
  if (!response.ok) {
    throw new Error("Failed to fetch user settings");
  }
  return response.json();
};

const updateUserSettings = async (
  settings: Partial<UserSettings>
): Promise<void> => {
  const response = await fetch("/api/user-settings", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("[Client] API Error:", errorData);
    throw new Error(
      `Failed to update user settings: ${
        errorData.error || response.statusText
      }`
    );
  }
};

const fetchBunqApiKey = async (): Promise<string | null> => {
  const response = await fetch("/api/user-settings/bunq-api-key");
  if (!response.ok) {
    throw new Error("Failed to fetch Bunq API key");
  }
  const data = await response.json();
  return data.apiKey;
};

const updateBunqApiKey = async (apiKey: string): Promise<void> => {
  const response = await fetch("/api/user-settings/bunq-api-key", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ apiKey }),
  });

  if (!response.ok) {
    throw new Error("Failed to update Bunq API key");
  }
};

// Hook for managing user settings
export const useUserSettings = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userSettingsQueryKeys.settings(userId),
    queryFn: fetchUserSettings,
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateUserSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userSettingsQueryKeys.settings(userId),
      });
    },
  });

  const updateBunqApiKeyMutation = useMutation({
    mutationFn: updateBunqApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userSettingsQueryKeys.settings(userId),
      });
      queryClient.invalidateQueries({
        queryKey: userSettingsQueryKeys.bunqApiKey(userId),
      });
    },
  });

  return {
    settings,
    isLoading,
    error,
    refetch,
    updateSettings: updateSettingsMutation.mutateAsync,
    updateBunqApiKey: updateBunqApiKeyMutation.mutateAsync,
    isUpdating: updateSettingsMutation.isPending,
    isUpdatingApiKey: updateBunqApiKeyMutation.isPending,
  };
};

// Hook specifically for Bunq API key
export const useBunqApiKey = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: apiKey,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: userSettingsQueryKeys.bunqApiKey(userId),
    queryFn: fetchBunqApiKey,
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const updateApiKeyMutation = useMutation({
    mutationFn: updateBunqApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userSettingsQueryKeys.bunqApiKey(userId),
      });
      queryClient.invalidateQueries({
        queryKey: userSettingsQueryKeys.settings(userId),
      });
    },
  });

  return {
    apiKey,
    isLoading,
    error,
    refetch,
    updateApiKey: updateApiKeyMutation.mutateAsync,
    isUpdating: updateApiKeyMutation.isPending,
  };
};
