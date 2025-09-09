import { Transaction } from "@/components/transactions/types";

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
  transactionCount: number;
}

/**
 * Calculate monthly financial trends from Bunq transaction data
 */
export const calculateMonthlyTrends = (
  transactions: Transaction[],
  monthsBack: number = 6
): MonthlyTrendData[] => {
  if (!transactions || transactions.length === 0) {
    // Return empty data for the last 6 months if no transactions
    const emptyTrends: MonthlyTrendData[] = [];
    const now = new Date();

    for (let i = monthsBack - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      emptyTrends.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        income: 0,
        expenses: 0,
        savings: 0,
        transactionCount: 0,
      });
    }

    return emptyTrends;
  }

  // Group transactions by month
  const monthlyData = new Map<
    string,
    { income: number; expenses: number; transactionCount: number }
  >();

  transactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const monthKey = `${transactionDate.getFullYear()}-${String(
      transactionDate.getMonth() + 1
    ).padStart(2, "0")}`;

    const amount = transaction.amount || 0;

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        income: 0,
        expenses: 0,
        transactionCount: 0,
      });
    }

    const monthData = monthlyData.get(monthKey)!;
    monthData.transactionCount++;

    if (amount > 0) {
      monthData.income += amount;
    } else {
      monthData.expenses += Math.abs(amount);
    }
  });

  // Generate trends for the last N months
  const trends: MonthlyTrendData[] = [];
  const now = new Date();

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", { month: "short" });

    const monthData = monthlyData.get(monthKey) || {
      income: 0,
      expenses: 0,
      transactionCount: 0,
    };

    const savings = monthData.income - monthData.expenses;

    trends.push({
      month: monthName,
      income: monthData.income,
      expenses: monthData.expenses,
      savings: savings, // Allow negative savings
      transactionCount: monthData.transactionCount,
    });
  }

  return trends;
};

/**
 * Get the last 6 months of data with proper month names
 */
export const getLastSixMonths = (): MonthlyTrendData[] => {
  const trends: MonthlyTrendData[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    trends.push({
      month: date.toLocaleDateString("en-US", { month: "short" }),
      income: 0,
      expenses: 0,
      savings: 0,
      transactionCount: 0,
    });
  }

  return trends;
};
