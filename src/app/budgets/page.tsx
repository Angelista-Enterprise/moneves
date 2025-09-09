"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { NavigationDock } from "@/components/navigation-dock";
import {
  useBudgets,
  useUnifiedTransactions,
  useBunqApiKey,
  useBudgetCategories,
  useSavingsGoals,
  useShowBalance,
} from "@/hooks";
import { BunqApiNotification } from "@/components/notifications/BunqApiNotification";
import { AnimationWrapper, PageHeader } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { AddTransactionForm } from "@/components/transactions";
import {
  BudgetCreationStep,
  TransactionCategorizationStep,
  BudgetList,
  SmartRecommendations,
} from "@/components/budgets";
import {
  Target,
  Plus,
  CheckCircle,
  ArrowRight,
  Settings,
  BarChart3,
  Tag,
} from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";

type Step = "overview" | "create" | "categorize" | "review";

// Removed unused Budget interface - using the one from BudgetList component

export default function BudgetsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [currentStep, setCurrentStep] = useState<Step>("overview");
  const { showBalance, toggleBalance } = useShowBalance();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  // const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Get Bunq data
  const { apiKey: bunqApiKey } = useBunqApiKey(userId || "");
  const {
    transactions: allTransactions,
    loading: transactionsLoading,
    error: transactionsError,
    bunqError,
    hasDbTransactions,
  } = useUnifiedTransactions({
    userId,
    perPage: 100,
  });

  // Get budgets
  const { budgets } = useBudgets(userId || "");

  // Get budget categories and savings goals for transaction creation
  const { data: budgetCategories } = useBudgetCategories(userId || "");

  const { goals: savingsGoals } = useSavingsGoals(userId || "");

  const steps = [
    {
      id: "overview" as Step,
      title: "Overview",
      description: "View your budget categories and spending",
      icon: BarChart3,
      completed: budgets.length > 0,
    },
    {
      id: "create" as Step,
      title: "Create Budgets",
      description: "Set up your budget categories",
      icon: Plus,
      completed: budgets.length > 0,
    },
    {
      id: "categorize" as Step,
      title: "Categorize Transactions",
      description: "Assign transactions to budget categories",
      icon: Tag,
      completed: false, // This would need to be calculated based on categorized transactions
    },
    {
      id: "review" as Step,
      title: "Review & Adjust",
      description: "Monitor and adjust your budgets",
      icon: Settings,
      completed: false,
    },
  ];

  const { formatCurrency } = useFormatting();

  const handleDeleteBudget = async (id: number) => {
    try {
      const response = await fetch(`/api/budgets/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the page to update the budget list
        window.location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error deleting budget:", errorData.error);
        alert("Failed to delete budget. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget. Please try again.");
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case "overview":
        return (
          <div className="space-y-8">
            <OverviewStep
              budgets={budgets}
              formatCurrency={formatCurrency}
              onNavigateToCreate={() => setCurrentStep("create")}
              onNavigateToCategorize={() => setCurrentStep("categorize")}
              showBalance={showBalance}
            />

            {/* Smart Recommendations */}
            <SmartRecommendations
              budgets={budgets}
              transactions={allTransactions}
              onApplyRecommendation={(rec) => {
                console.log("Applying recommendation:", rec);
                // Handle recommendation application
              }}
              onNavigateToSavings={() => {
                window.location.href = "/savings-goals";
              }}
              onNavigateToCategorize={() => {
                setCurrentStep("categorize");
              }}
              showBalance={showBalance}
            />

            {/* Budget List */}
            <BudgetList
              budgets={budgets}
              transactions={allTransactions}
              onEdit={() => {
                // setSelectedBudget(budget);
                setCurrentStep("create");
              }}
              onCreate={() => setCurrentStep("create")}
              onDelete={handleDeleteBudget}
              showBalance={showBalance}
              onToggleBalance={toggleBalance}
            />
          </div>
        );
      case "create":
        return (
          <BudgetCreationStep
            budgets={budgets}
            onBudgetCreated={() => {
              // Refresh budgets
              window.location.reload();
            }}
            onNext={() => setCurrentStep("categorize")}
          />
        );
      case "categorize":
        return (
          <TransactionCategorizationStep
            transactions={allTransactions}
            budgets={budgets}
            onNext={() => setCurrentStep("review")}
            showBalance={showBalance}
          />
        );
      case "review":
        return (
          <ReviewStep
            budgets={budgets}
            formatCurrency={formatCurrency}
            showBalance={showBalance}
          />
        );
      default:
        return (
          <OverviewStep
            budgets={budgets}
            formatCurrency={formatCurrency}
            onNavigateToCreate={() => setCurrentStep("create")}
            onNavigateToCategorize={() => setCurrentStep("categorize")}
            showBalance={showBalance}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative pb-20 xl:pb-0">
      {/* Header */}
      <PageHeader
        title="Budget Management"
        description="Create and manage your budget categories"
        icon={<Target className="w-6 h-6 text-white" />}
        showBalance={showBalance}
        onToggleBalance={toggleBalance}
        rightActions={
          <div className="flex gap-2 items-center">
            <Button
              size="sm"
              variant="ghost-blue"
              onClick={() => setShowAddTransaction(true)}
            >
              <Plus size={16} />
              Add Transaction
            </Button>
            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-blue-400 text-sm font-medium">
                {budgets.length} Categories
              </span>
            </div>
          </div>
        }
      />

      {/* Step Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = step.completed;
              const isClickable = index === 0 || steps[index - 1].completed;

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => isClickable && setCurrentStep(step.id)}
                    disabled={!isClickable}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive
                        ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                        : isCompleted
                        ? "bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20"
                        : isClickable
                        ? "bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700/50"
                        : "bg-gray-800/30 border border-gray-800 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isActive
                          ? "bg-blue-500"
                          : isCompleted
                          ? "bg-green-500"
                          : "bg-gray-600"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Icon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{step.title}</p>
                      <p className="text-xs opacity-75">{step.description}</p>
                    </div>
                  </button>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-4 h-4 text-gray-600 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-4 py-8">
        {/* Bunq API Notification */}
        <BunqApiNotification
          error={bunqError}
          hasDbTransactions={hasDbTransactions}
        />

        {/* Error State */}
        {bunqApiKey && transactionsError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                Error loading transaction data: {transactionsError}
              </p>
            </div>
          </AnimationWrapper>
        )}

        {/* Loading State */}
        {bunqApiKey && transactionsLoading && !transactionsError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                Loading transaction data...
              </p>
            </div>
          </AnimationWrapper>
        )}

        <AnimationWrapper animation="fadeIn" delay={200}>
          {getStepContent()}
        </AnimationWrapper>
      </div>

      {/* Navigation */}
      <NavigationDock />

      {/* Add Transaction Modal */}
      <AddTransactionForm
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        onSuccess={() => {
          // Transaction created successfully
          setShowAddTransaction(false);
        }}
        budgetCategories={budgetCategories || []}
        savingsGoals={savingsGoals || []}
        userAccounts={[]} // No user accounts in budgets page
        defaultType="expense" // Default to expense for budgets page
      />
    </div>
  );
}

// Step Components
function OverviewStep({
  budgets,
  formatCurrency,
  onNavigateToCreate,
  onNavigateToCategorize,
  showBalance,
}: {
  budgets: Array<{
    id: number;
    name: string;
    monthlyLimit: number;
    spent: number;
  }>;
  formatCurrency: (amount: number) => string;
  onNavigateToCreate: () => void;
  onNavigateToCategorize: () => void;
  showBalance: boolean;
}) {
  const totalBudget = budgets.reduce(
    (sum, budget) => sum + budget.monthlyLimit,
    0
  );
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const utilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Budget Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Budget</span>
              <span className="font-semibold">
                {showBalance ? formatCurrency(totalBudget) : "••••••"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Spent</span>
              <span className="font-semibold">
                {showBalance ? formatCurrency(totalSpent) : "••••••"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Utilization</span>
              <span
                className={`font-semibold ${
                  utilization > 80
                    ? "text-red-400"
                    : utilization > 50
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {showBalance ? `${utilization.toFixed(1)}%` : "••••••"}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Categories</h3>
          <div className="space-y-2">
            {budgets.length === 0 ? (
              <p className="text-gray-400 text-sm">
                No budget categories created yet
              </p>
            ) : (
              budgets.slice(0, 3).map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-300">{budget.name}</span>
                  <span className="text-sm font-medium">
                    {showBalance ? formatCurrency(budget.spent) : "••••••"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={onNavigateToCreate}
              className="w-full text-left p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create New Category
            </button>
            <button
              onClick={onNavigateToCategorize}
              className="w-full text-left p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors duration-200"
            >
              <Tag className="w-4 h-4 inline mr-2" />
              Categorize Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  budgets,
  formatCurrency,
  showBalance,
}: {
  budgets: Array<{
    id: number;
    name: string;
    monthlyLimit: number;
    spent: number;
  }>;
  formatCurrency: (amount: number) => string;
  showBalance: boolean;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Review & Adjust</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Monitor your budget performance and make adjustments as needed to stay
        on track.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {budgets.map((budget) => (
          <div
            key={budget.id}
            className="p-4 bg-gray-900/50 rounded-lg border border-gray-800"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{budget.name}</span>
              <span className="text-sm text-gray-400">
                {showBalance
                  ? `${((budget.spent / budget.monthlyLimit) * 100).toFixed(
                      1
                    )}%`
                  : "••••••"}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    (budget.spent / budget.monthlyLimit) * 100,
                    100
                  )}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>
                {showBalance ? formatCurrency(budget.spent) : "••••••"}
              </span>
              <span>
                {showBalance ? formatCurrency(budget.monthlyLimit) : "••••••"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
