"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { NavigationDock } from "@/components/navigation-dock";
import {
  TransactionCard,
  TransactionDetailCard,
  TransactionFilters,
  TransactionSummary,
  Transaction,
  AddTransactionForm,
  RecentTransactionsCarousel,
} from "@/components/transactions";
import {
  useCategories,
  useBudgetCategories,
  useSavingsGoals,
  useUnifiedTransactions,
  useShowBalance,
} from "@/hooks";
import { useBunqAccounts, useBunqApiKey } from "@/hooks";
import { BunqApiNotification } from "@/components/notifications/BunqApiNotification";
import {
  filterTransactions,
  sortTransactionsByDate,
} from "@/services/transactionData";
import { Button, PageHeader, AnimationWrapper } from "@/components/ui";
import { Plus, CreditCard } from "lucide-react";

export default function TransactionsPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { apiKey: bunqApiKey } = useBunqApiKey(userId || "");

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAmountRange, setSelectedAmountRange] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPeriod, setCurrentPeriod] = useState(0);

  // State for UI
  const { showBalance, toggleBalance } = useShowBalance();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Use Bunq hooks to fetch data
  const {
    loading: accountsLoading,
    error: accountsError,
    accounts,
  } = useBunqAccounts(bunqApiKey || undefined);

  // Get the first account ID for fetching transactions
  const firstAccountId = accounts?.[0]?.id;

  // Get unified transactions (Bunq + Database)
  const {
    transactions: allTransactions,
    loading: transactionsLoading,
    error: transactionsError,
    bunqError,
    hasDbTransactions,
  } = useUnifiedTransactions({
    userId,
    accountId: firstAccountId,
    perPage: 100,
  });

  // Get categories from database
  const { categories } = useCategories();

  // Get budget categories and savings goals for transaction creation
  const { data: budgetCategories } = useBudgetCategories(userId || "");
  const { goals: savingsGoals } = useSavingsGoals(userId || "");

  // Use unified transactions directly
  const transactions = allTransactions;

  // Check if we have any data at all
  const hasAnyData = transactions.length > 0;

  // Filter transactions based on current filters
  const filteredTransactions = filterTransactions(transactions, {
    searchTerm,
    selectedType,
    selectedCategory,
    selectedAmountRange,
    selectedDateRange,
    selectedStatus,
    startDate,
    endDate,
    currentPeriod,
  });

  // Sort transactions by date (most recent first)
  const sortedTransactions = sortTransactionsByDate(filteredTransactions);

  // Pagination removed

  // Show loading state if we're fetching any data
  const isLoading = accountsLoading || transactionsLoading;

  // Check for errors - but don't fail completely if we have some data
  const hasAccountError = bunqApiKey && accountsError;
  const hasTransactionsError = transactionsError;

  // Only show critical error if both accounts and transactions fail
  const hasCriticalError = hasAccountError && hasTransactionsError;

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    setSelectedTransaction(null);
  };

  return (
    <div className="min-h-screen bg-black text-white relative pb-28">
      {/* Header */}
      <PageHeader
        title="Transactions"
        description="Clarity for every transaction"
        showBalance={showBalance}
        onToggleBalance={toggleBalance}
        rightActions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost-blue"
              onClick={() => setShowAddTransaction(true)}
            >
              <Plus size={16} />
              Add Transaction
            </Button>
          </div>
        }
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-4 transition-all duration-300">
        {/* Bunq API Notification */}
        <BunqApiNotification
          error={bunqError || accountsError}
          hasDbTransactions={hasDbTransactions}
        />

        {/* Error States */}
        {hasCriticalError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                Error loading transaction data: Unable to fetch both regular and
                internal transactions
              </p>
            </div>
          </AnimationWrapper>
        )}

        {hasTransactionsError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                We couldn’t load transactions. Check your Bunq token or try
                again.
              </p>
            </div>
          </AnimationWrapper>
        )}

        {/* Loading State */}
        {isLoading && !hasCriticalError && (
          <AnimationWrapper animation="fadeIn" delay={200}>
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-400 text-sm">
                {accountsLoading && transactionsLoading
                  ? "Loading accounts and transactions..."
                  : accountsLoading
                    ? "Loading account data..."
                    : transactionsLoading
                      ? "Loading transactions..."
                      : "Loading data..."}
              </p>
            </div>
          </AnimationWrapper>
        )}

        {/* Transaction Summary Cards */}
        <TransactionSummary
          transactions={filteredTransactions}
          filteredTransactions={filteredTransactions}
          bunqTransactions={[]}
          showBalance={showBalance}
          isLoading={isLoading}
        />

        <RecentTransactionsCarousel
          transactions={sortTransactionsByDate(filteredTransactions)}
          showBalance={showBalance}
          isLoading={isLoading}
          maxItems={12}
        />

        {/* Filters and Search */}
        <TransactionFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedAmountRange={selectedAmountRange}
          setSelectedAmountRange={setSelectedAmountRange}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          currentPeriod={currentPeriod}
          setCurrentPeriod={setCurrentPeriod}
          categories={categories.reduce(
            (acc, category) => {
              acc[category.id] = { id: category.id, name: category.name };
              return acc;
            },
            {} as Record<string, { id: string; name: string }>
          )}
        />

        {/* No Data State */}
        {!isLoading && !hasCriticalError && !hasAnyData && (
          <AnimationWrapper animation="fadeIn" delay={300}>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No transactions yet
              </h3>
              <p className="text-gray-400 mb-6">
                {bunqApiKey
                  ? "Connect your account or add a manual transaction to get started."
                  : "Add your Bunq API token in Settings to sync transactions, or add one manually."}
              </p>
              <Button
                onClick={() => setShowAddTransaction(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Add transaction
              </Button>
            </div>
          </AnimationWrapper>
        )}

        {/* Transactions Grid */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <AnimationWrapper
                  key={index}
                  animation="scaleIn"
                  delay={400 + index * 100}
                  duration={400}
                >
                  <div className="p-4 rounded-xl border border-gray-800 bg-gray-900/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gray-800/50 rounded-lg animate-pulse" />
                      <div className="w-16 h-6 bg-gray-800/50 rounded animate-pulse" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-3/4 bg-gray-800/50 rounded animate-pulse" />
                      <div className="h-6 w-1/2 bg-gray-800/50 rounded animate-pulse" />
                      <div className="h-3 w-full bg-gray-800/50 rounded animate-pulse" />
                    </div>
                  </div>
                </AnimationWrapper>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    showBalance={showBalance}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Transaction Detail Card */}
      <TransactionDetailCard
        transaction={selectedTransaction}
        isOpen={isDetailOpen}
        onClose={handleCloseDetails}
        showBalance={showBalance}
      />

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
}
