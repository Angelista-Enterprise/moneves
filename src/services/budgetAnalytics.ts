import { Transaction } from "@/components/transactions/types";

export interface BudgetInsight {
  id: string;
  type:
    | "spending_trend"
    | "savings_opportunity"
    | "overspend_risk"
    | "goal_progress"
    | "pattern_analysis";
  title: string;
  description: string;
  severity: "info" | "warning" | "critical";
  data: Record<string, unknown>;
  points?: number;
}

export interface BudgetAchievement {
  id: string;
  type:
    | "savings_milestone"
    | "spending_control"
    | "goal_achieved"
    | "streak"
    | "efficiency";
  title: string;
  description: string;
  points: number;
  unlockedAt: string;
  data: Record<string, unknown>;
}

export interface SpendingPattern {
  type:
    | "consistent"
    | "sporadic"
    | "seasonal"
    | "trending_up"
    | "trending_down";
  confidence: number;
  description: string;
}

export interface BudgetAnalytics {
  totalSpent: number;
  totalBudget: number;
  utilizationRate: number;
  averageDailySpending: number;
  projectedMonthlySpending: number;
  daysRemaining: number;
  spendingPattern: SpendingPattern;
  insights: BudgetInsight[];
  achievements: BudgetAchievement[];
  riskLevel: "low" | "medium" | "high";
  recommendations: string[];
}

/**
 * Analyze spending patterns from transaction data
 */
export function analyzeSpendingPattern(
  transactions: Transaction[]
): SpendingPattern {
  if (transactions.length < 3) {
    return {
      type: "consistent",
      confidence: 0.5,
      description: "Insufficient data for pattern analysis",
    };
  }

  const amounts = transactions.map((tx) => Math.abs(tx.amount || 0));
  // const dates = transactions.map((tx) => new Date(tx.created));

  // Calculate variance
  const mean =
    amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
  const variance =
    amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) /
    amounts.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = standardDeviation / mean;

  // Analyze trend
  const sortedTransactions = transactions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const recentAmounts = sortedTransactions
    .slice(-7)
    .map((tx) => Math.abs(tx.amount || 0));
  const olderAmounts = sortedTransactions
    .slice(0, -7)
    .map((tx) => Math.abs(tx.amount || 0));

  const recentAvg =
    recentAmounts.reduce((sum, amount) => sum + amount, 0) /
    recentAmounts.length;
  const olderAvg =
    olderAmounts.length > 0
      ? olderAmounts.reduce((sum, amount) => sum + amount, 0) /
        olderAmounts.length
      : recentAvg;

  const trendChange = ((recentAvg - olderAvg) / olderAvg) * 100;

  // Determine pattern type
  let patternType: SpendingPattern["type"] = "consistent";
  let confidence = 0.7;
  let description = "";

  if (coefficientOfVariation > 0.5) {
    patternType = "sporadic";
    description =
      "Spending varies significantly from transaction to transaction";
    confidence = 0.8;
  } else if (Math.abs(trendChange) > 20) {
    patternType = trendChange > 0 ? "trending_up" : "trending_down";
    description = `Spending is ${
      trendChange > 0 ? "increasing" : "decreasing"
    } by ${Math.abs(trendChange).toFixed(1)}%`;
    confidence = 0.9;
  } else if (coefficientOfVariation < 0.2) {
    patternType = "consistent";
    description = "Spending is very consistent across transactions";
    confidence = 0.9;
  }

  return {
    type: patternType,
    confidence,
    description,
  };
}

/**
 * Generate budget insights based on spending data
 */
export function generateBudgetInsights(
  budget: {
    id: number;
    name: string;
    spent: number;
    monthlyLimit: number;
    savingsGoal?: number;
  },
  transactions: Transaction[]
  // allTransactions: BunqTransactionResponse[]
): BudgetInsight[] {
  const insights: BudgetInsight[] = [];
  const utilizationRate = budget.spent / budget.monthlyLimit;
  const daysInMonth = new Date().getDate();
  const daysRemaining =
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() -
    daysInMonth;
  const projectedSpending = (budget.spent / daysInMonth) * 30;

  // Overspend risk insight
  if (utilizationRate > 0.8) {
    insights.push({
      id: `overspend_risk_${budget.id}`,
      type: "overspend_risk",
      title: "High Spending Alert",
      description: `You've used ${(utilizationRate * 100).toFixed(
        1
      )}% of your ${
        budget.name
      } budget. At current pace, you'll exceed your limit by ${Math.max(
        0,
        projectedSpending - budget.monthlyLimit
      ).toFixed(2)}€.`,
      severity: utilizationRate > 1 ? "critical" : "warning",
      data: { utilizationRate, projectedSpending, daysRemaining },
    });
  }

  // Savings opportunity insight
  if (utilizationRate < 0.5 && budget.spent > 0) {
    const potentialSavings = budget.monthlyLimit - budget.spent;
    insights.push({
      id: `savings_opportunity_${budget.id}`,
      type: "savings_opportunity",
      title: "Savings Opportunity",
      description: `You're ${(utilizationRate * 100).toFixed(
        1
      )}% under budget for ${
        budget.name
      }. You could save ${potentialSavings.toFixed(2)}€ this month.`,
      severity: "info",
      data: { potentialSavings, utilizationRate },
    });
  }

  // Spending pattern insight
  const categoryTransactions = transactions.filter(
    () =>
      // This would need to be filtered by actual categorization
      true
  );

  if (categoryTransactions.length > 5) {
    const pattern = analyzeSpendingPattern(categoryTransactions);
    if (pattern.type === "trending_up") {
      insights.push({
        id: `spending_trend_${budget.id}`,
        type: "spending_trend",
        title: "Spending Trend Alert",
        description: `Your ${budget.name} spending is trending upward. Consider reviewing recent purchases.`,
        severity: "warning",
        data: { pattern },
      });
    }
  }

  // Goal progress insight
  if (budget.savingsGoal && budget.savingsGoal > 0) {
    const savingsProgress = (budget.spent / budget.savingsGoal) * 100;
    if (savingsProgress > 50) {
      insights.push({
        id: `goal_progress_${budget.id}`,
        type: "goal_progress",
        title: "Goal Progress",
        description: `You're ${savingsProgress.toFixed(1)}% towards your ${
          budget.name
        } savings goal of ${budget.savingsGoal}€.`,
        severity: "info",
        data: { savingsProgress, goal: budget.savingsGoal },
      });
    }
  }

  return insights;
}

/**
 * Generate budget achievements based on spending behavior
 */
export function generateBudgetAchievements(
  budget: {
    id: number;
    name: string;
    spent: number;
    monthlyLimit: number;
    savingsGoal?: number;
  },
  transactions: Transaction[]
): BudgetAchievement[] {
  const achievements: BudgetAchievement[] = [];
  const utilizationRate = budget.spent / budget.monthlyLimit;

  // Spending control achievements
  if (utilizationRate <= 0.5 && budget.spent > 0) {
    achievements.push({
      id: `spending_control_${budget.id}`,
      type: "spending_control",
      title: "Budget Master",
      description: `You've kept ${budget.name} spending under 50% of budget!`,
      points: 50,
      unlockedAt: new Date().toISOString(),
      data: { utilizationRate },
    });
  }

  // Savings milestone achievements
  if (budget.savingsGoal && budget.spent >= budget.savingsGoal) {
    achievements.push({
      id: `savings_milestone_${budget.id}`,
      type: "savings_milestone",
      title: "Goal Achiever",
      description: `Congratulations! You've reached your ${budget.name} savings goal!`,
      points: 100,
      unlockedAt: new Date().toISOString(),
      data: { goal: budget.savingsGoal, achieved: budget.spent },
    });
  }

  // Consistency achievements
  const categoryTransactions = transactions.filter(() => true); // Filter by actual categorization
  if (categoryTransactions.length >= 10) {
    const pattern = analyzeSpendingPattern(categoryTransactions);
    if (pattern.type === "consistent" && pattern.confidence > 0.8) {
      achievements.push({
        id: `consistency_${budget.id}`,
        type: "efficiency",
        title: "Consistent Spender",
        description: `You maintain very consistent spending patterns in ${budget.name}.`,
        points: 75,
        unlockedAt: new Date().toISOString(),
        data: { pattern },
      });
    }
  }

  return achievements;
}

/**
 * Calculate comprehensive budget analytics
 */
export function calculateBudgetAnalytics(
  budget: {
    id: number;
    name: string;
    spent: number;
    monthlyLimit: number;
    savingsGoal?: number;
  },
  transactions: Transaction[]
): BudgetAnalytics {
  const utilizationRate = budget.spent / budget.monthlyLimit;
  const daysInMonth = new Date().getDate();
  const daysRemaining =
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() -
    daysInMonth;
  const averageDailySpending = budget.spent / daysInMonth;
  const projectedMonthlySpending = averageDailySpending * 30;

  const categoryTransactions = transactions.filter(() => true); // Filter by actual categorization
  const spendingPattern = analyzeSpendingPattern(categoryTransactions);

  const insights = generateBudgetInsights(budget, categoryTransactions);
  const achievements = generateBudgetAchievements(budget, categoryTransactions);

  // Calculate risk level
  let riskLevel: "low" | "medium" | "high" = "low";
  if (utilizationRate > 1) riskLevel = "high";
  else if (
    utilizationRate > 0.8 ||
    projectedMonthlySpending > budget.monthlyLimit
  )
    riskLevel = "medium";

  // Generate recommendations
  const recommendations: string[] = [];
  if (utilizationRate > 0.8) {
    recommendations.push(
      `Consider reducing ${budget.name} spending to stay within budget`
    );
  }
  if (spendingPattern.type === "trending_up") {
    recommendations.push(
      `Your ${budget.name} spending is increasing - review recent purchases`
    );
  }
  if (budget.savingsGoal && budget.spent < budget.savingsGoal * 0.5) {
    recommendations.push(
      `You're on track to exceed your ${budget.name} savings goal!`
    );
  }

  return {
    totalSpent: budget.spent,
    totalBudget: budget.monthlyLimit,
    utilizationRate,
    averageDailySpending,
    projectedMonthlySpending,
    daysRemaining,
    spendingPattern,
    insights,
    achievements,
    riskLevel,
    recommendations,
  };
}
