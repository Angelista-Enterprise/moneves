"use client";

import { BentoItem, CategoryData } from "./types";
import { BentoGrid } from "./BentoGrid";
import { AnimationWrapper } from "@/components/ui";
import { Transaction } from "@/components/transactions/types";
import {
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
} from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";

interface FinancialOverviewProps {
  categories: CategoryData[];
  transactions: Transaction[] | undefined;
  showBalance: boolean;
  isLoading: boolean;
}

export const FinancialOverview = ({
  categories,
  transactions,
  showBalance,
  isLoading,
}: FinancialOverviewProps) => {
  const { formatCurrency } = useFormatting();
  // Calculate total income and expenses from transactions
  const totalIncome =
    transactions?.reduce((sum, tx) => {
      const amount = tx.amount || 0;
      return amount > 0 ? sum + amount : sum;
    }, 0) || 0;

  const totalExpenses =
    transactions?.reduce((sum, tx) => {
      const amount = tx.amount || 0;
      return amount < 0 ? sum + Math.abs(amount) : sum;
    }, 0) || 0;

  // Calculate previous month's data for comparison
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const previousMonthTransactions =
    transactions?.filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        txDate.getMonth() === previousMonth &&
        txDate.getFullYear() === previousYear
      );
    }) || [];

  const previousMonthIncome = previousMonthTransactions.reduce((sum, tx) => {
    const amount = tx.amount || 0;
    return amount > 0 ? sum + amount : sum;
  }, 0);

  const previousMonthExpenses = previousMonthTransactions.reduce((sum, tx) => {
    const amount = tx.amount || 0;
    return amount < 0 ? sum + Math.abs(amount) : sum;
  }, 0);

  // Calculate percentage change
  const incomeChange =
    previousMonthIncome > 0
      ? Math.round(
          ((totalIncome - previousMonthIncome) / previousMonthIncome) * 100
        )
      : 0;

  const expenseChange =
    previousMonthExpenses > 0
      ? Math.round(
          ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) *
            100
        )
      : 0;

  // Overview metrics (with fallbacks for empty arrays)
  const overBudgetCount = categories.filter(
    (cat) => cat.percentage >= 100
  ).length;
  const averageUtilization =
    categories.length > 0
      ? Math.round(
          categories.reduce((sum, cat) => sum + cat.percentage, 0) /
            categories.length
        )
      : 0;
  const topCategory =
    categories.length > 0
      ? categories.reduce((max, cat) => (cat.spent > max.spent ? cat : max))
      : { name: "No categories", spent: 0, monthlyLimit: 0, percentage: 0 };

  // Calculate net worth change
  const currentNetWorth = totalIncome - totalExpenses;
  const previousNetWorth = previousMonthIncome - previousMonthExpenses;
  const netWorthChange =
    previousNetWorth !== 0
      ? Math.round(
          ((currentNetWorth - previousNetWorth) / Math.abs(previousNetWorth)) *
            100
        )
      : 0;

  // Overview section items
  const overviewItems: BentoItem[] = [
    {
      title: "Total Income",
      description: "Total income from all transactions this month",
      icon: <TrendingUp className="w-4 h-4 text-green-500" />,
      amount: showBalance ? formatCurrency(totalIncome) : "••••••",
      change: incomeChange,
      tags: ["Income", "Total"],
      status: "This Month",
      colSpan: 1,
    },
    {
      title: "Total Expenses",
      description: "Total expenses from all transactions this month",
      icon: <DollarSign className="w-4 h-4 text-red-500" />,
      amount: showBalance ? formatCurrency(totalExpenses) : "••••••",
      change: expenseChange,
      tags: ["Expenses", "Total"],
      status: "This Month",
      colSpan: 1,
    },
    {
      title: "Net Worth",
      description: "Income minus expenses this month",
      icon: <Target className="w-4 h-4 text-blue-500" />,
      amount: showBalance ? formatCurrency(currentNetWorth) : "••••••",
      change: netWorthChange,
      tags: ["Net", "Worth"],
      status:
        currentNetWorth > 0
          ? "Positive"
          : currentNetWorth < 0
          ? "Negative"
          : "Neutral",
      colSpan: 1,
    },
    {
      title: "Budget Utilization",
      description: "Average budget usage across categories",
      icon: <TrendingUp className="w-4 h-4 text-purple-500" />,
      amount: `${averageUtilization}%`,
      tags: ["Budget", "Average"],
      status:
        averageUtilization > 80
          ? "High Usage"
          : averageUtilization > 50
          ? "Moderate"
          : "Low Usage",
      colSpan: 1,
    },
    {
      title: "Over Budget",
      description: "Categories exceeding their budget",
      icon: <TrendingDown className="w-4 h-4 text-orange-500" />,
      amount: overBudgetCount.toString(),
      tags: ["Over", "Alert"],
      status: overBudgetCount > 0 ? "Needs Attention" : "All Good",
      colSpan: 1,
    },
    {
      title: "Top Category",
      description: "Highest spending category",
      icon: <ShoppingCart className="w-4 h-4 text-purple-500" />,
      amount: topCategory.name,
      meta: showBalance ? formatCurrency(topCategory.spent) : "••••••",
      tags: ["Top", "Category"],
      status: `${topCategory.percentage}%`,
      colSpan: 1,
    },
  ];

  return (
    <AnimationWrapper animation="fadeIn" delay={200}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Financial Overview</h2>
        </div>
        <BentoGrid items={overviewItems} isLoading={isLoading} />
      </div>
    </AnimationWrapper>
  );
};
