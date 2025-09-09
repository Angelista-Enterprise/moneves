"use client";

import { BentoItem, CategoryData } from "./types";
import { BentoGrid } from "./BentoGrid";
import { AnimationWrapper } from "@/components/ui";
import { Target, Plus } from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";

interface CategoryAnalysisProps {
  categories: CategoryData[];
  filteredCategories: CategoryData[];
  showBalance: boolean;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  isLoading: boolean;
  onBudgetCreate?: () => void;
}

export const CategoryAnalysis = ({
  categories,
  filteredCategories,
  showBalance,
  showAddForm,
  setShowAddForm,
  isLoading,
  onBudgetCreate,
}: CategoryAnalysisProps) => {
  const { formatCurrency } = useFormatting();
  // Category analysis items
  const categoryAnalysisItems: BentoItem[] = filteredCategories.map(
    (category) => ({
      title: category.name,
      description: `${category.transactionCount} transactions this month`,
      icon: <div className={`w-4 h-4 rounded-full ${category.color}`} />,
      value: category.spent,
      maxValue: category.monthlyLimit,
      amount: showBalance ? formatCurrency(category.spent) : "••••••",
      tags: [
        category.percentage >= 100 ? "Over Budget" : "On Track",
        `${category.transactionCount} txns`,
      ],
      status: `${category.percentage}%`,
      colSpan: 1,
    })
  );

  return (
    <AnimationWrapper animation="fadeIn" delay={300}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Category Analysis</h2>
          {!isLoading && categories.length > 0 && (
            <AnimationWrapper animation="slideIn" delay={400}>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Category
              </button>
            </AnimationWrapper>
          )}
        </div>

        {isLoading ? (
          <BentoGrid items={[]} isLoading={true} />
        ) : categories.length === 0 ? (
          // Empty state placeholder
          <AnimationWrapper animation="scaleIn" delay={500}>
            <div className="mb-6 p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center transition-all duration-500 hover:bg-yellow-500/15 hover:border-yellow-500/30">
              <div className="mb-4">
                <Target className="w-12 h-12 text-yellow-500 mx-auto mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                  No Budget Categories Found
                </h3>
                <p className="text-yellow-300 text-sm mb-4">
                  Create your first budget category to start tracking your
                  spending and get insights.
                </p>
                <button
                  onClick={onBudgetCreate || (() => setShowAddForm(true))}
                  className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-500/30 transition-all duration-300 hover:scale-105 flex items-center gap-2 text-sm mx-auto"
                >
                  <Plus size={16} />
                  Create Budget Category
                </button>
              </div>
            </div>
          </AnimationWrapper>
        ) : filteredCategories.length === 0 ? (
          // No search results
          <AnimationWrapper animation="scaleIn" delay={500}>
            <div className="mb-6 p-6 bg-gray-500/10 border border-gray-500/20 rounded-lg text-center">
              <div className="mb-4">
                <Target className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  No Categories Found
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Try adjusting your search terms or filters.
                </p>
              </div>
            </div>
          </AnimationWrapper>
        ) : (
          <BentoGrid items={categoryAnalysisItems} />
        )}
      </div>
    </AnimationWrapper>
  );
};
