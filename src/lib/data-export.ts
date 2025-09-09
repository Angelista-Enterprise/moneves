/**
 * Data export functionality
 * Allows users to export their financial data in various formats
 */

export interface ExportOptions {
  format: "json" | "csv" | "xlsx";
  includeTransactions: boolean;
  includeBudgets: boolean;
  includeGoals: boolean;
  includeSettings: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportData {
  user: {
    id: string;
    email: string;
    name: string;
    exportDate: string;
  };
  settings?: Record<string, unknown>;
  transactions?: Record<string, unknown>[];
  budgets?: Record<string, unknown>[];
  goals?: Record<string, unknown>[];
  accounts?: Record<string, unknown>[];
  categories?: Record<string, unknown>[];
}

class DataExportService {
  /**
   * Export user data
   */
  async exportUserData(
    userId: string,
    userEmail: string,
    userName: string,
    options: ExportOptions
  ): Promise<Blob> {
    console.log("[data-export] Starting data export for user:", userId);

    const exportData: ExportData = {
      user: {
        id: userId,
        email: userEmail,
        name: userName,
        exportDate: new Date().toISOString(),
      },
    };

    // Fetch data based on options
    if (options.includeSettings) {
      exportData.settings = await this.fetchUserSettings();
    }

    if (options.includeTransactions) {
      exportData.transactions = await this.fetchTransactions(options.dateRange);
    }

    if (options.includeBudgets) {
      exportData.budgets = await this.fetchBudgets();
    }

    if (options.includeGoals) {
      exportData.goals = await this.fetchGoals();
    }

    // Generate file based on format
    switch (options.format) {
      case "json":
        return this.exportAsJSON(exportData);
      case "csv":
        return this.exportAsCSV(exportData);
      case "xlsx":
        return this.exportAsXLSX(exportData);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  /**
   * Export as JSON
   */
  private exportAsJSON(data: ExportData): Blob {
    const jsonString = JSON.stringify(data, null, 2);
    return new Blob([jsonString], { type: "application/json" });
  }

  /**
   * Export as CSV
   */
  private exportAsCSV(data: ExportData): Blob {
    let csvContent = "";

    // Add user info
    csvContent += "User Information\n";
    csvContent += `User ID,${data.user.id}\n`;
    csvContent += `Email,${data.user.email}\n`;
    csvContent += `Name,${data.user.name}\n`;
    csvContent += `Export Date,${data.user.exportDate}\n\n`;

    // Add transactions
    if (data.transactions && data.transactions.length > 0) {
      csvContent += "Transactions\n";
      csvContent += "ID,Description,Amount,Type,Category,Date,Account\n";
      data.transactions.forEach((transaction) => {
        csvContent += `${transaction.id},${transaction.description},${
          transaction.amount
        },${transaction.type},${transaction.category},${transaction.date},${
          transaction.account || "N/A"
        }\n`;
      });
      csvContent += "\n";
    }

    // Add budgets
    if (data.budgets && data.budgets.length > 0) {
      csvContent += "Budgets\n";
      csvContent += "ID,Name,Monthly Limit,Spent,Remaining,Category\n";
      data.budgets.forEach((budget) => {
        const monthlyLimit = budget.monthlyLimit as number;
        const spent = budget.spent as number;
        const remaining = monthlyLimit - spent;
        csvContent += `${budget.id},${
          budget.name
        },${monthlyLimit},${spent},${remaining},${budget.category || "N/A"}\n`;
      });
      csvContent += "\n";
    }

    // Add goals
    if (data.goals && data.goals.length > 0) {
      csvContent += "Savings Goals\n";
      csvContent +=
        "ID,Name,Target Amount,Current Amount,Progress,Target Date\n";
      data.goals.forEach((goal) => {
        const targetAmount = goal.targetAmount as number;
        const currentAmount = goal.currentAmount as number;
        const progress =
          targetAmount > 0
            ? ((currentAmount / targetAmount) * 100).toFixed(2)
            : 0;
        csvContent += `${goal.id},${
          goal.name
        },${targetAmount},${currentAmount},${progress}%,${
          goal.targetDate || "N/A"
        }\n`;
      });
      csvContent += "\n";
    }

    return new Blob([csvContent], { type: "text/csv" });
  }

  /**
   * Export as XLSX (Excel)
   */
  private async exportAsXLSX(data: ExportData): Promise<Blob> {
    // In a real implementation, you would use a library like 'xlsx' or 'exceljs'
    // For now, we'll create a simple CSV that can be opened in Excel
    const csvBlob = this.exportAsCSV(data);

    // Convert CSV to XLSX-like format (simplified)
    const csvText = await csvBlob.text();
    const xlsxBlob = new Blob([csvText], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return xlsxBlob;
  }

  /**
   * Fetch user settings
   */
  private async fetchUserSettings(): Promise<
    Record<string, unknown> | undefined
  > {
    try {
      const response = await fetch("/api/user-settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return await response.json();
    } catch (error) {
      console.error("[data-export] Failed to fetch settings:", error);
      return undefined;
    }
  }

  /**
   * Fetch transactions
   */
  private async fetchTransactions(_dateRange?: {
    start: Date;
    end: Date;
  }): Promise<Record<string, unknown>[]> {
    try {
      const params = new URLSearchParams();
      if (_dateRange) {
        params.append("startDate", _dateRange.start.toISOString());
        params.append("endDate", _dateRange.end.toISOString());
      }

      const response = await fetch(`/api/transactions?${params}`);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return await response.json();
    } catch (error) {
      console.error("[data-export] Failed to fetch transactions:", error);
      return [];
    }
  }

  /**
   * Fetch budgets
   */
  private async fetchBudgets(): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch("/api/budgets");
      if (!response.ok) throw new Error("Failed to fetch budgets");
      return await response.json();
    } catch (error) {
      console.error("[data-export] Failed to fetch budgets:", error);
      return [];
    }
  }

  /**
   * Fetch goals
   */
  private async fetchGoals(): Promise<Record<string, unknown>[]> {
    try {
      const response = await fetch("/api/savings-goals");
      if (!response.ok) throw new Error("Failed to fetch goals");
      return await response.json();
    } catch (error) {
      console.error("[data-export] Failed to fetch goals:", error);
      return [];
    }
  }

  /**
   * Download file
   */
  downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get export filename
   */
  getExportFilename(format: string, userId: string): string {
    const timestamp = new Date().toISOString().split("T")[0];
    return `moneves-export-${userId}-${timestamp}.${format}`;
  }
}

// Create singleton instance
export const dataExportService = new DataExportService();

/**
 * React hook for data export
 */
export const useDataExport = () => {
  return {
    exportUserData: dataExportService.exportUserData.bind(dataExportService),
    downloadFile: dataExportService.downloadFile.bind(dataExportService),
    getExportFilename:
      dataExportService.getExportFilename.bind(dataExportService),
  };
};

/**
 * Export user data
 */
export const exportUserData = async (
  userId: string,
  userEmail: string,
  userName: string,
  options: ExportOptions
): Promise<Blob> => {
  return dataExportService.exportUserData(userId, userEmail, userName, options);
};

/**
 * Download file
 */
export const downloadFile = (blob: Blob, filename: string) => {
  dataExportService.downloadFile(blob, filename);
};
