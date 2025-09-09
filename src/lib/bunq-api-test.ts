/**
 * Bunq API testing utilities
 * Tests API connection, validates API key, and provides connection status
 */

import { notificationManager } from "./notification-manager";

export interface BunqApiTestResult {
  success: boolean;
  status: "connected" | "disconnected" | "error" | "invalid_key" | "timeout";
  message: string;
  responseTime?: number;
  apiVersion?: string;
  serverTime?: string;
  errors?: string[];
}

export interface BunqApiStatus {
  isConnected: boolean;
  lastTested: Date;
  apiUrl: string;
  responseTime: number;
  status: string;
  version?: string;
}

class BunqApiTestService {
  private status: BunqApiStatus = {
    isConnected: false,
    lastTested: new Date(),
    apiUrl: "",
    responseTime: 0,
    status: "unknown",
  };

  /**
   * Test Bunq API connection
   */
  async testConnection(
    apiUrl: string,
    apiKey?: string
  ): Promise<BunqApiTestResult> {
    const startTime = Date.now();

    try {
      console.log("[bunq-api-test] Testing connection to:", apiUrl);

      // Test basic connectivity
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      const responseTime = Date.now() - startTime;

      if (!response.ok) {
        return {
          success: false,
          status: "error",
          message: `API returned ${response.status}: ${response.statusText}`,
          responseTime,
        };
      }

      const data = await response.json();

      // Update status
      this.status = {
        isConnected: true,
        lastTested: new Date(),
        apiUrl,
        responseTime,
        status: "connected",
        version: data.version,
      };

      return {
        success: true,
        status: "connected",
        message: "API connection successful",
        responseTime,
        apiVersion: data.version,
        serverTime: data.serverTime,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;

      let status: BunqApiTestResult["status"] = "error";
      let message = "Unknown error occurred";

      if (error instanceof Error) {
        if (
          error.name === "TimeoutError" ||
          error.message.includes("timeout")
        ) {
          status = "timeout";
          message = "Connection timeout - API may be unreachable";
        } else if (error.message.includes("fetch")) {
          status = "disconnected";
          message = "Network error - check your internet connection";
        } else if (
          error.message.includes("401") ||
          error.message.includes("unauthorized")
        ) {
          status = "invalid_key";
          message = "Invalid API key or insufficient permissions";

          // Use notification manager to handle API errors with throttling
          const shouldContinue = notificationManager.handleBunqApiError(
            apiUrl,
            message
          );
          if (!shouldContinue) {
            // API calls have been stopped due to repeated 401 errors
            return {
              success: false,
              status: "invalid_key",
              message:
                "API calls stopped due to repeated authentication failures",
              responseTime,
            };
          }
        } else {
          message = error.message;
        }
      }

      // Update status
      this.status = {
        isConnected: false,
        lastTested: new Date(),
        apiUrl,
        responseTime,
        status: status,
      };

      return {
        success: false,
        status,
        message,
        responseTime,
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };
    }
  }

  /**
   * Validate API key format
   */
  validateApiKey(apiKey: string): {
    isValid: boolean;
    message: string;
  } {
    if (!apiKey || typeof apiKey !== "string") {
      return {
        isValid: false,
        message: "API key is required",
      };
    }

    if (apiKey.length < 20) {
      return {
        isValid: false,
        message: "API key appears to be too short",
      };
    }

    if (apiKey.length > 200) {
      return {
        isValid: false,
        message: "API key appears to be too long",
      };
    }

    // Check for basic alphanumeric pattern
    const alphanumericPattern = /^[a-zA-Z0-9+/=_-]+$/;
    if (!alphanumericPattern.test(apiKey)) {
      return {
        isValid: false,
        message: "API key contains invalid characters",
      };
    }

    return {
      isValid: true,
      message: "API key format is valid",
    };
  }

  /**
   * Test API endpoints
   */
  async testEndpoints(
    apiUrl: string,
    apiKey: string
  ): Promise<{
    health: BunqApiTestResult;
    accounts?: BunqApiTestResult;
    transactions?: BunqApiTestResult;
  }> {
    const results: {
      health: BunqApiTestResult;
      accounts?: BunqApiTestResult;
      transactions?: BunqApiTestResult;
    } = {} as {
      health: BunqApiTestResult;
      accounts?: BunqApiTestResult;
      transactions?: BunqApiTestResult;
    };

    // Test health endpoint
    results.health = await this.testConnection(apiUrl, apiKey);

    if (results.health.success) {
      // Test accounts endpoint
      try {
        const accountsResponse = await fetch(`${apiUrl}/accounts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          signal: AbortSignal.timeout(5000),
        });

        results.accounts = {
          success: accountsResponse.ok,
          status: accountsResponse.ok ? "connected" : "error",
          message: accountsResponse.ok
            ? "Accounts endpoint accessible"
            : `Accounts endpoint error: ${accountsResponse.status}`,
          responseTime: 0,
        };
      } catch (error) {
        results.accounts = {
          success: false,
          status: "error",
          message: `Accounts endpoint error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }

      // Test transactions endpoint
      try {
        const transactionsResponse = await fetch(`${apiUrl}/transactions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          signal: AbortSignal.timeout(5000),
        });

        results.transactions = {
          success: transactionsResponse.ok,
          status: transactionsResponse.ok ? "connected" : "error",
          message: transactionsResponse.ok
            ? "Transactions endpoint accessible"
            : `Transactions endpoint error: ${transactionsResponse.status}`,
          responseTime: 0,
        };
      } catch (error) {
        results.transactions = {
          success: false,
          status: "error",
          message: `Transactions endpoint error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        };
      }
    }

    return results;
  }

  /**
   * Get current API status
   */
  getStatus(): BunqApiStatus {
    return { ...this.status };
  }

  /**
   * Reset status
   */
  resetStatus() {
    this.status = {
      isConnected: false,
      lastTested: new Date(),
      apiUrl: "",
      responseTime: 0,
      status: "unknown",
    };
  }

  /**
   * Get connection quality
   */
  getConnectionQuality(): "excellent" | "good" | "fair" | "poor" {
    if (!this.status.isConnected) return "poor";

    const responseTime = this.status.responseTime;

    if (responseTime < 500) return "excellent";
    if (responseTime < 1000) return "good";
    if (responseTime < 2000) return "fair";
    return "poor";
  }

  /**
   * Reset API error count (call when API key is updated)
   */
  resetApiErrors(apiUrl: string): void {
    notificationManager.resetBunqApiErrors(apiUrl);
  }
}

// Create singleton instance
export const bunqApiTestService = new BunqApiTestService();

/**
 * React hook for Bunq API testing
 */
export const useBunqApiTest = () => {
  return {
    testConnection: bunqApiTestService.testConnection.bind(bunqApiTestService),
    validateApiKey: bunqApiTestService.validateApiKey.bind(bunqApiTestService),
    testEndpoints: bunqApiTestService.testEndpoints.bind(bunqApiTestService),
    getStatus: bunqApiTestService.getStatus.bind(bunqApiTestService),
    resetStatus: bunqApiTestService.resetStatus.bind(bunqApiTestService),
    getConnectionQuality:
      bunqApiTestService.getConnectionQuality.bind(bunqApiTestService),
    resetApiErrors: bunqApiTestService.resetApiErrors.bind(bunqApiTestService),
  };
};

/**
 * Test Bunq API connection
 */
export const testBunqConnection = (apiUrl: string, apiKey?: string) => {
  return bunqApiTestService.testConnection(apiUrl, apiKey);
};

/**
 * Validate API key
 */
export const validateBunqApiKey = (apiKey: string) => {
  return bunqApiTestService.validateApiKey(apiKey);
};

/**
 * Get API status
 */
export const getBunqApiStatus = () => {
  return bunqApiTestService.getStatus();
};
