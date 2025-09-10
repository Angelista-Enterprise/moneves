"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { NavigationDock } from "@/components/navigation-dock";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { BudgetCategories } from "@/components/dashboard/BudgetCategories";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import BunqApiStatus from "@/components/dashboard/BunqApiStatus";
import { BunqApiNotification } from "@/components/notifications/BunqApiNotification";
import { getDashboardData } from "@/services/dashboardData";
import {
  useBunqAccounts,
  useUnifiedTransactions,
  useBunqApiKey,
  useBudgetCategories,
  useSavingsGoals,
  useShowBalance,
} from "@/hooks";
import { Button, PageHeader } from "@/components/ui";
import { AddTransactionForm } from "@/components/transactions";
import { DollarSign, Plus } from "lucide-react";
import Image from "next/image";

// Dashboard Content Component (uses useSearchParams)
const DashboardContent = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const searchParams = useSearchParams();

  const { apiKey: bunqApiKey } = useBunqApiKey(userId || "");

  const { showBalance, toggleBalance } = useShowBalance();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // Check if user just completed setup
  useEffect(() => {
    if (searchParams.get("setup") === "complete") {
      setShowWelcomeMessage(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcomeMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Use Bunq hooks to fetch data
  const {
    accounts,
    loading: accountsLoading,
    error: accountsError,
  } = useBunqAccounts(bunqApiKey || undefined);

  // Get the first account ID for fetching transactions

  const {
    transactions: allTransactions,
    loading: transactionsLoading,
    bunqError,
    dbError,
    hasDbTransactions,
  } = useUnifiedTransactions({
    userId,
    perPage: 50, // Get more transactions for better overview
  });

  // Get budget categories from database
  const {
    data: budgetCategories,
    isLoading: budgetCategoriesLoading,
    error: budgetCategoriesError,
  } = useBudgetCategories(userId || "");

  // Get savings goals from database
  const {
    goals: savingsGoals,
    isLoading: savingsGoalsLoading,
    error: savingsGoalsError,
  } = useSavingsGoals(userId || "");

  // Get dashboard data from service (with Bunq data and budget categories if available)
  const dashboardData = getDashboardData(
    accounts,
    allTransactions,
    budgetCategories
  );

  // Show loading state if we're fetching data
  const isLoading =
    accountsLoading ||
    transactionsLoading ||
    budgetCategoriesLoading ||
    savingsGoalsLoading;

  // Only show critical errors (database failures, not Bunq API issues)
  const hasCriticalError =
    budgetCategoriesError || savingsGoalsError || dbError;

  return (
    <div className="min-h-screen bg-black text-white relative pb-28">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        description="Clarity for every transaction — budgets, transactions, and goals in one view"
        icon={<DollarSign className="h-6 w-6 text-white" />}
        showBalance={showBalance}
        onToggleBalance={toggleBalance}
        rightActions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost-blue" onClick={() => setShowAddTransaction(true)}>
              <Plus size={16} />
              Add transaction
            </Button>
          </div>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-4">
        {/* Welcome Message */}
        {showWelcomeMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                  Welcome to Claru! 🎉
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Your account is all set up. Start by adding your first
                  transaction or connecting your Bunq account.
                </p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setShowWelcomeMessage(false)}
                  className="text-green-400 hover:text-green-600 dark:text-green-500 dark:hover:text-green-300"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Bunq API Notification */}
        <BunqApiNotification
          error={bunqError || accountsError}
          hasDbTransactions={hasDbTransactions}
        />

        {/* Critical Error State (Database failures) */}
        {hasCriticalError && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">
              Error loading financial data:{" "}
              {budgetCategoriesError?.message ||
                savingsGoalsError?.message ||
                dbError}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && !hasCriticalError && (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-400 text-sm">
              {accountsLoading && transactionsLoading
                ? "Loading accounts and transaction data..."
                : accountsLoading
                ? "Loading account data..."
                : transactionsLoading
                ? "Loading transaction data..."
                : budgetCategoriesLoading
                ? "Loading budget data..."
                : "Loading financial data..."}
            </p>
          </div>
        )}

        <FinancialOverview
          items={dashboardData.financialOverview}
          showBalance={showBalance}
          isLoading={isLoading}
        />

        {/* Grid Layout for New Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <BunqApiStatus />
        </div>

        {/* Budget Categories - Limited to 3 */}
        <BudgetCategories
          items={dashboardData.budgetItems}
          maxItems={3}
          showBalance={showBalance}
          isLoading={isLoading}
        />

        {/* Recent Transactions */}
        <RecentTransactions
          transactions={dashboardData.transactions}
          maxItems={5}
          showBalance={showBalance}
          isLoading={isLoading}
        />

        {/* Subtle branding footer */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
            <span>Powered by</span>
            <Image
              src="/brand/claru-wordmark.svg"
              alt="Claru"
              width={80}
              height={20}
              className="h-5"
            />
          </div>
        </div>
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
        userAccounts={[]}
      />
    </div>
  );
};

// Main Dashboard Component with Suspense
const BudgetingDashboard = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white relative flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
};

export default BudgetingDashboard;
