"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { NavigationDock } from "@/components/navigation-dock";
import {
  useBunqAccounts,
  useBunqApiKey,
  useSavingsGoals,
  useUnifiedTransactions,
  useBudgetCategories,
} from "@/hooks";
import {
  AnimationWrapper,
  StaggeredContainer,
  PageHeader,
} from "@/components/ui";
import { AddTransactionForm } from "@/components/transactions";
import {
  Target,
  TrendingUp,
  DollarSign,
  BarChart3,
  PiggyBank,
  CheckCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";
import {
  matchTransactionsWithSavingsGoals,
  calculateSavingsGoalProgress,
  getSavingsGoalInsights,
} from "@/services/savingsGoalMatching";

interface SavingsGoalWithAccount {
  id: number;
  userId: string;
  accountId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
  createdAt: string | null;
  accountName: string | null;
  accountType: string | null;
  accountBalance: number | null;
  progress: number;
  status: "on_track" | "behind" | "ahead" | "completed";
  // Additional transaction-based properties
  monthlyContribution?: number;
  monthsRemaining?: number;
  projectedCompletion?: string | null;
  insights?: {
    isOnTrack: boolean;
    needsAttention: boolean;
    recentActivity: boolean;
    contributionTrend: "increasing" | "decreasing" | "stable";
    recommendations: string[];
  };
}

interface BunqAccount {
  id: number;
  description: string;
  type: string;
  balance: string;
}

export default function SavingsGoalsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const [showBalance, setShowBalance] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingsGoalWithAccount | null>(
    null
  );
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Get Bunq data
  const { apiKey: bunqApiKey } = useBunqApiKey(userId || "");
  const {
    accounts: bunqAccounts,
    loading: accountsLoading,
    error: accountsError,
  } = useBunqAccounts(bunqApiKey || undefined);

  // Get transactions for matching with savings goals
  const {
    transactions: allTransactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useUnifiedTransactions({
    userId,
    perPage: 100,
  });

  // Get savings goals from database
  const {
    goals: savingsGoals,
    isLoading: goalsLoading,
    error: goalsError,
    createGoal,
    updateGoal,
    deleteGoal,
    updateCurrentAmount,
  } = useSavingsGoals(userId || "");

  // Get budget categories for transaction creation
  const { data: budgetCategories } = useBudgetCategories(userId || "");

  // Update current amounts based on Bunq account balances
  useEffect(() => {
    if (bunqAccounts && savingsGoals.length > 0) {
      savingsGoals.forEach(async (goal) => {
        const matchingAccount = bunqAccounts.find(
          (account) => account.id.toString() === goal.accountId
        );

        if (matchingAccount) {
          const currentBalance = parseFloat(matchingAccount.balance || "0");
          if (Math.abs(currentBalance - goal.currentAmount) > 0.01) {
            await updateCurrentAmount({
              id: goal.id,
              currentAmount: currentBalance,
            });
          }
        }
      });
    }
  }, [bunqAccounts, savingsGoals, updateCurrentAmount]);

  const { formatCurrency } = useFormatting();

  // Filter savings accounts from Bunq
  const savingsAccounts: BunqAccount[] =
    bunqAccounts?.filter(
      (account) =>
        account.type === "SavingsAccount" ||
        account.description?.toLowerCase().includes("savings") ||
        account.description?.toLowerCase().includes("spaar")
    ) || [];

  // Match transactions with savings goals and calculate enhanced data
  const goalsWithTransactions = matchTransactionsWithSavingsGoals(
    savingsGoals,
    allTransactions
  );

  // Calculate progress and status for each goal with transaction data
  const goalsWithProgress: SavingsGoalWithAccount[] = goalsWithTransactions.map(
    (goal) => {
      const progressData = calculateSavingsGoalProgress(goal, true);
      const insights = getSavingsGoalInsights(goal);

      return {
        ...goal,
        progress: progressData.progress,
        status: progressData.status,
        // Add additional transaction-based data
        monthlyContribution: progressData.monthlyContribution,
        monthsRemaining: progressData.monthsRemaining,
        projectedCompletion: progressData.projectedCompletion,
        insights,
        // Ensure required properties are present
        accountName: goal.accountName || `Account ${goal.accountId}`,
        accountType: goal.accountType || "SavingsAccount",
        accountBalance: goal.accountBalance || 0,
      } as SavingsGoalWithAccount;
    }
  );

  const totalSavings = goalsWithProgress.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );
  const totalTarget = goalsWithProgress.reduce(
    (sum, goal) => sum + goal.targetAmount,
    0
  );
  const overallProgress =
    totalTarget > 0 ? (totalSavings / totalTarget) * 100 : 0;

  // Loading and error states
  const isLoading = accountsLoading || goalsLoading || transactionsLoading;
  // Only show Bunq API errors if we have an API token
  const hasError =
    goalsError || (bunqApiKey && (accountsError || transactionsError));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "ahead":
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
      case "behind":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-500/10";
      case "ahead":
        return "text-blue-400 bg-blue-500/10";
      case "behind":
        return "text-yellow-400 bg-yellow-500/10";
      default:
        return "text-gray-400 bg-gray-500/10";
    }
  };

  const handleCreateGoal = async (goalData: {
    accountId?: string;
    name: string;
    targetAmount: number;
    targetDate?: string;
  }) => {
    try {
      if (!goalData.accountId) {
        console.error("Account ID is required");
        return;
      }
      await createGoal({
        accountId: goalData.accountId,
        name: goalData.name,
        targetAmount: goalData.targetAmount,
        targetDate: goalData.targetDate,
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const handleUpdateGoal = async (
    id: number,
    updates: {
      name?: string;
      targetAmount?: number;
      targetDate?: string;
    }
  ) => {
    try {
      await updateGoal({ id, updates });
      setEditingGoal(null);
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const handleDeleteGoal = async (id: number) => {
    if (confirm("Are you sure you want to delete this savings goal?")) {
      try {
        await deleteGoal(id);
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative pb-20 xl:pb-0">
      {/* Header */}
      <PageHeader
        title="Savings Goals"
        description="Track and manage your financial goals"
        icon={<PiggyBank className="w-6 h-6 text-white" />}
        showBalance={showBalance}
        onToggleBalance={() => setShowBalance(!showBalance)}
        rightActions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddTransaction(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-4 h-4" />
              New Goal
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-4 py-8">
        {/* Error State */}
        {hasError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                Error loading data:{" "}
                {goalsError?.message ||
                  (bunqApiKey && (accountsError?.message || transactionsError))}
              </p>
            </div>
          </AnimationWrapper>
        )}

        {/* Loading State */}
        {isLoading && !hasError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                {goalsLoading
                  ? "Loading savings goals..."
                  : bunqApiKey && accountsLoading && transactionsLoading
                  ? "Loading accounts and transactions..."
                  : bunqApiKey && accountsLoading
                  ? "Loading account data..."
                  : bunqApiKey && transactionsLoading
                  ? "Loading transaction data..."
                  : "Loading data..."}
              </p>
            </div>
          </AnimationWrapper>
        )}

        {/* Overview Stats */}
        <AnimationWrapper animation="fadeIn" delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-green-400" />
                <h3 className="text-lg font-semibold">Total Savings</h3>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {showBalance ? formatCurrency(totalSavings) : "••••••"}
              </p>
              <p className="text-sm text-gray-400">
                Across {goalsWithProgress.length} goals
              </p>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-blue-400" />
                <h3 className="text-lg font-semibold">Target Amount</h3>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {showBalance ? formatCurrency(totalTarget) : "••••••"}
              </p>
              <p className="text-sm text-gray-400">Combined goal target</p>
            </div>

            <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8 text-purple-400" />
                <h3 className="text-lg font-semibold">Progress</h3>
              </div>
              <p className="text-3xl font-bold text-white mb-2">
                {Math.round(overallProgress)}%
              </p>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                <div
                  className="h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </AnimationWrapper>

        {/* Available Accounts */}
        {savingsAccounts.length > 0 && (
          <AnimationWrapper animation="fadeIn" delay={400}>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">
                Available Savings Accounts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savingsAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="p-4 bg-gray-900/50 rounded-lg border border-gray-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white">
                          {account.description || `Account ${account.id}`}
                        </h4>
                        <p className="text-sm text-gray-400">{account.type}</p>
                        <p className="text-lg font-bold text-green-400">
                          {showBalance
                            ? formatCurrency(parseFloat(account.balance || "0"))
                            : "••••••"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AnimationWrapper>
        )}

        {/* Savings Goals */}
        <AnimationWrapper animation="fadeIn" delay={600}>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Savings Goals</h3>

            {goalsWithProgress.length === 0 ? (
              <div className="text-center py-12">
                <PiggyBank className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-400 mb-2">
                  No Savings Goals Found
                </h4>
                <p className="text-gray-500 mb-4">
                  Create your first savings goal to start tracking your
                  progress.
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200 mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  Create First Goal
                </button>
              </div>
            ) : (
              <StaggeredContainer
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                staggerDelay={100}
                animation="scaleIn"
              >
                {goalsWithProgress.map((goal) => (
                  <div
                    key={goal.id}
                    className="group p-6 bg-gray-900/50 rounded-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-1 hover:scale-[1.02] will-change-transform"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <PiggyBank className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white group-hover:text-gray-100 transition-colors">
                            {goal.name}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {goal.accountName || `Account ${goal.accountId}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            goal.status
                          )}`}
                        >
                          {getStatusIcon(goal.status)}
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setEditingGoal(goal)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                            title="Edit goal"
                          >
                            <Edit className="w-4 h-4 text-gray-400 hover:text-white" />
                          </button>
                          <button
                            onClick={() => handleDeleteGoal(goal.id)}
                            className="p-1 hover:bg-red-900/50 rounded transition-colors"
                            title="Delete goal"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-white">
                          {Math.round(goal.progress)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            goal.status === "completed"
                              ? "bg-gradient-to-r from-green-500 to-green-600"
                              : goal.status === "ahead"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                              : goal.status === "behind"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-green-500 to-blue-500"
                          }`}
                          style={{ width: `${Math.min(goal.progress, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial Info */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Current</p>
                        <p className="text-lg font-semibold text-white">
                          {showBalance
                            ? formatCurrency(goal.currentAmount)
                            : "••••••"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Target</p>
                        <p className="text-lg font-semibold text-gray-300">
                          {showBalance
                            ? formatCurrency(goal.targetAmount)
                            : "••••••"}
                        </p>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="p-3 bg-gray-800/50 rounded-lg mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Account ID</span>
                        <span className="text-gray-300 font-mono text-xs">
                          {showBalance ? goal.accountId.toString() : "••••••••"}
                        </span>
                      </div>
                      {goal.targetDate && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-gray-400">Target Date</span>
                          <span className="text-gray-300">
                            {new Date(goal.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Transaction Insights */}
                    {goal.insights && (
                      <div className="mb-4 p-3 bg-gray-800/30 rounded-lg">
                        <div className="text-xs text-gray-400 mb-2">
                          Recent Activity
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">
                              Monthly Contribution
                            </span>
                            <span className="text-white font-medium">
                              {showBalance
                                ? formatCurrency(goal.monthlyContribution || 0)
                                : "••••••"}
                            </span>
                          </div>
                          {(goal.monthsRemaining || 0) > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                Months Remaining
                              </span>
                              <span className="text-white font-medium">
                                {goal.monthsRemaining}
                              </span>
                            </div>
                          )}
                          {goal.projectedCompletion && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">
                                Projected Completion
                              </span>
                              <span className="text-white font-medium">
                                {new Date(
                                  goal.projectedCompletion
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Message */}
                    <div className="text-center">
                      {goal.status === "completed" && (
                        <p className="text-green-400 text-sm font-medium">
                          🎉 Goal Achieved!
                        </p>
                      )}
                      {goal.status === "ahead" && (
                        <p className="text-blue-400 text-sm">
                          Ahead of schedule
                        </p>
                      )}
                      {goal.status === "behind" && (
                        <p className="text-yellow-400 text-sm">
                          Needs attention
                        </p>
                      )}
                      {goal.status === "on_track" && (
                        <p className="text-gray-400 text-sm">On track</p>
                      )}
                    </div>

                    {/* Recommendations */}
                    {goal.insights?.recommendations &&
                      goal.insights.recommendations.length > 0 && (
                        <div className="mt-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="text-xs text-blue-400 mb-1">
                            Recommendations
                          </div>
                          <div className="text-xs text-gray-300">
                            {goal.insights.recommendations[0]}
                          </div>
                        </div>
                      )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))}
              </StaggeredContainer>
            )}
          </div>
        </AnimationWrapper>
      </div>

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingGoal) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">
              {editingGoal ? "Edit Savings Goal" : "Create New Savings Goal"}
            </h3>

            <SavingsGoalForm
              goal={editingGoal}
              accounts={savingsAccounts}
              onSubmit={
                editingGoal
                  ? (updates) => handleUpdateGoal(editingGoal.id, updates)
                  : handleCreateGoal
              }
              onCancel={() => {
                setShowCreateForm(false);
                setEditingGoal(null);
              }}
            />
          </div>
        </div>
      )}

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
        userAccounts={[]}
        defaultType="income" // Default to income for savings goals page
      />
    </div>
  );
}

// Savings Goal Form Component
function SavingsGoalForm({
  goal,
  accounts,
  onSubmit,
  onCancel,
}: {
  goal?: SavingsGoalWithAccount | null;
  accounts: BunqAccount[];
  onSubmit: (data: {
    accountId?: string;
    name: string;
    targetAmount: number;
    targetDate?: string;
  }) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    accountId: goal?.accountId || accounts[0]?.id?.toString() || "",
    name: goal?.name || "",
    targetAmount: goal?.targetAmount || 0,
    targetDate: goal?.targetDate || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (goal) {
      // Update existing goal
      onSubmit({
        name: formData.name,
        targetAmount: formData.targetAmount,
        targetDate: formData.targetDate || undefined,
      });
    } else {
      // Create new goal
      onSubmit({
        accountId: formData.accountId,
        name: formData.name,
        targetAmount: formData.targetAmount,
        targetDate: formData.targetDate || undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!goal && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Account
          </label>
          <select
            value={formData.accountId}
            onChange={(e) =>
              setFormData({ ...formData, accountId: e.target.value })
            }
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.description || `Account ${account.id}`} -{" "}
                {account.type}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Goal Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="e.g., Emergency Fund"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Amount (€)
        </label>
        <input
          type="number"
          value={formData.targetAmount}
          onChange={(e) =>
            setFormData({
              ...formData,
              targetAmount: parseFloat(e.target.value),
            })
          }
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="10000"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Target Date (Optional)
        </label>
        <input
          type="date"
          value={formData.targetDate}
          onChange={(e) =>
            setFormData({ ...formData, targetDate: e.target.value })
          }
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          {goal ? "Update Goal" : "Create Goal"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
