/**
 * Data deletion functionality
 * Allows users to delete their data with proper cleanup
 */

export interface DeletionOptions {
  deleteTransactions: boolean;
  deleteBudgets: boolean;
  deleteGoals: boolean;
  deleteSettings: boolean;
  deleteAccount: boolean;
  confirmDeletion: boolean;
}

export interface DeletionResult {
  success: boolean;
  deletedItems: {
    transactions: number;
    budgets: number;
    goals: number;
    settings: boolean;
    account: boolean;
  };
  errors: string[];
  signedOut?: boolean;
  message?: string;
}

class DataDeletionService {
  /**
   * Delete user data
   */
  async deleteUserData(
    userId: string,
    options: DeletionOptions
  ): Promise<DeletionResult> {
    console.log("[data-deletion] Starting data deletion for user:", userId);

    if (!options.confirmDeletion) {
      throw new Error("Deletion confirmation required");
    }

    const result: DeletionResult = {
      success: true,
      deletedItems: {
        transactions: 0,
        budgets: 0,
        goals: 0,
        settings: false,
        account: false,
      },
      errors: [],
    };

    try {
      // Delete transactions
      if (options.deleteTransactions) {
        const transactionResult = await this.deleteTransactions(userId);
        result.deletedItems.transactions = transactionResult.count;
        if (transactionResult.error) {
          result.errors.push(
            `Failed to delete transactions: ${transactionResult.error}`
          );
        }
      }

      // Delete budgets
      if (options.deleteBudgets) {
        const budgetResult = await this.deleteBudgets(userId);
        result.deletedItems.budgets = budgetResult.count;
        if (budgetResult.error) {
          result.errors.push(`Failed to delete budgets: ${budgetResult.error}`);
        }
      }

      // Delete goals
      if (options.deleteGoals) {
        const goalResult = await this.deleteGoals(userId);
        result.deletedItems.goals = goalResult.count;
        if (goalResult.error) {
          result.errors.push(`Failed to delete goals: ${goalResult.error}`);
        }
      }

      // Delete settings
      if (options.deleteSettings) {
        const settingsResult = await this.deleteSettings(userId);
        result.deletedItems.settings = settingsResult.success;
        if (!settingsResult.success) {
          result.errors.push(
            `Failed to delete settings: ${settingsResult.error}`
          );
        }
      }

      // Delete account (this should be last)
      if (options.deleteAccount) {
        const accountResult = await this.deleteAccount(userId);
        result.deletedItems.account = accountResult.success;
        if (!accountResult.success) {
          result.errors.push(
            `Failed to delete account: ${accountResult.error}`
          );
        } else if (accountResult.signedOut) {
          // Add sign out information to the result
          result.signedOut = true;
          result.message = accountResult.message;
        }
      }

      // Check if there were any errors
      if (result.errors.length > 0) {
        result.success = false;
        console.error("[data-deletion] Some deletions failed:", result.errors);
      } else {
        console.log("[data-deletion] All data deleted successfully");
      }
    } catch (error) {
      console.error("[data-deletion] Deletion failed:", error);
      result.success = false;
      result.errors.push(
        `Deletion failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    return result;
  }

  /**
   * Delete all transactions for a user
   */
  private async deleteTransactions(
    userId: string
  ): Promise<{ count: number; error?: string }> {
    try {
      const response = await fetch("/api/transactions/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete transactions";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`[data-deletion] Deleted ${result.count} transactions`);
      return { count: result.count };
    } catch (error) {
      console.error("[data-deletion] Failed to delete transactions:", error);
      return {
        count: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete all budgets for a user
   */
  private async deleteBudgets(
    userId: string
  ): Promise<{ count: number; error?: string }> {
    try {
      const response = await fetch("/api/budgets/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete budgets";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`[data-deletion] Deleted ${result.count} budgets`);
      return { count: result.count };
    } catch (error) {
      console.error("[data-deletion] Failed to delete budgets:", error);
      return {
        count: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete all goals for a user
   */
  private async deleteGoals(
    userId: string
  ): Promise<{ count: number; error?: string }> {
    try {
      const response = await fetch("/api/savings-goals/bulk-delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete goals";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log(`[data-deletion] Deleted ${result.count} goals`);
      return { count: result.count };
    } catch (error) {
      console.error("[data-deletion] Failed to delete goals:", error);
      return {
        count: 0,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Reset user settings to defaults
   */
  private async deleteSettings(
    userId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("/api/user-settings/reset", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to reset settings";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      console.log("[data-deletion] Reset user settings to defaults");
      return { success: true };
    } catch (error) {
      console.error("[data-deletion] Failed to reset settings:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete user account and all associated data (cascade delete)
   */
  private async deleteAccount(userId: string): Promise<{
    success: boolean;
    error?: string;
    signedOut?: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch("/api/user-data/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, deleteAccount: true }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete account";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("[data-deletion] Deleted user account and all data:", result);

      // If the user was signed out, we might want to handle this in the UI
      if (result.signedOut) {
        console.log(
          "[data-deletion] User has been signed out after account deletion"
        );
        // The UI should handle redirecting to sign-in page or showing appropriate message
      }

      return {
        success: true,
        signedOut: result.signedOut || false,
        message: result.message,
      };
    } catch (error) {
      console.error("[data-deletion] Failed to delete account:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get data summary for user
   */
  async getDataSummary(): Promise<{
    transactions: number;
    budgets: number;
    goals: number;
    hasSettings: boolean;
  }> {
    try {
      const [transactions, budgets, goals, settings] = await Promise.all([
        this.getTransactionCount(),
        this.getBudgetCount(),
        this.getGoalCount(),
        this.hasSettings(),
      ]);

      return {
        transactions,
        budgets,
        goals,
        hasSettings: settings,
      };
    } catch (error) {
      console.error("[data-deletion] Failed to get data summary:", error);
      return {
        transactions: 0,
        budgets: 0,
        goals: 0,
        hasSettings: false,
      };
    }
  }

  /**
   * Get transaction count
   */
  private async getTransactionCount(): Promise<number> {
    try {
      const response = await fetch("/api/transactions/count");
      if (!response.ok) return 0;
      const result = await response.json();
      return result.count || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get budget count
   */
  private async getBudgetCount(): Promise<number> {
    try {
      const response = await fetch("/api/budgets/count");
      if (!response.ok) return 0;
      const result = await response.json();
      return result.count || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Get goal count
   */
  private async getGoalCount(): Promise<number> {
    try {
      const response = await fetch("/api/savings-goals/count");
      if (!response.ok) return 0;
      const result = await response.json();
      return result.count || 0;
    } catch {
      return 0;
    }
  }

  /**
   * Check if user has settings
   */
  private async hasSettings(): Promise<boolean> {
    try {
      const response = await fetch("/api/user-settings");
      if (!response.ok) return false;
      const settings = await response.json();
      return !!settings;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const dataDeletionService = new DataDeletionService();

/**
 * React hook for data deletion
 */
export const useDataDeletion = () => {
  return {
    deleteUserData:
      dataDeletionService.deleteUserData.bind(dataDeletionService),
    getDataSummary:
      dataDeletionService.getDataSummary.bind(dataDeletionService),
  };
};

/**
 * Delete user data
 */
export const deleteUserData = async (
  userId: string,
  options: DeletionOptions
): Promise<DeletionResult> => {
  return dataDeletionService.deleteUserData(userId, options);
};

/**
 * Get data summary
 */
export const getDataSummary = async () => {
  return dataDeletionService.getDataSummary();
};
