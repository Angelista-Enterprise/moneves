"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { AnimationWrapper, StaggeredContainer } from "@/components/ui";
import { Transaction } from "@/components/transactions/types";
import { X, Tag, Check, Search, Filter, Sparkles, Zap } from "lucide-react";
import { CategorizationMatch } from "@/services/autoCategorization";
import { useFormatting } from "@/contexts/FormattingContext";

interface TransactionCategorizationStepProps {
  transactions: Transaction[];
  budgets: Array<{
    id: number;
    name: string;
    monthlyLimit: number;
    icon: string | null;
    color: string | null;
  }>;
  onNext: () => void;
}

export const TransactionCategorizationStep = ({
  transactions,
  budgets,
  onNext,
}: TransactionCategorizationStepProps) => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [categorizedCount, setCategorizedCount] = useState(0);
  const [autoSuggestions, setAutoSuggestions] = useState<
    Map<string, CategorizationMatch[]>
  >(new Map());
  const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);
  const [autoCategorizeProgress, setAutoCategorizeProgress] = useState(0);

  const { formatCurrency } = useFormatting();

  // Filter transactions
  const filteredTransactions = useMemo(
    () =>
      transactions?.filter((tx) => {
        const amount = tx.amount || 0;
        const matchesSearch = tx.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesType =
          filterType === "all" ||
          (filterType === "income" && amount > 0) ||
          (filterType === "expense" && amount < 0);

        return matchesSearch && matchesType;
      }) || [],
    [transactions, searchTerm, filterType]
  );

  // Generate auto-suggestions for transactions
  const generateAutoSuggestions = useCallback(() => {
    const suggestions = new Map<string, CategorizationMatch[]>();

    filteredTransactions.forEach((transaction) => {
      // Note: findMatchingCategories expects BunqTransactionResponse, but we have Transaction
      // For now, we'll skip auto-categorization or create a wrapper
      const matches: CategorizationMatch[] = [];
      if (matches.length > 0) {
        suggestions.set(transaction.id.toString(), matches);
      }
    });

    setAutoSuggestions(suggestions);
  }, [filteredTransactions]);

  useEffect(() => {
    generateAutoSuggestions();
  }, [generateAutoSuggestions]);

  const fetchCategorization = useCallback(async (transactionId: string) => {
    try {
      const response = await fetch(
        `/api/transactions/categorize?bunqTransactionId=${transactionId}`
      );
      if (response.ok) {
        const data = await response.json();
        return data?.categoryId?.toString() || null;
      }
    } catch (err) {
      console.error("Error fetching categorization:", err);
    }
    return null;
  }, []);

  const handleCategorize = async () => {
    if (!selectedTransaction) return;

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      console.log("Categorizing transaction:", {
        bunqTransactionId: selectedTransaction.id.toString(),
        categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : null,
      });

      const response = await fetch("/api/transactions/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bunqTransactionId: selectedTransaction.id.toString(),
          categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : null,
        }),
      });

      console.log(
        "Transaction categorization response:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to categorize transaction");
      }

      const categoryName = selectedCategoryId
        ? budgets.find((b) => b.id.toString() === selectedCategoryId)?.name ||
          "Unknown"
        : "No Category";

      setSuccess(`Transaction categorized as "${categoryName}" successfully!`);
      setCategorizedCount((prev) => prev + 1);

      // Close modal after a short delay
      setTimeout(() => {
        setSelectedTransaction(null);
        setSelectedCategoryId(null);
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransactionClick = async (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    const existingCategory = await fetchCategorization(
      transaction.id.toString()
    );
    setSelectedCategoryId(existingCategory);
  };

  const handleAutoCategorizeAll = async () => {
    setIsAutoCategorizing(true);
    setError("");
    setSuccess("");
    setAutoCategorizeProgress(0);

    try {
      const suggestionsArray = Array.from(autoSuggestions.entries());
      const totalSuggestions = suggestionsArray.length;
      let processedCount = 0;

      const autoCategorizePromises = suggestionsArray.map(
        async ([transactionId, suggestions]) => {
          const topSuggestion = suggestions[0];
          if (topSuggestion && topSuggestion.confidence > 0.7) {
            const response = await fetch("/api/transactions/categorize", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                bunqTransactionId: transactionId,
                categoryId: topSuggestion.categoryId,
              }),
            });

            if (response.ok) {
              setCategorizedCount((prev) => prev + 1);
              processedCount++;
              setAutoCategorizeProgress(
                (processedCount / totalSuggestions) * 100
              );
              return { success: true, category: topSuggestion.categoryName };
            }
          }
          processedCount++;
          setAutoCategorizeProgress((processedCount / totalSuggestions) * 100);
          return { success: false };
        }
      );

      const results = await Promise.all(autoCategorizePromises);
      const successCount = results.filter((r) => r.success).length;

      setSuccess(`Auto-categorized ${successCount} transactions successfully!`);

      // Refresh suggestions
      setTimeout(() => {
        generateAutoSuggestions();
        setSuccess("");
        setAutoCategorizeProgress(0);
      }, 3000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during auto-categorization"
      );
    } finally {
      setIsAutoCategorizing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <AnimationWrapper animation="fadeIn" delay={200}>
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Tag className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Categorize Transactions</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Assign your transactions to budget categories to track spending and
            monitor your progress.
          </p>
        </AnimationWrapper>
      </div>

      {/* Stats */}
      <AnimationWrapper animation="fadeIn" delay={400}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {transactions?.length || 0}
            </div>
            <div className="text-gray-400">Total Transactions</div>
          </div>
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {categorizedCount}
            </div>
            <div className="text-gray-400">Categorized</div>
          </div>
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {budgets.length}
            </div>
            <div className="text-gray-400">Budget Categories</div>
          </div>
          <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800 text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {autoSuggestions.size}
            </div>
            <div className="text-gray-400">Auto-suggestions</div>
          </div>
        </div>
      </AnimationWrapper>

      {/* Filters */}
      <AnimationWrapper animation="fadeIn" delay={600}>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              {[
                { id: "all", label: "All", icon: Filter },
                { id: "income", label: "Income", icon: Check },
                { id: "expense", label: "Expenses", icon: X },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() =>
                    setFilterType(id as "all" | "income" | "expense")
                  }
                  className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${
                    filterType === id
                      ? "border-purple-500 bg-purple-500/10 text-purple-400"
                      : "border-gray-700 text-gray-300 hover:border-gray-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AnimationWrapper>

      {/* Success/Error Messages */}
      {(error || success) && (
        <AnimationWrapper animation="fadeIn" delay={700}>
          <div
            className={`p-4 rounded-lg border ${
              error
                ? "bg-red-500/10 border-red-500/20"
                : "bg-green-500/10 border-green-500/20"
            }`}
          >
            <p
              className={`text-sm ${error ? "text-red-400" : "text-green-400"}`}
            >
              {error || success}
            </p>
          </div>
        </AnimationWrapper>
      )}

      {/* Auto-categorization Progress */}
      {isAutoCategorizing && (
        <AnimationWrapper animation="fadeIn" delay={700}>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-400">
                  Auto-categorizing transactions...
                </span>
              </div>
              <span className="text-sm text-blue-300">
                {Math.round(autoCategorizeProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${autoCategorizeProgress}%` }}
              />
            </div>
          </div>
        </AnimationWrapper>
      )}

      {/* Transaction List */}
      <AnimationWrapper animation="fadeIn" delay={800}>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <h3 className="text-xl font-semibold mb-4">Transactions</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No transactions found matching your criteria
              </div>
            ) : (
              <StaggeredContainer
                className="space-y-2"
                staggerDelay={50}
                animation="scaleIn"
              >
                {filteredTransactions.map((transaction) => {
                  const amount = transaction.amount || 0;
                  const isIncome = amount > 0;
                  const suggestions =
                    autoSuggestions.get(transaction.id.toString()) || [];
                  const topSuggestion = suggestions[0];

                  return (
                    <button
                      key={transaction.id}
                      onClick={() => handleTransactionClick(transaction)}
                      className="group relative w-full p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 hover:bg-gray-800/70 transition-all duration-300 text-left hover:shadow-lg hover:shadow-gray-900/20 hover:-translate-y-1 hover:scale-[1.02] will-change-transform"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isIncome ? "bg-green-400" : "bg-red-400"
                              } group-hover:scale-125 transition-transform duration-200`}
                            />
                            <p className="font-medium text-white truncate group-hover:text-gray-100 transition-colors duration-200">
                              {transaction.description}
                            </p>
                            {topSuggestion && (
                              <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                                <Sparkles className="w-3 h-3 text-blue-400" />
                                <span className="text-xs text-blue-400 font-medium">
                                  {Math.round(topSuggestion.confidence * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                            {topSuggestion && (
                              <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs text-yellow-400">
                                  {topSuggestion.categoryName}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold text-lg group-hover:scale-105 transition-transform duration-200 ${
                              isIncome ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {formatCurrency(amount)}
                          </p>
                          <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors duration-200">
                            {isIncome ? "Income" : "Expense"}
                          </p>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                      {/* Click indicator */}
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-400 rounded-full" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </StaggeredContainer>
            )}
          </div>
        </div>
      </AnimationWrapper>

      {/* Categorization Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">
                    Categorize Transaction
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedTransaction(null);
                    setSelectedCategoryId(null);
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Transaction Details */}
              <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Amount</span>
                  <span
                    className={`font-semibold ${
                      selectedTransaction.amount > 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatCurrency(selectedTransaction.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Description</span>
                  <span className="text-sm text-gray-300 text-right max-w-48 truncate">
                    {selectedTransaction.description}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Date</span>
                  <span className="text-sm text-gray-300">
                    {new Date(selectedTransaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Category
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedCategoryId === null
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                        <X className="w-4 h-4 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300">
                          No Category
                        </p>
                        <p className="text-xs text-gray-400">
                          Leave uncategorized
                        </p>
                      </div>
                    </div>
                  </button>

                  {budgets.map((category) => (
                    <button
                      key={category.id}
                      onClick={() =>
                        setSelectedCategoryId(category.id.toString())
                      }
                      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                        selectedCategoryId === category.id.toString()
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            category.color || "bg-gray-600"
                          }`}
                        >
                          <span className="text-lg">
                            {category.icon || "💰"}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-300">
                            {category.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatCurrency(category.monthlyLimit)} limit
                          </p>
                        </div>
                        {selectedCategoryId === category.id.toString() && (
                          <Check className="w-4 h-4 text-purple-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTransaction(null);
                    setSelectedCategoryId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCategorize}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-purple-600 rounded-lg text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Category
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <AnimationWrapper animation="fadeIn" delay={1000}>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Auto-categorize Button */}
          {autoSuggestions.size > 0 && (
            <button
              onClick={handleAutoCategorizeAll}
              disabled={isAutoCategorizing}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all duration-300 flex items-center gap-2"
            >
              {isAutoCategorizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Auto-categorizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Auto-categorize All ({autoSuggestions.size})
                </>
              )}
            </button>
          )}

          {/* Continue Button */}
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center gap-2"
          >
            Continue to Review
            <Check className="w-5 h-5" />
          </button>
        </div>
      </AnimationWrapper>
    </div>
  );
};
