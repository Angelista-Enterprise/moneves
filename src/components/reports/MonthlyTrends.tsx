"use client";

import { AnimationWrapper, StaggeredContainer } from "@/components/ui";
import { calculateMonthlyTrends } from "@/services/monthlyTrends";
import { Transaction } from "@/components/transactions/types";
import { useFormatting } from "@/contexts/FormattingContext";

interface MonthlyTrendsProps {
  transactions: Transaction[] | undefined;
  showBalance: boolean;
  isLoading?: boolean;
}

export const MonthlyTrends = ({
  transactions,
  showBalance,
  isLoading = false,
}: MonthlyTrendsProps) => {
  const { formatCurrency } = useFormatting();
  // Calculate monthly trends from transaction data
  const monthlyTrends = calculateMonthlyTrends(transactions || [], 6);
  return (
    <AnimationWrapper animation="fadeIn" delay={400}>
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Monthly Financial Trends</h2>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-400">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-400">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-400">Savings</span>
            </div>
          </div>
        </div>

        {isLoading ? (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            staggerDelay={100}
            animation="scaleIn"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-gray-800 bg-gray-900/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 w-12 bg-gray-800/50 rounded animate-pulse" />
                  <div className="h-6 w-16 bg-gray-800/50 rounded animate-pulse" />
                </div>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gray-800/50 rounded animate-pulse" />
                    <div className="h-2 w-full bg-gray-800/50 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gray-800/50 rounded animate-pulse" />
                    <div className="h-2 w-full bg-gray-800/50 rounded animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-18 bg-gray-800/50 rounded animate-pulse" />
                    <div className="h-2 w-full bg-gray-800/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </StaggeredContainer>
        ) : (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            staggerDelay={100}
            animation="scaleIn"
          >
            {monthlyTrends.map((month) => {
              const maxAmount = Math.max(
                ...monthlyTrends.map((m) => Math.max(m.income, m.expenses))
              );
              const incomePercentage = (month.income / maxAmount) * 100;
              const expensePercentage = (month.expenses / maxAmount) * 100;
              const savingsPercentage = (month.savings / maxAmount) * 100;
              // Calculate savings rate: 0% if no income, otherwise (savings/income) * 100
              const savingsRate =
                month.income === 0
                  ? 0
                  : Math.round((month.savings / month.income) * 100);

              return (
                <div
                  key={month.month}
                  className="group relative p-4 rounded-xl overflow-hidden transition-all duration-500 border border-gray-800 bg-gray-900/50 hover:shadow-[0_8px_32px_rgba(255,255,255,0.08)] hover:-translate-y-2 hover:scale-[1.02] will-change-transform"
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
                  </div>

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white transition-colors duration-300 group-hover:text-white/90">
                        {month.month}
                      </h3>
                      <div className="text-right">
                        <p className="text-sm text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                          Savings Rate
                        </p>
                        <p
                          className={`text-lg font-bold transition-all duration-300 group-hover:scale-105 ${
                            savingsRate > 0
                              ? "text-green-500"
                              : savingsRate < 0
                              ? "text-red-500"
                              : "text-gray-500"
                          }`}
                        >
                          {showBalance ? `${savingsRate}%` : "••••••"}
                        </p>
                      </div>
                    </div>

                    {/* Income Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-green-400 transition-colors duration-300 group-hover:text-green-300">
                          Income
                        </span>
                        <span className="text-xs text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                          {showBalance
                            ? formatCurrency(month.income)
                            : "••••••"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full transition-all duration-500 group-hover:from-green-400 group-hover:to-green-300"
                          style={{ width: `${incomePercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Expenses Bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-red-400 transition-colors duration-300 group-hover:text-red-300">
                          Expenses
                        </span>
                        <span className="text-xs text-gray-400 transition-colors duration-300 group-hover:text-gray-300">
                          {showBalance
                            ? formatCurrency(month.expenses)
                            : "••••••"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-red-500 to-red-400 h-2 rounded-full transition-all duration-500 group-hover:from-red-400 group-hover:to-red-300"
                          style={{ width: `${expensePercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Savings Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs transition-colors duration-300 group-hover:opacity-80 ${
                            month.savings > 0
                              ? "text-green-400 group-hover:text-green-300"
                              : month.savings < 0
                              ? "text-red-400 group-hover:text-red-300"
                              : "text-gray-400 group-hover:text-gray-300"
                          }`}
                        >
                          Savings
                        </span>
                        <span
                          className={`text-xs transition-colors duration-300 group-hover:opacity-80 ${
                            month.savings > 0
                              ? "text-green-400 group-hover:text-green-300"
                              : month.savings < 0
                              ? "text-red-400 group-hover:text-red-300"
                              : "text-gray-400 group-hover:text-gray-300"
                          }`}
                        >
                          {showBalance
                            ? formatCurrency(month.savings)
                            : "••••••"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            month.savings > 0
                              ? "bg-gradient-to-r from-green-500 to-green-400 group-hover:from-green-400 group-hover:to-green-300"
                              : month.savings < 0
                              ? "bg-gradient-to-r from-red-500 to-red-400 group-hover:from-red-400 group-hover:to-red-300"
                              : "bg-gradient-to-r from-gray-500 to-gray-400 group-hover:from-gray-400 group-hover:to-gray-300"
                          }`}
                          style={{ width: `${Math.abs(savingsPercentage)}%` }}
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-between text-xs text-gray-500 transition-colors duration-300 group-hover:text-gray-400">
                      <span>
                        Net:{" "}
                        {showBalance ? formatCurrency(month.savings) : "••••••"}
                      </span>
                      <span
                        className={`${
                          month.savings > 0
                            ? "text-green-400"
                            : month.savings < 0
                            ? "text-red-400"
                            : "text-gray-500"
                        }`}
                      >
                        {month.savings > 0
                          ? "Positive"
                          : month.savings < 0
                          ? "Negative"
                          : "Neutral"}
                      </span>
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
