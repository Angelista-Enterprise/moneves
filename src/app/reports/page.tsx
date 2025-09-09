"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { NavigationDock } from "@/components/navigation-dock";
import {
  useBudgetCategories,
  useUnifiedTransactions,
  useBunqApiKey,
  useSavingsGoals,
} from "@/hooks";
import { BunqTransactionResponse } from "@/types/bunq/transactions";
import {
  updateBudgetCategorySpent,
  calculateProgressPercentage,
} from "@/services/budgetCalculation";
import {
  FinancialOverview,
  CategoryAnalysis,
  MonthlyTrends,
  ReportsFilters,
  BudgetCreationForm,
  TransactionCategorization,
  AnimationWrapper,
  CategoryData,
} from "@/components/reports";
import { AddTransactionForm } from "@/components/transactions";
import { Target, Plus, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function ReportsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBalance, setShowBalance] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<BunqTransactionResponse | null>(null);
  const [showCategorization, setShowCategorization] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Get Bunq data
  const { apiKey: bunqApiKey } = useBunqApiKey(userId || "");
  const {
    transactions: allTransactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useUnifiedTransactions({
    userId,
    perPage: 100,
  });

  // Get budget categories from database
  const {
    data: budgetCategories,
    isLoading: budgetCategoriesLoading,
    error: budgetCategoriesError,
  } = useBudgetCategories(userId || "");

  // Get savings goals from database
  const { goals: savingsGoals } = useSavingsGoals(userId || "");

  // Calculate category data from database budget categories
  const categories: CategoryData[] =
    budgetCategories?.map((budget) => {
      // Update spent amount if we have Bunq transactions
      const updatedBudget = allTransactions
        ? updateBudgetCategorySpent(budget, allTransactions)
        : budget;

      const percentage = calculateProgressPercentage(updatedBudget);

      return {
        id: budget.id.toString(),
        name: budget.name,
        icon: "💰",
        color: budget.color
          ? `${budget.color.replace("text-", "bg-")}/10`
          : "bg-blue-500/10",
        monthlyLimit: budget.monthlyLimit,
        spent: updatedBudget.spent,
        remaining: updatedBudget.remaining,
        percentage: percentage,
        isActive: Boolean(budget.isTracked),
        transactionCount: 0, // This would need to be calculated from actual transactions
      };
    }) || [];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading and error states
  const isLoading = budgetCategoriesLoading || transactionsLoading;
  // Only show Bunq API errors if we have an API token
  const hasError = budgetCategoriesError || (bunqApiKey && transactionsError);

  // Monthly trends will be calculated from transaction data in the component

  const handleBudgetCreated = () => {
    // Refresh budget categories
    window.location.reload();
  };

  const handleTransactionCategorize = () => {
    // Refresh data after categorization
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black text-white relative pb-20 xl:pb-0">
      {/* Header */}
      <PageHeader
        title="Reports & Analysis"
        description="Comprehensive financial overview, category analysis, and trends"
        icon={<BarChart3 className="h-6 w-6 text-white" />}
        showBalance={showBalance}
        onToggleBalance={() => setShowBalance(!showBalance)}
        rightActions={
          <div className="flex gap-2">
            <button
              onClick={() => setShowAddTransaction(true)}
              className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm"
            >
              <Plus size={16} />
              Add Transaction
            </button>
            <button className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm">
              <Target size={16} />
              Export Report
            </button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-4">
        {/* Error State */}
        {hasError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                Error loading budget data:{" "}
                {budgetCategoriesError?.message ||
                  (bunqApiKey && transactionsError)}
              </p>
            </div>
          </AnimationWrapper>
        )}

        {/* Loading State */}
        {isLoading && !hasError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                {budgetCategoriesLoading
                  ? "Loading budget data..."
                  : bunqApiKey && transactionsLoading
                  ? "Loading transaction data..."
                  : "Loading data..."}
              </p>
            </div>
          </AnimationWrapper>
        )}

        {/* No Budget Categories State */}
        {!isLoading && !hasError && categories.length === 0 && (
          <AnimationWrapper animation="scaleIn" delay={300}>
            <div className="mb-6 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
              <div className="mb-4">
                <Target className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  No Budget Categories Found
                </h3>
                <p className="text-yellow-300 text-sm mb-4">
                  Create your first budget category to start tracking your
                  spending and get insights.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm mx-auto"
                >
                  <Plus size={16} />
                  Create Budget Category
                </button>
              </div>
            </div>
          </AnimationWrapper>
        )}

        {/* Overview Section */}
        <FinancialOverview
          categories={categories}
          transactions={allTransactions}
          showBalance={showBalance}
          isLoading={isLoading}
        />

        {/* Filters and Search */}
        <ReportsFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
        />

        {/* Category Analysis Section */}
        <CategoryAnalysis
          categories={categories}
          filteredCategories={filteredCategories}
          showBalance={showBalance}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          isLoading={isLoading}
          onBudgetCreate={() => setShowBudgetForm(true)}
        />

        {/* Monthly Financial Trends Section */}
        <MonthlyTrends
          transactions={allTransactions}
          showBalance={showBalance}
          isLoading={isLoading}
        />
      </div>

      {/* Navigation */}
      <NavigationDock />

      {/* Budget Creation Modal */}
      <BudgetCreationForm
        isOpen={showBudgetForm}
        onClose={() => setShowBudgetForm(false)}
        onSuccess={handleBudgetCreated}
      />

      {/* Transaction Categorization Modal */}
      {selectedTransaction && (
        <TransactionCategorization
          transaction={selectedTransaction}
          categories={categories}
          isOpen={showCategorization}
          onClose={() => {
            setShowCategorization(false);
            setSelectedTransaction(null);
          }}
          onCategorize={handleTransactionCategorize}
        />
      )}

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
        userAccounts={[]} // No user accounts in reports page
      />
    </div>
  );
}
