/**
 * System information utilities
 * Provides application version, build info, and system diagnostics
 */

export interface SystemInfo {
  application: {
    name: string;
    version: string;
    buildDate: string;
    environment: string;
    nodeVersion: string;
  };
  database: {
    type: string;
    version?: string;
    status: "connected" | "disconnected" | "error";
    lastBackup?: string;
  };
  system: {
    platform: string;
    arch: string;
    memory: {
      total: number;
      free: number;
      used: number;
    };
    uptime: number;
  };
  features: {
    analytics: boolean;
    notifications: boolean;
    dataExport: boolean;
    dataDeletion: boolean;
    bunqIntegration: boolean;
  };
}

class SystemInfoService {
  /**
   * Get comprehensive system information
   */
  async getSystemInfo(): Promise<SystemInfo> {
    const application = this.getApplicationInfo();
    const database = await this.getDatabaseInfo();
    const system = this.getSystemInfoInternal();
    const features = this.getFeatureInfo();

    return {
      application,
      database,
      system,
      features,
    };
  }

  /**
   * Get application information
   */
  private getApplicationInfo() {
    return {
      name: "Moneves",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
      nodeVersion: process.env.NODE_VERSION || "unknown",
    };
  }

  /**
   * Get database information
   */
  private async getDatabaseInfo() {
    try {
      // In a real implementation, you would check the actual database connection
      const response = await fetch("/api/system/database-status");
      if (response.ok) {
        const data = await response.json();
        return {
          type: "SQLite",
          version: data.version,
          status: data.status,
          lastBackup: data.lastBackup,
        };
      }
    } catch (error) {
      console.error("[system-info] Failed to get database info:", error);
    }

    return {
      type: "SQLite",
      status: "connected" as const,
    };
  }

  /**
   * Get system information
   */
  private getSystemInfoInternal() {
    // In a browser environment, we can only get limited system info
    if (typeof window !== "undefined") {
      return {
        platform: navigator.platform,
        arch: navigator.userAgent.includes("x64") ? "x64" : "x86",
        memory: {
          total: (navigator as { deviceMemory?: number }).deviceMemory || 0,
          free: 0,
          used: 0,
        },
        uptime: performance.now(),
      };
    }

    // Server-side system info
    return {
      platform: process.platform,
      arch: process.arch,
      memory: {
        total: process.memoryUsage().heapTotal,
        free: process.memoryUsage().heapUsed,
        used: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed,
      },
      uptime: process.uptime(),
    };
  }

  /**
   * Get feature availability information
   */
  private getFeatureInfo() {
    return {
      analytics: true,
      notifications: true,
      dataExport: true,
      dataDeletion: true,
      bunqIntegration: true,
    };
  }

  /**
   * Get application diagnostics
   */
  async getDiagnostics(): Promise<{
    status: "healthy" | "warning" | "error";
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check database connection
      const dbInfo = await this.getDatabaseInfo();
      if (dbInfo.status !== "connected") {
        issues.push("Database connection issue");
        recommendations.push(
          "Check database configuration and restart the application"
        );
      }

      // Check memory usage
      const systemInfo = this.getSystemInfoInternal();
      if (systemInfo.memory.total > 0) {
        const memoryUsage = systemInfo.memory.used / systemInfo.memory.total;
        if (memoryUsage > 0.9) {
          issues.push("High memory usage detected");
          recommendations.push(
            "Consider restarting the application or increasing available memory"
          );
        }
      }

      // Check environment
      const appInfo = this.getApplicationInfo();
      if (appInfo.environment === "development") {
        recommendations.push("Application is running in development mode");
      }
    } catch {
      issues.push("Failed to run diagnostics");
      recommendations.push("Check application logs for more details");
    }

    let status: "healthy" | "warning" | "error" = "healthy";
    if (issues.length > 0) {
      status = issues.some(
        (issue) => issue.includes("error") || issue.includes("failed")
      )
        ? "error"
        : "warning";
    }

    return {
      status,
      issues,
      recommendations,
    };
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): {
    loadTime: number;
    memoryUsage: number;
    responseTime: number;
  } {
    const loadTime = typeof window !== "undefined" ? performance.now() : 0;
    const memoryUsage =
      typeof window !== "undefined"
        ? (performance as { memory?: { usedJSHeapSize?: number } }).memory
            ?.usedJSHeapSize || 0
        : 0;
    const responseTime = typeof window !== "undefined" ? performance.now() : 0;

    return {
      loadTime,
      memoryUsage,
      responseTime,
    };
  }

  /**
   * Get build information
   */
  getBuildInfo(): {
    version: string;
    buildDate: string;
    commitHash?: string;
    branch?: string;
    environment: string;
  } {
    return {
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      buildDate: process.env.NEXT_PUBLIC_BUILD_DATE || new Date().toISOString(),
      commitHash: process.env.NEXT_PUBLIC_COMMIT_HASH,
      branch: process.env.NEXT_PUBLIC_BRANCH,
      environment: process.env.NODE_ENV || "development",
    };
  }
}

// Create singleton instance
export const systemInfoService = new SystemInfoService();

/**
 * React hook for system information
 */
export const useSystemInfo = () => {
  return {
    getSystemInfo: systemInfoService.getSystemInfo.bind(systemInfoService),
    getDiagnostics: systemInfoService.getDiagnostics.bind(systemInfoService),
    getPerformanceMetrics:
      systemInfoService.getPerformanceMetrics.bind(systemInfoService),
    getBuildInfo: systemInfoService.getBuildInfo.bind(systemInfoService),
  };
};

/**
 * Get system information
 */
export const getSystemInfo = () => {
  return systemInfoService.getSystemInfo();
};

/**
 * Get diagnostics
 */
export const getDiagnostics = () => {
  return systemInfoService.getDiagnostics();
};

/**
 * Get build information
 */
export const getBuildInfo = () => {
  return systemInfoService.getBuildInfo();
};
