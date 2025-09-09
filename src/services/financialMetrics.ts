import { Transaction } from "@/components/transactions/types";

export interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  incomeChange: number;
  expensesChange: number;
  netChange: number;
  transactionCountChange: number;
}

export const calculateFinancialMetrics = (
  transactions: Transaction[],
  currentPeriod: "month" | "week" | "year" = "month"
): FinancialMetrics => {
  const now = new Date();
  const currentPeriodStart = getPeriodStart(now, currentPeriod);
  const previousPeriodStart = getPeriodStart(
    new Date(currentPeriodStart.getTime() - 1),
    currentPeriod
  );
  const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);

  // Filter transactions for current period
  const currentPeriodTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= currentPeriodStart && txDate <= now;
  });

  // Filter transactions for previous period
  const previousPeriodTransactions = transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= previousPeriodStart && txDate <= previousPeriodEnd;
  });

  // Calculate current period metrics
  const currentIncome = currentPeriodTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const currentExpenses = Math.abs(
    currentPeriodTransactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  const currentNet = currentPeriodTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const currentCount = currentPeriodTransactions.length;

  // Calculate previous period metrics
  const previousIncome = previousPeriodTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const previousExpenses = Math.abs(
    previousPeriodTransactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + tx.amount, 0)
  );

  const previousNet = previousPeriodTransactions.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );

  const previousCount = previousPeriodTransactions.length;

  // Calculate percentage changes
  const incomeChange = calculatePercentageChange(previousIncome, currentIncome);
  const expensesChange = calculatePercentageChange(
    previousExpenses,
    currentExpenses
  );
  const netChange = calculatePercentageChange(previousNet, currentNet);
  const transactionCountChange = calculatePercentageChange(
    previousCount,
    currentCount
  );

  return {
    totalIncome: currentIncome,
    totalExpenses: currentExpenses,
    netAmount: currentNet,
    transactionCount: currentCount,
    incomeChange,
    expensesChange,
    netChange,
    transactionCountChange,
  };
};

const getPeriodStart = (
  date: Date,
  period: "month" | "week" | "year"
): Date => {
  const start = new Date(date);

  switch (period) {
    case "month":
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      break;
    case "year":
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      break;
  }

  return start;
};

const calculatePercentageChange = (
  previous: number,
  current: number
): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / Math.abs(previous)) * 100;
};
