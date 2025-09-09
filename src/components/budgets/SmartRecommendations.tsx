"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AnimationWrapper } from "@/components/ui";
import {
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  DollarSign,
  Star,
  ArrowRight,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { Transaction } from "@/components/transactions/types";

interface Recommendation {
  id: string;
  type: "savings" | "spending" | "optimization" | "goal" | "alert";
  title: string;
  description: string;
  impact: "low" | "medium" | "high";
  effort: "low" | "medium" | "high";
  potentialSavings?: number;
  category?: string;
  action?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface Budget {
  id: number;
  name: string;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  savingsGoal?: number;
}

interface SmartRecommendationsProps {
  budgets: Budget[];
  transactions: Transaction[];
  onApplyRecommendation: (recommendation: Recommendation) => void;
  onNavigateToSavings?: () => void;
  onNavigateToCategorize?: () => void;
}

export const SmartRecommendations = ({
  budgets,
  transactions,
  onApplyRecommendation,
  onNavigateToSavings,
  onNavigateToCategorize,
}: SmartRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filter, setFilter] = useState<
    "all" | "savings" | "spending" | "optimization"
  >("all");

  const generateRecommendations = useCallback(() => {
    const recs: Recommendation[] = [];

    // Analyze each budget for recommendations
    budgets.forEach((budget) => {
      const utilizationRate = budget.spent / budget.monthlyLimit;
      const daysInMonth = new Date().getDate();
      const projectedSpending = (budget.spent / daysInMonth) * 30;
      // const remainingDays =
      //   new Date(
      //     new Date().getFullYear(),
      //     new Date().getMonth() + 1,
      //     0
      //   ).getDate() - daysInMonth;

      // High utilization alerts
      if (utilizationRate > 0.9) {
        recs.push({
          id: `alert_${budget.id}`,
          type: "alert",
          title: "Critical Spending Alert",
          description: `You've used ${Math.round(
            utilizationRate * 100
          )}% of your ${
            budget.name
          } budget. Consider reducing spending immediately.`,
          impact: "high",
          effort: "medium",
          category: budget.name,
          action: "Reduce spending",
          icon: AlertTriangle,
          color: "text-red-400 bg-red-500/10",
        });
      }

      // Savings opportunities
      if (utilizationRate < 0.6 && budget.spent > 0) {
        const potentialSavings = budget.monthlyLimit - budget.spent;
        recs.push({
          id: `savings_${budget.id}`,
          type: "savings",
          title: "Savings Opportunity",
          description: `You're ${Math.round(
            utilizationRate * 100
          )}% under budget for ${
            budget.name
          }. You could save ${potentialSavings.toFixed(0)}€ this month.`,
          impact: "medium",
          effort: "low",
          potentialSavings,
          category: budget.name,
          action: "Increase savings goal",
          icon: Target,
          color: "text-green-400 bg-green-500/10",
        });
      }

      // Budget optimization
      if (projectedSpending > budget.monthlyLimit * 1.1) {
        recs.push({
          id: `optimization_${budget.id}`,
          type: "optimization",
          title: "Budget Optimization",
          description: `At current pace, you'll exceed ${
            budget.name
          } budget by ${(projectedSpending - budget.monthlyLimit).toFixed(
            0
          )}€. Consider adjusting your spending pattern.`,
          impact: "high",
          effort: "medium",
          category: budget.name,
          action: "Adjust spending pattern",
          icon: BarChart3,
          color: "text-yellow-400 bg-yellow-500/10",
        });
      }

      // Goal setting recommendations
      if (!budget.savingsGoal && budget.remaining > 100) {
        recs.push({
          id: `goal_${budget.id}`,
          type: "goal",
          title: "Set Savings Goal",
          description: `You have ${budget.remaining.toFixed(0)}€ remaining in ${
            budget.name
          }. Consider setting a savings goal to maximize your potential.`,
          impact: "medium",
          effort: "low",
          category: budget.name,
          action: "Set savings goal",
          icon: Star,
          color: "text-blue-400 bg-blue-500/10",
        });
      }
    });

    // Cross-budget recommendations
    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
    const totalBudget = budgets.reduce(
      (sum, budget) => sum + budget.monthlyLimit,
      0
    );
    const overallUtilization = totalSpent / totalBudget;

    if (overallUtilization > 0.8) {
      recs.push({
        id: "overall_alert",
        type: "alert",
        title: "Overall Budget Alert",
        description: `You've used ${Math.round(
          overallUtilization * 100
        )}% of your total budget. Consider reviewing all categories.`,
        impact: "high",
        effort: "high",
        action: "Review all budgets",
        icon: AlertTriangle,
        color: "text-red-400 bg-red-500/10",
      });
    }

    // Smart categorization recommendation
    const uncategorizedTransactions = transactions.filter(
      (tx) => tx.category === "Uncategorized"
    );
    if (uncategorizedTransactions.length > 5) {
      recs.push({
        id: "categorization",
        type: "optimization",
        title: "Improve Categorization",
        description: `You have ${uncategorizedTransactions.length} uncategorized transactions. Better categorization will improve budget accuracy.`,
        impact: "medium",
        effort: "low",
        action: "Categorize transactions",
        icon: Zap,
        color: "text-purple-400 bg-purple-500/10",
      });
    }

    setRecommendations(recs);
  }, [budgets, transactions]);

  useEffect(() => {
    generateRecommendations();
  }, [generateRecommendations]);

  const filteredRecommendations = recommendations.filter(
    (rec) => filter === "all" || rec.type === filter
  );

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-400 bg-red-500/10";
      case "medium":
        return "text-yellow-400 bg-yellow-500/10";
      case "low":
        return "text-green-400 bg-green-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "text-green-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              Smart Recommendations
            </h3>
            <p className="text-sm text-gray-400">
              AI-powered insights to optimize your budget
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-yellow-400 font-medium">
            {recommendations.length} recommendations
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {[
          { id: "all", label: "All", icon: BarChart3 },
          { id: "savings", label: "Savings", icon: Target },
          { id: "spending", label: "Spending", icon: TrendingDown },
          { id: "optimization", label: "Optimization", icon: Zap },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id as typeof filter)}
            className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
              filter === id
                ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                : "border-gray-700 text-gray-300 hover:border-gray-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-white mb-2">All Good!</h4>
            <p className="text-gray-400">
              No recommendations at this time. Your budgets are well optimized.
            </p>
          </div>
        ) : (
          filteredRecommendations.map((rec, index) => (
            <AnimationWrapper
              key={rec.id}
              animation="fadeIn"
              delay={index * 100}
            >
              <div className="group p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/20">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${rec.color}`}
                  >
                    <rec.icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
                        {rec.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(
                            rec.impact
                          )}`}
                        >
                          {rec.impact} impact
                        </div>
                        <div
                          className={`text-xs ${getEffortColor(rec.effort)}`}
                        >
                          {rec.effort} effort
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{rec.description}</p>

                    {rec.potentialSavings && (
                      <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-400" />
                          <span className="text-sm font-medium text-green-400">
                            Potential Savings: {rec.potentialSavings.toFixed(0)}
                            €
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        {rec.category && (
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {rec.category}
                          </span>
                        )}
                        {rec.action && (
                          <span className="flex items-center gap-1">
                            <ArrowRight className="w-3 h-3" />
                            {rec.action}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (rec.type === "goal" && onNavigateToSavings) {
                            onNavigateToSavings();
                          } else if (
                            rec.type === "optimization" &&
                            rec.action === "Categorize transactions" &&
                            onNavigateToCategorize
                          ) {
                            onNavigateToCategorize();
                          } else {
                            onApplyRecommendation(rec);
                          }
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 opacity-0 group-hover:opacity-100"
                      >
                        <Zap className="w-4 h-4" />
                        {rec.type === "goal"
                          ? "Set Goal"
                          : rec.type === "optimization" &&
                            rec.action === "Categorize transactions"
                          ? "Categorize"
                          : "Apply"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </AnimationWrapper>
          ))
        )}
      </div>
    </div>
  );
};
