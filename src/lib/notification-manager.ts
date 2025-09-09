import React from "react";

export interface Notification {
  id: string;
  type: "error" | "warning" | "info" | "success" | "recommendation";
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible: boolean;
  timestamp: Date;
  read: boolean;
  category:
    | "bunq_api"
    | "system"
    | "recommendation"
    | "budget"
    | "goal"
    | "transaction";
}

export interface BunqApiError {
  count: number;
  lastError: Date;
  apiUrl: string;
  errorMessage: string;
}

class NotificationManager {
  private notifications: Notification[] = [];
  private bunqApiErrors: Map<string, BunqApiError> = new Map();
  private maxApiErrors = 3; // Stop calling after 3 consecutive 401s
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load notifications from localStorage on initialization
    this.loadNotifications();
  }

  /**
   * Add a new notification
   */
  addNotification(
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ): string {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    this.saveNotifications();
    this.notifyListeners();

    return id;
  }

  /**
   * Handle Bunq API errors with smart throttling
   */
  handleBunqApiError(apiUrl: string, errorMessage: string): boolean {
    const now = new Date();
    const existingError = this.bunqApiErrors.get(apiUrl);

    if (existingError) {
      // Check if this is a 401 error
      if (
        errorMessage.includes("401") ||
        errorMessage.includes("unauthorized")
      ) {
        existingError.count += 1;
        existingError.lastError = now;
        existingError.errorMessage = errorMessage;

        // If we've hit the max errors, stop calling the API
        if (existingError.count >= this.maxApiErrors) {
          this.addNotification({
            type: "error",
            title: "Bunq API Connection Failed",
            message: `API key appears to be invalid. Stopped calling ${apiUrl} after ${this.maxApiErrors} consecutive 401 errors. Please check your API credentials.`,
            action: {
              label: "Update API Key",
              onClick: () => {
                // Navigate to settings or open API key modal
                window.location.href = "/settings";
              },
            },
            dismissible: true,
            category: "bunq_api",
          });

          this.saveNotifications();
          this.notifyListeners();
          return false; // Stop calling the API
        }
      }
    } else {
      // First error for this API URL
      this.bunqApiErrors.set(apiUrl, {
        count: 1,
        lastError: now,
        apiUrl,
        errorMessage,
      });
    }

    return true; // Continue calling the API
  }

  /**
   * Reset Bunq API error count (when API key is updated)
   */
  resetBunqApiErrors(apiUrl: string): void {
    this.bunqApiErrors.delete(apiUrl);
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Add smart recommendations
   */
  addRecommendation(
    title: string,
    message: string,
    action?: { label: string; onClick: () => void }
  ): string {
    return this.addNotification({
      type: "recommendation",
      title,
      message,
      action,
      dismissible: true,
      category: "recommendation",
    });
  }

  /**
   * Add system notification
   */
  addSystemNotification(
    type: "error" | "warning" | "info" | "success",
    title: string,
    message: string,
    action?: { label: string; onClick: () => void }
  ): string {
    return this.addNotification({
      type,
      title,
      message,
      action,
      dismissible: true,
      category: "system",
    });
  }

  /**
   * Mark notification as read
   */
  markAsRead(id: string): void {
    const notification = this.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Dismiss notification
   */
  dismiss(id: string): void {
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Get unread count
   */
  getUnreadCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  /**
   * Get notifications by category
   */
  getNotificationsByCategory(
    category: Notification["category"]
  ): Notification[] {
    return this.notifications.filter((n) => n.category === category);
  }

  /**
   * Get Bunq API status
   */
  getBunqApiStatus(): {
    hasErrors: boolean;
    errorCount: number;
    lastError?: Date;
  } {
    const totalErrors = Array.from(this.bunqApiErrors.values()).reduce(
      (sum, error) => sum + error.count,
      0
    );
    const lastError = Array.from(this.bunqApiErrors.values()).reduce(
      (latest, error) =>
        !latest || error.lastError > latest ? error.lastError : latest,
      undefined as Date | undefined
    );

    return {
      hasErrors: totalErrors > 0,
      errorCount: totalErrors,
      lastError,
    };
  }

  /**
   * Subscribe to notification changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener());
  }

  /**
   * Save notifications to localStorage
   */
  private saveNotifications(): void {
    if (typeof window === "undefined") return; // Skip during SSR

    try {
      localStorage.setItem(
        "moneves_notifications",
        JSON.stringify(this.notifications)
      );
      localStorage.setItem(
        "moneves_bunq_errors",
        JSON.stringify(Array.from(this.bunqApiErrors.entries()))
      );
    } catch (error) {
      console.error(
        "[notification-manager] Failed to save notifications:",
        error
      );
    }
  }

  /**
   * Load notifications from localStorage
   */
  private loadNotifications(): void {
    if (typeof window === "undefined") return; // Skip during SSR

    try {
      const savedNotifications = localStorage.getItem("moneves_notifications");
      if (savedNotifications) {
        this.notifications = JSON.parse(savedNotifications).map(
          (n: Notification & { timestamp: string }) => ({
            ...n,
            timestamp: new Date(n.timestamp),
          })
        );
      }

      const savedErrors = localStorage.getItem("moneves_bunq_errors");
      if (savedErrors) {
        const errorEntries = JSON.parse(savedErrors);
        this.bunqApiErrors = new Map(
          errorEntries.map(
            ([key, value]: [string, BunqApiError & { lastError: string }]) => [
              key,
              { ...value, lastError: new Date(value.lastError) },
            ]
          )
        );
      }
    } catch (error) {
      console.error(
        "[notification-manager] Failed to load notifications:",
        error
      );
    }
  }
}

// Singleton instance
export const notificationManager = new NotificationManager();

// React hook for using notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (!isClient) return;

    const updateNotifications = () => {
      setNotifications(notificationManager.getNotifications());
      setUnreadCount(notificationManager.getUnreadCount());
    };

    // Initial load
    updateNotifications();

    // Subscribe to changes
    const unsubscribe = notificationManager.subscribe(updateNotifications);

    return unsubscribe;
  }, [isClient]);

  return {
    notifications,
    unreadCount,
    addNotification:
      notificationManager.addNotification.bind(notificationManager),
    addRecommendation:
      notificationManager.addRecommendation.bind(notificationManager),
    addSystemNotification:
      notificationManager.addSystemNotification.bind(notificationManager),
    markAsRead: notificationManager.markAsRead.bind(notificationManager),
    markAllAsRead: notificationManager.markAllAsRead.bind(notificationManager),
    dismiss: notificationManager.dismiss.bind(notificationManager),
    dismissAll: notificationManager.dismissAll.bind(notificationManager),
    getBunqApiStatus:
      notificationManager.getBunqApiStatus.bind(notificationManager),
    resetBunqApiErrors:
      notificationManager.resetBunqApiErrors.bind(notificationManager),
    handleBunqApiError:
      notificationManager.handleBunqApiError.bind(notificationManager),
  };
};
