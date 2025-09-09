import { notificationManager } from "./notification-manager";

export interface FinancialData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  budgets: Array<{
    id: string;
    name: string;
    monthlyLimit: number;
    spent: number;
    category: string;
  }>;
  goals: Array<{
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate?: string;
  }>;
  transactions: Array<{
    id: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
  }>;
  categories: Array<{
    id: string;
    name: string;
    totalSpent: number;
  }>;
}

export interface Recommendation {
  id: string;
  type: "budget" | "savings" | "spending" | "category" | "goal" | "general";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  data?: Record<string, unknown>;
}

class SmartRecommendationsService {
  private lastAnalysisDate: Date | null = null;
  private analysisInterval = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Analyze financial data and generate recommendations
   */
  analyzeAndRecommend(data: FinancialData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check if we should analyze (not too frequent)
    const now = new Date();
    if (
      this.lastAnalysisDate &&
      now.getTime() - this.lastAnalysisDate.getTime() < this.analysisInterval
    ) {
      return recommendations;
    }

    this.lastAnalysisDate = now;

    // Budget recommendations
    recommendations.push(...this.analyzeBudgets(data));

    // Savings recommendations
    recommendations.push(...this.analyzeSavings(data));

    // Spending recommendations
    recommendations.push(...this.analyzeSpending(data));

    // Category recommendations
    recommendations.push(...this.analyzeCategories(data));

    // Goal recommendations
    recommendations.push(...this.analyzeGoals(data));

    // General recommendations
    recommendations.push(...this.analyzeGeneral(data));

    // Send high priority recommendations as notifications
    recommendations
      .filter((r) => r.priority === "high")
      .forEach((rec) => {
        notificationManager.addRecommendation(
          rec.title,
          rec.description,
          rec.action
        );
      });

    return recommendations;
  }

  /**
   * Analyze budget data
   */
  private analyzeBudgets(data: FinancialData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check for over-budget categories
    data.budgets.forEach((budget) => {
      const utilizationRate = budget.spent / budget.monthlyLimit;

      if (utilizationRate >= 1) {
        recommendations.push({
          id: `budget_exceeded_${budget.id}`,
          type: "budget",
          priority: "high",
          title: `Budget Exceeded: ${budget.name}`,
          description: `You've spent $${budget.spent.toFixed(
            2
          )} out of $${budget.monthlyLimit.toFixed(2)} budget for ${
            budget.category
          }. Consider adjusting your spending or increasing the budget.`,
          action: {
            label: "View Budget",
            onClick: () => (window.location.href = "/budgets"),
          },
          data: { budgetId: budget.id, utilizationRate },
        });
      } else if (utilizationRate >= 0.8) {
        recommendations.push({
          id: `budget_warning_${budget.id}`,
          type: "budget",
          priority: "medium",
          title: `Budget Warning: ${budget.name}`,
          description: `You've used ${(utilizationRate * 100).toFixed(
            0
          )}% of your ${budget.category} budget. You have $${(
            budget.monthlyLimit - budget.spent
          ).toFixed(2)} remaining.`,
          action: {
            label: "View Budget",
            onClick: () => (window.location.href = "/budgets"),
          },
          data: { budgetId: budget.id, utilizationRate },
        });
      }
    });

    // Check for unused budgets
    const unusedBudgets = data.budgets.filter((budget) => budget.spent === 0);
    if (unusedBudgets.length > 0) {
      recommendations.push({
        id: "unused_budgets",
        type: "budget",
        priority: "low",
        title: "Unused Budgets",
        description: `You have ${unusedBudgets.length} budget(s) with no spending. Consider reviewing if these budgets are still needed.`,
        action: {
          label: "Review Budgets",
          onClick: () => (window.location.href = "/budgets"),
        },
        data: { unusedCount: unusedBudgets.length },
      });
    }

    return recommendations;
  }

  /**
   * Analyze savings data
   */
  private analyzeSavings(data: FinancialData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check savings rate
    const savingsRate =
      data.netIncome > 0 ? (data.netIncome / data.totalIncome) * 100 : 0;

    if (savingsRate < 10 && data.totalIncome > 0) {
      recommendations.push({
        id: "low_savings_rate",
        type: "savings",
        priority: "high",
        title: "Low Savings Rate",
        description: `Your savings rate is ${savingsRate.toFixed(
          1
        )}%. Financial experts recommend saving at least 20% of your income. Consider creating a savings goal.`,
        action: {
          label: "Create Savings Goal",
          onClick: () => (window.location.href = "/savings-goals"),
        },
        data: { savingsRate },
      });
    } else if (savingsRate >= 20) {
      recommendations.push({
        id: "excellent_savings_rate",
        type: "savings",
        priority: "low",
        title: "Excellent Savings Rate!",
        description: `Great job! You're saving ${savingsRate.toFixed(
          1
        )}% of your income. Keep up the good work!`,
        data: { savingsRate },
      });
    }

    // Check for emergency fund
    const monthlyExpenses = data.totalExpenses;
    const emergencyFundTarget = monthlyExpenses * 3; // 3 months of expenses
    const currentSavings = data.goals
      .filter((goal) => goal.name.toLowerCase().includes("emergency"))
      .reduce((sum, goal) => sum + goal.currentAmount, 0);

    if (currentSavings < emergencyFundTarget && data.goals.length === 0) {
      recommendations.push({
        id: "emergency_fund",
        type: "savings",
        priority: "high",
        title: "Build Emergency Fund",
        description: `Consider building an emergency fund of $${emergencyFundTarget.toFixed(
          2
        )} (3 months of expenses). You currently have $${currentSavings.toFixed(
          2
        )} saved.`,
        action: {
          label: "Create Emergency Fund Goal",
          onClick: () => (window.location.href = "/savings-goals"),
        },
        data: { target: emergencyFundTarget, current: currentSavings },
      });
    }

    return recommendations;
  }

  /**
   * Analyze spending patterns
   */
  private analyzeSpending(data: FinancialData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check for high spending categories
    const sortedCategories = data.categories
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 3);

    sortedCategories.forEach((category) => {
      const percentage = (category.totalSpent / data.totalExpenses) * 100;

      if (percentage > 40) {
        recommendations.push({
          id: `high_spending_${category.id}`,
          type: "spending",
          priority: "medium",
          title: `High Spending: ${category.name}`,
          description: `${category.name} represents ${percentage.toFixed(
            1
          )}% of your total expenses. Consider if this spending aligns with your financial goals.`,
          action: {
            label: "View Transactions",
            onClick: () => (window.location.href = "/transactions"),
          },
          data: { categoryId: category.id, percentage },
        });
      }
    });

    // Check for irregular spending
    const recentTransactions = data.transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return transactionDate >= thirtyDaysAgo;
    });

    const dailySpending = recentTransactions.reduce((acc, t) => {
      const date = t.date.split("T")[0];
      acc[date] = (acc[date] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);

    const spendingValues = Object.values(dailySpending);
    if (spendingValues.length > 7) {
      const avgSpending =
        spendingValues.reduce((sum, val) => sum + val, 0) /
        spendingValues.length;
      const variance =
        spendingValues.reduce(
          (sum, val) => sum + Math.pow(val - avgSpending, 2),
          0
        ) / spendingValues.length;
      const coefficient = Math.sqrt(variance) / avgSpending;

      if (coefficient > 0.5) {
        recommendations.push({
          id: "irregular_spending",
          type: "spending",
          priority: "medium",
          title: "Irregular Spending Pattern",
          description:
            "Your daily spending varies significantly. Consider creating a daily spending budget to better control your expenses.",
          action: {
            label: "Create Budget",
            onClick: () => (window.location.href = "/budgets"),
          },
          data: { coefficient },
        });
      }
    }

    return recommendations;
  }

  /**
   * Analyze category data
   */
  private analyzeCategories(data: FinancialData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check for uncategorized transactions
    const uncategorizedCount = data.transactions.filter(
      (t) => !t.category || t.category === "Uncategorized"
    ).length;

    if (uncategorizedCount > 0) {
      recommendations.push({
        id: "uncategorized_transactions",
        type: "category",
        priority: "medium",
        title: "Uncategorized Transactions",
        description: `You have ${uncategorizedCount} uncategorized transactions. Proper categorization helps with budgeting and analysis.`,
        action: {
          label: "Categorize Transactions",
          onClick: () => (window.location.href = "/transactions"),
        },
        data: { count: uncategorizedCount },
      });
    }

    return recommendations;
  }

  /**
   * Analyze goal data
   */
  private analyzeGoals(data: FinancialData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check for overdue goals
    const now = new Date();
    const overdueGoals = data.goals.filter((goal) => {
      if (!goal.targetDate) return false;
      const targetDate = new Date(goal.targetDate);
      return targetDate < now && goal.currentAmount < goal.targetAmount;
    });

    if (overdueGoals.length > 0) {
      recommendations.push({
        id: "overdue_goals",
        type: "goal",
        priority: "high",
        title: "Overdue Savings Goals",
        description: `You have ${overdueGoals.length} overdue savings goal(s). Consider adjusting the target date or increasing monthly contributions.`,
        action: {
          label: "View Goals",
          onClick: () => (window.location.href = "/savings-goals"),
        },
        data: { count: overdueGoals.length },
      });
    }

    // Check for goals with low progress
    const lowProgressGoals = data.goals.filter((goal) => {
      const progress =
        goal.targetAmount > 0
          ? (goal.currentAmount / goal.targetAmount) * 100
          : 0;
      const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
      const timeRemaining = targetDate
        ? (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30)
        : 0; // months

      return progress < 50 && timeRemaining < 6 && timeRemaining > 0;
    });

    if (lowProgressGoals.length > 0) {
      recommendations.push({
        id: "low_progress_goals",
        type: "goal",
        priority: "medium",
        title: "Goals Need Attention",
        description: `You have ${lowProgressGoals.length} goal(s) with low progress and limited time remaining. Consider increasing contributions.`,
        action: {
          label: "View Goals",
          onClick: () => (window.location.href = "/savings-goals"),
        },
        data: { count: lowProgressGoals.length },
      });
    }

    return recommendations;
  }

  /**
   * Analyze general financial health
   */
  private analyzeGeneral(data: FinancialData): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Check for negative net income
    if (data.netIncome < 0) {
      recommendations.push({
        id: "negative_net_income",
        type: "general",
        priority: "high",
        title: "Negative Net Income",
        description: `Your expenses exceed your income by $${Math.abs(
          data.netIncome
        ).toFixed(
          2
        )}. This is unsustainable long-term. Consider reducing expenses or increasing income.`,
        action: {
          label: "Review Budget",
          onClick: () => (window.location.href = "/budgets"),
        },
        data: { netIncome: data.netIncome },
      });
    }

    // Check for no budgets
    if (data.budgets.length === 0) {
      recommendations.push({
        id: "no_budgets",
        type: "general",
        priority: "high",
        title: "Create Your First Budget",
        description:
          "Budgets help you track and control your spending. Create a budget to get started with better financial management.",
        action: {
          label: "Create Budget",
          onClick: () => (window.location.href = "/budgets"),
        },
      });
    }

    // Check for no goals
    if (data.goals.length === 0) {
      recommendations.push({
        id: "no_goals",
        type: "general",
        priority: "medium",
        title: "Set Financial Goals",
        description:
          "Financial goals give you something to work towards. Consider setting up a savings goal for your future.",
        action: {
          label: "Create Goal",
          onClick: () => (window.location.href = "/savings-goals"),
        },
      });
    }

    return recommendations;
  }
}

export const smartRecommendationsService = new SmartRecommendationsService();
