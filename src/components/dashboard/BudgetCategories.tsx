"use client";

import { BudgetItem } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { CircleProgress } from "@/components/ui/circle-progress";
import {
  SkeletonCard,
  AnimationWrapper,
  StaggeredContainer,
} from "@/components/ui";
import { useRouter } from "next/navigation";
import { Target, Plus } from "lucide-react";
import { useFormatting } from "@/contexts/FormattingContext";
import { useHelpHover } from "@/contexts/HelpHoverContext";

interface BudgetCategoriesProps {
  items: BudgetItem[];
  maxItems?: number;
  showBalance: boolean;
  isLoading?: boolean;
}

export const BudgetCategories = ({
  items,
  maxItems = 3,
  showBalance,
  isLoading = false,
}: BudgetCategoriesProps) => {
  const router = useRouter();
  const displayItems = items.slice(0, maxItems);

  const { formatCurrency } = useFormatting();
  const { isHelpHovered, isHelpToggled } = useHelpHover();

  const handleViewAll = () => {
    router.push("/reports");
  };

  const handleCreateBudget = () => {
    router.push("/reports");
  };

  return (
    <AnimationWrapper animation="fadeIn" delay={200}>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Budget Categories</h2>
          {!isLoading && items.length > 0 && (
            <AnimationWrapper animation="slideIn" delay={300}>
              <Button
                onClick={handleViewAll}
                variant="outline"
                size="sm"
                className="bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50 transition-all duration-300 hover:scale-105"
              >
                View All
              </Button>
            </AnimationWrapper>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-6 max-w-7xl mx-auto">
            {Array.from({ length: 3 }).map((_, index) => (
              <AnimationWrapper
                key={index}
                animation="scaleIn"
                delay={400 + index * 150}
                duration={500}
              >
                <SkeletonCard />
              </AnimationWrapper>
            ))}
          </div>
        ) : items.length === 0 ? (
          // Empty state placeholder
          <AnimationWrapper animation="scaleIn" delay={400}>
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center transition-all duration-500 hover:bg-yellow-500/15 hover:border-yellow-500/30">
              <div className="mb-3">
                <Target className="w-8 h-8 text-yellow-500 mx-auto mb-2 transition-transform duration-300 hover:scale-110" />
                <h3 className="text-sm font-semibold text-yellow-400 mb-1">
                  No Budget Categories
                </h3>
                <p className="text-yellow-300 text-xs mb-3">
                  Create budget categories to track your spending
                </p>
                <Button
                  onClick={handleCreateBudget}
                  size="sm"
                  className="text-xs transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  <Plus size={14} />
                  Create Budget
                </Button>
              </div>
            </div>
          </AnimationWrapper>
        ) : (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-3 gap-3 pb-6 max-w-7xl mx-auto"
            staggerDelay={150}
            animation="scaleIn"
          >
            {displayItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="group relative p-4 rounded-xl overflow-hidden transition-all duration-500 border border-gray-800 bg-gray-900/50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)] hover:-translate-y-2 hover:scale-[1.02] will-change-transform"
                >
                  {/* Background gradient overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                  </div>
                  <div className="relative flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black/5 dark:bg-white/10 group-hover:bg-gradient-to-br transition-all duration-500 group-hover:scale-110">
                        <Icon size={24} className={item.color} />
                      </div>
                      <CircleProgress
                        size={60}
                        strokeWidth={6}
                        progress={item.progress}
                        className="text-gray-600 transition-all duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-sm text-gray-400 mb-1 transition-colors duration-300 group-hover:text-gray-300">
                        {item.title}
                      </h3>
                      <p className="text-2xl font-bold text-white mb-1 transition-all duration-300 group-hover:text-white/90">
                        {showBalance ? formatCurrency(item.spent) : "••••••"}
                      </p>
                      <p className="text-sm text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                        of{" "}
                        {showBalance ? formatCurrency(item.amount) : "••••••"}
                      </p>
                      <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                        {item.description}
                      </p>

                      {/* Help info - shows when help is hovered */}
                      <div
                        className={`mt-2 transition-all duration-300 ease-in-out overflow-hidden ${
                          isHelpHovered || isHelpToggled
                            ? "max-h-20 opacity-100 transform translate-y-0"
                            : "max-h-0 opacity-0 transform -translate-y-2"
                        }`}
                      >
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-300">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 bg-blue-400 rounded-full transition-all duration-300 ${
                                  isHelpHovered || isHelpToggled
                                    ? "scale-100"
                                    : "scale-0"
                                }`}
                              ></div>
                              <span className="font-semibold text-blue-200">
                                🎯 Budget Tracking
                              </span>
                            </div>
                            <div className="text-blue-300/80 pl-4">
                              <div>
                                • <strong>Progress:</strong>{" "}
                                {item.progress.toFixed(1)}% of{" "}
                                {formatCurrency(item.amount)} limit
                                <br />• <strong>Status:</strong>{" "}
                                {item.progress >= 100
                                  ? "🔴 Over budget"
                                  : item.progress >= 80
                                    ? "🟡 Warning"
                                    : "🟢 On track"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Gradient border effect */}
                  <div className="absolute inset-0 -z-10 rounded-xl p-px bg-gradient-to-br from-transparent via-gray-100/50 to-transparent dark:via-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              );
            })}
          </StaggeredContainer>
        )}
      </div>
    </AnimationWrapper>
  );
};
