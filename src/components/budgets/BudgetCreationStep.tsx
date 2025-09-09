"use client";

import { useState } from "react";
import { AnimationWrapper, StaggeredContainer } from "@/components/ui";
import { Plus, Target, CheckCircle } from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";

interface BudgetCreationStepProps {
  budgets: Array<{
    id: number;
    name: string;
    monthlyLimit: number;
    spent: number;
    icon: string | null;
    color: string | null;
  }>;
  onBudgetCreated: () => void;
  onNext: () => void;
}

const BUDGET_COLORS = [
  { name: "Blue", value: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Green", value: "text-green-500", bg: "bg-green-500/10" },
  { name: "Red", value: "text-red-500", bg: "bg-red-500/10" },
  { name: "Yellow", value: "text-yellow-500", bg: "bg-yellow-500/10" },
  { name: "Purple", value: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Pink", value: "text-pink-500", bg: "bg-pink-500/10" },
  { name: "Indigo", value: "text-indigo-500", bg: "bg-indigo-500/10" },
  { name: "Orange", value: "text-orange-500", bg: "bg-orange-500/10" },
];

const BUDGET_ICONS = [
  "💰",
  "🍔",
  "🚗",
  "🏠",
  "👕",
  "🎬",
  "🏥",
  "📚",
  "⚡",
  "📱",
  "✈️",
  "🛒",
  "🎮",
  "☕",
  "🍕",
  "🎵",
];

export const BudgetCreationStep = ({
  budgets,
  onBudgetCreated,
  onNext,
}: BudgetCreationStepProps) => {
  const [showForm, setShowForm] = useState(budgets.length === 0);
  const [formData, setFormData] = useState({
    name: "",
    monthlyLimit: "",
    icon: "💰",
    color: "text-blue-500",
    isTracked: true,
    isGoalLess: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      console.log("Creating budget with data:", {
        name: formData.name,
        monthlyLimit: parseFloat(formData.monthlyLimit),
        icon: formData.icon,
        color: formData.color,
        isTracked: formData.isTracked,
        isGoalLess: formData.isGoalLess,
      });

      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          monthlyLimit: parseFloat(formData.monthlyLimit),
          icon: formData.icon,
          color: formData.color,
          isTracked: formData.isTracked,
          isGoalLess: formData.isGoalLess,
        }),
      });

      console.log(
        "Budget creation response:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create budget");
      }

      // Show success message
      setSuccess(`Budget category "${formData.name}" created successfully!`);

      // Reset form
      setFormData({
        name: "",
        monthlyLimit: "",
        icon: "💰",
        color: "text-blue-500",
        isTracked: true,
        isGoalLess: false,
      });

      // Call the callback to refresh data
      onBudgetCreated();

      // Hide form after a short delay
      setTimeout(() => {
        setShowForm(false);
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { formatCurrency } = useFormatting();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <AnimationWrapper animation="fadeIn" delay={200}>
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Create Budget Categories</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Set up your budget categories to start tracking your spending and
            achieve your financial goals.
          </p>
        </AnimationWrapper>
      </div>

      {/* Existing Budgets */}
      {budgets.length > 0 ? (
        <AnimationWrapper animation="fadeIn" delay={400}>
          <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Your Budget Categories
            </h3>
            <StaggeredContainer
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              staggerDelay={100}
              animation="scaleIn"
            >
              {budgets.map((budget) => (
                <div
                  key={budget.id}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${budget.color}`}
                    >
                      <span className="text-xl">{budget.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{budget.name}</h4>
                      <p className="text-sm text-gray-400">
                        {formatCurrency(budget.monthlyLimit)} limit
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Spent</span>
                      <span className="font-medium">
                        {formatCurrency(budget.spent)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
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
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>0%</span>
                      <span>
                        {((budget.spent / budget.monthlyLimit) * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              ))}
            </StaggeredContainer>
          </div>
        </AnimationWrapper>
      ) : (
        <AnimationWrapper animation="fadeIn" delay={400}>
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              No Budget Categories Yet
            </h3>
            <p className="text-gray-300 mb-6">
              Create your first budget category to start tracking your spending
              and achieve your financial goals.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
            >
              <Plus className="w-4 h-4" />
              Create Your First Category
            </button>
          </div>
        </AnimationWrapper>
      )}

      {/* Create New Budget */}
      <AnimationWrapper animation="fadeIn" delay={600}>
        <div className="bg-gray-900/50 rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Create New Budget Category</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                showForm
                  ? "bg-gray-600 text-white hover:bg-gray-700"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              }`}
            >
              <Plus className="w-4 h-4" />
              {showForm ? "Cancel" : "Add New Category"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-green-400 text-sm">{success}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Groceries, Entertainment"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Monthly Limit */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Monthly Limit (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.monthlyLimit}
                    onChange={(e) =>
                      setFormData({ ...formData, monthlyLimit: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Icon
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {BUDGET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`p-2 rounded-lg border transition-all duration-200 ${
                        formData.icon === icon
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <span className="text-lg">{icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Color
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {BUDGET_COLORS.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, color: color.value })
                      }
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        formData.color === color.value
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full ${color.bg} flex items-center justify-center`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${color.value.replace(
                            "text-",
                            "bg-"
                          )}`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      Track Spending
                    </label>
                    <p className="text-xs text-gray-400">
                      Include this category in budget calculations
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isTracked: !formData.isTracked,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      formData.isTracked ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        formData.isTracked ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-300">
                      No Spending Goal
                    </label>
                    <p className="text-xs text-gray-400">
                      Track expenses without a budget limit
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isGoalLess: !formData.isGoalLess,
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      formData.isGoalLess ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        formData.isGoalLess ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isSubmitting || !formData.name || !formData.monthlyLimit
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Category
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </AnimationWrapper>

      {/* Next Step Button */}
      {budgets.length > 0 && (
        <AnimationWrapper animation="fadeIn" delay={800}>
          <div className="text-center">
            <button
              onClick={onNext}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              Continue to Categorization
              <CheckCircle className="w-5 h-5" />
            </button>
          </div>
        </AnimationWrapper>
      )}
    </div>
  );
};
