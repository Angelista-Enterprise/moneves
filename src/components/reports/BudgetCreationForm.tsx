"use client";

import { useState } from "react";
import { AnimationWrapper } from "@/components/ui";
import { X, Plus, Target } from "lucide-react";

interface BudgetCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
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

export const BudgetCreationForm = ({
  isOpen,
  onClose,
  onSuccess,
}: BudgetCreationFormProps) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create budget");
      }

      // Reset form
      setFormData({
        name: "",
        monthlyLimit: "",
        icon: "💰",
        color: "text-blue-500",
        isTracked: true,
        isGoalLess: false,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimationWrapper animation="fadeIn" delay={0}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-xl border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-brand to-brand rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold">
                  Create Budget Category
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

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
              <div className="space-y-4">
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
                  onClick={onClose}
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
                      Create Budget
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AnimationWrapper>
  );
};
