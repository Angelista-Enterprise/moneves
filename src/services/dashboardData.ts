import React from "react";
import {
  DashboardData,
  BudgetItem,
  FinancialOverviewItem,
} from "@/types/dashboard";
import { BunqAccountResponse } from "@/types/bunq";
import { Transaction as AppTransaction } from "@/components/transactions/types";
import { BudgetCategory } from "@/types/database/budgets";
// Removed unused TransactionCategory import
import { Wallet, TrendingUp, Target, ArrowUpRight } from "lucide-react";
import { calculateProgressPercentage } from "./budgetCalculation";
import { calculateFinancialMetrics } from "./financialMetrics";

// Helper functions to convert Bunq data to dashboard format
// const convertBunqTransactionToTransaction = (
//   bunqTx: AppTransaction
// ): Transaction => {
//   return {
//     id: bunqTx.id,
//     description: bunqTx.description,
//     amount: bunqTx.amount,
//     date: bunqTx.date,
//     category: bunqTx.category,
//     type: bunqTx.type,
//     icon: getCategoryIcon(bunqTx.category),
//   };
// };

// Helper function to get category icon (will be replaced with database lookup)
const getCategoryIcon = (categoryId: string) => {
  // This will be replaced with actual category lookup from database
  const categoryMap: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    income: TrendingUp,
    housing: Wallet,
    food: Wallet,
    transportation: Wallet,
    subscriptions: Wallet,
    shopping: Wallet,
    healthcare: Wallet,
    fitness: Wallet,
    travel: Wallet,
    entertainment: Wallet,
    education: Wallet,
    uncategorized: Wallet,
  };
  return categoryMap[categoryId] || Wallet;
};

// Convert budget categories to budget items
const convertBudgetCategoriesToBudgetItems = (
  budgetCategories: BudgetCategory[]
): BudgetItem[] => {
  return budgetCategories.map((budget) => {
    const progress = calculateProgressPercentage(budget);

    return {
      id: budget.id.toString(),
      title: budget.name,
      description: "monthly budget",
      amount: budget.monthlyLimit,
      spent: budget.spent,
      icon: getCategoryIcon("budget"), // Will be replaced with actual category icon
      color: budget.color || "text-blue-500",
      bgColor: budget.color
        ? `${budget.color.replace("text-", "bg-")}/10`
        : "bg-blue-500/10",
      progress,
    };
  });
};

// Calculate financial overview from real data
const calculateFinancialOverview = (
  accounts?: BunqAccountResponse[],
  transactions?: AppTransaction[]
): FinancialOverviewItem[] => {
  if (!accounts || !transactions) {
    return [];
  }

  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => {
    return sum + parseFloat(account.balance || "0");
  }, 0);

  // Calculate financial metrics with real period-over-period changes
  const metrics = calculateFinancialMetrics(transactions, "month");

  const savingsRate =
    metrics.totalIncome > 0
      ? ((metrics.totalIncome - metrics.totalExpenses) / metrics.totalIncome) *
        100
      : 0;

  return [
    {
      id: "total-balance",
      title: "Total Balance",
      description: "Combined balance across all accounts",
      amount: totalBalance,
      change: 0, // Balance change would need account history, keeping as 0 for now
      changeType: "increase" as const,
      icon: Wallet,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: "monthly-income",
      title: "Monthly Income",
      description: "Total income this month",
      amount: metrics.totalIncome,
      change: metrics.incomeChange,
      changeType:
        metrics.incomeChange >= 0
          ? ("increase" as const)
          : ("decrease" as const),
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: "monthly-expenses",
      title: "Monthly Expenses",
      description: "Total expenses this month",
      amount: metrics.totalExpenses,
      change: metrics.expensesChange,
      changeType:
        metrics.expensesChange <= 0
          ? ("increase" as const)
          : ("decrease" as const),
      icon: Target,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      id: "savings-rate",
      title: "Savings Rate",
      description: "Percentage of income saved",
      amount: savingsRate,
      change: 0, // Savings rate change calculation would be complex, keeping as 0 for now
      changeType: "increase" as const,
      icon: ArrowUpRight,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];
};

// Main dashboard data function
export const getDashboardData = (
  accounts?: BunqAccountResponse[],
  transactions?: AppTransaction[],
  budgetCategories?: BudgetCategory[]
): DashboardData => {
  // Use transactions directly since they're already in the correct format
  const convertedTransactions = transactions || [];

  // Calculate financial overview
  const financialOverview = calculateFinancialOverview(
    accounts,
    convertedTransactions
  );

  // Convert budget categories to budget items
  const budgetItems = budgetCategories
    ? convertBudgetCategoriesToBudgetItems(budgetCategories)
    : [];

  return {
    budgetItems,
    transactions: convertedTransactions,
    financialOverview,
  };
};
