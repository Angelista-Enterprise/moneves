import { Transaction } from "@/components/transactions/types";
import { SavingsGoal } from "@/lib/db/schema";

export interface SavingsGoalWithTransactions extends SavingsGoal {
  transactions: Transaction[];
  totalInflows: number;
  totalOutflows: number;
  netFlow: number;
  lastTransactionDate: string | null;
  // Account properties from the database join
  accountName?: string | null;
  accountType?: string | null;
  accountBalance?: number | null;
}

export function matchTransactionsWithSavingsGoals(
  savingsGoals: SavingsGoal[],
  transactions: Transaction[]
): SavingsGoalWithTransactions[] {
  return savingsGoals.map((goal) => {
    // For now, we'll use all transactions since they're already filtered by account
    // In a real implementation, you'd need to pass account-specific transactions
    const goalTransactions = transactions;

    // Calculate flows
    const inflows = goalTransactions
      .filter((tx) => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const outflows = goalTransactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    const netFlow = inflows - outflows;

    // Get the most recent transaction date
    const lastTransactionDate =
      goalTransactions.length > 0
        ? goalTransactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0].date
        : null;

    return {
      ...goal,
      transactions: goalTransactions,
      totalInflows: inflows,
      totalOutflows: outflows,
      netFlow,
      lastTransactionDate,
    };
  });
}

export function calculateSavingsGoalProgress(
  goal: SavingsGoalWithTransactions,
  useTransactionData: boolean = true
): {
  progress: number;
  status: "on_track" | "behind" | "ahead" | "completed";
  monthlyContribution: number;
  monthsRemaining: number;
  projectedCompletion: string | null;
} {
  const currentAmount = useTransactionData
    ? goal.currentAmount
    : goal.currentAmount;
  const progress =
    goal.targetAmount > 0 ? (currentAmount / goal.targetAmount) * 100 : 0;

  let status: "on_track" | "behind" | "ahead" | "completed" = "on_track";
  if (progress >= 100) status = "completed";
  else if (progress < 50) status = "behind";
  else if (progress > 80) status = "ahead";

  // Calculate monthly contribution based on recent transactions
  const recentTransactions = goal.transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return txDate >= thirtyDaysAgo;
  });

  const monthlyInflows = recentTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const monthlyOutflows = recentTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const monthlyContribution = monthlyInflows - monthlyOutflows;

  // Calculate months remaining
  const remainingAmount = goal.targetAmount - currentAmount;
  const monthsRemaining =
    monthlyContribution > 0
      ? Math.ceil(remainingAmount / monthlyContribution)
      : null;

  // Calculate projected completion date
  const projectedCompletion = monthsRemaining
    ? new Date(Date.now() + monthsRemaining * 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : null;

  return {
    progress: Math.min(progress, 100),
    status,
    monthlyContribution,
    monthsRemaining: monthsRemaining || 0,
    projectedCompletion,
  };
}

export function getSavingsGoalInsights(goal: SavingsGoalWithTransactions): {
  isOnTrack: boolean;
  needsAttention: boolean;
  recentActivity: boolean;
  contributionTrend: "increasing" | "decreasing" | "stable";
  recommendations: string[];
} {
  const progress = calculateSavingsGoalProgress(goal);
  const recentTransactions = goal.transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return txDate >= sevenDaysAgo;
  });

  const recentActivity = recentTransactions.length > 0;
  const isOnTrack =
    progress.status === "on_track" || progress.status === "ahead";
  const needsAttention =
    progress.status === "behind" || progress.monthlyContribution <= 0;

  // Calculate contribution trend (simplified)
  const lastMonthTransactions = goal.transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    return txDate >= sixtyDaysAgo && txDate < thirtyDaysAgo;
  });

  const lastMonthContribution =
    lastMonthTransactions
      .filter((tx) => tx.amount > 0)
      .reduce((sum, tx) => sum + tx.amount, 0) -
    lastMonthTransactions
      .filter((tx) => tx.amount < 0)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const currentMonthContribution = progress.monthlyContribution;

  let contributionTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (currentMonthContribution > lastMonthContribution * 1.1)
    contributionTrend = "increasing";
  else if (currentMonthContribution < lastMonthContribution * 0.9)
    contributionTrend = "decreasing";

  // Generate recommendations
  const recommendations: string[] = [];

  if (needsAttention) {
    recommendations.push(
      "Consider increasing your monthly contributions to stay on track"
    );
  }

  if (progress.monthlyContribution <= 0) {
    recommendations.push("Set up automatic transfers to this savings account");
  }

  if (contributionTrend === "decreasing") {
    recommendations.push(
      "Your contributions have decreased recently - consider reviewing your budget"
    );
  }

  if (progress.monthsRemaining > 12) {
    recommendations.push(
      "Consider increasing your target amount or monthly contributions"
    );
  }

  if (progress.progress > 80 && progress.status !== "completed") {
    recommendations.push("You're close to your goal! Keep up the great work");
  }

  return {
    isOnTrack,
    needsAttention,
    recentActivity,
    contributionTrend,
    recommendations,
  };
}
