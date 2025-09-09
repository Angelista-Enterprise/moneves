"use client";

import { useState, useCallback } from "react";

export interface BugReport {
  id: string;
  title: string;
  description: string;
  category: BugCategory;
  severity: BugSeverity;
  page: string;
  userAgent: string;
  timestamp: string;
  screenshot?: string;
  steps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  userId?: string;
  status: BugStatus;
  attachments?: string[];
}

export type BugCategory =
  | "ui-issue"
  | "functionality"
  | "performance"
  | "data-issue"
  | "navigation"
  | "authentication"
  | "api-error"
  | "other";

export type BugSeverity = "low" | "medium" | "high" | "critical";

export type BugStatus = "open" | "in-progress" | "resolved" | "closed";

export interface BugReportFormData {
  title: string;
  description: string;
  category: BugCategory;
  severity: BugSeverity;
  steps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  screenshot?: string;
}

class BugReportService {
  private reports: BugReport[] = [];
  private listeners: Set<() => void> = new Set();

  // Subscribe to changes
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners of changes
  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // Create a new bug report
  async createReport(
    formData: BugReportFormData,
    userId?: string
  ): Promise<BugReport> {
    const report: BugReport = {
      id: this.generateId(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      severity: formData.severity,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      screenshot: formData.screenshot,
      steps: formData.steps,
      expectedBehavior: formData.expectedBehavior,
      actualBehavior: formData.actualBehavior,
      userId,
      status: "open",
      attachments: [],
    };

    // Store in localStorage for now (in production, this would be sent to a server)
    this.reports.push(report);
    this.saveToStorage();
    this.notify();

    // In a real app, you would send this to your backend
    console.log("[BugReport] New bug report created:", report);

    return report;
  }

  // Get all reports
  getReports(): BugReport[] {
    return [...this.reports];
  }

  // Get reports by user
  getReportsByUser(userId: string): BugReport[] {
    return this.reports.filter((report) => report.userId === userId);
  }

  // Update report status
  updateReportStatus(reportId: string, status: BugStatus): void {
    const report = this.reports.find((r) => r.id === reportId);
    if (report) {
      report.status = status;
      this.saveToStorage();
      this.notify();
    }
  }

  // Generate unique ID
  private generateId(): string {
    return `bug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Save to localStorage
  private saveToStorage(): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("bug_reports", JSON.stringify(this.reports));
    }
  }

  // Load from localStorage
  loadFromStorage(): void {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bug_reports");
      if (stored) {
        try {
          this.reports = JSON.parse(stored);
        } catch (error) {
          console.error(
            "[BugReport] Error loading reports from storage:",
            error
          );
        }
      }
    }
  }

  // Take screenshot (simplified version)
  async takeScreenshot(): Promise<string | null> {
    try {
      // In a real implementation, you would use html2canvas or similar
      // For now, we'll return a placeholder
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    } catch (error) {
      console.error("[BugReport] Error taking screenshot:", error);
      return null;
    }
  }

  // Get category options
  getCategoryOptions(): {
    value: BugCategory;
    label: string;
    description: string;
  }[] {
    return [
      {
        value: "ui-issue",
        label: "UI Issue",
        description: "Visual problems, layout issues, styling bugs",
      },
      {
        value: "functionality",
        label: "Functionality",
        description: "Features not working as expected",
      },
      {
        value: "performance",
        label: "Performance",
        description: "Slow loading, lag, or performance issues",
      },
      {
        value: "data-issue",
        label: "Data Issue",
        description: "Incorrect data, missing information, sync problems",
      },
      {
        value: "navigation",
        label: "Navigation",
        description: "Routing, page transitions, menu issues",
      },
      {
        value: "authentication",
        label: "Authentication",
        description: "Login, logout, session, permission issues",
      },
      {
        value: "api-error",
        label: "API Error",
        description: "Server errors, network issues, API failures",
      },
      {
        value: "other",
        label: "Other",
        description: "Something else not covered above",
      },
    ];
  }

  // Get severity options
  getSeverityOptions(): {
    value: BugSeverity;
    label: string;
    description: string;
    color: string;
  }[] {
    return [
      {
        value: "low",
        label: "Low",
        description: "Minor issue, doesn't affect core functionality",
        color: "text-green-600 bg-green-100",
      },
      {
        value: "medium",
        label: "Medium",
        description: "Noticeable issue, some functionality affected",
        color: "text-yellow-600 bg-yellow-100",
      },
      {
        value: "high",
        label: "High",
        description: "Significant issue, major functionality affected",
        color: "text-orange-600 bg-orange-100",
      },
      {
        value: "critical",
        label: "Critical",
        description: "App-breaking issue, core functionality unusable",
        color: "text-red-600 bg-red-100",
      },
    ];
  }
}

// Create singleton instance
export const bugReportService = new BugReportService();

// Initialize service
if (typeof window !== "undefined") {
  bugReportService.loadFromStorage();
}

// React hook for bug reports
export function useBugReports() {
  const [reports, setReports] = useState<BugReport[]>([]);

  const refreshReports = useCallback(() => {
    setReports(bugReportService.getReports());
  }, []);

  const createReport = useCallback(
    async (formData: BugReportFormData, userId?: string) => {
      const report = await bugReportService.createReport(formData, userId);
      refreshReports();
      return report;
    },
    [refreshReports]
  );

  const updateReportStatus = useCallback(
    (reportId: string, status: BugStatus) => {
      bugReportService.updateReportStatus(reportId, status);
      refreshReports();
    },
    [refreshReports]
  );

  const takeScreenshot = useCallback(async () => {
    return await bugReportService.takeScreenshot();
  }, []);

  return {
    reports,
    createReport,
    updateReportStatus,
    takeScreenshot,
    refreshReports,
    categoryOptions: bugReportService.getCategoryOptions(),
    severityOptions: bugReportService.getSeverityOptions(),
  };
}
