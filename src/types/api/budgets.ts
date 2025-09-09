// API types for budgets and categories

// Dashboard metrics types
export interface DashboardMetrics {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlySavings: number;
  budgetUtilization: number;
  topCategories: Array<{
    id: number;
    name: string;
    spent: number;
    limit: number;
    percentage: number;
  }>;
  recentTransactions: Array<{
    id: number;
    description: string;
    amount: number;
    type: string;
    date: string;
    categoryName?: string;
  }>;
  savingsGoals: Array<{
    id: number;
    name: string;
    currentAmount: number;
    targetAmount: number;
    progress: number;
  }>;
}