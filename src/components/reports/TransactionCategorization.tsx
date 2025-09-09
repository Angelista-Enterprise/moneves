"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimationWrapper } from "@/components/ui";
import { BunqTransactionResponse } from "@/types/bunq/transactions";
import { CategoryData } from "./types";
import { X, Tag, Check, Sparkles, Zap } from "lucide-react";
import {
  findMatchingCategories,
  CategorizationMatch,
} from "@/services/autoCategorization";
import { useFormatting } from "@/contexts/FormattingContext";

interface TransactionCategorizationProps {
  transaction: BunqTransactionResponse;
  categories: CategoryData[];
  isOpen: boolean;
  onClose: () => void;
  onCategorize: (transactionId: string, categoryId: string | null) => void;
}

export const TransactionCategorization = ({
  transaction,
  categories,
  isOpen,
  onClose,
  onCategorize,
}: TransactionCategorizationProps) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [autoSuggestions, setAutoSuggestions] = useState<CategorizationMatch[]>(
    []
  );

  const fetchCategorization = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/transactions/categorize?bunqTransactionId=${transaction.id}`
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedCategoryId(data?.categoryId?.toString() || null);
      }
    } catch (err) {
      console.error("Error fetching categorization:", err);
    }
  }, [transaction.id]);

  useEffect(() => {
    if (isOpen) {
      // Fetch existing categorization
      fetchCategorization();

      // Generate auto-suggestions
      const budgetCategories = categories.map((cat) => ({
        id: parseInt(cat.id),
        name: cat.name,
        autoCategorizeFilters: undefined, // We'll need to fetch this from the API
      }));

      const suggestions = findMatchingCategories(transaction, budgetCategories);
      setAutoSuggestions(suggestions);
    }
  }, [isOpen, fetchCategorization, transaction, categories]);

  const handleCategorize = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/transactions/categorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bunqTransactionId: transaction.id.toString(),
          categoryId: selectedCategoryId ? parseInt(selectedCategoryId) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to categorize transaction");
      }

      const categoryName = selectedCategoryId
        ? categories.find((c) => c.id === selectedCategoryId)?.name || "Unknown"
        : "No Category";

      setSuccess(`Transaction categorized as "${categoryName}" successfully!`);
      onCategorize(transaction.id.toString(), selectedCategoryId);

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { formatCurrency } = useFormatting();

  const amount = parseFloat(transaction.amount) || 0;
  const isIncome = amount > 0;

  if (!isOpen) return null;

  return (
    <AnimationWrapper animation="fadeIn" delay={0}>
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
                onClick={onClose}
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
                    isIncome ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Description</span>
                <span className="text-sm text-gray-300 text-right max-w-48 truncate">
                  {transaction.description}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Date</span>
                <span className="text-sm text-gray-300">
                  {new Date(transaction.created).toLocaleDateString()}
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

            {/* Auto-suggestions */}
            {autoSuggestions.length > 0 && (
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-medium text-blue-400">
                    Auto-suggestions
                  </h3>
                </div>
                <div className="space-y-2">
                  {autoSuggestions.slice(0, 3).map((suggestion) => (
                    <button
                      key={suggestion.categoryId}
                      onClick={() =>
                        setSelectedCategoryId(suggestion.categoryId.toString())
                      }
                      className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                        selectedCategoryId === suggestion.categoryId.toString()
                          ? "border-blue-500 bg-blue-500/20"
                          : "border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-white">
                            {suggestion.categoryName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-blue-400">
                            {Math.round(suggestion.confidence * 100)}%
                          </span>
                          {selectedCategoryId ===
                            suggestion.categoryId.toString() && (
                            <Check className="w-4 h-4 text-green-400" />
                          )}
                        </div>
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        Matched: {suggestion.matchedFilters.join(", ")}
                      </div>
                    </button>
                  ))}
                </div>
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
                      ? "border-blue-500 bg-blue-500/10"
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

                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedCategoryId === category.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.color}`}
                      >
                        <span className="text-lg">{category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-300">
                          {category.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(category.monthlyLimit)} limit
                        </p>
                      </div>
                      {selectedCategoryId === category.id && (
                        <Check className="w-4 h-4 text-blue-400" />
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
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCategorize}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
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
    </AnimationWrapper>
  );
};
