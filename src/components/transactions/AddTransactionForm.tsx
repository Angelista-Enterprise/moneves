"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { AnimationWrapper } from "@/components/ui";
import { X, Plus, Minus } from "lucide-react";
import { BudgetCategory } from "@/types/database/budgets";
import { SavingsGoal } from "@/lib/db/schema";
import { useCreateTransaction } from "@/hooks/useTransactions";

interface AddTransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (transaction: unknown) => void;
  budgetCategories?: BudgetCategory[];
  savingsGoals?: SavingsGoal[];
  userAccounts?: Array<{ id: number; name: string }>;
  defaultCategoryId?: number;
  defaultSavingsGoalId?: number;
  defaultType?: "income" | "expense";
}

export const AddTransactionForm = ({
  isOpen,
  onClose,
  onSuccess,
  budgetCategories = [],
  savingsGoals = [],
  userAccounts = [],
  defaultCategoryId,
  defaultSavingsGoalId,
  defaultType = "expense",
}: AddTransactionFormProps) => {
  const { data: session } = useSession();
  const userId = session?.user?.id || "test-user-123"; // Fallback for development

  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    type: defaultType,
    date: new Date().toISOString().split("T")[0],
    categoryId: defaultCategoryId ? defaultCategoryId.toString() : "",
    accountId: "",
    savingsGoalId: defaultSavingsGoalId ? defaultSavingsGoalId.toString() : "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Use the create transaction hook
  const createTransactionMutation = useCreateTransaction(userId);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        amount: "",
        description: "",
        type: defaultType,
        date: new Date().toISOString().split("T")[0],
        categoryId: defaultCategoryId ? defaultCategoryId.toString() : "",
        accountId: "",
        savingsGoalId: defaultSavingsGoalId
          ? defaultSavingsGoalId.toString()
          : "",
      });
      setError("");
      setSuccess("");
    }
  }, [isOpen, defaultType, defaultCategoryId, defaultSavingsGoalId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const transactionData = {
      amount: parseFloat(formData.amount),
      description: formData.description,
      type: formData.type as "income" | "expense",
      date: formData.date,
      categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      accountId: formData.accountId ? parseInt(formData.accountId) : null,
      savingsGoalId: formData.savingsGoalId
        ? parseInt(formData.savingsGoalId)
        : null,
    };

    createTransactionMutation.mutate(transactionData, {
      onSuccess: (transaction) => {
        setSuccess("Transaction created successfully!");
        onSuccess(transaction);

        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "An error occurred");
      },
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleType = () => {
    setFormData((prev) => ({
      ...prev,
      type: prev.type === "income" ? "expense" : "income",
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <AnimationWrapper animation="scaleIn" delay={0}>
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Add Transaction</h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount and Type */}
            <div className="space-y-3">
              <Label htmlFor="amount">Amount</Label>
              <div className="flex gap-2">
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  placeholder="0.00"
                  className="flex-1"
                  required
                />
                <Button
                  type="button"
                  onClick={toggleType}
                  variant={
                    formData.type === "income" ? "default" : "destructive"
                  }
                  size="sm"
                  className="px-3"
                >
                  {formData.type === "income" ? (
                    <Plus size={16} />
                  ) : (
                    <Minus size={16} />
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                {formData.type === "income" ? "Income" : "Expense"}
              </p>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Transaction description"
                required
              />
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                required
              />
            </div>

            {/* Category */}
            {budgetCategories.length > 0 && (
              <div>
                <Label htmlFor="category">Category (Optional)</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    handleInputChange("categoryId", value)
                  }
                >
                  <option value="">No Category</option>
                  {budgetCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Savings Goal */}
            {savingsGoals.length > 0 && formData.type === "income" && (
              <div>
                <Label htmlFor="savingsGoal">Savings Goal (Optional)</Label>
                <Select
                  value={formData.savingsGoalId}
                  onValueChange={(value) =>
                    handleInputChange("savingsGoalId", value)
                  }
                >
                  <option value="">No Goal</option>
                  {savingsGoals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Account */}
            {userAccounts.length > 0 && (
              <div>
                <Label htmlFor="account">Account (Optional)</Label>
                <Select
                  value={formData.accountId}
                  onValueChange={(value) =>
                    handleInputChange("accountId", value)
                  }
                >
                  <option value="">No Account</option>
                  {userAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </Select>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={createTransactionMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={createTransactionMutation.isPending}
              >
                {createTransactionMutation.isPending
                  ? "Creating..."
                  : "Create Transaction"}
              </Button>
            </div>
          </form>
        </div>
      </AnimationWrapper>
    </div>
  );
};
