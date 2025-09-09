/**
 * Analytics tracking system
 * Tracks user interactions and feature usage with opt-in/opt-out functionality
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
  userId?: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  userId?: string;
  debug?: boolean;
}

class Analytics {
  private config: AnalyticsConfig = {
    enabled: false,
    debug: false,
  };

  private events: AnalyticsEvent[] = [];

  /**
   * Initialize analytics with user settings
   */
  initialize(config: AnalyticsConfig) {
    this.config = { ...this.config, ...config };

    if (this.config.debug) {
      console.log("[analytics] Initialized with config:", this.config);
    }
  }

  /**
   * Track an event
   */
  track(event: string, properties?: Record<string, unknown>) {
    if (!this.config.enabled) {
      if (this.config.debug) {
        console.log("[analytics] Event tracking disabled:", event, properties);
      }
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        page:
          typeof window !== "undefined" ? window.location.pathname : undefined,
        userAgent:
          typeof window !== "undefined"
            ? window.navigator.userAgent
            : undefined,
      },
      timestamp: new Date(),
      userId: this.config.userId,
    };

    this.events.push(analyticsEvent);

    if (this.config.debug) {
      console.log("[analytics] Event tracked:", analyticsEvent);
    }

    // In a real implementation, you would send this to your analytics service
    this.sendToAnalyticsService(analyticsEvent);
  }

  /**
   * Track page view
   */
  page(pageName: string, properties?: Record<string, unknown>) {
    this.track("page_view", {
      page: pageName,
      ...properties,
    });
  }

  /**
   * Track feature usage
   */
  feature(
    featureName: string,
    action: string,
    properties?: Record<string, unknown>
  ) {
    this.track("feature_used", {
      feature: featureName,
      action,
      ...properties,
    });
  }

  /**
   * Track settings changes
   */
  settingsChanged(setting: string, oldValue: unknown, newValue: unknown) {
    this.track("settings_changed", {
      setting,
      oldValue,
      newValue,
    });
  }

  /**
   * Track budget interactions
   */
  budgetAction(
    action: string,
    budgetId?: string,
    properties?: Record<string, unknown>
  ) {
    this.track("budget_action", {
      action,
      budgetId,
      ...properties,
    });
  }

  /**
   * Track transaction interactions
   */
  transactionAction(
    action: string,
    transactionId?: string,
    properties?: Record<string, unknown>
  ) {
    this.track("transaction_action", {
      action,
      transactionId,
      ...properties,
    });
  }

  /**
   * Track goal interactions
   */
  goalAction(
    action: string,
    goalId?: string,
    properties?: Record<string, unknown>
  ) {
    this.track("goal_action", {
      action,
      goalId,
      ...properties,
    });
  }

  /**
   * Track error events
   */
  error(error: string, context?: Record<string, unknown>) {
    this.track("error", {
      error,
      context,
    });
  }

  /**
   * Get all tracked events (for debugging)
   */
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Get analytics summary
   */
  getSummary() {
    const eventCounts = this.events.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEvents: this.events.length,
      eventCounts,
      firstEvent: this.events[0]?.timestamp,
      lastEvent: this.events[this.events.length - 1]?.timestamp,
    };
  }

  /**
   * Send event to analytics service (mock implementation)
   */
  private async sendToAnalyticsService(event: AnalyticsEvent) {
    try {
      // In a real implementation, you would send this to your analytics service
      // For now, we'll just log it or store it locally

      if (this.config.debug) {
        console.log("[analytics] Sending to service:", event);
      }

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 10));
    } catch (error) {
      console.error("[analytics] Failed to send event:", error);
    }
  }
}

// Create singleton instance
export const analytics = new Analytics();

/**
 * React hook for analytics
 */
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    page: analytics.page.bind(analytics),
    feature: analytics.feature.bind(analytics),
    settingsChanged: analytics.settingsChanged.bind(analytics),
    budgetAction: analytics.budgetAction.bind(analytics),
    transactionAction: analytics.transactionAction.bind(analytics),
    goalAction: analytics.goalAction.bind(analytics),
    error: analytics.error.bind(analytics),
  };
};

/**
 * Initialize analytics with user settings
 */
export const initializeAnalytics = (config: AnalyticsConfig) => {
  analytics.initialize(config);
};

/**
 * Track page view on route change
 */
export const trackPageView = (
  pageName: string,
  properties?: Record<string, unknown>
) => {
  analytics.page(pageName, properties);
};

/**
 * Track feature usage
 */
export const trackFeature = (
  featureName: string,
  action: string,
  properties?: Record<string, unknown>
) => {
  analytics.feature(featureName, action, properties);
};

/**
 * Track settings changes
 */
export const trackSettingsChange = (
  setting: string,
  oldValue: unknown,
  newValue: unknown
) => {
  analytics.settingsChanged(setting, oldValue, newValue);
};
