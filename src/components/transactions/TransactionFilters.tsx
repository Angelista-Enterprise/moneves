"use client";

import { TransactionFiltersProps } from "./types";
import { AnimationWrapper } from "@/components/ui";
import { Search } from "lucide-react";

export const TransactionFilters = ({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedCategory,
  setSelectedCategory,
  selectedAmountRange,
  setSelectedAmountRange,
  selectedDateRange,
  setSelectedDateRange,
  selectedStatus,
  setSelectedStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  currentPeriod,
  setCurrentPeriod,
  categories,
}: TransactionFiltersProps) => {
  const amountLabels: Record<string, string> = {
    all: "All Amounts",
    "0-50": "$0 - $50",
    "50-200": "$50 - $200",
    "200-500": "$200 - $500",
    "500-1000": "$500 - $1,000",
    "1000+": "$1,000+",
  };

  const getCategoryName = (id: string) => categories[id]?.name || "Unknown";

  const activeFilters: Array<{
    key: string;
    label: string;
    onRemove: () => void;
  }> = [];

  if (searchTerm.trim().length > 0) {
    activeFilters.push({
      key: "search",
      label: `Search: "${searchTerm}"`,
      onRemove: () => setSearchTerm(""),
    });
  }
  if (selectedType !== "all") {
    activeFilters.push({
      key: "type",
      label: `Type: ${selectedType}`,
      onRemove: () => setSelectedType("all"),
    });
  }
  if (selectedCategory !== "all") {
    activeFilters.push({
      key: "category",
      label: `Category: ${getCategoryName(selectedCategory)}`,
      onRemove: () => setSelectedCategory("all"),
    });
  }
  if (selectedAmountRange !== "all") {
    activeFilters.push({
      key: "amount",
      label: `Amount: ${
        amountLabels[selectedAmountRange] || selectedAmountRange
      }`,
      onRemove: () => setSelectedAmountRange("all"),
    });
  }
  if (selectedStatus !== "all") {
    activeFilters.push({
      key: "status",
      label: `Status: ${selectedStatus}`,
      onRemove: () => setSelectedStatus("all"),
    });
  }
  if (selectedDateRange === "custom" && (startDate || endDate)) {
    activeFilters.push({
      key: "date",
      label: `Date: ${startDate || "…"} → ${endDate || "…"}`,
      onRemove: () => {
        setStartDate("");
        setEndDate("");
        setSelectedDateRange("all");
      },
    });
  } else if (selectedDateRange !== "all") {
    activeFilters.push({
      key: "range",
      label: `Range: ${selectedDateRange}`,
      onRemove: () => setSelectedDateRange("all"),
    });
  }

  const resetAll = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedCategory("all");
    setSelectedAmountRange("all");
    setSelectedDateRange("all");
    setSelectedStatus("all");
    setStartDate("");
    setEndDate("");
    setCurrentPeriod(0);
  };

  return (
    <AnimationWrapper animation="fadeIn" delay={400}>
      <div className="py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-300" />
          <input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-md bg-gray-900/50 border border-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-700"
          />
        </div>

        {/* All Filters in One Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Transaction Type Filter */}
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className={
                "px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none pr-8 hover:border-gray-600 " +
                (selectedType !== "all"
                  ? "border-blue-500/60 bg-blue-500/10"
                  : "border-gray-700")
              }
            >
              <option value="all">All</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={
                "px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none pr-8 hover:border-gray-600 " +
                (selectedCategory !== "all"
                  ? "border-blue-500/60 bg-blue-500/10"
                  : "border-gray-700")
              }
            >
              <option value="all">All Categories</option>
              {Object.values(categories).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={selectedDateRange}
              onChange={(e) => {
                setSelectedDateRange(e.target.value);
                setCurrentPeriod(0); // Reset to current period when changing frequency
              }}
              className={
                "px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none pr-8 hover:border-gray-600 " +
                (selectedDateRange !== "all"
                  ? "border-blue-500/60 bg-blue-500/10"
                  : "border-gray-700")
              }
            >
              <option value="all">All Time</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom Range</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Custom Date Range Inputs */}
          {selectedDateRange === "custom" && (
            <>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={
                    "px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-600 " +
                    (startDate
                      ? "border-blue-500/60 bg-blue-500/10"
                      : "border-gray-700")
                  }
                  placeholder="Start Date"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={
                    "px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-600 " +
                    (endDate
                      ? "border-blue-500/60 bg-blue-500/10"
                      : "border-gray-700")
                  }
                  placeholder="End Date"
                />
              </div>
            </>
          )}

          {/* Amount Range Filter */}
          <div className="relative">
            <select
              value={selectedAmountRange}
              onChange={(e) => setSelectedAmountRange(e.target.value)}
              className={
                "px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none pr-8 hover:border-gray-600 " +
                (selectedAmountRange !== "all"
                  ? "border-blue-500/60 bg-blue-500/10"
                  : "border-gray-700")
              }
            >
              <option value="all">All Amounts</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-200">$50 - $200</option>
              <option value="200-500">$200 - $500</option>
              <option value="500-1000">$500 - $1,000</option>
              <option value="1000+">$1,000+</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={
                "px-4 py-2 bg-gray-800/50 border rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 appearance-none pr-8 hover:border-gray-600 " +
                (selectedStatus !== "all"
                  ? "border-blue-500/60 bg-blue-500/10"
                  : "border-gray-700")
              }
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Pagination Controls - All the way to the right */}
          {selectedDateRange !== "all" && selectedDateRange !== "custom" && (
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => setCurrentPeriod(currentPeriod + 1)}
                className="w-8 h-8 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 text-sm flex items-center justify-center hover:scale-105"
              >
                ‹
              </button>
              <span className="px-2 py-2 text-sm text-gray-300 min-w-[5rem] text-center">
                {(() => {
                  if (currentPeriod === 0) return "Current";

                  const today = new Date();
                  const getPeriodRange = (
                    frequency: string,
                    offset: number
                  ) => {
                    const baseDate = new Date(today);

                    switch (frequency) {
                      case "weekly":
                        const weekStart = new Date(baseDate);
                        weekStart.setDate(
                          baseDate.getDate() - baseDate.getDay() - offset * 7
                        );
                        return weekStart;
                      case "monthly":
                        return new Date(
                          baseDate.getFullYear(),
                          baseDate.getMonth() - offset,
                          1
                        );
                      case "yearly":
                        return new Date(baseDate.getFullYear() - offset, 0, 1);
                      default:
                        return baseDate;
                    }
                  };

                  const periodDate = getPeriodRange(
                    selectedDateRange,
                    currentPeriod
                  );

                  switch (selectedDateRange) {
                    case "weekly":
                      const weekStart = new Date(periodDate);
                      const weekEnd = new Date(weekStart);
                      weekEnd.setDate(weekStart.getDate() + 6);
                      return `${weekStart.getDate()}/${
                        weekStart.getMonth() + 1
                      } - ${weekEnd.getDate()}/${weekEnd.getMonth() + 1}`;
                    case "monthly":
                      return periodDate.toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      });
                    case "yearly":
                      return periodDate.getFullYear().toString();
                    default:
                      return "Current";
                  }
                })()}
              </span>
              <button
                onClick={() => setCurrentPeriod(Math.max(0, currentPeriod - 1))}
                disabled={currentPeriod === 0}
                className="w-8 h-8 bg-gray-800/50 border border-gray-700 rounded-lg text-white hover:bg-gray-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center hover:scale-105 disabled:hover:scale-100"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {/* Active filters bar */}
        {activeFilters.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">
              {activeFilters.length} filter{activeFilters.length > 1 ? "s" : ""}{" "}
              applied:
            </span>
            {activeFilters.map((f) => (
              <button
                key={f.key}
                onClick={f.onRemove}
                className="px-2 py-1 rounded-full text-xs bg-blue-500/15 text-blue-300 border border-blue-500/30 hover:bg-blue-500/25 transition-colors"
              >
                {f.label} <span className="ml-1">×</span>
              </button>
            ))}
            <button
              onClick={resetAll}
              className="ml-2 px-2 py-1 rounded-full text-xs bg-gray-800/60 text-gray-200 border border-gray-700 hover:bg-gray-700/60 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </AnimationWrapper>
  );
};
